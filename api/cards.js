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
  rarityColors: {
    limited: '#ff6b35',
    rare: '#4fc3f7',
    super_rare: '#ab47bc',
    unique: '#ffd700',
    common: '#78909c'
  },
  positionIcons: {
    PG: '🏃',
    SG: '⚡',
    SF: '🏀',
    PF: '💪',
    C: '🗼'
  }
};

// Challenge 2FA (popolata da backend in redirect)
let otpChallenge = null;

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
  // Pulsante Login
  document.getElementById('login-btn')?.addEventListener('click', () => {
    window.location.href = '/api/auth/login';
  });

  // Submit codice 2FA (se modale visibile)
  document.getElementById('twofa-submit')?.addEventListener('click', () => {
    const code = document.getElementById('twofa-input').value.trim();
    if (code.length !== 6) {
      document.getElementById('twofa-error').textContent = 'Inserisci 6 cifre';
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const challenge = params.get('challenge');
    window.location.href = `/api/auth/login?code=${code}&challenge=${encodeURIComponent(challenge)}`;
  });

  // Carica carte dall’API o usa demo
  loadLiveDataWithFallback();

  // Imposta filtri, lineup e shortcut
  setupFilters();
  setupLineupControls();
  setupKeyboardShortcuts();
});

// Carica dati live con fallback demo
async function loadLiveDataWithFallback() {
  try {
    showLoading('Caricamento carte Sorare...');
    const res = await fetch('/api/cards');
    const data = await res.json();

    if (res.status === 401 && data.loginUrl) {
      // Mostra solo il bottone login
      document.getElementById('login-container').style.display = 'block';
      return;
    }
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Errore API');
    }

    currentData.cards = data.data;
    applyFilters();
    renderCards();
    updateConnectionStatus(true);
    showSuccessNotification(`✅ ${data.count} carte caricate di ${data.user.nickname}`);
  } catch (err) {
    console.error('Errore live load:', err);
    loadDemoData();
    updateConnectionStatus(false);
    showErrorNotification('API non disponibile, mostrando demo');
  } finally {
    hideLoading();
  }
}

// Carica dati demo
function loadDemoData() {
  currentData.cards = DEMO_DATA.cards;
  applyFilters();
  renderCards();
}

// Imposta i filtri
function setupFilters() {
  document.getElementById('search-input')?.addEventListener('input', e => {
    currentData.filters.search = e.target.value;
    applyFilters(); renderCards();
  });
  ['rarity', 'position', 'team'].forEach(type => {
    document.getElementById(`${type}-filter`)?.addEventListener('change', e => {
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
  let result = [...currentData.cards];
  const { rarity, position, team, search } = currentData.filters;
  if (rarity !== 'all') result = result.filter(c => c.rarity === rarity);
  if (position !== 'all') result = result.filter(c => c.player.position === position);
  if (team !== 'all') result = result.filter(c => c.player.team.abbreviation === team);
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(c => c.player.displayName.toLowerCase().includes(term));
  }
  currentData.filteredCards = result;
}

// Render delle carte e lineup (tua implementazione)
function renderCards() { /* ... */ }
function createCardHTML(c) { /* ... */ }
function updateStats() { /* ... */ }
function updateConnectionStatus(isConnected) { /* ... */ }

// Gestione lineup
function addToLineup(id) { /* ... */ }
function removeFromLineup(id) { /* ... */ }
function clearLineup() { /* ... */ }
function optimizeLineup() { /* ... */ }
function updateLineupDisplay() { /* ... */ }

// Notifiche e loader
function showLoading(msg='Caricamento...') { /* ... */ }
function hideLoading() { /* ... */ }
function showSuccessNotification(msg) { /* ... */ }
function showErrorNotification(msg) { /* ... */ }
