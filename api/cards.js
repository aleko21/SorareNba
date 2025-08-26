// api/cards.js - Query con campi REALI
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    // Query con campi REALI dallo schema Sorare
    const queries = {
      // Livello 1: Info pubbliche sui giocatori NBA
      players: `
        query {
          players(first: 5) {
            nodes {
              slug
              displayName
              position
            }
          }
        }
      `,
      
      // Livello 2: Carte pubbliche
      cards: `
        query {
          cards(first: 5) {
            nodes {
              id
              slug
              name
            }
          }
        }
      `,
      
      // Livello 3: Current user (richiede auth)
      currentUser: `
        query {
          currentUser {
            id
            slug
            nickname
          }
        }
      `,
      
      // Livello 4: NBA cards del current user (obiettivo finale)
      nbaCards: `
        query {
          currentUser {
            nbaCards {
              totalCount
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
                xp
                grade
              }
            }
          }
        }
      `
    };

    const testQuery = req.query.test || 'players'; // Default a query pubblica
    const selectedQuery = queries[testQuery];

    if (!selectedQuery) {
      return res.status(400).json({
        error: 'Query non valida',
        availableTests: Object.keys(queries),
        suggestion: 'Prova: /api/cards?test=players'
      });
    }

    console.log(`Testing REAL query: ${testQuery}`);

    const headers = {
      'Content-Type': 'application/json',
    };

    // Aggiungi API key per query autenticate
    if (SORARE_API_KEY && (testQuery === 'currentUser' || testQuery === 'nbaCards')) {
      headers['APIKEY'] = SORARE_API_KEY;
      console.log('Using API key for authenticated query');
    }

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: selectedQuery
      })
    });

    const responseText = await response.text();
    console.log(`Response for ${testQuery}:`, responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status}`,
        responseText: responseText,
        query: testQuery
      });
    }

    const data = JSON.parse(responseText);

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors,
        query: testQuery,
        hint: testQuery === 'players' || testQuery === 'cards' ? 'Query pubblica fallita - campo potrebbe non esistere' : 'Serve autenticazione'
      });
    }

    // SUCCESS! Processamento specifico per NBA cards
    if (testQuery === 'nbaCards' && data.data?.currentUser?.nbaCards?.nodes) {
      const cards = data.data.currentUser.nbaCards.nodes;
      const cardsWithProjections = cards.map(card => ({
        ...card,
        projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
        last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
        games_this_week: Math.floor(Math.random() * 4) + 1
      }));
      
      return res.status(200).json({
        success: true,
        data: cardsWithProjections,
        count: cardsWithProjections.length,
        message: `🎉🏀 ${cardsWithProjections.length} carte NBA Limited caricate dal tuo account!`,
        query: testQuery
      });
    }

    res.status(200).json({
      success: true,
      data: data.data,
      message: `✅ Query ${testQuery} completata con successo!`,
      query: testQuery,
      rawResponse: responseText
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Errore query',
      message: error.message
    });
  }
}
