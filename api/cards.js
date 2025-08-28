// api/cards.js - USA JWT salvato, non fa più login
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
        message: 'Devi fare login prima di accedere alle carte',
        loginRequired: true,
        loginUrl: '/api/auth/login',
        instructions: [
          '1. Vai a /api/auth/login per fare login',
          '2. Completa il processo 2FA se richiesto',
          '3. Torna qui per vedere le tue carte'
        ]
      });
    }

    const jwt = jwtMatch[1];
    const { default: fetch } = await import('node-fetch');

    console.log('🏀 Caricando carte NBA con JWT salvato...');

    // In api/cards.js, sostituisci la query con:
const nbaQuery = `
  query {
    currentUser {
      id
      slug
      nickname
      nbaUserProfile {
        id
      }
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
        query: nbaQuery
      })
    });

    const data = await response.json();

    if (data.errors) {
      // JWT scaduto o invalido
      if (data.errors.some(err => err.message.includes('token') || err.message.includes('unauthorized'))) {
        res.setHeader('Set-Cookie', 'sorare_jwt=; HttpOnly; Max-Age=0; Path=/');
        return res.status(401).json({
          error: 'JWT scaduto',
          message: 'Fai login di nuovo',
          loginUrl: '/api/auth/login'
        });
      }
      
      return res.status(400).json({
        error: 'Errore GraphQL',
        details: data.errors
      });
    }

    const userData = data.data?.currentUser;
    const cards = userData?.nbaCards?.nodes || [];
    
    // Aggiungi proiezioni
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
      message: `🏀 ${cardsWithProjections.length} carte NBA di ${userData?.nickname}!`,
      authMethod: 'JWT + API Key (separati)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cards error:', error);
    res.status(500).json({
      error: 'Errore caricamento carte',
      message: error.message
    });
  }
}
