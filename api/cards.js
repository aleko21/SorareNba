// api/cards.js - Sistema completo API Key + Login + 2FA
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    if (!SORARE_EMAIL || !SORARE_PASSWORD || !SORARE_API_KEY) {
      return res.status(500).json({
        error: 'Configurazione incompleta'
      });
    }

    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    const twoFACode = req.query.code;

    // Helper function per chiamate con API Key
    async function apiCall(url, options = {}) {
      const headers = {
        'Content-Type': 'application/json',
        'APIKEY': SORARE_API_KEY,  // API Key sempre presente
        ...options.headers
      };

      return fetch(url, {
        ...options,
        headers
      });
    }

    // FASE 1: Ottieni salt e prepara password
    const saltResponse = await apiCall(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const { salt } = await saltResponse.json();
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, salt);

    const loginMutation = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          jwtToken(aud: "sorare-nba-manager") {
            token
          }
          otpSessionChallenge
          errors {
            message
          }
        }
      }
    `;

    if (!twoFACode) {
      // FASE 2A: Tentativo login iniziale
      console.log('Initial login attempt with API key...');

      const loginResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
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

      const loginData = await loginResponse.json();
      console.log('Initial login response:', JSON.stringify(loginData, null, 2));

      // Se otteniamo JWT direttamente (no 2FA)
      if (loginData.data?.signIn?.jwtToken?.token) {
        const jwtToken = loginData.data.signIn.jwtToken.token;
        return await fetchPersonalCards(jwtToken);
      }

      // Se abbiamo otpSessionChallenge (2FA richiesto)
      const otpSessionChallenge = loginData.data?.signIn?.otpSessionChallenge;
      
      if (otpSessionChallenge) {
        return res.status(202).json({
          success: false,
          requiresTwoFA: true,
          otpSessionChallenge: otpSessionChallenge,
          message: '🔐 Codice 2FA richiesto da Sorare',
          instructions: [
            '1. Controlla la tua email per il codice di verifica',
            '2. Il codice è di 6 cifre numeriche',
            '3. Usa: /api/cards?code=TUO_CODICE_2FA'
          ],
          nextStep: `${req.headers.host}/api/cards?code=INSERISCI_CODICE`,
          apiKeyWorking: true,
          loginWorking: true
        });
      }

      // Login fallito per altro motivo
      return res.status(400).json({
        error: 'Login failed',
        details: loginData.data?.signIn?.errors || loginData.errors
      });

    } else {
      // FASE 2B: Login con codice 2FA
      console.log('2FA login attempt with code:', twoFACode);

      // Ottieni fresh otpSessionChallenge
      const freshLoginResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
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

      const freshLoginData = await freshLoginResponse.json();
      const otpSessionChallenge = freshLoginData.data?.signIn?.otpSessionChallenge;
      
      if (!otpSessionChallenge) {
        return res.status(400).json({
          error: 'Cannot get fresh OTP session'
        });
      }

      // Login con 2FA
      const twoFAResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
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

      const twoFAData = await twoFAResponse.json();
      console.log('2FA response:', JSON.stringify(twoFAData, null, 2));

      if (twoFAData.data?.signIn?.errors?.length > 0) {
        return res.status(400).json({
          error: 'Codice 2FA non valido',
          details: twoFAData.data.signIn.errors,
          hints: [
            'Verifica che il codice sia corretto',
            'Il codice potrebbe essere scaduto',
            'Richiedi un nuovo codice se necessario'
          ]
        });
      }

      const jwtToken = twoFAData.data?.signIn?.jwtToken?.token;
      
      if (!jwtToken) {
        return res.status(400).json({
          error: 'Nessun JWT ricevuto dopo 2FA',
          data: twoFAData
        });
      }

      console.log('✅ 2FA successful! Fetching personal cards...');
      return await fetchPersonalCards(jwtToken);
    }

    // FASE 3: Funzione per recuperare carte personali
    async function fetchPersonalCards(jwtToken) {
      const nbaQuery = `
        query {
          currentUser {
            id
            slug
            nickname
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

      const cardsResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'JWT-AUD': 'sorare-nba-manager'
        },
        body: JSON.stringify({
          query: nbaQuery
        })
      });

      const cardsData = await cardsResponse.json();

      if (cardsData.errors) {
        return res.status(400).json({
          error: 'Errore recupero carte personali',
          details: cardsData.errors
        });
      }

      const userData = cardsData.data?.currentUser;
      const cards = userData?.nbaCards?.nodes || [];
      
      // Aggiungi proiezioni simulate
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
        totalCount: userData?.nbaCards?.totalCount || 0,
        user: {
          nickname: userData?.nickname,
          slug: userData?.slug
        },
        message: `🎉🏀 ${cardsWithProjections.length} carte NBA personali di ${userData?.nickname}!`,
        authMethod: 'API Key + JWT + 2FA',
        benefits: [
          '✅ API Key: 600 chiamate/minuto',
          '✅ JWT: Accesso alle tue carte personali',
          '✅ 2FA: Sicurezza massima'
        ],
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Hybrid system error:', error);
    res.status(500).json({
      error: 'Sistema ibrido fallito',
      message: error.message,
      stack: error.stack
    });
  }
}
