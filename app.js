// Application data from JSON
const applicationData = {
  "apiStatus": {
    "sorareAPI": {
      "status": "connected",
      "lastUpdate": "2025-08-25T16:17:23Z",
      "responseTime": "142ms",
      "uptime": "99.7%"
    },
    "rotowireAPI": {
      "status": "connected", 
      "lastUpdate": "2025-08-25T16:15:41Z",
      "responseTime": "89ms",
      "uptime": "98.9%"
    },
    "nbaDataAPI": {
      "status": "connected",
      "lastUpdate": "2025-08-25T16:16:12Z", 
      "responseTime": "234ms",
      "uptime": "99.2%"
    }
  },
  "myLimitedCards": [
    {
      "id": "card_1",
      "playerName": "Nikola Jokic",
      "team": "DEN",
      "position": "C",
      "serialNumber": 1247,
      "xpLevel": 8,
      "averageScore15": 42.8,
      "averageScore5": 45.2,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "108.2%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Jokic",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_2", 
      "playerName": "Shai Gilgeous-Alexander",
      "team": "OKC",
      "position": "PG",
      "serialNumber": 892,
      "xpLevel": 6,
      "averageScore15": 38.4,
      "averageScore5": 41.1,
      "currentSeason": "2024-25",
      "rarity": "Limited", 
      "powerScore": "105.8%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=SGA",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_3",
      "playerName": "Giannis Antetokounmpo", 
      "team": "MIL",
      "position": "PF",
      "serialNumber": 634,
      "xpLevel": 9,
      "averageScore15": 41.2,
      "averageScore5": 38.9,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "111.4%", 
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Giannis",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_4",
      "playerName": "Jayson Tatum",
      "team": "BOS", 
      "position": "SF",
      "serialNumber": 1789,
      "xpLevel": 7,
      "averageScore15": 35.6,
      "averageScore5": 33.8,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "107.3%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Tatum",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_5",
      "playerName": "Anthony Edwards",
      "team": "MIN",
      "position": "SG", 
      "serialNumber": 2156,
      "xpLevel": 5,
      "averageScore15": 34.2,
      "averageScore5": 36.7,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "103.9%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Edwards",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_6",
      "playerName": "Trae Young",
      "team": "ATL",
      "position": "PG",
      "serialNumber": 987,
      "xpLevel": 6,
      "averageScore15": 36.8,
      "averageScore5": 34.2,
      "currentSeason": "2024-25", 
      "rarity": "Limited",
      "powerScore": "105.2%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Trae",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_7",
      "playerName": "Cade Cunningham",
      "team": "DET",
      "position": "PG",
      "serialNumber": 1434,
      "xpLevel": 4,
      "averageScore15": 32.4,
      "averageScore5": 35.1,
      "currentSeason": "2024-25",
      "rarity": "Limited", 
      "powerScore": "102.1%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Cade",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_8",
      "playerName": "LeBron James",
      "team": "LAL", 
      "position": "SF",
      "serialNumber": 723,
      "xpLevel": 8,
      "averageScore15": 33.7,
      "averageScore5": 31.2,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "108.9%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=LeBron",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_9", 
      "playerName": "Domantas Sabonis",
      "team": "SAC",
      "position": "C",
      "serialNumber": 1523,
      "xpLevel": 7,
      "averageScore15": 31.8,
      "averageScore5": 33.4,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "107.6%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Sabonis",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    },
    {
      "id": "card_10",
      "playerName": "Tyrese Haliburton", 
      "team": "IND",
      "position": "PG",
      "serialNumber": 2044,
      "xpLevel": 5,
      "averageScore15": 29.3,
      "averageScore5": 31.8,
      "currentSeason": "2024-25",
      "rarity": "Limited",
      "powerScore": "103.4%",
      "imageUrl": "https://via.placeholder.com/150x200/1f2937/ffffff?text=Haliburton",
      "lastUpdated": "2025-08-25T16:17:23Z",
      "syncStatus": "synced"
    }
  ],
  "weeklyProjections": [
    {
      "playerName": "Nikola Jokic",
      "team": "DEN", 
      "gamesThisWeek": 3,
      "projectedPoints": 128.4,
      "matchupDifficulty": "Medium",
      "recommendation": "BUY",
      "confidence": 0.92,
      "reasonings": ["3 giochi questa settimana", "Matchup favorevoli vs CHA, POR", "In forma eccellente"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    },
    {
      "playerName": "Shai Gilgeous-Alexander",
      "team": "OKC",
      "gamesThisWeek": 4, 
      "projectedPoints": 153.6,
      "matchupDifficulty": "Easy",
      "recommendation": "BUY", 
      "confidence": 0.89,
      "reasonings": ["4 giochi questa settimana", "OKC in ottima forma", "Matchup soft vs teams difesa debole"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    },
    {
      "playerName": "Giannis Antetokounmpo",
      "team": "MIL",
      "gamesThisWeek": 3,
      "projectedPoints": 123.6,
      "matchupDifficulty": "Hard", 
      "recommendation": "HOLD",
      "confidence": 0.74,
      "reasonings": ["Solo 3 giochi", "Matchup difficili vs BOS, MIA", "Possibile rest"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    },
    {
      "playerName": "Anthony Edwards", 
      "team": "MIN",
      "gamesThisWeek": 4,
      "projectedPoints": 146.8,
      "matchupDifficulty": "Medium",
      "recommendation": "BUY",
      "confidence": 0.85,
      "reasonings": ["4 giochi buoni", "In forma crescente", "Minnesota sta bene"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    },
    {
      "playerName": "Trae Young",
      "team": "ATL", 
      "gamesThisWeek": 3,
      "projectedPoints": 110.4,
      "matchupDifficulty": "Medium",
      "recommendation": "HOLD",
      "confidence": 0.71,
      "reasonings": ["Forma altalenante", "3 giochi ok", "ATL con problemi difensivi"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    },
    {
      "playerName": "Jayson Tatum",
      "team": "BOS",
      "gamesThisWeek": 4,
      "projectedPoints": 142.4,
      "matchupDifficulty": "Easy",
      "recommendation": "BUY", 
      "confidence": 0.88,
      "reasonings": ["4 giochi facili", "Boston dominante", "Tatum in ottima forma"],
      "lastUpdated": "2025-08-25T16:15:41Z",
      "dataSource": "RotoWire + NBA Advanced Stats"
    }
  ],
  "competitions": [
    {
      "id": "limited_champion",
      "name": "Limited Champion",
      "pointsCap": 240,
      "rewards": ["Carte Rare", "€500+ premi", "Tickets eventi NBA"],
      "deadline": "2025-08-28T20:00:00",
      "participants": 12847,
      "myStatus": "not_entered",
      "description": "La competizione più prestigiosa per carte Limited",
      "lastUpdated": "2025-08-25T16:16:12Z"
    },
    {
      "id": "limited_contender", 
      "name": "Limited Contender",
      "pointsCap": 180,
      "rewards": ["Carte Limited", "€100+ premi"],
      "deadline": "2025-08-28T20:00:00", 
      "participants": 8934,
      "myStatus": "lineup_submitted",
      "description": "Competizione accessibile per carte Limited",
      "lastUpdated": "2025-08-25T16:16:12Z"
    },
    {
      "id": "limited_academy",
      "name": "Limited Academy", 
      "pointsCap": 120,
      "rewards": ["Carte Common", "XP Boost"],
      "deadline": "2025-08-28T20:00:00",
      "participants": 15672,
      "myStatus": "not_entered", 
      "description": "Competizione entry-level per nuovi manager",
      "lastUpdated": "2025-08-25T16:16:12Z"
    }
  ],
  "systemMessages": [
    {
      "type": "success",
      "message": "Sincronizzazione completata - 10 carte Limited trovate",
      "timestamp": "2025-08-25T16:17:23Z"
    },
    {
      "type": "info", 
      "message": "Proiezioni aggiornate da RotoWire",
      "timestamp": "2025-08-25T16:15:41Z"
    },
    {
      "type": "warning",
      "message": "Giannis Antetokounmpo - possibile rest nel back-to-back",
      "timestamp": "2025-08-25T16:14:12Z"
    }
  ]
};

// Application state
let currentSection = 'dashboard';
let selectedCards = new Set();
let currentLineup = [null, null, null, null, null];
let selectedCompetition = null;
let filteredCards = [...applicationData.myLimitedCards];
let connectionState = 'connecting';
let apiCallsToday = 1247;
let maxApiCalls = 5000;
let autoRefreshEnabled = true;
let refreshInterval = 15; // minutes

// API simulation state
let isConnected = false;
let connectionAttempts = 0;
let liveFeedMessages = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeConnection();
});

// Connection simulation
function initializeConnection() {
    console.log('Starting connection simulation...');
    
    const connectionScreen = document.getElementById('connectionScreen');
    const progressFill = document.getElementById('connectionProgress');
    const statusText = document.getElementById('connectionStatus');
    
    let progress = 0;
    const steps = [
        { progress: 20, text: 'Validazione API Key...', delay: 800 },
        { progress: 45, text: 'Connessione a Sorare...', delay: 1200 },
        { progress: 70, text: 'Caricamento dati utente...', delay: 900 },
        { progress: 85, text: 'Sincronizzazione carte...', delay: 600 },
        { progress: 100, text: 'Connessione completata!', delay: 400 }
    ];
    
    function animateConnection(stepIndex) {
        if (stepIndex >= steps.length) {
            setTimeout(() => {
                connectionScreen.style.display = 'none';
                initializeApp();
                isConnected = true;
                showToast('success', 'Connessione riuscita', 'Collegato con successo alle API Sorare');
            }, 500);
            return;
        }
        
        const step = steps[stepIndex];
        progressFill.style.width = step.progress + '%';
        statusText.textContent = step.text;
        
        setTimeout(() => {
            animateConnection(stepIndex + 1);
        }, step.delay);
    }
    
    // Simulate random connection delay
    setTimeout(() => {
        animateConnection(0);
    }, 500);
}

function initializeApp() {
    console.log('Initializing main application...');
    
    // Setup components in correct order
    setupNavigation();
    setupAPIHandlers();
    setupSettingsHandlers();
    setupFilters();
    setupOptimizer();
    setupDragAndDrop();
    
    // Load data
    loadDashboard();
    loadCards();
    loadProjections();
    loadCompetitions();
    
    // Initialize live feed
    initializeLiveFeed();
    
    // Setup auto-refresh if enabled
    if (autoRefreshEnabled) {
        setupAutoRefresh();
    }
    
    console.log('App initialized successfully');
}

// Navigation functionality - FIXED
function setupNavigation() {
    console.log('Setting up navigation...');
    
    // Wait for DOM to be fully ready
    setTimeout(() => {
        const navTabs = document.querySelectorAll('.nav__tab');
        const sections = document.querySelectorAll('.section');
        
        console.log(`Found ${navTabs.length} nav tabs and ${sections.length} sections`);
        
        navTabs.forEach((tab) => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const sectionId = this.dataset.section;
                console.log('Navigating to section:', sectionId);
                
                // Update active tab
                navTabs.forEach(t => t.classList.remove('nav__tab--active'));
                this.classList.add('nav__tab--active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('section--active'));
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('section--active');
                    console.log('Successfully switched to:', sectionId);
                } else {
                    console.error('Section not found:', sectionId);
                }
                
                currentSection = sectionId;
            });
        });
        
        // Set up quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="optimize"]')) {
                e.preventDefault();
                switchToSection('optimizer');
            } else if (e.target.closest('[data-action="projections"]')) {
                e.preventDefault();
                switchToSection('projections');
            }
        });
        
        console.log('Navigation setup completed');
    }, 100);
}

