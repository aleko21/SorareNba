// api/cards.js - Versione OAuth (sostituisce completamente il file esistente)
export default async function handler(req, res) {
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
    // Ottieni access token dai cookies
    const cookies = req.headers.cookie || '';
    const tokenMatch = cookies.match(/sorare_token=([^;]+)/);
    
    if (!tokenMatch) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'Please login via OAuth first',
        loginUrl: '/api/auth/sorare',
        instructions: [
          '1. Click on "Login with Sorare" button',
          '2. Authorize the application on Sorare.com',
          '3. You will be redirected back with access to your cards'
        ]
      });
    }
    
    const accessToken = tokenMatch[1];
    console.log('Using OAuth access token, length:', accessToken.length);
    
    const { default: fetch } = await import('node-fetch');
    
    // Query per carte NBA Limited
    const nbaCardsQuery = `
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

    console.log('Fetching NBA cards with OAuth token...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: nbaCardsQuery
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('GraphQL response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      // Se token è scaduto, chiedi nuovo login
      if (data.errors.some(err => err.message.includes('token') || err.message.includes('unauthorized'))) {
        res.setHeader('Set-Cookie', 'sorare_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/');
        return res.status(401).json({
          error: 'Token expired',
          message: 'Please login again',
          loginUrl: '/api/auth/sorare'
        });
      }
      
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors
      });
    }

    const userData = data.data?.currentUser;
    const cards = userData?.nbaCards?.nodes || [];
    const totalCount = userData?.nbaCards?.totalCount || 0;
    
    console.log(`Found ${cards.length} NBA cards for user: ${userData?.nickname}`);

    // Aggiungi proiezioni simulate per ogni carta
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
      totalCount: totalCount,
      user: {
        nickname: userData?.nickname,
        slug: userData?.slug
      },
      message: `🎉🏀 ${cardsWithProjections.length} carte NBA caricate dal tuo account Sorare (${userData?.nickname})!`,
      timestamp: new Date().toISOString(),
      authMethod: 'OAuth 2.0'
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
