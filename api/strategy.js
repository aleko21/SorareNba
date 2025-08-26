const COMPETITION_CAPS = {
  'limited_contender': 205,
  'limited_champion': 205,
  'rare_champion': 220
};

const SCORING_WEIGHTS = {
  projection: 0.4,
  consistency: 0.3,
  games_this_week: 0.2,
  level_bonus: 0.1
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { cards, competition } = req.method === 'GET' ? req.query : req.body;
    
    if (!cards) {
      return res.status(400).json({ error: 'Cards parameter required' });
    }

    const cardsData = typeof cards === 'string' ? JSON.parse(cards) : cards;
    const pointsCap = COMPETITION_CAPS[competition] || 205;

    // Calcola score strategico per ogni carta
    const scoredCards = cardsData.map(card => {
      const projectionScore = card.projection || 0;
      const consistencyScore = card.last10avg || 0;
      const gamesScore = (card.games_this_week || 1) * 5;
      const levelBonus = (card.level || 1) * 2;
      
      const strategicScore = (
        projectionScore * SCORING_WEIGHTS.projection +
        consistencyScore * SCORING_WEIGHTS.consistency +
        gamesScore * SCORING_WEIGHTS.games_this_week +
        levelBonus * SCORING_WEIGHTS.level_bonus
      );

      return {
        ...card,
        strategicScore: Math.round(strategicScore * 10) / 10,
        efficiency: Math.round((strategicScore / projectionScore) * 100) / 100
      };
    });

    // Ordina per strategic score
    scoredCards.sort((a, b) => b.strategicScore - a.strategicScore);

    // Genera formazione ottimale (top 5)
    const optimalLineup = scoredCards.slice(0, 5);
    const totalProjection = optimalLineup.reduce((sum, card) => sum + (card.projection || 0), 0);
    const avgEfficiency = optimalLineup.reduce((sum, card) => sum + card.efficiency, 0) / 5;

    // Genera raccomandazioni strategiche
    const recommendations = [];
    
    if (totalProjection < pointsCap * 0.8) {
      recommendations.push({
        type: 'warning',
        message: 'La formazione potrebbe essere sotto il cap ottimale. Considera carte con proiezioni più alte.'
      });
    }

    if (avgEfficiency > 1.2) {
      recommendations.push({
        type: 'success',
        message: 'Excellent value lineup! Giocatori efficienti selezionati.'
      });
    }

    const lowGamesCards = optimalLineup.filter(card => card.games_this_week < 2);
    if (lowGamesCards.length > 2) {
      recommendations.push({
        type: 'info',
        message: `${lowGamesCards.length} giocatori hanno meno di 2 partite questa settimana.`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        optimalLineup,
        totalProjection: Math.round(totalProjection * 10) / 10,
        pointsCap,
        efficiency: Math.round(avgEfficiency * 100) / 100,
        recommendations,
        allCardsRanked: scoredCards
      }
    });

  } catch (error) {
    console.error('Strategy API Error:', error);
    res.status(500).json({ 
      error: 'Errore nel calcolo della strategia', 
      message: error.message 
    });
  }
}