function switchToSection(sectionId) {
    const targetTab = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetTab) {
        targetTab.click();
    }
}

// Live Feed System
function initializeLiveFeed() {
    const liveFeed = document.getElementById('liveFeed');
    if (!liveFeed) return;
    
    // Add initial system messages
    applicationData.systemMessages.forEach(msg => {
        addLiveFeedMessage(msg.type, msg.message, new Date(msg.timestamp));
    });
    
    // Simulate live updates
    setTimeout(() => {
        simulateLiveUpdates();
    }, 5000);
}

function addLiveFeedMessage(type, message, timestamp) {
    const liveFeed = document.getElementById('liveFeed');
    if (!liveFeed) return;
    
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    
    const iconClass = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-triangle' :
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    feedItem.innerHTML = `
        <div class="feed-icon feed-icon--${type}">
            <i class="fas fa-${iconClass}"></i>
        </div>
        <div class="feed-content">
            <p class="feed-message">${message}</p>
            <p class="feed-time">${formatTime(timestamp)}</p>
        </div>
    `;
    
    liveFeed.insertBefore(feedItem, liveFeed.firstChild);
    
    // Keep only last 10 messages
    const items = liveFeed.querySelectorAll('.feed-item');
    if (items.length > 10) {
        liveFeed.removeChild(items[items.length - 1]);
    }
}

