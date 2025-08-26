export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    // Codice 2FA dal query parameter
    const twoFACode = req.query.code || req.query.tfa_code;
    
    if (!SORARE_EMAIL || !SORARE_PASSWORD) {
      return res.status(500).json({ 
        error: 'Missing credentials' 
      });
    }

    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    // Step 1: Get salt
    console.log('Getting salt...');
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const saltData = await saltResponse.json();
    
    if (!saltData.salt) {
      throw new Error('No salt returned');
    }

    // Step 2: Hash password
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, saltData.salt);

    // Step 3: Login query (con o senza 2FA code)
    let loginQuery, variables;
    
    if (!twoFACode) {
      // Primo tentativo - senza codice 2FA
      loginQuery = `
        mutation SignInMutation($input: signInInput!) {
          signIn(input: $input) {
            jwtToken(aud: "sorare-nba-manager") {
              token
            }
            errors {
              message
            }
          }
        }
      `;
      
      variables = {
        input: {
          email: SORARE_EMAIL,
          password: hashedPassword
        }
      };
    } else {
      // Secondo tentativo - con codice 2FA
      loginQuery = `
        mutation SignInMutation($input: signInInput!) {
          signIn(input: $input) {
            jwtToken(aud: "sorare-nba-manager") {
              token
            }
            errors {
              message
            }
          }
        }
      `;
      
      variables = {
        input: {
          email: SORARE_EMAIL,
          password: hashedPassword,
          otpAttempt: twoFACode  // Campo per codice 2FA
        }
      };
    }

    console.log(twoFACode ? 'Login with 2FA code...' : 'Initial login attempt...');

    const loginHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (SORARE_API_KEY) {
      loginHeaders['APIKEY'] = SORARE_API_KEY;
    }

    const loginResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: loginHeaders,
      body: JSON.stringify({
        query: loginQuery,
        variables: variables
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));

    // Gestisci diversi tipi di errori
    const errors = loginData.data?.signIn?.errors || [];
    
    for (const error of errors) {
      if (error.message === 'authenticate_from_new_country') {
        return res.status(202).json({
          success: false,
          requiresTwoFA: true,
          message: 'Codice di verifica richiesto',
          instructions: [
            '1. Controlla la tua email per il codice di verifica',
            '2. Usa: /api/cards?code=IL_TUO_CODICE',
            '3. Il codice è di solito 6 cifre'
          ],
          nextStep: `${req.headers.host}/api/cards?code=INSERISCI_CODICE_QUI`
        });
      }
      
      if (error.message.includes('otp') || error.message.includes('code')) {
        return res.status(400).json({
          error: 'Codice di verifica non valido',
          details: error.message,
          instructions: 'Riprova con: /api/cards?code=NUOVO_CODICE'
        });
      }
    }

    // Login riuscito!
    const jwtToken = loginData.data?.signIn?.jwtToken?.token;
    
    if (!jwtToken) {
      return res.status(400).json({
        error: 'Login failed',
        details: errors,
        loginData: loginData
      });
    }

    console.log('✅ Login successful! JWT token received');

    // Ora usa il JWT per ottenere le carte
    const QUERY_LIMITED_CARDS = `
      query {
        currentUser {
          nbaCards(rarities: [limited]) {
            nodes {
              id
              slug
              pictureUrl
              player {
                displayName
                team {
                  name
                  abbreviation
                }
                position
                age
              }
              rarity
              level
              xp
              serialNumber
              onSale
            }
          }
        }
      }
    `;

    const cardsHeaders = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };
    
    if (SORARE_API_KEY) {
      cardsHeaders['APIKEY'] = SORARE_API_KEY;
    }

    const cardsResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: cardsHeaders,
      body: JSON.stringify({
        query: QUERY_LIMITED_CARDS
      })
    });

    const cardsData = await cardsResponse.json();

    if (cardsData.errors) {
      return res.status(400).json({
        error: 'GraphQL errors getting cards',
        details: cardsData.errors
      });
    }

    const cards = cardsData.data?.currentUser?.nbaCards?.nodes || [];
    
    // Aggiungi proiezioni simulate
    const cardsWithProjections = cards.map(card => ({
      ...card,
      projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
      last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
      games_this_week: Math.floor(Math.random() * 4) + 1
    }));

    res.status(200).json({
      success: true,
      data: cardsWithProjections,
      count: cardsWithProjections.length,
      message: '🎉 Carte Limited caricate con successo!',
      jwtReceived: true
    });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      error: 'Function crashed',
      message: error.message,
      stack: error.stack
    });
  }
}
