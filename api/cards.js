// api/cards.js - Versione corretta senza errori di inizializzazione
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
        loginUrl: '/api/auth/login'
      });
    }

    const jwt = jwtMatch[1];
    const { default: fetch } = await import('node-fetch');

    console.log('🏀 Caricando carte con debug query...');

    // Query di debug semplice e sicura
    const debugQuery = `
      query {
        currentUser {
          id
          slug
          nickname
          cards(first: 100) {
            totalCount
            nodes {
              id
              name
              rarity
              sport {
                name
                slug
              }
              player: anyPlayer {
                __typename
                ... on NBAPlayer {
                  displayName
                  position
                  team: activeClub {
                    name
                    abbreviation
                  }
                }
              }
            }
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
        query: debugQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json(); // ✅ Nome diverso per evitare conflitti

    if (responseData.errors) {
      console.error('GraphQL errors:', responseData.errors);
      return res.status(400).json({
        error: 'Errore GraphQL',
        details: responseData.errors
      });
    }

    // ✅ Ora posso accedere ai dati in sicurezza
    const userData = responseData.data?.currentUser;
    const allCards = userData?.cards?.nodes || [];
    
    console.log('=== DEBUG INFO ===');
    console.log('User:', userData?.nickname);
    console.log('Totale carte:', userData?.cards?.totalCount);
    console.log('Carte ricevute:', allCards.length);
    
    // Debug ogni carta
    allCards.forEach((card, index) => {
      console.log(`${index + 1}. "${card.name}" (${card.rarity}) - Sport: ${card.sport?.name || 'unknown'} - Player Type: ${card.player?.__typename || 'unknown'}`);
    });

    // Filtra solo carte NBA
    const nbaCards = allCards.filter(card => 
      card.sport?.slug === 'nba' || 
      card.player?.__typename === 'NBAPlayer' ||
      card.sport?.name === 'NBA'
    );
    
    console.log('Carte NBA filtrate:', nbaCards.length);
    
    // Aggiungi proiezioni simulate solo alle carte NBA
    const nbaCardsWithProjections = nbaCards.map(card => ({
      ...card,
      serialNumber: card.serialNumber || Math.floor(Math.random() * 1000) + 1,
      pictureUrl: card.pictureUrl || `https://via.placeholder.com/200x300/ff6b35/white?text=${card.name?.split(' ').map(n => n[0]).join('') || 'NBA'}`,
      xp: card.xp || Math.floor(Math.random() * 500) + 100,
      grade: card.grade || null,
      seasonYear: card.seasonYear || '2024',
      onSale: card.onSale || false,
      projection: Math.round((Math.random() * 30 + 40) * 10) / 10,
      last10avg: Math.round((Math.random() * 25 + 35) * 10) / 10,
      games_this_week: Math.floor(Math.random() * 4) + 1,
      efficiency: Math.round((Math.random() * 0.5 + 1) * 100) / 100,
      // Assicurati che player abbia la struttura corretta
      player: card.player ? {
        displayName: card.player.displayName || card.name || 'Unknown Player',
        slug: card.player.slug || card.slug || 'unknown',
        position: card.player.position || 'Unknown',
        age: card.player.age || Math.floor(Math.random() * 10) + 20,
        team: card.player.team ? {
          name: card.player.team.name || 'Unknown Team',
          abbreviation: card.player.team.abbreviation || 'UNK'
        } : {
          name: 'Unknown Team',
          abbreviation: 'UNK'
        }
      } : null
    }));

    res.status(200).json({
      success: true,
      data: nbaCardsWithProjections,
      count: nbaCardsWithProjections.length,
      totalCount: userData?.cards?.totalCount || 0,
      user: {
        nickname: userData?.nickname,
        slug: userData?.slug
      },
      debug: {
        totalCardsInAccount: allCards.length,
        nbaCardsFound: nbaCards.length,
        sampleCards: allCards.slice(0, 3).map(card => ({
          name: card.name,
          rarity: card.rarity,
          sport: card.sport?.name,
          playerType: card.player?.__typename
        }))
      },
      message: nbaCardsWithProjections.length > 0 
        ? `🏀 ${nbaCardsWithProjections.length} carte NBA di ${userData?.nickname}!`
        : `❓ ${userData?.nickname} ha ${allCards.length} carte totali, ma 0 carte NBA. Controlla i debug info.`,
      authMethod: 'JWT + API Key (debug mode)',
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