function simulateLiveUpdates() {
    const updates = [
        { type: 'info', message: 'Nikola Jokic - injury report aggiornato: Probable' },
        { type: 'warning', message: 'Anthony Edwards - possibile minutaggio ridotto' },
        { type: 'success', message: 'Lineup ottimizzato automaticamente per Limited Champion' },
        { type: 'info', message: 'Nuove proiezioni disponibili per 6 giocatori' },
        { type: 'warning', message: 'Rate limit API raggiunto - rallentamento automatico' }
    ];
    
    function addRandomUpdate() {
        if (isConnected) {
            const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
            addLiveFeedMessage(randomUpdate.type, randomUpdate.message, new Date());
        }
        
        // Schedule next update (between 10-30 seconds)
        const nextUpdate = Math.random() * 20000 + 10000;
        setTimeout(addRandomUpdate, nextUpdate);
    }
    
    addRandomUpdate();
}

// API Handlers
function setupAPIHandlers() {
    // Wait for DOM elements to be available
    setTimeout(() => {
        // Refresh data button
        const refreshDataBtn = document.getElementById('refreshDataBtn');
        if (refreshDataBtn) {
            refreshDataBtn.addEventListener('click', simulateDataRefresh);
        }
        
        // Test connection button
        const testConnectionBtn = document.getElementById('testConnectionBtn');
        if (testConnectionBtn) {
            testConnectionBtn.addEventListener('click', testAPIConnection);
        }
        
        // Refresh connections button
        const refreshConnectionBtn = document.getElementById('refreshConnectionBtn');
        if (refreshConnectionBtn) {
            refreshConnectionBtn.addEventListener('click', refreshAPIConnections);
        }
        
        // Refresh projections button
        const refreshProjectionsBtn = document.getElementById('refreshProjectionsBtn');
        if (refreshProjectionsBtn) {
            refreshProjectionsBtn.addEventListener('click', () => refreshSpecificData('projections'));
        }
    }, 200);
}

