// api/auth/login.js
export default async function handler(req, res) {
  // CORS e metodo
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { code, challenge } = req.query;
  // 1) Se non c'è code, generiamo challenge 2FA
  if (!code) {
    // ... login iniziale e ottenimento otpSessionChallenge ...
    return res.status(202).json({ requiresTwoFA: true, otpSessionChallenge });
  }
  // 2) Se c'è code + challenge, tentiamo verifica
  // ... login con otpSessionChallenge + otpAttempt ...
  if (success) {
    return res.status(200).json({ success: true, hasJWT: true });
  } else {
    return res.status(400).json({ error: 'Codice 2FA non valido' });
  }
}
