export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Usa JWT da environment variable o query parameter
    let jwtToken = process.env.SORARE_JWT_TOKEN || req.query.jwt;
    
    if (!jwtToken) {
      return res.status(401).json({
        error: 'JWT token required',
        message: 'Login su sorare.com, ottieni JWT e aggiungi: ?jwt=TOKEN',
        instructions: [
          '1. Login su sorare.com nel browser',
          '2. F12 > Network > Ricarica',  
          '3. Trova richiesta a api.sorare.com/graphql',
          '4. Copia Authorization header JWT',
          '5. Testa con: /api/cards?jwt=IL_TUO_JWT'
        ]
      });
    }

    const { default: fetch } = await import('node-fetch');
    const SORARE_API_KEY = process.env.SORARE_API_KEY;

    // Query per carte Limited
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

    console.log('Using JWT token, length:', jwtToken.length);
    console.log('JWT preview:', jwtToken.substring(0, 50) + '...');

    const headers = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };
    
    if (SORARE_API_KEY) {
      headers['APIKEY'] = SORARE_API_KEY;
      console.log('Using API key for higher rate limits');
    }

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: QUERY_LIMITED_CARDS
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors,
        hint: 'JWT potrebbe essere scaduto, ottienine uno nuovo dal browser'
      });
    }

    const cards = data.data?.currentUser?.nbaCards?.nodes || [];
    
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
      message: `🎉 ${cardsWithProjections.length} carte Limited caricate con successo!`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Errore nel recupero delle carte',
      message: error.message,
      stack: error.stack
    });
  }
}