function simulateDataRefresh() {
    showProgressModal();
    
    const steps = [
        { name: 'cards', duration: 2000, description: 'Scaricamento carte Limited...' },
        { name: 'projections', duration: 1500, description: 'Aggiornamento proiezioni...' },
        { name: 'competitions', duration: 1000, description: 'Sincronizzazione competizioni...' }
    ];
    
    let currentStep = 0;
    
    function executeStep(step) {
        const stepElement = document.getElementById(`step${currentStep + 1}`);
        const progressBar = document.getElementById(`${step.name}Progress`);
        const progressText = document.getElementById(`${step.name}ProgressText`);
        
        if (stepElement) {
            stepElement.querySelector('.step-icon i').className = 'fas fa-sync-alt fa-spin';
        }
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            if (progressText) {
                if (step.name === 'cards') {
                    const cardsLoaded = Math.floor((progress / 100) * 10);
                    progressText.textContent = `${cardsLoaded}/10 carte`;
                } else if (step.name === 'projections') {
                    progressText.textContent = `${Math.floor(progress)}% completato`;
                } else {
                    progressText.textContent = `Sincronizzazione ${Math.floor(progress)}%`;
                }
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                if (stepElement) {
                    const icon = stepElement.querySelector('.step-icon i');
                    icon.className = 'fas fa-check-circle';
                    icon.style.color = 'var(--color-success)';
                }
                
                currentStep++;
                if (currentStep < steps.length) {
                    setTimeout(() => executeStep(steps[currentStep]), 300);
                } else {
                    setTimeout(() => {
                        hideProgressModal();
                        showToast('success', 'Aggiornamento completato', `Sincronizzato con Sorare - ${applicationData.myLimitedCards.length} carte trovate`);
                        updateLastSyncTime();
                        addLiveFeedMessage('success', `Sincronizzazione completata - ${applicationData.myLimitedCards.length} carte Limited trovate`, new Date());
                        
                        // Simulate some API usage
                        apiCallsToday += Math.floor(Math.random() * 10) + 5;
                        updateAPIUsageStats();
                    }, 500);
                }
            }
        }, 100);
    }
    
    executeStep(steps[0]);
}

function refreshSpecificData(type) {
    const syncIndicator = document.getElementById(`${type}SyncIndicator`);
    if (syncIndicator) {
        syncIndicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Aggiornamento in corso...';
        syncIndicator.style.color = 'var(--color-warning)';
    }
    
    // Simulate API call
    setTimeout(() => {
        if (syncIndicator) {
            syncIndicator.innerHTML = '<i class="fas fa-check-circle"></i> Aggiornato';
            syncIndicator.style.color = 'var(--color-success)';
        }
        
        showToast('success', 'Dati aggiornati', `${type === 'projections' ? 'Proiezioni' : 'Dati'} aggiornati con successo`);
        addLiveFeedMessage('info', `${type === 'projections' ? 'Proiezioni' : 'Dati'} aggiornati da API`, new Date());
        
        apiCallsToday += 3;
        updateAPIUsageStats();
    }, Math.random() * 2000 + 1000);
}

function testAPIConnection() {
    showToast('info', 'Test connessione', 'Verifica connessione API in corso...');
    
    const scenarios = [
        { success: true, delay: 1200, message: 'Connessione API attiva - Tempo di risposta: 156ms' },
        { success: true, delay: 800, message: 'Tutte le API sono operative - Latenza ottima' },
        { success: false, delay: 3000, message: 'Timeout connessione - Verifica la rete' }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    setTimeout(() => {
        if (scenario.success) {
            showToast('success', 'Test riuscito', scenario.message);
            addLiveFeedMessage('success', 'Test connessione API completato con successo', new Date());
        } else {
            showErrorModal('CONNECTION_TIMEOUT', scenario.message, 'Verifica la connessione internet e riprova tra qualche minuto.');
        }
        
        apiCallsToday += 1;
        updateAPIUsageStats();
    }, scenario.delay);
}

function refreshAPIConnections() {
    const refreshBtn = document.getElementById('refreshConnectionBtn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Aggiornamento...';
        refreshBtn.disabled = true;
    }
    
    // Simulate API status check
    setTimeout(() => {
        // Randomly update API response times
        const apis = ['sorare', 'rotowire', 'nba'];
        apis.forEach(api => {
            const responseTimeEl = document.querySelector(`[data-api="${api}"] .response-time`);
            if (responseTimeEl) {
                const newTime = Math.floor(Math.random() * 200) + 50;
                responseTimeEl.textContent = newTime + 'ms';
            }
            
            // Randomly change NBA API status to show variability
            if (api === 'nba' && Math.random() > 0.7) {
                const statusEl = document.querySelector(`[data-api="${api}"] .status-indicator`);
                if (statusEl) {
                    statusEl.className = 'status-indicator status--warning';
                    statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Lento</span>';
                }
            }
        });
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Connessioni';
            refreshBtn.disabled = false;
        }
        
        showToast('success', 'Stato API aggiornato', 'Tutti i servizi sono stati verificati');
        addLiveFeedMessage('info', 'Stato delle API aggiornato', new Date());
        
        apiCallsToday += 3;
        updateAPIUsageStats();
    }, 1500);
}

