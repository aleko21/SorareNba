// SorareNBA Manager - Application Logic

// Data from the application
const limitedCards = [
    {
        "id": "card_1",
        "player": {
            "displayName": "LeBron James",
            "team": {"abbreviation": "LAL"},
            "position": "Forward",
            "age": 39,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"
        },
        "rarity": "Limited",
        "level": 8,
        "xp": 2100,
        "last10avg": 45.2,
        "projection": 48.5,
        "games_this_week": 3
    },
    {
        "id": "card_2",
        "player": {
            "displayName": "Stephen Curry",
            "team": {"abbreviation": "GSW"},
            "position": "Guard",
            "age": 35,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png"
        },
        "rarity": "Limited",
        "level": 10,
        "xp": 2850,
        "last10avg": 52.3,
        "projection": 55.1,
        "games_this_week": 2
    },
    {
        "id": "card_3",
        "player": {
            "displayName": "Giannis Antetokounmpo",
            "team": {"abbreviation": "MIL"},
            "position": "Forward",
            "age": 29,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png"
        },
        "rarity": "Limited",
        "level": 7,
        "xp": 1950,
        "last10avg": 58.7,
        "projection": 61.2,
        "games_this_week": 4
    },
    {
        "id": "card_4",
        "player": {
            "displayName": "Luka Dončić",
            "team": {"abbreviation": "DAL"},
            "position": "Guard",
            "age": 25,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png"
        },
        "rarity": "Limited",
        "level": 9,
        "xp": 2650,
        "last10avg": 56.8,
        "projection": 59.3,
        "games_this_week": 3
    },
    {
        "id": "card_5",
        "player": {
            "displayName": "Jayson Tatum",
            "team": {"abbreviation": "BOS"},
            "position": "Forward",
            "age": 26,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png"
        },
        "rarity": "Limited",
        "level": 6,
        "xp": 1650,
        "last10avg": 42.1,
        "projection": 44.8,
        "games_this_week": 2
    },
    {
        "id": "card_6",
        "player": {
            "displayName": "Anthony Davis",
            "team": {"abbreviation": "LAL"},
            "position": "Center",
            "age": 31,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png"
        },
        "rarity": "Limited",
        "level": 5,
        "xp": 1350,
        "last10avg": 46.3,
        "projection": 49.1,
        "games_this_week": 3
    },
    {
        "id": "card_7",
        "player": {
            "displayName": "Nikola Jokić",
            "team": {"abbreviation": "DEN"},
            "position": "Center",
            "age": 29,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png"
        },
        "rarity": "Limited",
        "level": 8,
        "xp": 2200,
        "last10avg": 62.4,
        "projection": 65.8,
        "games_this_week": 2
    },
    {
        "id": "card_8",
        "player": {
            "displayName": "Joel Embiid",
            "team": {"abbreviation": "PHI"},
            "position": "Center",
            "age": 30,
            "imageUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png"
        },
        "rarity": "Limited",
        "level": 4,
        "xp": 1100,
        "last10avg": 51.2,
        "projection": 47.6,
        "games_this_week": 1
    }
];

const competitions = [
    {
        "id": "limited_contender",
        "name": "Limited Contender",
        "type": "Limited",
        "points_cap": 205,
        "min_cards_required": 5,
        "card_types": ["Limited"],
        "prizes": ["Limited Cards", "Essence"],
        "participants": 1250,
        "ends_in": "2 giorni 14 ore"
    },
    {
        "id": "limited_champion",
        "name": "Limited Champion",
        "type": "Limited",
        "points_cap": 205,
        "min_cards_required": 5,
        "card_types": ["Limited"],
        "has_mvp": true,
        "prizes": ["€500 Cash", "Rare Cards"],
        "participants": 890,
        "ends_in": "2 giorni 14 ore"
    },
    {
        "id": "rare_champion",
        "name": "Rare Champion",
        "type": "Rare",
        "points_cap": 220,
        "min_cards_required": 3,
        "card_types": ["Rare", "Limited (max 2)"],
        "has_mvp": true,
        "prizes": ["€2000 Cash", "Super Rare Cards"],
        "participants": 456,
        "ends_in": "2 giorni 14 ore"
    }
];

// Application state
let currentSection = 'dashboard';
let filteredCards = [...limitedCards];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeNavigation();
    initializeDashboard();
    initializeMyCards();
    initializeProjections();
    initializeStrategy();
    initializeCompetitions();
    initializeModal();
});

