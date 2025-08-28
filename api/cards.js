        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'APIKEY': SORARE_API_KEY,
          'JWT-AUD': 'sorare-nba-manager',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: QUERY, variables: { first: 50, after: cursor } })
      });
      const { data, errors } = await resp.json();
      if (errors) throw new Error(errors[0].message);

      const page = data.currentUser.cards;
      allNodes.push(...page.nodes);
      hasNextPage = page.pageInfo.hasNextPage;
      cursor = page.pageInfo.endCursor;
    }

    // Filtra solo Limited
    const limited = allNodes.filter(c => c.rarityTyped?.toUpperCase() === 'LIMITED');

    // Mappa con proiezioni
    const cards = limited.map(card => ({
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

    return res.status(200).json({
      success: true,
      data: cards,
      count: cards.length,
      totalCount: allNodes.length,
      message: `🎉🏀 ${cards.length} carte NBA Limited caricate!`,
      authMethod: 'JWT + API Key (paginazione)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cards error:', error);
    return res.status(500).json({ error: 'Errore caricamento carte', message: error.message });
  }
}