// Settings Handlers
function setupSettingsHandlers() {
    setTimeout(() => {
        // API Key toggle
        const toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');
        const apiKeyInput = document.getElementById('apiKeyInput');
        if (toggleApiKeyBtn && apiKeyInput) {
            toggleApiKeyBtn.addEventListener('click', () => {
                const isPassword = apiKeyInput.type === 'password';
                apiKeyInput.type = isPassword ? 'text' : 'password';
                toggleApiKeyBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            });
        }
        
        // Test API key button
        const testApiKeyBtn = document.getElementById('testApiKeyBtn');
        if (testApiKeyBtn) {
            testApiKeyBtn.addEventListener('click', testAPIKey);
        }
        
        // Clear cache button
        const clearCacheBtn = document.getElementById('clearCacheBtn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', clearCache);
        }
        
        // Auto-refresh toggle
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                autoRefreshEnabled = e.target.checked;
                if (autoRefreshEnabled) {
                    setupAutoRefresh();
                    showToast('success', 'Auto-refresh attivato', `Dati aggiornati ogni ${refreshInterval} minuti`);
                } else {
                    showToast('info', 'Auto-refresh disattivato', 'Gli aggiornamenti saranno solo manuali');
                }
            });
        }
        
        // Refresh interval select
        const refreshIntervalSelect = document.getElementById('refreshIntervalSelect');
        if (refreshIntervalSelect) {
            refreshIntervalSelect.addEventListener('change', (e) => {
                refreshInterval = parseInt(e.target.value);
                if (refreshInterval > 0 && autoRefreshEnabled) {
                    setupAutoRefresh();
                    showToast('info', 'Intervallo aggiornato', `Nuova frequenza: ${refreshInterval} minuti`);
                }
            });
        }
        
        // Error modal handlers
        const closeErrorBtn = document.getElementById('closeErrorBtn');
        const retryConnectionBtn = document.getElementById('retryConnectionBtn');
        
        if (closeErrorBtn) {
            closeErrorBtn.addEventListener('click', () => hideErrorModal());
        }
        
        if (retryConnectionBtn) {
            retryConnectionBtn.addEventListener('click', () => {
                hideErrorModal();
                testAPIConnection();
            });
        }
    }, 200);
}

function testAPIKey() {
    const testBtn = document.getElementById('testApiKeyBtn');
    if (testBtn) {
        testBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Testing...';
        testBtn.disabled = true;
    }
    
    setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        
        if (success) {
            showToast('success', 'API Key valida', 'Autenticazione completata con successo');
            addLiveFeedMessage('success', 'API Key verificata e autenticata', new Date());
        } else {
            showErrorModal('INVALID_API_KEY', 'API Key non valida', 'Verifica che la chiave sia corretta e non scaduta.');
        }
        
        if (testBtn) {
            testBtn.innerHTML = '<i class="fas fa-plug"></i> Test Connessione API';
            testBtn.disabled = false;
        }
        
        apiCallsToday += 1;
        updateAPIUsageStats();
    }, 2000);
}

function clearCache() {
    const clearBtn = document.getElementById('clearCacheBtn');
    if (clearBtn) {
        clearBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Cancellazione...';
        clearBtn.disabled = true;
    }
    
    setTimeout(() => {
        showToast('success', 'Cache cancellata', 'Cache pulita con successo - 47.3 MB liberati');
        addLiveFeedMessage('info', 'Cache applicazione cancellata', new Date());
        
        // Reset cache stats
        const cacheSizeEl = document.querySelector('.cache-stat strong');
        if (cacheSizeEl && cacheSizeEl.textContent === '47.3 MB') {
            cacheSizeEl.textContent = '2.1 MB';
        }
        
        if (clearBtn) {
            clearBtn.innerHTML = '<i class="fas fa-trash"></i> Cancella Cache';
            clearBtn.disabled = false;
        }
    }, 1000);
}

// Auto-refresh functionality
let autoRefreshTimer = null;

function setupAutoRefresh() {
    if (autoRefreshTimer) {
        clearInterval(autoRefreshTimer);
    }
    
    if (refreshInterval > 0 && autoRefreshEnabled) {
        autoRefreshTimer = setInterval(() => {
            if (isConnected) {
                addLiveFeedMessage('info', 'Auto-refresh: aggiornamento dati in corso', new Date());
                
                // Simulate light data refresh
                setTimeout(() => {
                    updateLastSyncTime();
                    apiCallsToday += 2;
                    updateAPIUsageStats();
                    addLiveFeedMessage('success', 'Auto-refresh completato', new Date());
                }, Math.random() * 2000 + 1000);
            }
        }, refreshInterval * 60 * 1000);
    }
}

// Modal functions
function showProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Reset progress bars
        document.querySelectorAll('.progress-fill').forEach(bar => {
            bar.style.width = '0%';
        });
        
        // Reset step icons
        document.querySelectorAll('.step-icon i').forEach(icon => {
            icon.className = 'fas fa-clock';
            icon.style.color = '';
        });
        
        // Reset progress texts
        const cardsProgressText = document.getElementById('cardsProgressText');
        const projectionsProgressText = document.getElementById('projectionsProgressText');
        const competitionsProgressText = document.getElementById('competitionsProgressText');
        
        if (cardsProgressText) cardsProgressText.textContent = '0/10 carte';
        if (projectionsProgressText) projectionsProgressText.textContent = 'In attesa...';
        if (competitionsProgressText) competitionsProgressText.textContent = 'In attesa...';
    }
}

function hideProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showErrorModal(errorCode, message, suggestion) {
    const modal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    const errorCodeEl = document.getElementById('errorCode');
    const errorSuggestion = document.getElementById('errorSuggestion');
    
    if (modal && errorMessage && errorCodeEl && errorSuggestion) {
        errorMessage.textContent = message;
        errorCodeEl.textContent = errorCode;
        errorSuggestion.textContent = suggestion;
        modal.classList.remove('hidden');
    }
}

function hideErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Toast notification system
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';
    
    const iconColor = type === 'success' ? 'var(--color-success)' :
                     type === 'error' ? 'var(--color-error)' :
                     type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}" style="color: ${iconColor}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// Utility functions
function updateLastSyncTime() {
    const lastSyncEl = document.getElementById('lastSyncTime');
    if (lastSyncEl) {
        const now = new Date();
        const time = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        lastSyncEl.textContent = `Ultimo sync: ${time}`;
    }
}

function updateAPIUsageStats() {
    const percentage = (apiCallsToday / maxApiCalls) * 100;
    const usageText = document.querySelector('.usage-card .usage-value');
    const usageBar = document.querySelector('.usage-card .usage-fill');
    
    if (usageText) {
        usageText.textContent = `${apiCallsToday} / ${maxApiCalls}`;
    }
    
    if (usageBar) {
        usageBar.style.width = percentage + '%';
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

// Dashboard functionality
function loadDashboard() {
    console.log('Dashboard loaded');
}

// Cards functionality
function loadCards() {
    console.log('Loading cards...');
    populateTeamFilter();
    renderCards(filteredCards);
}

function populateTeamFilter() {
    const teamFilter = document.getElementById('teamFilter');
    if (!teamFilter) return;
    
    const teams = [...new Set(applicationData.myLimitedCards.map(card => card.team))].sort();
    
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamFilter.appendChild(option);
    });
}

function renderCards(cards) {
    const cardsGrid = document.getElementById('cardsGrid');
    if (!cardsGrid) return;
    
    cardsGrid.innerHTML = '';
    
    cards.forEach(card => {
        const cardElement = createPlayerCard(card);
        cardsGrid.appendChild(cardElement);
    });
}

function createPlayerCard(card) {
    const div = document.createElement('div');
    div.className = 'player-card';
    div.dataset.cardId = card.id;
    
    const isInLineup = currentLineup.some(lineupCard => lineupCard && lineupCard.id === card.id);
    if (isInLineup) {
        div.classList.add('player-card--in-lineup');
    }
    
    div.innerHTML = `
        <div class="card-header">
            <div class="player-info">
                <h3>${card.playerName}</h3>
                <div class="team-position">${card.team} • ${card.position}</div>
            </div>
            <div class="card-level">LV ${card.xpLevel}</div>
        </div>
        
        <div class="card-stats">
            <div class="stat-item">
                <div class="stat-value">${card.averageScore15}</div>
                <div class="stat-label">Media L15</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${card.powerScore}</div>
                <div class="stat-label">Power Score</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">#${card.serialNumber}</div>
                <div class="stat-label">Serial</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${card.averageScore5}</div>
                <div class="stat-label">Media L5</div>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => toggleCardSelection(card.id));
    
    return div;
}

function toggleCardSelection(cardId) {
    if (selectedCards.has(cardId)) {
        selectedCards.delete(cardId);
    } else {
        selectedCards.add(cardId);
    }
    
    updateCardSelection();
}

function updateCardSelection() {
    document.querySelectorAll('.player-card').forEach(card => {
        const cardId = card.dataset.cardId;
        if (selectedCards.has(cardId)) {
            card.classList.add('player-card--selected');
        } else {
            card.classList.remove('player-card--selected');
        }
    });
}

// Filter functionality
function setupFilters() {
    setTimeout(() => {
        const teamFilter = document.getElementById('teamFilter');
        const positionFilter = document.getElementById('positionFilter');
        
        if (teamFilter) {
            teamFilter.addEventListener('change', applyFilters);
        }
        if (positionFilter) {
            positionFilter.addEventListener('change', applyFilters);
        }
    }, 300);
}

function applyFilters() {
    const teamFilter = document.getElementById('teamFilter');
    const positionFilter = document.getElementById('positionFilter');
    
    const teamValue = teamFilter ? teamFilter.value : '';
    const positionValue = positionFilter ? positionFilter.value : '';
    
    filteredCards = applicationData.myLimitedCards.filter(card => {
        const teamMatch = !teamValue || card.team === teamValue;
        const positionMatch = !positionValue || card.position === positionValue;
        return teamMatch && positionMatch;
    });
    
    renderCards(filteredCards);
}

// Projections functionality
function loadProjections() {
    console.log('Loading projections...');
    const tbody = document.getElementById('projectionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    applicationData.weeklyProjections.forEach(projection => {
        const row = createProjectionRow(projection);
        tbody.appendChild(row);
    });
}

function createProjectionRow(projection) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td><strong>${projection.playerName}</strong></td>
        <td>${projection.team}</td>
        <td>${projection.gamesThisWeek}</td>
        <td><strong>${projection.projectedPoints.toFixed(1)}</strong></td>
        <td><span class="difficulty difficulty--${projection.matchupDifficulty.toLowerCase()}">${projection.matchupDifficulty}</span></td>
        <td><span class="recommendation recommendation--${projection.recommendation.toLowerCase()}">${projection.recommendation}</span></td>
        <td>${(projection.confidence * 100).toFixed(0)}%</td>
    `;
    
    return tr;
}

