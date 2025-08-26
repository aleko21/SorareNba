// public/app.js - File completo con OAuth integration

// Stato globale dell'applicazione
let currentData = {
  cards: [],
  filteredCards: [],
  selectedLineup: [],
  filters: {
    rarity: 'all',
    position: 'all',
    team: 'all',
    search: ''
  }
};

// Configurazione
const CONFIG = {
  maxLineupSize: 5,
  rarityColors: {
    'limited': '#ff6b35',
    'rare': '#4fc3f7',
    'super_rare': '#ab47bc',
    'unique': '#ffd700',
    'common': '#78909c'
  },
  positionIcons: {
    'PG': '🏃',
    'SG': '⚡',
    'SF': '🏀',
    'PF': '💪',
    'C': '🗼'
  }
};

// Dati demo per fallback
const DEMO_DATA = {
  cards: [
    {
      id: '1',
      slug: 'lebron-james-2024-limited-1',
      name: 'LeBron James',
      rarity: 'limited',
      serialNumber: 42,
      pictureUrl: 'https://via.placeholder.com/200x300/ff6b35/white?text=LBJ',
      xp: 450,
      grade: null,
      seasonYear: '2024',
      player: {
        displayName: 'LeBron James',
        slug: 'lebron-james',
        position: 'SF',
        age: 39,
        team: {
          name: 'Los Angeles Lakers',
          abbreviation: 'LAL'
        }
      },
      onSale: false,
      projection: 52.3,
      last10avg: 48.7,
      games_this_week: 3,
      efficiency: 1.12
    },
    {
      id: '2',
      slug: 'stephen-curry-2024-rare-156',
      name: 'Stephen Curry',
      rarity: 'rare',
      serialNumber: 156,
      pictureUrl: 'https://via.placeholder.com/200x300/4fc3f7/white?text=SC30',
      xp: 380,
      grade: null,
      seasonYear: '2024',
      player: {
        displayName: 'Stephen Curry',
        slug: 'stephen-curry',
        position: 'PG',
        age: 36,
        team: {
          name: 'Golden State Warriors',
          abbreviation: 'GSW'
        }
      },
      onSale: true,
      projection: 49.8,
      last10avg: 45.2,
      games_this_week: 2,
      efficiency: 1.08
    },
    {
      id: '3',
      slug: 'giannis-antetokounmpo-2024-super-rare-89',
      name: 'Giannis Antetokounmpo',
      rarity: 'super_rare',
      serialNumber: 89,
      pictureUrl: 'https://via.placeholder.com/200x300/ab47bc/white?text=GA34',
      xp: 520,
      grade: null,
      seasonYear: '2024',
      player: {
        displayName: 'Giannis Antetokounmpo',
        slug: 'giannis-antetokounmpo',
        position: 'PF',
        age: 29,
        team: {
          name: 'Milwaukee Bucks',
          abbreviation: 'MIL'
        }
      },
      onSale: false,
      projection: 55.1,
      last10avg: 52.4,
      games_this_week: 4,
      efficiency: 1.18
    },
    {
      id: '4',
      slug: 'nikola-jokic-2024-limited-23',
      name: 'Nikola Jokic',
      rarity: 'limited',
      serialNumber: 23,
      pictureUrl: 'https://via.placeholder.com/200x300/ff6b35/white?text=NJ15',
      xp: 490,
      grade: null,
      seasonYear: '2024',
      player: {
        displayName: 'Nikola Jokic',
        slug: 'nikola-jokic',
        position: 'C',
        age: 29,
        team: {
          name: 'Denver Nuggets',
          abbreviation: 'DEN'
        }
      },
      onSale: false,
      projection: 58.2,
      last10avg: 54.8,
      games_this_week: 3,
      efficiency: 1.25
    },
    {
      id: '5',
      slug: 'jayson-tatum-2024-rare-234',
      name: 'Jayson Tatum',
      rarity: 'rare',
      serialNumber: 234,
      pictureUrl: 'https://via.placeholder.com/200x300/4fc3f7/white?text=JT0',
      xp: 420,
      grade: null,
      seasonYear: '2024',
      player: {
        displayName: 'Jayson Tatum',
        slug: 'jayson-tatum',
        position: 'SF',
        age: 26,
        team: {
          name: 'Boston Celtics',
          abbreviation: 'BOS'
        }
      },
      onSale: false,
      projection: 46.7,
      last10avg: 43.9,
      games_this_week: 3,
      efficiency: 1.04
    }
  ]
};

