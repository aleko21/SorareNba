// api/cards.js - VERSIONE CORRETTA basata su documentazione
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');
    
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    // Step 1: Get salt
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const { salt } = await saltResponse.json();
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, salt);

    // Step 2: First login attempt
    const loginMutation = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          currentUser {
            slug
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

    const firstLoginHeaders = {
      'Content-Type': 'application/json'
    };
    if (SORARE_API_KEY) {
      firstLoginHeaders['APIKEY'] = SORARE_API_KEY;
    }

    const firstLoginResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: firstLoginHeaders,
      body: JSON.stringify({
        query: loginMutation,
        variables: {
          input: {
            email: SORARE_EMAIL,
            password: hashedPassword
          }
        }
      })
    });

    const firstLoginData = await firstLoginResponse.json();
    console.log('First login response:', JSON.stringify(firstLoginData, null, 2));

    // Check if we got JWT directly (no 2FA required)
    if (firstLoginData.data?.signIn?.jwtToken?.token) {
      const jwtToken = firstLoginData.data.signIn.jwtToken.token;
      return await fetchNBACards(jwtToken, SORARE_API_KEY);
    }

    // Check if we got otpSessionChallenge (2FA required)
    const otpSessionChallenge = firstLoginData.data?.signIn?.otpSessionChallenge;
    
    if (!otpSessionChallenge) {
      return res.status(400).json({
        error: 'Login failed',
        details: firstLoginData.data?.signIn?.errors,
        data: firstLoginData
      });
    }

    // Step 3: Handle 2FA
    const twoFACode = req.query.code;
    
    if (!twoFACode) {
      return res.status(202).json({
        success: false,
        requiresTwoFA: true,
        otpSessionChallenge: otpSessionChallenge,
        message: 'Codice 2FA richiesto',
        instructions: `Usa: /api/cards?code=TUO_CODICE_2FA`,
        nextStep: `${req.headers.host || 'your-app.vercel.app'}/api/cards?code=INSERISCI_CODICE`
      });
    }

    // Step 4: Second login with 2FA
    const secondLoginResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: firstLoginHeaders,
      body: JSON.stringify({
        query: loginMutation,
        variables: {
          input: {
            otpSessionChallenge: otpSessionChallenge,
            otpAttempt: twoFACode
          }
        }
      })
    });

    const secondLoginData = await secondLoginResponse.json();
    console.log('Second login (2FA) response:', JSON.stringify(secondLoginData, null, 2));

    if (secondLoginData.data?.signIn?.errors?.length > 0) {
      return res.status(400).json({
        error: 'Codice 2FA non valido',
        details: secondLoginData.data.signIn.errors,
        hint: 'Riprova con codice fresco'
      });
    }

    const jwtToken = secondLoginData.data?.signIn?.jwtToken?.token;
    
    if (!jwtToken) {
      return res.status(400).json({
        error: 'Nessun JWT ricevuto dopo 2FA',
        data: secondLoginData
      });
    }

    // Step 5: Use JWT to get NBA cards
    return await fetchNBACards(jwtToken, SORARE_API_KEY);

    // Helper function to fetch NBA cards
    async function fetchNBACards(jwtToken, apiKey) {
      const nbaQuery = `
        query {
          currentUser {
            nbaCards {
              nodes {
                id
                slug
                name
                rarity
                player {
                  displayName
                  position
                  team {
                    name
                    abbreviation
                  }
                }
                xp
                grade
              }
            }
          }
        }
      `;

      const nbaHeaders = {
        'Authorization': `Bearer ${jwtToken}`,
        'JWT-AUD': 'sorare-nba-manager',  // ← OBBLIGATORIO dalla documentazione!
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        nbaHeaders['APIKEY'] = apiKey;
      }

      const nbaResponse = await fetch('https://api.sorare.com/graphql', {
        method: 'POST',
        headers: nbaHeaders,
        body: JSON.stringify({
          query: nbaQuery
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
      
      // Aggiungi proiezioni simulate
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
        message: `🎉 ${cardsWithProjections.length} carte NBA Limited caricate dal tuo account!`,
        jwtReceived: true
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Errore di sistema',
      message: error.message,
      stack: error.stack
    });
  }
}