// Competition functionality
function loadCompetitions() {
    console.log('Loading competitions...');
    const competitionsGrid = document.getElementById('competitionsGrid');
    const competitionSelect = document.getElementById('competitionSelect');
    
    if (competitionsGrid) {
        competitionsGrid.innerHTML = '';
        
        applicationData.competitions.forEach(competition => {
            const cardElement = createCompetitionCard(competition);
            competitionsGrid.appendChild(cardElement);
        });
    }
    
    if (competitionSelect) {
        competitionSelect.innerHTML = '<option value="">Seleziona competizione</option>';
        
        applicationData.competitions.forEach(competition => {
            const option = document.createElement('option');
            option.value = competition.id;
            option.textContent = `${competition.name} (Cap: ${competition.pointsCap})`;
            competitionSelect.appendChild(option);
        });
    }
}

function createCompetitionCard(competition) {
    const div = document.createElement('div');
    div.className = 'competition-card';
    
    const deadline = new Date(competition.deadline);
    const timeLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
    
    const statusClass = competition.myStatus === 'lineup_submitted' ? 'entered' : 'not-entered';
    const statusText = competition.myStatus === 'lineup_submitted' ? 'Formazione Inviata' : 'Non Partecipando';
    
    div.innerHTML = `
        <div class="competition-header">
            <div>
                <h3 class="competition-name">${competition.name}</h3>
                <p>${competition.description}</p>
            </div>
            <div class="competition-cap">Cap: ${competition.pointsCap}</div>
        </div>
        
        <div class="competition-info">
            <div class="info-row">
                <span>Partecipanti:</span>
                <span>${competition.participants.toLocaleString()}</span>
            </div>
            <div class="info-row">
                <span>Scadenza:</span>
                <span>${timeLeft} giorni</span>
            </div>
            <div class="info-row">
                <span>Rewards:</span>
                <span>${competition.rewards.join(', ')}</span>
            </div>
        </div>
        
        <div class="competition-status status--${statusClass}">
            <i class="fas fa-${statusClass === 'entered' ? 'check-circle' : 'times-circle'}"></i>
            ${statusText}
        </div>
    `;
    
    return div;
}

// Optimizer functionality
function setupOptimizer() {
    setTimeout(() => {
        const competitionSelect = document.getElementById('competitionSelect');
        const autoOptimizeBtn = document.getElementById('autoOptimizeBtn');
        
        if (competitionSelect) {
            competitionSelect.addEventListener('change', onCompetitionChange);
        }
        if (autoOptimizeBtn) {
            autoOptimizeBtn.addEventListener('click', autoOptimizeLineup);
        }
        
        populateAvailableCards();
    }, 300);
}

function onCompetitionChange() {
    const competitionSelect = document.getElementById('competitionSelect');
    if (!competitionSelect) return;
    
    const competitionId = competitionSelect.value;
    
    if (competitionId) {
        selectedCompetition = applicationData.competitions.find(c => c.id === competitionId);
        updatePointsDisplay();
    } else {
        selectedCompetition = null;
        updatePointsDisplay();
    }
}

function updatePointsDisplay() {
    const pointsCapValue = document.getElementById('pointsCapValue');
    const pointsUsedValue = document.getElementById('pointsUsedValue');
    const pointsRemainingValue = document.getElementById('pointsRemainingValue');
    
    if (!pointsCapValue || !pointsUsedValue || !pointsRemainingValue) return;
    
    if (selectedCompetition) {
        const cap = selectedCompetition.pointsCap;
        const used = calculateUsedPoints();
        const remaining = cap - used;
        
        pointsCapValue.textContent = cap;
        pointsUsedValue.textContent = used.toFixed(1);
        pointsRemainingValue.textContent = remaining.toFixed(1);
        
        if (remaining < 0) {
            pointsRemainingValue.style.color = 'var(--color-error)';
        } else if (remaining < 10) {
            pointsRemainingValue.style.color = 'var(--color-warning)';
        } else {
            pointsRemainingValue.style.color = 'var(--color-success)';
        }
    } else {
        pointsCapValue.textContent = '--';
        pointsUsedValue.textContent = '0';
        pointsRemainingValue.textContent = '--';
    }
}

function calculateUsedPoints() {
    return currentLineup.reduce((total, card) => {
        if (card) {
            return total + card.averageScore15;
        }
        return total;
    }, 0);
}

