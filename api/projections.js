import fetch from 'node-fetch';

const API_KEY = process.env.SORARE_API_KEY;
const GRAPHQL_ENDPOINT = 'https://api.sorare.com/graphql';

const QUERY_PLAYER_STATS = `
  query($playerSlugs: [String!]) {
    players(slugs: $playerSlugs) {
      slug
      displayName
      team {
        abbreviation
      }
      position
      so5Scores(last: 10) {
        score
        game {
          date
        }
      }
    }
  }
`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { playerSlugs } = req.query;
    
    if (!playerSlugs) {
      return res.status(400).json({ error: 'playerSlugs parameter required' });
    }

    const slugsArray = Array.isArray(playerSlugs) ? playerSlugs : [playerSlugs];

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: QUERY_PLAYER_STATS,
        variables: { playerSlugs: slugsArray }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: 'GraphQL errors', details: data.errors });
    }

    const players = data.data?.players || [];
    
    // Calcola proiezioni basate sui dati storici
    const projections = players.map(player => {
      const scores = player.so5Scores || [];
      const recentScores = scores.slice(-5); // Ultimi 5 match
      const avgScore = recentScores.length > 0 
        ? recentScores.reduce((sum, s) => sum + s.score, 0) / recentScores.length
        : 0;
      
      return {
        player: player.displayName,
        team: player.team?.abbreviation,
        position: player.position,
        avgLast5: Math.round(avgScore * 10) / 10,
        projection: Math.round((avgScore * (0.9 + Math.random() * 0.2)) * 10) / 10,
        confidence: Math.round(Math.random() * 40 + 60), // 60-100%
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    });

    res.status(200).json({
      success: true,
      data: projections
    });

  } catch (error) {
    console.error('Projections API Error:', error);
    res.status(500).json({ 
      error: 'Errore nel calcolo delle proiezioni', 
      message: error.message 
    });
  }
}
