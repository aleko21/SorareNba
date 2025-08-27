// api/cards.js - Versione completa con query corrette basate sullo schema reale
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    console.log('🏀 Testando diverse query per carte NBA...');

    // Prova diverse query basate sullo schema reale
    const testQuery = req.query.test || 'cards';
    
    const queries = {
      // Test 1: Informazioni base currentUser
      user: `
        query {
          currentUser {
            id
            slug
            nickname
            __typename
          }
        }
      `,
      
      // Test 2: Carte generiche del currentUser
      cards: `
        query {
          currentUser {
            id
            slug
            nickname
            cards(first: 50) {
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
                onSale
                player: anyPlayer {
                  __typename
                  ... on FootballPlayer {
                    displayName
                    slug
                    position
                    age
                    team: activeClub {
                      name
                      slug
                    }
                  }
                  ... on BaseballPlayer {
                    displayName
                    slug
                    position
                    age
                    team: activeClub {
                      name
                      slug
                    }
                  }
                  ... on NbaPlayer {
                    displayName
                    slug
                    position
                    age
                    team: activeClub {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `,
      
      // Test 3: Solo carte NBA usando filtro sport
      nbaCards: `
        query {
          currentUser {
            id
            slug
            nickname
            cards(first: 50, sports: ["basketball"]) {
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
                onSale
                player: anyPlayer {
                  __typename
                  ... on NbaPlayer {
                    displayName
                    slug
                    position
                    age
                    team: activeClub {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      `,
      
      // Test 4: Carte NBA con filtro più specifico
      nbaCardsFiltered: `
        query {
          currentUser {
            cards(first: 100, rarities: [limited, rare, super_rare, unique], sports: ["basketball"]) {
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
                onSale
                player: anyPlayer {
                  ... on NbaPlayer {
                    displayName
                    slug
                    position
                    age
                    team: activeClub {
                      name
                      slug
                      abbreviation
                    }
                  }
                }
              }
            }
          }
        }
      `
    };

    const selectedQuery = queries[testQuery];
    
    if (!selectedQuery) {
      return res.status(400).json({
        error: 'Test query non valida',
        availableTests: Object.keys(queries),
        usage: 'Usa ?test=cards (default), ?test=user, ?test=nbaCards, o ?test=nbaCardsFiltered'
      });
    }

    console.log(`Eseguendo test: ${testQuery}`);

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'APIKEY': SORARE_API_KEY,
        'JWT-AUD': 'sorare-nba-manager',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: selectedQuery
      })
    });

    const data = await response.json();

    console.log(`Risposta per ${testQuery}:`, JSON.stringify(data, null, 2));

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
        details: data.errors,
        testQuery: testQuery,
        suggestion: 'Prova un altro test: ?test=user per informazioni base'
      });
    }

    const userData = data.data?.currentUser;
    
    if (!userData) {
      return res.status(400).json({
        error: 'Dati utente non trovati',
        rawData: data
      });
    }

    // Gestisci diversi tipi di risposta
    if (testQuery === 'user') {
      return res.status(200).json({
        success: true,
        message: '✅ Connessione currentUser funziona!',
        user: userData,
        nextStep: 'Prova ?test=cards per vedere tutte le carte'
      });
    }

    const cards = userData.cards?.nodes || [];
    const totalCount = userData.cards?.totalCount || 0;
    
    // Filtra solo le carte NBA e aggiungi dati mancanti
    const nbaCards = cards
      .filter(card => {
        return card.player?.__typename === 'NbaPlayer' || 
               (card.player && card.player.team);
      })
      .map(card => {
        // Verifica se il player è NBA
        const isNbaPlayer = card.player?.__typename === 'NbaPlayer';
        
        return {
          ...card,
          // Dati del giocatore
          player: {
            displayName: card.player?.displayName || 'Unknown Player',
            slug: card.player?.slug || '',
            position: card.player?.position || 'N/A',
            age: card.player?.age || null,
            team: {
              name: card.player?.team?.name || 'Unknown Team',
              abbreviation: card.player?.team?.abbreviation || 
                          card.player?.team?.slug?.toUpperCase()?.substring(0, 3) || 'UNK'
            }
          },
          // Aggiungi proiezioni simulate
          projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
          last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
          games_this_week: Math.floor