function populateAvailableCards() {
    const availableCards = document.getElementById('availableCards');
    if (!availableCards) return;
    
    availableCards.innerHTML = '';
    
    applicationData.myLimitedCards.forEach(card => {
        const isInLineup = currentLineup.some(lineupCard => lineupCard && lineupCard.id === card.id);
        if (!isInLineup) {
            const miniCard = createMiniCard(card);
            availableCards.appendChild(miniCard);
        }
    });
}

function createMiniCard(card) {
    const div = document.createElement('div');
    div.className = 'mini-card';
    div.draggable = true;
    div.dataset.cardId = card.id;
    
    div.innerHTML = `
        <div class="mini-card__header">
            <h4 class="mini-card__name">${card.playerName}</h4>
            <span class="mini-card__score">${card.averageScore15}</span>
        </div>
        <div class="mini-card__info">
            <span>${card.team} • ${card.position}</span>
        </div>
    `;
    
    return div;
}

// Drag and Drop functionality
function setupDragAndDrop() {
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
}

function handleDragStart(e) {
    if (e.target.classList.contains('mini-card')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.cardId);
        e.target.style.opacity = '0.5';
    }
}

function handleDragOver(e) {
    if (e.target.closest('.lineup-slot')) {
        e.preventDefault();
    }
}

function handleDragEnter(e) {
    if (e.target.closest('.lineup-slot')) {
        e.target.closest('.lineup-slot').classList.add('lineup-slot--dragover');
    }
}

function handleDragLeave(e) {
    if (e.target.closest('.lineup-slot')) {
        e.target.closest('.lineup-slot').classList.remove('lineup-slot--dragover');
    }
}

function handleDrop(e) {
    const slot = e.target.closest('.lineup-slot');
    if (slot) {
        e.preventDefault();
        slot.classList.remove('lineup-slot--dragover');
        
        const cardId = e.dataTransfer.getData('text/plain');
        const card = applicationData.myLimitedCards.find(c => c.id === cardId);
        const position = parseInt(slot.dataset.position);
        
        if (card) {
            addPlayerToLineup(card, position);
        }
    }
    
    document.querySelectorAll('.mini-card').forEach(card => {
        card.style.opacity = '1';
    });
}

function addPlayerToLineup(card, position) {
    const currentPosition = currentLineup.findIndex(c => c && c.id === card.id);
    if (currentPosition !== -1) {
        currentLineup[currentPosition] = null;
    }
    
    currentLineup[position] = card;
    
    updateLineupDisplay();
    updatePointsDisplay();
    populateAvailableCards();
}

function updateLineupDisplay() {
    const lineupSlots = document.querySelectorAll('.lineup-slot');
    
    lineupSlots.forEach((slot, index) => {
        const card = currentLineup[index];
        const slotContent = slot.querySelector('.slot-content');
        
        if (card) {
            slot.classList.add('lineup-slot--filled');
            slotContent.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${card.playerName}</strong><br>
                        <small>${card.team} • ${card.position} • ${card.averageScore15} pts</small>
                    </div>
                    <button class="btn btn--sm" onclick="removeFromLineup(${index})" style="background: var(--color-error); color: white;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        } else {
            slot.classList.remove('lineup-slot--filled');
            slotContent.textContent = 'Trascina qui una carta';
        }
    });
    
    renderCards(filteredCards);
}

window.removeFromLineup = function(position) {
    currentLineup[position] = null;
    updateLineupDisplay();
    updatePointsDisplay();
    populateAvailableCards();
}

function autoOptimizeLineup() {
    if (!selectedCompetition) {
        showToast('error', 'Errore', 'Seleziona prima una competizione');
        return;
    }
    
    // Show loading with API simulation
    showToast('info', 'Ottimizzazione in corso', 'Calcolo della formazione ottimale...');
    
    setTimeout(() => {
        const optimizedLineup = optimizeLineup(selectedCompetition.pointsCap);
        currentLineup = optimizedLineup;
        
        updateLineupDisplay();
        updatePointsDisplay();
        populateAvailableCards();
        
        showToast('success', 'Ottimizzazione completata', 'Formazione ottimizzata con successo!');
        addLiveFeedMessage('success', `Formazione ottimizzata per ${selectedCompetition.name}`, new Date());
        
        apiCallsToday += 5; // Optimization uses more API calls
        updateAPIUsageStats();
    }, 1500);
}

function optimizeLineup(pointsCap) {
    const cardsWithProjections = applicationData.myLimitedCards.map(card => {
        const projection = applicationData.weeklyProjections.find(p => p.playerName === card.playerName);
        return {
            ...card,
            projectedPoints: projection ? projection.projectedPoints : card.averageScore15 * 3,
            efficiency: projection ? projection.projectedPoints / card.averageScore15 : 3
        };
    });
    
    cardsWithProjections.sort((a, b) => b.efficiency - a.efficiency);
    
    const lineup = [null, null, null, null, null];
    let totalPoints = 0;
    let selectedCount = 0;
    
    for (const card of cardsWithProjections) {
        if (selectedCount < 5 && totalPoints + card.averageScore15 <= pointsCap) {
            lineup[selectedCount] = card;
            totalPoints += card.averageScore15;
            selectedCount++;
        }
    }
    
    return lineup;
}