// Navigation - Fixed to properly handle section switching
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const section = this.getAttribute('data-section');
            console.log('Navigating to section:', section);
            
            // Update active button immediately
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show the selected section
            showSection(section);
        });
    });
}

function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        console.log('Section shown successfully:', sectionName);
    } else {
        console.error('Section not found:', sectionName);
    }
}

// Dashboard
function initializeDashboard() {
    updateDashboardStats();
    createPerformanceChart();
    updateTopPerformers();
}

function updateDashboardStats() {
    const totalCards = limitedCards.length;
    const portfolioValue = calculatePortfolioValue();
    const avgScore = calculateAverageScore();
    const activeCompetitions = competitions.length;
    
    const totalCardsEl = document.getElementById('total-cards');
    const portfolioValueEl = document.getElementById('portfolio-value');
    const avgScoreEl = document.getElementById('avg-score');
    const activeCompetitionsEl = document.getElementById('active-competitions');
    
    if (totalCardsEl) totalCardsEl.textContent = totalCards;
    if (portfolioValueEl) portfolioValueEl.textContent = `€${portfolioValue.toLocaleString()}`;
    if (avgScoreEl) avgScoreEl.textContent = avgScore.toFixed(1);
    if (activeCompetitionsEl) activeCompetitionsEl.textContent = activeCompetitions;
}

function calculatePortfolioValue() {
    return limitedCards.reduce((total, card) => {
        return total + (card.level * 150 + card.projection * 10);
    }, 0);
}

function calculateAverageScore() {
    const totalScore = limitedCards.reduce((total, card) => total + card.last10avg, 0);
    return totalScore / limitedCards.length;
}

function createPerformanceChart() {
    const chartElement = document.getElementById('performance-chart');
    if (!chartElement) return;
    
    const ctx = chartElement.getContext('2d');
    
    const labels = [];
    const data = [];
    
    for (let i = 9; i >= 0; i--) {
        labels.push(`Game ${10 - i}`);
        data.push(Math.random() * 20 + 40);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Punteggio Medio',
                data: data,
                backgroundColor: '#1FB8CD20',
                borderColor: '#1FB8CD',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 30,
                    max: 70
                }
            }
        }
    });
}

function updateTopPerformers() {
    const topPerformers = [...limitedCards]
        .sort((a, b) => b.projection - a.projection)
        .slice(0, 3);
    
    const container = document.getElementById('top-performers');
    if (!container) return;
    
    container.innerHTML = '';
    
    topPerformers.forEach((card, index) => {
        const performerElement = document.createElement('div');
        performerElement.className = 'performer-item';
        performerElement.innerHTML = `
            <img src="${card.player.imageUrl}" alt="${card.player.displayName}" class="performer-avatar">
            <div class="performer-info">
                <div class="performer-name">${card.player.displayName}</div>
                <div class="performer-team">${card.player.team.abbreviation} • ${card.player.position}</div>
            </div>
            <div class="performer-score">${card.projection.toFixed(1)}</div>
        `;
        container.appendChild(performerElement);
    });
}

// My Cards Section
function initializeMyCards() {
    populateTeamFilter();
    renderCards(limitedCards);
    
    const positionFilter = document.getElementById('position-filter');
    const teamFilter = document.getElementById('team-filter');
    
    if (positionFilter) {
        positionFilter.addEventListener('change', filterCards);
    }
    if (teamFilter) {
        teamFilter.addEventListener('change', filterCards);
    }
}

function populateTeamFilter() {
    const teamFilter = document.getElementById('team-filter');
    if (!teamFilter) return;
    
    const teams = [...new Set(limitedCards.map(card => card.player.team.abbreviation))].sort();
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

function filterCards() {
    const positionFilter = document.getElementById('position-filter');
    const teamFilter = document.getElementById('team-filter');
    
    const positionValue = positionFilter ? positionFilter.value : '';
    const teamValue = teamFilter ? teamFilter.value : '';
    
    filteredCards = limitedCards.filter(card => {
        const matchesPosition = !positionValue || card.player.position === positionValue;
        const matchesTeam = !teamValue || card.player.team.abbreviation === teamValue;
        return matchesPosition && matchesTeam;
    });
    
    renderCards(filteredCards);
}

function renderCards(cards) {
    const container = document.getElementById('cards-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = createPlayerCard(card);
        container.appendChild(cardElement);
    });
}

function createPlayerCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'player-card';
    
    const xpProgress = (card.xp % 300) / 300 * 100;
    
    cardElement.innerHTML = `
        <div class="card-header">
            <img src="${card.player.imageUrl}" alt="${card.player.displayName}" class="player-image">
            <div class="rarity-badge">${card.rarity}</div>
            <div class="level-badge">LV ${card.level}</div>
        </div>
        <div class="card-content">
            <div class="player-name">${card.player.displayName}</div>
            <div class="player-details">
                <span>${card.player.team.abbreviation} • ${card.player.position}</span>
                <span>${card.player.age} anni</span>
            </div>
            <div class="xp-progress">
                <div class="xp-label">
                    <span>XP: ${card.xp}</span>
                    <span>${Math.floor(xpProgress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${xpProgress}%"></div>
                </div>
            </div>
            <div class="stats-row">
                <div class="stat-item">
                    <span class="stat-value">${card.last10avg.toFixed(1)}</span>
                    <span class="stat-label">Media 10</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${card.projection.toFixed(1)}</span>
                    <span class="stat-label">Proiezione</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${card.games_this_week}</span>
                    <span class="stat-label">Partite</span>
                </div>
            </div>
        </div>
    `;
    
    return cardElement;
}

// Projections Section
function initializeProjections() {
    renderProjectionsTable();
}

