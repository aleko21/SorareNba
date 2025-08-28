// public/app.js

// Quando clicchi login:
async function startLogin() {
  showLoading();
  const res = await fetch('/api/auth/login', { method: 'GET' });
  const data = await res.json();
  hideLoading();
  if (data.requiresTwoFA) {
    otpChallenge = data.otpSessionChallenge;
    showTwoFAModal();
  } else if (data.hasJWT) {
    onLoginSuccess();
  }
}

// Quando invii 2FA:
async function verifyTwoFA() {
  const code = document.getElementById('twofa-input').value;
  showLoading();
  const res = await fetch(`/api/auth/login?code=${code}&challenge=${otpChallenge}`);
  const data = await res.json();
  hideLoading();
  if (data.success && data.hasJWT) {
    hideTwoFAModal();
    onLoginSuccess();
  } else {
    showError(data.error || 'Codice non valido');
  }
}
