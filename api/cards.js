// api/cards.js - Versione con query PUBBLICA
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    // ✅ Query PUBBLICA (non richiede autenticazione)
    const PUBLIC_QUERY = `
      query {
        cards(first: 10, rarities: [limited]) {
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
            onSale
          }
        }
      }
    `;

    console.log('Testing PUBLIC query without authentication...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // NO AUTHORIZATION - solo query pubblica
      },
      body: JSON.stringify({
        query: PUBLIC_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Public API Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors
      });
    }

    const cards = data.data?.cards?.nodes || [];
    
    // Simula che siano "tue" carte per test
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
      message: '✅ API Sorare funziona! (Dati pubblici Limited)',
      note: 'Per dati personali serve processo diverso di autenticazione'
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Errore connessione API',
      message: error.message,
      stack: error.stack
    });
  }
}
