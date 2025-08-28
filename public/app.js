// SorareNBA Manager - Application Logic with Live API Integration

// Global variables
let limitedCards = [];
let competitions = [];
let isApiConnected = false;

// API Configuration
const API_CONFIG = {
    baseUrl: window.location.origin,
    endpoints: {
        cards: '/api/cards',
        projections: '/api/projections',
        strategy: '/api/strategy'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Try to load live data first, fallback to demo data
    loadLiveDataWithFallback();
});

async function loadLiveDataWithFallback() {
    try {
        showLoading('Connessione all\'API SorareNBA...');
        await fetchLiveCards();
        updateConnectionStatus(true);
        showSuccessNotification('Connesso all\'API SorareNBA!');
    } catch (error) {
        console.warn('API non disponibile, carico dati di esempio:', error);
        loadDemoData();
        updateConnectionStatus(false);
        showErrorNotification('API non disponibile, mostro dati di esempio');
    } finally {
        hideLoading();
    }
}

async function fetchLiveCards() {
    try {
        showLoading('Caricamento carte Limited...');
        const response = await fetch(API_CONFIG.endpoints.cards);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            limitedCards = result.data;
            console.log(`Caricate ${limitedCards.length} carte Limited dall'API`);
            updateDashboard();
            renderMyCards();
            isApiConnected = true;
            return true;
        } else {
            throw new Error(result.error || 'Dati non validi dall\'API');
        }
    } catch (error) {
        console.error('Errore nel caricamento delle carte:', error);
        throw error;
    }
}