// Funzioni di caricamento dati
async function loadLiveDataWithFallback() {
  try {
    showLoading('Connessione all\'API Sorare...');
    
    const response = await fetch('/api/cards');
    const data = await response.json();
    
    if (response.status === 401) {
      // Mostra pulsante di login OAuth
      showOAuthLogin(data);
      return;
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    
    if (data.success && data.data) {
      // Carica dati reali
      currentData.cards = data.data;
      applyFilters();
      renderCards();
      updateConnectionStatus(true);
      showSuccessNotification(`✅ ${data.count} carte caricate da ${data.user?.nickname || 'Sorare'}!`);
    } else {
      throw new Error('Invalid API response');
    }
    
  } catch (error) {
    console.error('Live data failed:', error);
    loadDemoData();
    updateConnectionStatus(false);
    showErrorNotification('API non disponibile, mostro dati di esempio');
  } finally {
    hideLoading();
  }
}

function loadDemoData() {
  currentData.cards = DEMO_DATA.cards;
  applyFilters();
  renderCards();
  updateConnectionStatus(false);
}

// Funzioni OAuth
function showOAuthLogin(authData) {
  const loginHtml = `
    <div class="oauth-login-container">
      <div class="oauth-login-card">
        <h2>🔐 Connetti il tuo Account Sorare</h2>
        <p>Per vedere le tue carte NBA reali, autorizza l'applicazione a accedere al tuo account Sorare.</p>
        
        <div class="oauth-features">
          <div class="feature">
            <span class="feature-icon">🏀</span>
            <span>Le tue carte NBA Limited</span>
          </div>
          <div class="feature">
            <span class="feature-icon">📊</span>
            <span>Proiezioni personalizzate</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🔒</span>
            <span>Autenticazione sicura via Sorare</span>
          </div>
        </div>
        
        <a href="/api/auth/sorare" class="oauth-login-btn">
          <span class="sorare-icon">⚽</span>
          Accedi con Sorare
        </a>
        
        <p class="oauth-disclaimer">
          Nessun dato viene memorizzato. L'autorizzazione è gestita direttamente da Sorare.
        </p>
        
        <button onclick="loadDemoData(); updateConnectionStatus(false);" class="demo-btn">
          📱 Continua con Dati Demo
        </button>
      </div>
    </div>
  `;
  
  document.getElementById('cards-grid').innerHTML = loginHtml;
  hideLoading();
}

function checkAuthSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const authStatus = urlParams.get('auth');
  const message = urlParams.get('message');
  
  if (authStatus === 'success') {
    showSuccessNotification('🎉 Login con Sorare completato!');
    // Rimuovi parametri URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Ricarica dati
    setTimeout(() => {
      loadLiveDataWithFallback();
    }, 1000);
  } else if (urlParams.get('error')) {
    const error = urlParams.get('error');
    showErrorNotification(`❌ Errore di autenticazione: ${message || error}`);
    window.history.replaceState({}, document.title, window.location.pathname);
    loadDemoData();
  }
}

