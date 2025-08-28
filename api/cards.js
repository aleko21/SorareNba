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

// Challenge 2FA (popolata da backend)
let otpChallenge = null;

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  // Listener per il pulsante di login
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) loginBtn.addEventListener('click', startLogin);

  // Listener per submit del codice 2FA nella modale
  const twofaSubmit = document.getElementById('twofa-submit');
  if (twofaSubmit) twofaSubmit.addEventListener('click', submitTwoFACode);

  // Carica le carte dall'API o demo
  loadLiveDataWithFallback();

  // Imposta filtri e lineup
  setupFilters();
  setupLineupControls();
  setupKeyboardShortcuts();
});

// Funzione di redirect per login (gestito dal backend)
function startLogin() {
  window.location.href = '/api/auth/login.js';
}

// Funzione per inviare il codice 2FA via redirect
function submitTwoFACode() {
  const code = document.getElementById('twofa-input').value.trim();
  if (code.length !== 6) {
    document.getElementById('twofa-error').textContent = 'Inserisci un codice di 6 cifre';
    return;
  }
  const challenge = otpChallenge || new URLSearchParams(window.location.search).get('challenge');
  window.location.href = `/api/auth/login.js?code=${code}&challenge=${encodeURIComponent(challenge)}`;
}

// Carica dati live con fallback sui demo
async function loadLiveDataWithFallback() {
  try {
    showLoading('Caricamento carte Sorare...');
    const response = await fetch('/api/cards.js');
    const data = await response.json();

    if (response.status === 401 && data.loginUrl) {
      // Mostra pulsante login se non autenticato
      return showLoginContainer();
    }
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Errore API');
    }

    currentData.cards = data.data;
    applyFilters();
    renderCards();
    updateConnectionStatus(true);
    showSuccessNotification(`✅ Caricate ${data.count} carte di ${data.user.nickname}`);
  } catch (error) {
    console.error('Errore caricamento live:', error);
    loadDemoData();
    updateConnectionStatus(false);
    showErrorNotification('Errore API, mostrati dati demo');
  } finally {
    hideLoading();
  }
}

// Mostra contenitore login
function showLoginContainer() {
  const container = document.getElementById('login-container');
  if (container) container.style.display = 'block';
}

// Carica dati di esempio
function loadDemoData() {
  currentData.cards = DEMO_DATA.cards;
  applyFilters();
  renderCards();
}

// Imposta i filtri
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.addEventListener('input', e => {
    currentData.filters.search = e.target.value;
    applyFilters(); renderCards();
  });
  ['rarity', 'position', 'team'].forEach(type => {
    const select = document.getElementById(`${type}-filter`);
    if (select) select.addEventListener('change', e => {
      currentData.filters[type] = e.target.value;
      applyFilters(); renderCards();
    });
  });
}

// Controlli lineup
function setupLineupControls() {
  document.getElementById('clear-lineup-btn')?.addEventListener('click', clearLineup);
  document.getElementById('optimize-lineup-btn')?.addEventListener('click', optimizeLineup);
  document.getElementById('refresh-btn')?.addEventListener('click', loadLiveDataWithFallback);
}

// Scorciatoie da tastiera
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'r') { e.preventDefault(); loadLiveDataWithFallback(); }
    if (e.ctrlKey && e.key === 'l') { e.preventDefault(); clearLineup(); }
    if (e.ctrlKey && e.key === 'o') { e.preventDefault(); optimizeLineup(); }
    if (e.key === 'Escape') { resetFilters(); }
  });
}

// Applica i filtri alle carte
function applyFilters() {
  let filtered = [...currentData.cards];
  const { rarity, position, team, search } = currentData.filters;
  if (rarity !== 'all') filtered = filtered.filter(c => c.rarity === rarity);
  if (position !== 'all') filtered = filtered.filter(c => c.player.position === position);
  if (team !== 'all') filtered = filtered.filter(c => c.player.team.abbreviation === team);
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(c => c.player.displayName.toLowerCase().includes(term));
  }
  currentData.filteredCards = filtered;
}

// Rendering carte e lineup (mantieni la tua implementazione esistente)
function renderCards() { /* ... */ }
function createCardHTML(card) { /* ... */ }
function updateStats() { /* ... */ }
function updateConnectionStatus(isConnected) { /* ... */ }

// Gestione lineup
function addToLineup(id) { /* ... */ }
function removeFromLineup(id) { /* ... */ }
function clearLineup() { /* ... */ }
function optimizeLineup() { /* ... */ }
function updateLineupDisplay() { /* ... */ }

// Notifiche e caricamento
function showLoading(msg = 'Caricamento...') { /* ... */ }
function hideLoading() { /* ... */ }
function showSuccessNotification(msg) { /* ... */ }
function showErrorNotification(msg) { /* ... */ }

// Esporta per test, se necessario
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyFilters, loadDemoData, loadLiveDataWithFallback };
}
