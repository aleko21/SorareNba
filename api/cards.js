// api/cards.js - Sistema ibrido completo
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;

    if (!SORARE_EMAIL || !SORARE_PASSWORD || !SORARE_API_KEY) {
      return res.status(500).json({
        error: 'Configurazione incompleta',
        missing: {
          email: !SORARE_EMAIL,
          password: !SORARE_PASSWORD,
          apiKey: !SORARE_API_KEY
        }
      });
    }

    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    // FASE 1: Login per ottenere JWT
    console.log('Step 1: Getting JWT via login...');
    
    // Get salt
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const { salt } = await saltResponse.json();
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, salt);

    // Login mutation
    const loginMutation = `
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

    const loginResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APIKEY': SORARE_API_KEY  // API key anche per login
      },
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
    console.log('Login response:', JSON.stringify(loginData, null, 2));

    if (loginData.errors || loginData.data?.signIn?.errors?.length > 0) {
      return res.status(400).json({
        error: 'Login failed',
        details: loginData.errors || loginData.data?.signIn?.errors,
        hint: 'Verifica email/password o gestisci 2FA se richiesto'
      });
    }

    const jwtToken = loginData.data?.signIn?.jwtToken?.token;
    
    if (!jwtToken) {
      return res.status(400).json({
        error: 'Nessun JWT ricevuto',
        loginResponse: loginData
      });
    }

    console.log('✅ JWT obtained:', jwtToken.substring(0, 50) + '...');

    // FASE 2: Usa JWT + API Key per ottenere carte personali
    console.log('Step 2: Fetching personal NBA cards...');

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

    const cardsResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,   // JWT per autenticazione
        'APIKEY': SORARE_API_KEY,               // API key per rate limits
        'JWT-AUD': 'sorare-nba-manager',        // Obbligatorio
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: nbaQuery
      })
    });

    const cardsData = await cardsResponse.json();
    console.log('Cards response:', JSON.stringify(cardsData, null, 2));

    if (cardsData.errors) {
      return res.status(400).json({
        error: 'Errore recupero carte',
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

    res.status(200).json({
      success: true,
      data: cardsWithProjections,
      count: cardsWithProjections.length,
      totalCount: userData?.nbaCards?.totalCount || 0,
      user: {
        nickname: userData?.nickname,
        slug: userData?.slug
      },
      message: `🎉 ${cardsWithProjections.length} carte NBA personali di ${userData?.nickname}!`,
      authMethod: 'JWT + API Key',
      benefits: [
        'Accesso alle tue carte personali',
        '600 chiamate/minuto (invece di 60)',
        'Dati in tempo reale'
      ]
    });

  } catch (error) {
    console.error('Hybrid auth error:', error);
    res.status(500).json({
      error: 'Sistema ibrido fallito',
      message: error.message,
      stack: error.stack
    });
  }
}