// Funzioni di rendering
function renderCards() {
  const cardsGrid = document.getElementById('cards-grid');
  
  if (currentData.filteredCards.length === 0) {
    cardsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Nessuna carta trovata</h3>
        <p>Prova a modificare i filtri o ricarica i dati</p>
        <button onclick="resetFilters()" class="btn btn--primary">Reset Filtri</button>
      </div>
    `;
    return;
  }

  const cardsHtml = currentData.filteredCards.map(card => createCardHTML(card)).join('');
  cardsGrid.innerHTML = cardsHtml;
  
  updateStats();
}

function createCardHTML(card) {
  const rarityColor = CONFIG.rarityColors[card.rarity] || '#78909c';
  const positionIcon = CONFIG.positionIcons[card.player.position] || '🏀';
  const isInLineup = currentData.selectedLineup.some(c => c.id === card.id);
  const projectionTrend = card.projection > card.last10avg ? 'up' : 'down';
  const gamesText = card.games_this_week === 1 ? 'game' : 'games';

  return `
    <div class="card ${isInLineup ? 'card--selected' : ''}" data-card-id="${card.id}">
      <div class="card__header">
        <div class="card__rarity" style="background-color: ${rarityColor}">
          ${card.rarity.replace('_', ' ').toUpperCase()}
        </div>
        <div class="card__serial">#${card.serialNumber}</div>
      </div>
      
      <div class="card__image">
        <img src="${card.pictureUrl || `https://via.placeholder.com/200x300/${rarityColor.substring(1)}/white?text=${card.player.displayName.split(' ').map(n => n[0]).join('')}`}" 
             alt="${card.player.displayName}" 
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/200x300/78909c/white?text=NBA'">
        ${card.onSale ? '<div class="card__sale-badge">IN VENDITA</div>' : ''}
      </div>
      
      <div class="card__content">
        <h3 class="card__name">${card.player.displayName}</h3>
        <div class="card__team">${positionIcon} ${card.player.team.abbreviation} • ${card.player.position}</div>
        
        <div class="card__stats">
          <div class="stat">
            <div class="stat__label">Proiezione</div>
            <div class="stat__value stat__value--projection ${projectionTrend}">
              ${card.projection}
              ${projectionTrend === 'up' ? '↗️' : '↘️'}
            </div>
          </div>
          <div class="stat">
            <div class="stat__label">L10 Avg</div>
            <div class="stat__value">${card.last10avg}</div>
          </div>
        </div>
        
        <div class="card__footer">
          <div class="card__games">
            ${card.games_this_week} ${gamesText} this week
          </div>
          <div class="card__xp">
            ${card.xp} XP
          </div>
        </div>
        
        <button 
          class="card__action-btn ${isInLineup ? 'card__action-btn--remove' : 'card__action-btn--add'}"
          onclick="${isInLineup ? `removeFromLineup('${card.id}')` : `addToLineup('${card.id}')`}">
          ${isInLineup ? '➖ Rimuovi' : '➕ Aggiungi'}
        </button>
      </div>
    </div>
  `;
}

// Funzioni di filtro
function applyFilters() {
  let filtered = [...currentData.cards];
  
  // Filtro per rarità
  if (currentData.filters.rarity !== 'all') {
    filtered = filtered.filter(card => card.rarity === currentData.filters.rarity);
  }
  
  // Filtro per posizione
  if (currentData.filters.position !== 'all') {
    filtered = filtered.filter(card => card.player.position === currentData.filters.position);
  }
  
  // Filtro per team
  if (currentData.filters.team !== 'all') {
    filtered = filtered.filter(card => card.player.team.abbreviation === currentData.filters.team);
  }
  
  // Filtro per ricerca
  if (currentData.filters.search) {
    const searchTerm = currentData.filters.search.toLowerCase();
    filtered = filtered.filter(card => 
      card.player.displayName.toLowerCase().includes(searchTerm) ||
      card.player.team.name.toLowerCase().includes(searchTerm) ||
      card.player.team.abbreviation.toLowerCase().includes(searchTerm)
    );
  }
  
  currentData.filteredCards = filtered;
}

function resetFilters() {
  // Reset tutti i filtri
  currentData.filters = {
    rarity: 'all',
    position: 'all',
    team: 'all',
    search: ''
  };
  
  // Reset dei controlli UI
  document.getElementById('rarity-filter').value = 'all';
  document.getElementById('position-filter').value = 'all';
  document.getElementById('team-filter').value = 'all';
  document.getElementById('search-input').value = '';
  
  applyFilters();
  renderCards();
}

// Funzioni lineup
function addToLineup(cardId) {
  if (currentData.selectedLineup.length >= CONFIG.maxLineupSize) {
    showErrorNotification(`Massimo ${CONFIG.maxLineupSize} carte per lineup!`);
    return;
  }
  
  const card = currentData.cards.find(c => c.id === cardId);
  if (card && !currentData.selectedLineup.find(c => c.id === cardId)) {
    currentData.selectedLineup.push(card);
    updateLineupDisplay();
    renderCards(); // Re-render per mostrare stato selected
    showSuccessNotification(`${card.player.displayName} aggiunto alla lineup!`);
  }
}

function removeFromLineup(cardId) {
  currentData.selectedLineup = currentData.selectedLineup.filter(c => c.id !== cardId);
  updateLineupDisplay();
  renderCards(); // Re-render per rimuovere stato selected
  
  const card = currentData.cards.find(c => c.id === cardId);
  if (card) {
    showSuccessNotification(`${card.player.displayName} rimosso dalla lineup!`);
  }
}

function clearLineup() {
  if (currentData.selectedLineup.length === 0) return;
  
  currentData.selectedLineup = [];
  updateLineupDisplay();
  renderCards();
  showSuccessNotification('Lineup cancellata!');
}

function optimizeLineup() {
  if (currentData.filteredCards.length < CONFIG.maxLineupSize) {
    showErrorNotification('Non ci sono abbastanza carte per ottimizzare la lineup!');
    return;
  }
  
  // Ottimizzazione semplice basata su proiezioni
  const sortedByProjection = [...currentData.filteredCards]
    .sort((a, b) => b.projection - a.projection)
    .slice(0, CONFIG.maxLineupSize);
    
  currentData.selectedLineup = sortedByProjection;
  updateLineupDisplay();
  renderCards();
  showSuccessNotification('Lineup ottimizzata in base alle proiezioni!');
}

function updateLineupDisplay() {
  const lineupContainer = document.getElementById('selected-lineup');
  const lineupCounter = document.getElementById('lineup-counter');
  
  // Aggiorna counter
  lineupCounter.textContent = `${currentData.selectedLineup.length}/${CONFIG.maxLineupSize}`;
  
  if (currentData.selectedLineup.length === 0) {
    lineupContainer.innerHTML = `
      <div class="lineup-empty">
        <p>Nessuna carta selezionata</p>
        <p class="text-sm">Clicca "Aggiungi" sulle carte per creare la tua lineup</p>
      </div>
    `;
    return;
  }
  
  const totalProjection = currentData.selectedLineup.reduce((sum, card) => sum + card.projection, 0);
  const avgProjection = totalProjection / currentData.selectedLineup.length;
  
  const lineupHtml = `
    <div class="lineup-stats">
      <div class="lineup-stat">
        <span class="lineup-stat__label">Proiezione Totale:</span>
        <span class="lineup-stat__value">${totalProjection.toFixed(1)}</span>
      </div>
      <div class="lineup-stat">
        <span class="lineup-stat__label">Media:</span>
        <span class="lineup-stat__value">${avgProjection.toFixed(1)}</span>
      </div>
    </div>
    <div class="lineup-cards">
      ${currentData.selectedLineup.map(card => `
        <div class="lineup-card">
          <img src="${card.pictureUrl || 'https://via.placeholder.com/60x80/78909c/white?text=NBA'}" 
               alt="${card.player.displayName}" 
               class="lineup-card__image">
          <div class="lineup-card__info">
            <div class="lineup-card__name">${card.player.displayName}</div>
            <div class="lineup-card__details">${card.player.team.abbreviation} • ${card.projection}</div>
          </div>
          <button onclick="removeFromLineup('${card.id}')" class="lineup-card__remove">✕</button>
        </div>
      `).join('')}
    </div>
  `;
  
  lineupContainer.innerHTML = lineupHtml;
}

// Funzioni di utilità
function updateStats() {
  const statsContainer = document.getElementById('stats-summary');
  const totalCards = currentData.filteredCards.length;
  const avgProjection = totalCards > 0 ? 
    currentData.filteredCards.reduce((sum, card) => sum + card.projection, 0) / totalCards : 0;
  
  // Conteggio per rarità
  const rarityCount = currentData.filteredCards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {});
  
  statsContainer.innerHTML = `
    <div class="stat-item">
      <div class="stat-item__value">${totalCards}</div>
      <div class="stat-item__label">Carte Totali</div>
    </div>
    <div class="stat-item">
      <div class="stat-item__value">${avgProjection.toFixed(1)}</div>
      <div class="stat-item__label">Proiezione Media</div>
    </div>
    <div class="stat-item">
      <div class="stat-item__value">${rarityCount.limited || 0}</div>
      <div class="stat-item__label">Limited</div>
    </div>
    <div class="stat-item">
      <div class="stat-item__value">${currentData.selectedLineup.length}</div>
      <div class="stat-item__label">In Lineup</div>
    </div>
  `;
}

function updateConnectionStatus(isConnected) {
  const statusElement = document.getElementById('connection-status');
  if (statusElement) {
    statusElement.className = `connection-status ${isConnected ? 'connected' : 'disconnected'}`;
    statusElement.textContent = isConnected ? '🟢 API Connessa' : '🟡 Dati Demo';
  }
}

// Funzioni di notifica
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('notification--show'), 100);
  
  // Auto remove
  setTimeout(() => {
    notification.classList.remove('notification--show');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, duration);
}

function showSuccessNotification(message) {
  showNotification(message, 'success');
}

function showErrorNotification(message) {
  showNotification(message, 'error', 5000);
}

// Funzioni loading
function showLoading(message = 'Caricamento...') {
  const cardsGrid = document.getElementById('cards-grid');
  cardsGrid.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

function hideLoading() {
  // Il loading viene nascosto quando viene renderizzato il contenuto
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Controlla auth success prima di caricare dati
  checkAuthSuccess();
  
  // Se non c'è auth success, carica normalmente
  if (!window.location.search.includes('auth=success')) {
    loadLiveDataWithFallback();
  }
  
  // Setup filtri
  setupFilters();
  
  // Setup lineup controls
  setupLineupControls();
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
});

function setupFilters() {
  // Ricerca
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentData.filters.search = e.target.value;
      applyFilters();
      renderCards();
    });
  }
  
  // Filtro rarità
  const rarityFilter = document.getElementById('rarity-filter');
  if (rarityFilter) {
    rarityFilter.addEventListener('change', (e) => {
      currentData.filters.rarity = e.target.value;
      applyFilters();
      renderCards();
    });
  }
  
  // Filtro posizione
  const positionFilter = document.getElementById('position-filter');
  if (positionFilter) {
    positionFilter.addEventListener('change', (e) => {
      currentData.filters.position = e.target.value;
      applyFilters();
      renderCards();
    });
  }
  
  // Filtro team
  const teamFilter = document.getElementById('team-filter');
  if (teamFilter) {
    teamFilter.addEventListener('change', (e) => {
      currentData.filters.team = e.target.value;
      applyFilters();
      renderCards();
    });
  }
}

function setupLineupControls() {
  // Clear lineup
  const clearBtn = document.getElementById('clear-lineup-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearLineup);
  }
  
  // Optimize lineup
  const optimizeBtn = document.getElementById('optimize-lineup-btn');
  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', optimizeLineup);
  }
  
  // Refresh data
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadLiveDataWithFallback();
    });
  }
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+R: Refresh
    if (e.ctrlKey && e.key === 'r') {
      e.preventDefault();
      loadLiveDataWithFallback();
    }
    
    // Ctrl+L: Clear lineup
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      clearLineup();
    }
    
    // Ctrl+O: Optimize lineup
    if (e.ctrlKey && e.key === 'o') {
      e.preventDefault();
      optimizeLineup();
    }
    
    // Escape: Reset filters
    if (e.key === 'Escape') {
      resetFilters();
    }
  });
}

// Export per testing (se necessario)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    currentData,
    loadLiveDataWithFallback,
    loadDemoData,
    addToLineup,
    removeFromLineup,
    applyFilters,
    resetFilters
  };
}
