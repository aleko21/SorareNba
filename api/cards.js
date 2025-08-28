// api/cards.js - Query minimale che sicuramente funziona
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    // Ottieni JWT dal cookie
    const cookies = req.headers.cookie || '';
    const jwtMatch = cookies.match(/sorare_jwt=([^;]+)/);
    
    if (!jwtMatch) {
      return res.status(401).json({
        error: 'Non autenticato',
        loginUrl: '/api/auth/login'
      });
    }

    const jwt = jwtMatch[1];
    const { default: fetch } = await import('node-fetch');

    // STEP 1: Test base - sappiamo che funziona
    console.log('Step 1: Test JWT base...');
    
    const baseQuery = `
      query {
        currentUser {
          id
          slug
          nickname
        }
      }
    `;

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'APIKEY': SORARE_API_KEY,
        'JWT-AUD': 'sorare-nba-manager',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: baseQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (responseData.errors) {
      return res.status(400).json({
        error: 'JWT o query base fallita',
        details: responseData.errors
      });
    }

    const userData = responseData.data?.currentUser;
    
    if (!userData) {
      return res.status(400).json({
        error: 'currentUser non trovato',
        data: responseData
      });
    }

    console.log('✅ JWT funziona, user:', userData.nickname);

    // STEP 2: Test espansione graduale
    console.log('Step 2: Test accesso carte...');
    
    const cardsQuery = `
      query {
        currentUser {
          id
          slug
          nickname
        }
      }
    `;

    // Per ora, invece di cercare carte reali che potrebbero non esistere,
    // generiamo dati di test per verificare che tutto funzioni
    const demoNBACards = [
      {
        id: 'demo-1',
        slug: 'lebron-james-limited-demo',
        name: 'LeBron James (Demo)',
        rarity: 'limited',
        serialNumber: 23,
        pictureUrl: 'https://via.placeholder.com/200x300/ff6b35/white?text=LBJ',
        xp: 450,
        grade: null,
        seasonYear: '2024',
        onSale: false,
        player: {
          displayName: 'LeBron James',
          slug: 'lebron-james',
          position: 'SF',
          age: 39,
          team: {
            name: 'Los Angeles Lakers',
            abbreviation: 'LAL'
          }
        },
        projection: 52.3,
        last10avg: 48.7,
        games_this_week: 3,
        efficiency: 1.12
      },
      {
        id: 'demo-2',
        slug: 'stephen-curry-rare-demo',
        name: 'Stephen Curry (Demo)',
        rarity: 'rare',
        serialNumber: 30,
        pictureUrl: 'https://via.placeholder.com/200x300/4fc3f7/white?text=SC',
        xp: 380,
        grade: null,
        seasonYear: '2024',
        onSale: false,
        player: {
          displayName: 'Stephen Curry',
          slug: 'stephen-curry',
          position: 'PG',
          age: 36,
          team: {
            name: 'Golden State Warriors',
            abbreviation: 'GSW'
          }
        },
        projection: 49.8,
        last10avg: 45.2,
        games_this_week: 2,
        efficiency: 1.08
      }
    ];

    res.status(200).json({
      success: true,
      data: demoNBACards,
      count: demoNBACards.length,
      user: {
        nickname: userData.nickname,
        slug: userData.slug
      },
      message: `🏀 Sistema funzionante per ${userData.nickname}! (Dati demo mentre debuggiamo l'accesso alle carte reali)`,
      authMethod: 'JWT + API Key (funzionante)',
      nextSteps: [
        '1. ✅ Login 2FA funziona',
        '2. ✅ JWT salvato e valido', 
        '3. ✅ Accesso account Sorare OK',
        '4. 🔄 Debug accesso carte reali in corso...'
      ],
      debug: {
        jwtWorking: true,
        userFound: true,
        accountNickname: userData.nickname,
        accountSlug: userData.slug
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cards error:', error);
    res.status(500).json({
      error: 'Errore caricamento carte',
      message: error.message,
      stack: error.stack
    });
  }
}
