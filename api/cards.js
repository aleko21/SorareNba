// api/cards.js - Torna all'API Key (niente OAuth)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    if (!SORARE_API_KEY) {
      return res.status(500).json({
        error: 'API Key non configurata',
        message: 'Configura SORARE_API_KEY nelle environment variables'
      });
    }

    const { default: fetch } = await import('node-fetch');

    // Query pubblica per testare l'API key
    const testQuery = `
      query {
        cards(first: 10) {
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
          }
        }
      }
    `;

    console.log('Testing API with public query...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APIKEY': SORARE_API_KEY  // Come dice l'assistenza Sorare
      },
      body: JSON.stringify({
        query: testQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors,
        hint: 'Verifica che l\'API key sia valida'
      });
    }

    const cards = data.data?.cards?.nodes || [];
    
    // Simula che siano "NBA cards" per test
    const nbaCards = cards.filter(card => 
      card.player?.team?.name && 
      card.player?.position
    ).map(card => ({
      ...card,
      // Aggiungi dati mancanti per compatibilità
      serialNumber: Math.floor(Math.random() * 1000) + 1,
      pictureUrl: `https://via.placeholder.com/200x300/ff6b35/white?text=${card.player.displayName.split(' ').map(n => n[0]).join('')}`,
      xp: Math.floor(Math.random() * 500) + 100,
      grade: null,
      seasonYear: '2024',
      onSale: Math.random() > 0.8,
      projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
      last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
      games_this_week: Math.floor(Math.random() * 4) + 1,
      efficiency: Math.round((Math.random() * 0.5 + 1) * 100) / 100
    }));

    res.status(200).json({
      success: true,
      data: nbaCards,
      count: nbaCards.length,
      message: `✅ ${nbaCards.length} carte caricate con API Key!`,
      note: 'Dati pubblici Sorare (per carte personali serve autenticazione diversa)',
      timestamp: new Date().toISOString()
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
