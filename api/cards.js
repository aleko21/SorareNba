// api/cards.js - Correzione finale
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
    
    if (!SORARE_EMAIL || !SORARE_PASSWORD) {
      return res.status(500).json({ 
        error: 'Missing credentials' 
      });
    }

    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    const twoFACode = req.query.code;

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

      return await response.json();
    }

    // Get salt
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const saltData = await saltResponse.json();
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, saltData.salt);

    if (!twoFACode) {
      // Initial login
      const loginData = await performLogin({
        email: SORARE_EMAIL,
        password: hashedPassword
      });

      if (loginData.data?.signIn?.jwtToken?.token) {
        const jwtToken = loginData.data.signIn.jwtToken.token;
        return await fetchNBACards(jwtToken);
      }

      const otpSessionChallenge = loginData.data?.signIn?.otpSessionChallenge;
      
      if (otpSessionChallenge) {
        return res.status(202).json({
          success: false,
          requiresTwoFA: true,
          otpSessionChallenge: otpSessionChallenge,
          message: 'Codice 2FA richiesto',
          nextStep: `${req.headers.host}/api/cards?code=INSERISCI_CODICE`
        });
      }

      return res.status(400).json({
        error: 'Login failed',
        details: loginData.data?.signIn?.errors || []
      });

    } else {
      // 2FA login
      console.log('Performing 2FA with code:', twoFACode);
      
      // Get fresh session
      const freshLoginData = await performLogin({
        email: SORARE_EMAIL,
        password: hashedPassword
      });

      const otpSessionChallenge = freshLoginData.data?.signIn?.otpSessionChallenge;
      
      if (!otpSessionChallenge) {
        return res.status(400).json({
          error: 'Cannot get fresh OTP session challenge'
        });
      }

      // ✅ USA SOLO otpAttempt (l'unico campo valido)
      const twoFALoginData = await performLogin({
        otpSessionChallenge: otpSessionChallenge,
        otpAttempt: twoFACode  // SOLO questo campo!
      });

      console.log('2FA response:', JSON.stringify(twoFALoginData, null, 2));

      if (twoFALoginData.errors) {
        return res.status(400).json({
          error: 'GraphQL errors in 2FA',
          details: twoFALoginData.errors
        });
      }

      if (twoFALoginData.data?.signIn?.errors?.length > 0) {
        return res.status(400).json({
          error: 'Codice 2FA non valido',
          details: twoFALoginData.data.signIn.errors,
          hint: 'Codice scaduto o errato'
        });
      }

      const jwtToken = twoFALoginData.data?.signIn?.jwtToken?.token;
      
      if (!jwtToken) {
        return res.status(400).json({
          error: 'Nessun JWT token ricevuto dopo 2FA',
          data: twoFALoginData
        });
      }

      console.log('✅ 2FA SUCCESS! JWT received');
      return await fetchNBACards(jwtToken);
    }

    // Fetch NBA cards function
    async function fetchNBACards(jwtToken) {
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
        'JWT-AUD': 'sorare-nba-manager',
        'Content-Type': 'application/json'
      };

      if (SORARE_API_KEY) {
        nbaHeaders['APIKEY'] = SORARE_API_KEY;
      }

      const nbaResponse = await fetch('https://api.sorare.com/graphql', {
        method: 'POST',
        headers: nbaHeaders,
        body: JSON.stringify({
          query: nbaCardsQuery
        })
      });

      const nbaData = await nbaResponse.json();

      if (nbaData.errors) {
        return res.status(400).json({
          error: 'Errore nel recupero carte NBA',
          details: nbaData.errors
        });
      }

      const cards = nbaData.data?.currentUser?.nbaCards?.nodes || [];
      
      const cardsWithProjections = cards.map(card => ({
        ...card,
        projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
        last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
        games_this_week: Math.floor(Math.random() * 4) + 1
      }));

      return res.status(200).json({
        success: true,
        data: cardsWithProjections,
        count: cardsWithProjections.length,
        message: `🎉🏀 ${cardsWithProjections.length} carte NBA dal tuo account Sorare!`,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'System error',
      message: error.message
    });
  }
}
