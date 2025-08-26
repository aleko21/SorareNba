const API_KEY = process.env.SORARE_API_KEY;
const GRAPHQL_ENDPOINT = 'https://api.sorare.com/graphql';

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
    // Dynamic import per node-fetch v3.x
    const { default: fetch } = await import('node-fetch');
    
    console.log('API_KEY present:', !!API_KEY);

    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'API key non configurata',
        details: 'SORARE_API_KEY environment variable missing'
      });
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUERY_LIMITED_CARDS
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return res.status(400).json({ 
        error: 'GraphQL errors', 
        details: data.errors 
      });
    }

    const cards = data.data?.currentUser?.nbaCards?.nodes || [];
    
    // Aggiungi proiezioni simulate per ogni carta
    const cardsWithProjections = cards.map(card => ({
      ...card,
      projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
      last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
      games_this_week: Math.floor(Math.random() * 4) + 1
    }));

    res.status(200).json({
      success: true,
      data: cardsWithProjections,
      count: cardsWithProjections.length
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
