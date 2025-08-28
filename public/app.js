// public/app.js

// Stato globale
let currentData = {
  cards: [],
  filteredCards: [],
  selectedLineup: [],
  filters: { rarity: 'all', position: 'all', team: 'all', search: '' }
};

// Configurazioni
const CONFIG = {
  maxLineupSize: 5,
  rarityColors: { limited: '#ff6b35', rare: '#4fc3f7', super_rare: '#ab47bc', unique: '#ffd700', common: '#78909c' },
  positionIcons: { PG: '🏃', SG: '⚡', SF: '🏀', PF: '💪', C: '🗼' }
};

// Variabile per challenge 2FA (non più necessaria in fetch flow)
let otpChallenge = null;

// Inizializzazione al DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Aggiungi listener login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.addEventListener('click', startLogin);

  // Aggiungi listener submit 2FA
  const twofaSubmit = document.getElementById('twofa-submit');
  if (twofaSubmit) twofaSubmit.addEventListener('click', verifyTwoFA);

  // Carica dati (se JWT già presente)
  loadLiveDataWithFallback();

  // Setup filtri e lineup
  setupFilters();
  setupLineupControls();
  setupKeyboardShortcuts();
});

// REDIRECT al login endpoint
function startLogin() {
  window.location.href = '/api/auth/login.js';
}

// Ricarica dati live con fallback demo
async function loadLiveDataWithFallback() {
  try {
    showLoading('Connessione all\'API Sorare...');
    const response = await fetch('/api/cards.js');
    const data = await response.json();

    if (response.status === 401 && data.loginUrl) {
      // Non autenticato, mostra login button
      return showLoginContainer();
    }
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'API Error');
    }

    currentData.cards = data.data;
    applyFilters();
    renderCards();
    updateConnectionStatus(true);
    showSuccessNotification(`✅ ${data.count} carte caricate da ${data.user.nickname}!`);
  } catch (error) {
    console.error('Live data failed:', error);
    loadDemoData();
    updateConnectionStatus(false);
    showErrorNotification('API non disponibile, mostro dati di esempio');
  } finally {
    hideLoading();
  }
}

// Mostra pulsante login
function showLoginContainer() {
  const container = document.getElementById('login-container');
  if (container) container.style.display = 'block';
}

// Carica dati demo
function loadDemoData() {
  currentData.cards = DEMO_DATA.cards;
  applyFilters();
  renderCards();
  updateConnectionStatus(false);
}

// Verifica 2FA (non più usata qui, backend gestisce redirect)
function verifyTwoFA() {
  // Questo metodo rimane solo se si volesse gestire fetch flow
}

// Setup filtri
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', e => {
    currentData.filters.search = e.target.value;
    applyFilters(); renderCards();
  });
  ['rarity', 'position', 'team'].forEach(type => {
    const elem = document.getElementById(`${type}-filter`);
    if (elem) elem.addEventListener('change', e => {
      currentData.filters[type] = e.target.value;
      applyFilters(); renderCards();
    });
  });
}

// Setup lineup buttons
function setupLineupControls() {
  const clearBtn = document.getElementById('clear-lineup-btn');
  if (clearBtn) clearBtn.addEventListener('click', clearLineup);
  const optimizeBtn = document.getElementById('optimize-lineup-btn');
  if (optimizeBtn) optimizeBtn.addEventListener('click', optimizeLineup);
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', loadLiveDataWithFallback);
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'r') { e.preventDefault(); loadLiveDataWithFallback(); }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); clearLineup(); }
    if (e.ctrlKey && e.key === 'o') { e.preventDefault(); optimizeLineup(); }
    if (e.key === 'Escape') { resetFilters(); }
  });
}

// Filtra carte
function applyFilters() {
  let filtered = [...currentData.cards];
  if (currentData.filters.rarity !== 'all') filtered = filtered.filter(c => c.rarity === currentData.filters.rarity);
  if (currentData.filters.position !== 'all') filtered = filtered.filter(c => c.player.position === currentData.filters.position);
  if (currentData.filters.team !== 'all') filtered = filtered.filter(c => c.player.team.abbreviation === currentData.filters.team);
  if (currentData.filters.search) {
    const term = currentData.filters.search.toLowerCase();
    filtered = filtered.filter(c => c.player.displayName.toLowerCase().includes(term));
  }
  currentData.filteredCards = filtered;
}

// Rendering carte e lineup (stessi metodi di prima)
function renderCards() { /* ... existing implementation ... */ }
function createCardHTML(card) { /* ... existing implementation ... */ }
function updateStats() { /* ... existing implementation ... */ }
function updateConnectionStatus(isConnected) { /* ... existing implementation ... */ }

// Lineup management
function addToLineup(id) { /* ... existing implementation ... */ }
function removeFromLineup(id) { /* ... existing implementation ... */ }
function clearLineup() { /* ... existing implementation ... */ }
function optimizeLineup() { /* ... existing implementation ... */ }
function updateLineupDisplay() { /* ... existing implementation ... */ }

// Notifications and loading
function showLoading(msg = 'Caricamento...') { /* ... existing implementation ... */ }
function hideLoading() { /* ... existing implementation ... */ }
function showSuccessNotification(msg) { /* ... existing implementation ... */ }
function showErrorNotification(msg) { /* ... existing implementation ... */ }

// Export per testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { /* exported methods if needed */ };
}
