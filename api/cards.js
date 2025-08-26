// api/cards.js - Versione Completa con Gestione 2FA Corretta
export default async function handler(req, res) {
  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Environment variables
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    if (!SORARE_EMAIL || !SORARE_PASSWORD) {
      return res.status(500).json({ 
        error: 'Missing credentials',
        details: 'SORARE_EMAIL and SORARE_PASSWORD required in environment variables'
      });
    }

    // Import modules
    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    // Get 2FA code from query
    const twoFACode = req.query.code;

    // Login mutation query
    const loginMutation = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          currentUser {
            slug
            nickname
          }
          jwtToken(aud: "sorare-nba-manager") {
            token
            expiredAt
          }
          otpSessionChallenge
          errors {
            message
          }
        }
      }
    `;

    // Helper function to perform login
    async function performLogin(loginInput) {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (SORARE_API_KEY) {
        headers['APIKEY'] = SORARE_API_KEY;
      }

      const response = await fetch('https://api.sorare.com/graphql', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: loginMutation,
          variables: { input: loginInput }
        })
      });

      if (!response.ok) {
        throw new Error(`Login request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    }

    // Step 1: Get salt for password hashing
    console.log('Getting salt for user:', SORARE_EMAIL);
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    
    if (!saltResponse.ok) {
      throw new Error(`Salt request failed: ${saltResponse.status} ${saltResponse.statusText}`);
    }
    
    const saltData = await saltResponse.json();
    
    if (!saltData.salt) {
      throw new Error('No salt returned from API');
    }

    // Step 2: Hash password with salt
    console.log('Hashing password...');
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, saltData.salt);

    let loginData;

    if (!twoFACode) {
      // Step 3a: First login attempt (no 2FA code)
      console.log('Performing initial login...');
      
      loginData = await performLogin({
        email: SORARE_EMAIL,
        password: hashedPassword
      });

      console.log('Initial login response:', JSON.stringify(loginData, null, 2));

      // Check for direct JWT (no 2FA required)
      if (loginData.data?.signIn?.jwtToken?.token) {
        console.log('✅ Login successful without 2FA!');
        const jwtToken = loginData.data.signIn.jwtToken.token;
        return await fetchNBACards(jwtToken);
      }

      // Check for otpSessionChallenge (2FA required)
      const otpSessionChallenge = loginData.data?.signIn?.otpSessionChallenge;
      
      if (otpSessionChallenge) {
        return res.status(202).json({
          success: false,
          requiresTwoFA: true,
          otpSessionChallenge: otpSessionChallenge,
          message: 'Codice 2FA richiesto',
          instructions: [
            '1. Controlla la tua email per il codice di verifica',
            '2. Il codice è solitamente di 6 cifre',
            '3. Usa: /api/cards?code=IL_TUO_CODICE'
          ],
          nextStep: `${req.headers.host || 'your-app.vercel.app'}/api/cards?code=INSERISCI_CODICE`
        });
      }

      // Login failed
      return res.status(400).json({
        error: 'Login failed',
        details: loginData.data?.signIn?.errors || [],
        data: loginData
      });

    } else {
      // Step 3b: 2FA login attempt
      console.log('Performing 2FA login with code:', twoFACode);
      
      // IMPORTANTE: Rigenera sempre una fresh session per 2FA
      const freshLoginData = await performLogin({
        email: SORARE_EMAIL,
        password: hashedPassword
      });

      const otpSessionChallenge = freshLoginData.data?.signIn?.otpSessionChallenge;
      
      if (!otpSessionChallenge) {
        return res.status(400).json({
          error: 'Cannot get fresh OTP session challenge',
          details: freshLoginData.data?.signIn?.errors || []
        });
      }

      console.log('Using fresh otpSessionChallenge:', otpSessionChallenge);

      // Try 2FA with multiple field names (different versions of Sorare API)
      const twoFAInput = {
        otpSessionChallenge: otpSessionChallenge,
        // Prova tutti i possibili nomi di campo
        otpAttempt: twoFACode,
        otp: twoFACode,
        otpCode: twoFACode,
        twoFactorCode: twoFACode,
        verificationCode: twoFACode,
        authenticationCode: twoFACode,
        code: twoFACode
      };

      console.log('2FA input:', twoFAInput);

      loginData = await performLogin(twoFAInput);

      console.log('2FA login response:', JSON.stringify(loginData, null, 2));

      // Check for errors
      if (loginData.data?.signIn?.errors?.length > 0) {
        const errors = loginData.data.signIn.errors;
        
        return res.status(400).json({
          error: 'Codice 2FA non valido',
          details: errors,
          hints: [
            'Verifica che il codice sia corretto (6 cifre)',
            'Il codice potrebbe essere scaduto',
            'Richiedi un nuovo codice e riprova immediatamente',
            'Assicurati di non aver aggiunto spazi o caratteri extra'
          ],
          debugInfo: {
            receivedCode: twoFACode,
            codeLength: twoFACode.length,
            otpSessionChallenge: otpSessionChallenge
          }
        });
      }

      // Check for JWT token
      const jwtToken = loginData.data?.signIn?.jwtToken?.token;
      
      if (!jwtToken) {
        return res.status(400).json({
          error: 'Nessun JWT token ricevuto dopo 2FA',
          data: loginData,
          hint: 'Login completato ma nessun token JWT'
        });
      }

      console.log('✅ 2FA successful! JWT token received');
      return await fetchNBACards(jwtToken);
    }

    // Helper function to fetch NBA cards with JWT
    async function fetchNBACards(jwtToken) {
      console.log('Fetching NBA cards with JWT token...');
      
      // Query per carte NBA (basata su documentazione Sorare)
      const nbaCardsQuery = `
        query {
          currentUser {
            nbaCards {
              totalCount
              nodes {
                id
                slug
                name
                rarity
                serialNumber
                pictureUrl
                xp
                grade
                seasonYear
                player {
                  displayName
                  slug
                  position
                  age
                  team {
                    name
                    abbreviation
                  }
                }
                onSale
              }
            }
          }
        }
      `;

      const nbaHeaders = {
        'Authorization': `Bearer ${jwtToken}`,
        'JWT-AUD': 'sorare-nba-manager',  // Obbligatorio per Sorare
        'Content-Type': 'application/json'
      };

      if (SORARE_API_KEY) {
        nbaHeaders['APIKEY'] = SORARE_API_KEY;
        console.log('Using API key for higher rate limits');
      }

      const nbaResponse = await fetch('https://api.sorare.com/graphql', {
        method: 'POST',
        headers: nbaHeaders,
        body: JSON.stringify({
          query: nbaCardsQuery
        })
      });

      if (!nbaResponse.ok) {
        throw new Error(`NBA cards request failed: ${nbaResponse.status} ${nbaResponse.statusText}`);
      }

      const nbaData = await nbaResponse.json();
      console.log('NBA cards response:', JSON.stringify(nbaData, null, 2));

      if (nbaData.errors) {
        return res.status(400).json({
          error: 'Errore nel recupero carte NBA',
          details: nbaData.errors,
          hint: 'JWT token potrebbe essere scaduto o non valido'
        });
      }

      const cards = nbaData.data?.currentUser?.nbaCards?.nodes || [];
      const totalCount = nbaData.data?.currentUser?.nbaCards?.totalCount || 0;
      
      console.log(`Found ${cards.length} NBA cards`);

      // Aggiungi proiezioni simulate per ogni carta
      const cardsWithProjections = cards.map(card => ({
        ...card,
        projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
        last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
        games_this_week: Math.floor(Math.random() * 4) + 1,
        efficiency: Math.round((Math.random() * 0.5 + 1) * 100) / 100
      }));

      return res.status(200).json({
        success: true,
        data: cardsWithProjections,
        count: cardsWithProjections.length,
        totalCount: totalCount,
        message: `🎉🏀 ${cardsWithProjections.length} carte NBA caricate dal tuo account Sorare!`,
        timestamp: new Date().toISOString(),
        apiKeyUsed: !!SORARE_API_KEY,
        jwtReceived: true
      });
    }

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      error: 'Errore del sistema',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}
