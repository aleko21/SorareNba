// api/cards.js - QUERY CORRETTA
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    // ✅ QUERY CORRETTA basata sullo schema reale
    const CORRECT_QUERY = `
      query {
        currentUser {
          nbaCards {
            nodes {
              id
              slug
              serialNumber
              name
              pictureUrl
              rarity
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
              xp
              grade
            }
          }
        }
      }
    `;

    console.log('Testing CORRECTED NBA query...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Test prima SENZA autenticazione
      },
      body: JSON.stringify({
        query: CORRECT_QUERY
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Corrected query response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors,
        hint: 'Probabilmente serve autenticazione per currentUser'
      });
    }

    const cards = data.data?.currentUser?.nbaCards?.nodes || [];
    
    // Simula proiezioni per le carte ricevute
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
      message: cards.length > 0 ? '✅ Carte NBA caricate!' : 'Nessuna carta NBA (serve autenticazione)'
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