function renderProjectionsTable() {
    const tbody = document.getElementById('projections-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const sortedCards = [...limitedCards].sort((a, b) => b.projection - a.projection);
    
    sortedCards.forEach(card => {
        const row = document.createElement('tr');
        const trend = card.projection > card.last10avg ? '↗️' : '↘️';
        const trendClass = card.projection > card.last10avg ? 'trend-up' : 'trend-down';
        
        row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${card.player.imageUrl}" alt="${card.player.displayName}" 
                         style="width: 30px; height: 30px; border-radius: 4px; object-fit: cover;">
                    <strong>${card.player.displayName}</strong>
                </div>
            </td>
            <td>${card.player.team.abbreviation}</td>
            <td>${card.games_this_week}</td>
            <td>${card.last10avg.toFixed(1)}</td>
            <td><strong>${card.projection.toFixed(1)}</strong></td>
            <td><span class="${trendClass}">${trend} ${Math.abs(card.projection - card.last10avg).toFixed(1)}</span></td>
        `;
        
        tbody.appendChild(row);
    });
}

// Strategy Section
function initializeStrategy() {
    generateOptimalFormation();
    generateStrategicRecommendations();
    
    const createFormationBtn = document.getElementById('create-formation');
    if (createFormationBtn) {
        createFormationBtn.addEventListener('click', showFormationModal);
    }
}

function generateOptimalFormation() {
    const container = document.getElementById('optimal-formation');
    if (!container) return;
    
    const scoredCards = limitedCards.map(card => ({
        ...card,
        score: card.projection * card.games_this_week
    })).sort((a, b) => b.score - a.score).slice(0, 5);
    
    container.innerHTML = '';
    
    let totalProjection = 0;
    scoredCards.forEach(card => {
        totalProjection += card.projection;
        const playerElement = document.createElement('div');
        playerElement.className = 'formation-player';
        playerElement.innerHTML = `
            <img src="${card.player.imageUrl}" alt="${card.player.displayName}" class="formation-player-avatar">
            <div class="formation-player-info">
                <div class="formation-player-name">${card.player.displayName}</div>
                <div class="formation-player-details">${card.player.team.abbreviation} • ${card.player.position} • ${card.games_this_week} partite</div>
            </div>
            <div class="formation-player-score">${card.projection.toFixed(1)}</div>
        `;
        container.appendChild(playerElement);
    });
    
    const totalElement = document.createElement('div');
    totalElement.style.textAlign = 'center';
    totalElement.style.marginTop = '16px';
    totalElement.style.padding = '12px';
    totalElement.style.background = 'var(--color-bg-1)';
    totalElement.style.borderRadius = 'var(--radius-base)';
    totalElement.innerHTML = `<strong>Punteggio Totale Previsto: ${totalProjection.toFixed(1)}</strong>`;
    container.appendChild(totalElement);
}

function generateStrategicRecommendations() {
    const container = document.getElementById('strategy-recommendations');
    if (!container) return;
    
    const recommendations = [
        {
            title: "Focus su Giocatori con Più Partite",
            text: "Giannis (4 partite) e LeBron/Luka (3 partite) offrono più opportunità di punteggio questa settimana."
        },
        {
            title: "Considerare Matchups Favorevoli",
            text: "Nikola Jokić ha un'alta proiezione (65.8) nonostante solo 2 partite - matchups molto favorevoli."
        },
        {
            title: "Diversificazione Posizioni",
            text: "Bilancia la formazione con almeno un giocatore per posizione per massimizzare il punteggio."
        },
        {
            title: "Monitorare Infortuni",
            text: "Joel Embiid ha solo 1 partita - verifica aggiornamenti su possibili infortuni prima di schierarlo."
        }
    ];
    
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        recElement.innerHTML = `
            <div class="recommendation-title">${rec.title}</div>
            <p class="recommendation-text">${rec.text}</p>
        `;
        container.appendChild(recElement);
    });
}

// Competitions Section
function initializeCompetitions() {
    renderCompetitions();
}

function renderCompetitions() {
    const container = document.getElementById('competitions-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    competitions.forEach(competition => {
        const competitionElement = createCompetitionCard(competition);
        container.appendChild(competitionElement);
    });
}

function createCompetitionCard(competition) {
    const cardElement = document.createElement('div');
    cardElement.className = 'competition-card';
    
    cardElement.innerHTML = `
        <div class="competition-header">
            <div class="competition-name">${competition.name}</div>
            <div class="competition-type">${competition.type}</div>
        </div>
        <div class="competition-body">
            ${competition.has_mvp ? '<div class="mvp-badge">🏆 MVP Bonus</div>' : ''}
            <div class="competition-details">
                <div class="detail-row">
                    <span class="detail-label">Points Cap:</span>
                    <span class="detail-value">${competition.points_cap}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Min Carte:</span>
                    <span class="detail-value">${competition.min_cards_required}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Partecipanti:</span>
                    <span class="detail-value">${competition.participants.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Scade in:</span>
                    <span class="detail-value">${competition.ends_in}</span>
                </div>
            </div>
            <div class="prizes-list">
                <strong style="font-size: 12px; color: var(--color-text-secondary); text-transform: uppercase;">Premi:</strong><br>
                ${competition.prizes.map(prize => `<span class="prize-tag">${prize}</span>`).join('')}
            </div>
            <button class="btn btn--primary btn--full-width" onclick="participateInCompetition('${competition.id}')">
                Partecipa Ora
            </button>
        </div>
    `;
    
    return cardElement;
}

function participateInCompetition(competitionId) {
    const competition = competitions.find(c => c.id === competitionId);
    if (competition) {
        alert(`Partecipazione registrata per ${competition.name}! Buona fortuna! 🍀`);
    }
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('formation-modal');
    if (!modal) return;
    
    const closeButtons = document.querySelectorAll('#close-modal, #close-modal-btn');
    const overlay = document.querySelector('.modal-overlay');
    const participateBtn = document.getElementById('participate-btn');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', hideFormationModal);
    });
    
    if (overlay) {
        overlay.addEventListener('click', hideFormationModal);
    }
    
    if (participateBtn) {
        participateBtn.addEventListener('click', function() {
            hideFormationModal();
            participateInCompetition('limited_champion');
        });
    }
}

function showFormationModal() {
    const modal = document.getElementById('formation-modal');
    const summaryContainer = document.getElementById('formation-summary');
    
    if (!modal || !summaryContainer) return;
    
    const topCards = limitedCards
        .map(card => ({ ...card, score: card.projection * card.games_this_week }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    
    const totalProjection = topCards.reduce((sum, card) => sum + card.projection, 0);
    
    summaryContainer.innerHTML = `
        <div style="background: var(--color-bg-3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <h4 style="margin: 0 0 8px 0;">Formazione Ottimale Creata</h4>
            <p style="margin: 0; font-size: 14px; color: var(--color-text-secondary);">
                5 giocatori selezionati • Punteggio previsto: <strong>${totalProjection.toFixed(1)}</strong>
            </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${topCards.map(card => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--color-bg-1); border-radius: 6px;">
                    <span style="font-weight: 500;">${card.player.displayName}</span>
                    <span style="color: var(--color-primary); font-weight: bold;">${card.projection.toFixed(1)}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function hideFormationModal() {
    const modal = document.getElementById('formation-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function simulateApiCall(endpoint, query) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: limitedCards,
                success: true
            });
        }, 1000);
    });
}
