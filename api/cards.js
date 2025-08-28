// api/cards.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    const cookies = req.headers.cookie || '';
    const jwtMatch = cookies.match(/sorare_jwt=([^;]+)/);
    if (!jwtMatch) {
      return res.status(401).json({ error: 'Non autenticato', loginUrl: '/api/auth/login' });
    }
    const jwt = jwtMatch[1];
    const { default: fetch } = await import('node-fetch');

    // 1) Query preliminare per totalCount
    const countQuery = `
      query {
        currentUser {
          cards(first: 0, sport: NBA) {
            totalCount
          }
        }
      }
    `;
    const countResp = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'APIKEY': SORARE_API_KEY,
        'JWT-AUD': 'sorare-nba-manager',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: countQuery })
    });
    const countData = await countResp.json();
    const total = countData.data.currentUser.cards.totalCount;

    // 2) Query “bulk” con first = total
    const bulkQuery = `
      query CardsAll($first: Int!) {
        currentUser {
          nickname
          cards(first: $first, sport: NBA) {
            nodes {
              name
              slug
              rarityTyped
              serialNumber
              pictureUrl
              xp
              grade
              seasonYear
              anyPlayer {
                displayName
                slug
                anyPositions
                age
                ... on NBAPlayer {
                  activeClub { name slug }
                }
              }
              walletStatus
            }
          }
        }
      }
    `;
    const bulkResp = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'APIKEY': SORARE_API_KEY,
        'JWT-AUD': 'sorare-nba-manager',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: bulkQuery, variables: { first: total } })
    });
    const bulkData = await bulkResp.json();
    if (bulkData.errors) throw new Error(bulkData.errors[0].message);

    // Filtra e mappa le Limited
    const allCards = bulkData.data.currentUser.cards.nodes;
    const limited = allCards.filter(c => c.rarityTyped?.toUpperCase() === 'LIMITED');
    const cardsWithProjections = limited.map(card => ({
      id: card.slug,
      slug: card.slug,
      name: card.name,
      rarity: card.rarityTyped.toLowerCase(),
      serialNumber: card.serialNumber,
      pictureUrl: card.pictureUrl,
      xp: card.xp,
      grade: card.grade,
      seasonYear: card.seasonYear,
      onSale: card.walletStatus !== 'MINTED',
      player: {
        displayName: card.anyPlayer.displayName,
        slug: card.anyPlayer.slug,
        position: card.anyPlayer.anyPositions?.[0] || null,
        age: card.anyPlayer.age,
        team: {
          name: card.anyPlayer.activeClub?.name,
          abbreviation: card.anyPlayer.activeClub?.slug?.slice(0,3).toUpperCase()
        }
      },
      projection: Math.round((Math.random()*30+40)*10)/10,
      last10avg: Math.round((Math.random()*25+35)*10)/10,
      games_this_week: Math.floor(Math.random()*4)+1,
      efficiency: Math.round((Math.random()*0.5+1)*100)/100
    }));

    res.status(200).json({
      success: true,
      data: cardsWithProjections,
      count: cardsWithProjections.length,
      totalCount: total,
      user: { nickname: bulkData.data.currentUser.nickname },
      message: `🎉🏀 ${cardsWithProjections.length} carte NBA Limited di ${bulkData.data.currentUser.nickname}!`,
      authMethod: 'JWT + API Key (bulk fetch)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cards error:', error);
    res.status(500).json({ error: 'Errore caricamento carte', message: error.message });
  }
}
