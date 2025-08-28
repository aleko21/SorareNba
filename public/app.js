// public/app.js

// Mostra stato di caricamento
function showLoading(message = 'Caricamento in corso…') {
  const container = document.getElementById('cards-container');
  container.innerHTML = `<p class="loading">${message}</p>`;
}

// Carica e visualizza le carte NBA Limited
async function loadCards() {
  showLoading();
  try {
    const response = await fetch('/api/cards');
    const result = await response.json();

    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    if (!result.success) {
      container.innerHTML = `<p class="error">Errore: ${result.message || 'Impossibile caricare le carte'}</p>`;
      console.error('API error:', result);
      return;
    }

    if (result.data.length === 0) {
      container.innerHTML = `<p class="empty">Nessuna carta NBA Limited trovata.</p>`;
      return;
    }

    // Crea una card per ogni carta
    result.data.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';

      cardEl.innerHTML = `
        <img src="${card.pictureUrl}" alt="${card.name}" class="card-img" />
        <div class="card-info">
          <h2 class="card-title">${card.name}</h2>
          <p class="card-detail">Rarity: <strong>${card.rarity}</strong></p>
          <p class="card-detail">Serial: <strong>${card.serialNumber}</strong></p>
          <p class="card-detail">XP: <strong>${card.xp}</strong></p>
          <p class="card-detail">Grade: <strong>${card.grade ?? '—'}</strong></p>
          <p class="card-detail">Season: <strong>${card.seasonYear}</strong></p>
        </div>
      `;
      container.appendChild(cardEl);
    });
  } catch (error) {
    const container = document.getElementById('cards-container');
    container.innerHTML = `<p class="error">Errore di connessione</p>`;
    console.error('Fetch error:', error);
  }
}

// Avvia il caricamento al DOM ready
document.addEventListener('DOMContentLoaded', loadCards);