async function fetchProjections(playerSlugs) {
    if (!isApiConnected) return [];
    
    try {
        const params = new URLSearchParams();
        playerSlugs.forEach(slug => params.append('playerSlugs', slug));
        
        const response = await fetch(`${API_CONFIG.endpoints.projections}?${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Errore proiezioni:', error);
        return [];
    }
}

async function calculateOptimalStrategy() {
    const competition = document.getElementById('competition-select')?.value || 'limited_contender';
    
    try {
        showLoading('Calcolo strategia ottimale...');
        
        if (isApiConnected) {
            const response = await fetch(API_CONFIG.endpoints.strategy, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cards: limitedCards,
                    competition: competition
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                renderStrategy(result.data);
            } else {
                throw new Error(result.error);
            }
        } else {
            // Fallback strategy calculation
            const strategy = calculateFallbackStrategy(limitedCards, competition);
            renderStrategy(strategy);
        }
    } catch (error) {
        console.error('Errore strategia:', error);
        showErrorNotification('Errore nel calcolo della strategia: ' + error.message);
    } finally {
        hideLoading();
    }
}

function calculateFallbackStrategy(cards, competition) {
    const pointsCaps = {
        'limited_contender': 205,
        'limited_champion': 205,
        'rare_champion': 220
    };
    
    const pointsCap = pointsCaps[competition] || 205;
    
    // Simple strategy: sort by projection and pick top 5
    const sortedCards = [...cards].sort((a, b) => (b.projection || 0) - (a.projection || 0));
    const optimalLineup = sortedCards.slice(0, 5);
    const totalProjection = optimalLineup.reduce((sum, card) => sum + (card.projection || 0), 0);
    
    return {
        optimalLineup,
        totalProjection: Math.round(totalProjection * 10) / 10,
        pointsCap,
        efficiency: Math.round((totalProjection / pointsCap) * 100),
        recommendations: [
            {
                type: 'info',
                message: 'Strategia calcolata localmente. Connettiti all\'API per analisi avanzate.'
            }
        ]
    };
}

// Demo data for fallback
function loadDemoData() {
    limitedCards = [
        {
            "id": "demo_1",
            "slug": "lebron-james",
            "pictureUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
            "player": {
                "displayName": "LeBron James",
                "team": {"abbreviation": "LAL", "name": "Los Angeles Lakers"},
                "position": "Forward",
                "age": 39
            },
            "rarity": "Limited",
            "level": 8,
            "xp": 2100,
            "projection": 48.5,
            "last10avg": 45.2,
            "games_this_week": 3
        },
        {
            "id": "demo_2",
            "slug": "stephen-curry",
            "pictureUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png",
            "player": {
                "displayName": "Stephen Curry",
                "team": {"abbreviation": "GSW", "name": "Golden State Warriors"},
                "position": "Guard",
                "age": 35
            },
            "rarity": "Limited",
            "level": 10,
            "xp": 2850,
            "projection": 55.1,
            "last10avg": 52.3,
            "games_this_week": 2
        },
        {
            "id": "demo_3",
            "slug": "giannis-antetokounmpo",
            "pictureUrl": "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png",
            "player": {
                "displayName": "Giannis Antetokounmpo",
                "team": {"abbreviation": "MIL", "name": "Milwaukee Bucks"},
                "position": "Forward",
                "age": 29
            },
            "rarity": "Limited",
            "level": 7,
            "xp": 1950,
            "projection": 61.2,
            "last10avg": 58.7,
            "games_this_week": 4
        }
    ];
    
    competitions = [
        {
            "id": "limited_contender",
            "name": "Limited Contender",
            "type": "Limited",
            "points_cap": 205,
            "prizes": ["Limited Cards", "Essence"],
            "participants": 1250,
            "ends_in": "2 days 14 hours"
        }
    ];
    
    updateDashboard();
    renderMyCards();
    renderCompetitions();
}

// UI Helper Functions
function showLoading(message = 'Caricamento...') {
    hideLoading(); // Remove any existing loader
    
    const loader = document.createElement('div');
    loader.id = 'api-loader';
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('api-loader');
    if (loader) {
        loader.remove();
    }
}

function showErrorNotification(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccessNotification(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function updateConnectionStatus(connected) {
    isApiConnected = connected;
    
    const apiStatus = document.getElementById('api-status');
    const connectionIndicator = document.getElementById('connection-indicator');
    
    if (apiStatus) {
        apiStatus.className = connected ? 'api-status connected' : 'api-status disconnected';
        apiStatus.textContent = connected ? '🟢 API Connessa' : '🔴 API Disconnessa';
    }
    
    if (connectionIndicator) {
        connectionIndicator.className = connected ? 'connection-indicator online' : 'connection-indicator offline';
        connectionIndicator.innerHTML = `
            <div class="connection-dot ${connected ? 'online' : 'offline'}"></div>
            <span>Connessione API: ${connected ? 'Online' : 'Offline'}</span>
        `;
    }
}

async function refreshData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(180deg)';
    }
    
    try {
        await loadLiveDataWithFallback();
        showSuccessNotification('Dati aggiornati!');
    } catch (error) {
        showErrorNotification('Errore nell\'aggiornamento dati');
    } finally {
        if (refreshBtn) {
            refreshBtn.style.transform = '';
        }
    }
}

// Navigation and App Initialization
function initializeApp() {
    setupNavigation();
    setupFilters();
    updateDashboard();
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => section.classList.remove('active'));
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
            }
            
            // Load section-specific data
            switch(targetSection) {
                case 'my-cards':
                    renderMyCards();
                    break;
                case 'projections':
                    renderProjections();
                    break;
                case 'strategy':
                    renderStrategySection();
                    break;
                case 'competitions':
                    renderCompetitions();
                    break;
            }
        });
    });
}

function setupFilters() {
    const positionFilter = document.getElementById('position-filter');
    const teamFilter = document.getElementById('team-filter');
    const searchInput = document.getElementById('search-player');
    
    if (positionFilter) {
        positionFilter.addEventListener('change', applyFilters);
    }
    if (teamFilter) {
        teamFilter.addEventListener('change', applyFilters);
    }
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    const positionFilter = document.getElementById('position-filter')?.value || '';
    const teamFilter = document.getElementById('team-filter')?.value || '';
    const searchTerm = document.getElementById('search-player')?.value.toLowerCase() || '';
    
    const filteredCards = limitedCards.filter(card => {
        const matchPosition = !positionFilter || card.player.position === positionFilter;
        const matchTeam = !teamFilter || card.player.team?.abbreviation === teamFilter;
        const matchSearch = !searchTerm || card.player.displayName.toLowerCase().includes(searchTerm);
        
        return matchPosition && matchTeam && matchSearch;
    });
    
    renderMyCards(filteredCards);
}

function updateDashboard() {
    // Update stats
    document.getElementById('total-cards').textContent = limitedCards.length;
    
    const avgProjection = limitedCards.length > 0 
        ? limitedCards.reduce((sum, card) => sum + (card.projection || 0), 0) / limitedCards.length
        : 0;
    document.getElementById('avg-score').textContent = Math.round(avgProjection * 10) / 10;
    
    const estimatedValue = limitedCards.length * 350; // €350 per carta media
    document.getElementById('portfolio-value').textContent = `€${estimatedValue.toLocaleString()}`;
    
    // Update team filter options
    updateTeamFilter();
    
    // Create charts if data available
    if (limitedCards.length > 0) {
        createPerformanceChart();
        createPositionsChart();
    }
}

function updateTeamFilter() {
    const teamFilter = document.getElementById('team-filter');
    if (!teamFilter) return;
    
    const teams = [...new Set(limitedCards.map(card => card.player.team?.abbreviation).filter(Boolean))];
    
    teamFilter.innerHTML = '<option value="">Tutte le Squadre</option>';
    teams.sort().forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

function renderMyCards(cardsToRender = limitedCards) {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;
    
    if (cardsToRender.length === 0) {
        grid.innerHTML = '<p class="no-cards">Nessuna carta trovata</p>';
        return;
    }
    
    grid.innerHTML = cardsToRender.map(card => `
        <div class="player-card" onclick="showCardDetails('${card.id}')">
            <img src="${card.pictureUrl || card.player.imageUrl || 'https://via.placeholder.com/280x200?text=' + encodeURIComponent(card.player.displayName)}" 
                 alt="${card.player.displayName}" 
                 class="card-image"
                 onerror="this.src='https://via.placeholder.com/280x200?text=${encodeURIComponent(card.player.displayName)}'">
            <div class="card-content">
                <div class="card-header">
                    <div>
                        <div class="player-name">${card.player.displayName}</div>
                        <div class="player-team">${card.player.team?.abbreviation || 'N/A'} - ${card.player.position}</div>
                    </div>
                    <div class="rarity-badge">${card.rarity}</div>
                </div>
                <div class="card-stats">
                    <div class="stat-item">
                        <div class="stat-value">${card.projection || 'N/A'}</div>
                        <div class="stat-label">Proiezione</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${card.level || 'N/A'}</div>
                        <div class="stat-label">Livello</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${card.last10avg || 'N/A'}</div>
                        <div class="stat-label">Media L10</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${card.games_this_week || 0}</div>
                        <div class="stat-label">Partite</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderProjections() {
    const container = document.getElementById('projections-table');
    if (!container) return;
    
    if (limitedCards.length === 0) {
        container.innerHTML = '<p>Nessuna proiezione disponibile</p>';
        return;
    }
    
    const sortedByProjection = [...limitedCards].sort((a, b) => (b.projection || 0) - (a.projection || 0));
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Giocatore</th>
                    <th>Squadra</th>
                    <th>Posizione</th>
                    <th>Proiezione</th>
                    <th>Media L10</th>
                    <th>Partite</th>
                    <th>Trend</th>
                </tr>
            </thead>
            <tbody>
                ${sortedByProjection.map(card => `
                    <tr>
                        <td>${card.player.displayName}</td>
                        <td>${card.player.team?.abbreviation || 'N/A'}</td>
                        <td>${card.player.position}</td>
                        <td><strong>${card.projection || 'N/A'}</strong></td>
                        <td>${card.last10avg || 'N/A'}</td>
                        <td>${card.games_this_week || 0}</td>
                        <td>${(card.projection || 0) > (card.last10avg || 0) ? '📈' : '📉'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Update top performer cards
    if (sortedByProjection.length > 0) {
        const topPerformer = sortedByProjection[0];
        document.getElementById('top-projection').innerHTML = `
            <div class="top-projection">
                <strong>${topPerformer.player.displayName}</strong><br>
                <span style="color: var(--color-primary); font-size: 1.5rem;">${topPerformer.projection}</span> pts
            </div>
        `;
        
        // Find best value (highest projection / avg ratio)
        const bestValue = sortedByProjection.reduce((best, card) => {
            const ratio = (card.projection || 0) / (card.last10avg || 1);
            const bestRatio = (best.projection || 0) / (best.last10avg || 1);
            return ratio > bestRatio ? card : best;
        });
        
        document.getElementById('best-value').innerHTML = `
            <div class="best-value">
                <strong>${bestValue.player.displayName}</strong><br>
                <span style="color: var(--color-success);">+${Math.round(((bestValue.projection || 0) / (bestValue.last10avg || 1) - 1) * 100)}%</span> upside
            </div>
        `;
    }
}

function renderStrategySection() {
    const competitionSelect = document.getElementById('competition-select');
    if (competitionSelect) {
        // Load available competitions
        competitionSelect.innerHTML = `
            <option value="limited_contender">Limited Contender (Cap: 205)</option>
            <option value="limited_champion">Limited Champion (Cap: 205)</option>
            <option value="rare_champion">Rare Champion (Cap: 220)</option>
        `;
    }
}

function renderStrategy(strategyData) {
    const resultsContainer = document.getElementById('strategy-results');
    const lineupContainer = document.getElementById('optimal-lineup');
    
    if (!resultsContainer || !lineupContainer) return;
    
    // Render recommendations
    resultsContainer.innerHTML = `
        <h3>Analisi Strategica</h3>
        <div class="strategy-summary">
            <div class="stat-item">
                <div class="stat-value">${strategyData.totalProjection}</div>
                <div class="stat-label">Proiezione Totale</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${strategyData.pointsCap}</div>
                <div class="stat-label">Points Cap</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${strategyData.efficiency}%</div>
                <div class="stat-label">Efficienza</div>
            </div>
        </div>
        
        <div class="recommendations">
            ${strategyData.recommendations?.map(rec => `
                <div class="recommendation ${rec.type}">
                    <div class="recommendation-icon">
                        ${rec.type === 'success' ? '✅' : rec.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </div>
                    <div class="recommendation-content">
                        <p>${rec.message}</p>
                    </div>
                </div>
            `).join('') || ''}
        </div>
    `;
    
    // Render optimal lineup
    lineupContainer.innerHTML = strategyData.optimalLineup?.map((card, index) => `
        <div class="lineup-card">
            <div class="lineup-position">#${index + 1}</div>
            <img src="${card.pictureUrl || card.player?.imageUrl || 'https://via.placeholder.com/100x100?text=' + encodeURIComponent(card.player?.displayName || 'Player')}" 
                 alt="${card.player?.displayName}" 
                 style="width: 60px; height: 60px; border-radius: 50%; margin: 0.5rem auto;"
                 onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(card.player?.displayName || 'P')}'">
            <div class="player-name">${card.player?.displayName}</div>
            <div class="projection">${card.projection || 'N/A'} pts</div>
        </div>
    `).join('') || '<p>Nessuna formazione disponibile</p>';
}

function renderCompetitions() {
    const grid = document.getElementById('competitions-grid');
    if (!grid) return;
    
    const competitionsData = [
        {
            id: "limited_contender",
            name: "Limited Contender",
            type: "Limited",
            points_cap: 205,
            prizes: ["Limited Cards", "Essence"],
            participants: 1250,
            ends_in: "2 giorni 14 ore"
        },
        {
            id: "limited_champion", 
            name: "Limited Champion",
            type: "Limited",
            points_cap: 205,
            has_mvp: true,
            prizes: ["$500 Cash", "Rare Cards"],
            participants: 890,
            ends_in: "2 giorni 14 ore"
        },
        {
            id: "rare_champion",
            name: "Rare Champion", 
            type: "Rare",
            points_cap: 220,
            has_mvp: true,
            prizes: ["$2000 Cash", "Super Rare Cards"],
            participants: 456,
            ends_in: "2 giorni 14 ore"
        }
    ];
    
    grid.innerHTML = competitionsData.map(comp => `
        <div class="competition-card">
            <div class="competition-title">${comp.name}</div>
            <div class="competition-type">Tipo: ${comp.type}</div>
            
            <div class="competition-stats">
                <div class="stat-item">
                    <div class="stat-value">${comp.points_cap}</div>
                    <div class="stat-label">Points Cap</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${comp.participants}</div>
                    <div class="stat-label">Partecipanti</div>
                </div>
            </div>
            
            <div class="prizes">
                <strong>Premi:</strong> ${comp.prizes.join(', ')}
            </div>
            
            <div class="ends-in">
                <strong>Termina in:</strong> ${comp.ends_in}
            </div>
            
            <button class="btn btn--primary" style="width: 100%; margin-top: 1rem;" 
                    onclick="enterCompetition('${comp.id}')">
                Partecipa
            </button>
        </div>
    `).join('');
}

// Chart Functions
function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    // Sample performance data
    const last5Games = ['Game -4', 'Game -3', 'Game -2', 'Game -1', 'Last Game'];
    const avgScores = last5Games.map(() => Math.round(Math.random() * 20 + 40));
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last5Games,
            datasets: [{
                label: 'Media Punti Squadra',
                data: avgScores,
                borderColor: 'var(--color-teal-500)',
                backgroundColor: 'rgba(33, 128, 141, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createPositionsChart() {
    const ctx = document.getElementById('positions-chart');
    if (!ctx) return;
    
    // Count positions
    const positions = {};
    limitedCards.forEach(card => {
        const pos = card.player.position || 'Unknown';
        positions[pos] = (positions[pos] || 0) + 1;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(positions),
            datasets: [{
                data: Object.values(positions),
                backgroundColor: [
                    'var(--color-teal-500)',
                    'var(--color-orange-400)',
                    'var(--color-red-400)',
                    'var(--color-gray-400)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Utility Functions
function generateOptimalLineup() {
    calculateOptimalStrategy();
    
    // Switch to strategy section
    document.querySelector('[data-section="strategy"]').click();
}

function analyzeMarket() {
    showSuccessNotification('Analisi mercato in sviluppo!');
}

function checkNewCompetitions() {
    document.querySelector('[data-section="competitions"]').click();
}

function showCardDetails(cardId) {
    const card = limitedCards.find(c => c.id === cardId);
    if (card) {
        alert(`${card.player.displayName}\n\nProiezione: ${card.projection}\nLivello: ${card.level}\nXP: ${card.xp}`);
    }
}

function enterCompetition(competitionId) {
    showSuccessNotification(`Interessante! La competizione ${competitionId} è stata selezionata.`);
}
