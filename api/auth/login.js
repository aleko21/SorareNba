// api/auth/login.js - Gestisce SOLO login e 2FA
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    const { default: fetch } = await import('node-fetch');
    const { default: bcrypt } = await import('bcryptjs');

    const twoFACode = req.query.code;
    const storedChallenge = req.query.challenge; // Challenge esistente

    // Helper per chiamate API
    async function apiCall(url, options = {}) {
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'APIKEY': SORARE_API_KEY,
          ...options.headers
        }
      });
    }

    // Get salt
    const saltResponse = await apiCall(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    const { salt } = await saltResponse.json();
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, salt);

    const loginMutation = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          jwtToken(aud: "sorare-nba-manager") {
            token
          }
          otpSessionChallenge
          errors {
            message
          }
        }
      }
    `;

    if (!twoFACode) {
      // STEP 1: Login iniziale - genera challenge UNA SOLA VOLTA
      console.log('🔐 Generando challenge 2FA...');

      const loginResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: loginMutation,
          variables: {
            input: {
              email: SORARE_EMAIL,
              password: hashedPassword
            }
          }
        })
      });

      const loginData = await loginResponse.json();

      // Se JWT diretto (no 2FA)
      if (loginData.data?.signIn?.jwtToken?.token) {
        const jwt = loginData.data.signIn.jwtToken.token;
        
        // Salva JWT in cookie sicuro
        res.setHeader('Set-Cookie', `sorare_jwt=${jwt}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`);
        
        return res.status(200).json({
          success: true,
          hasJWT: true,
          message: '✅ Login completato! Puoi caricare le carte.',
          nextStep: 'Vai a /api/cards per vedere le tue carte NBA'
        });
      }

      // Se richiede 2FA
      const otpSessionChallenge = loginData.data?.signIn?.otpSessionChallenge;
      
      if (otpSessionChallenge) {
        return res.status(202).json({
          success: false,
          requiresTwoFA: true,
          otpSessionChallenge: otpSessionChallenge,
          message: '🔐 Codice 2FA richiesto',
          instructions: [
            '1. Controlla la tua email per il codice',
            '2. IMPORTANTE: Non ricaricare questa pagina!',
            '3. Usa il link con il codice che ricevi'
          ],
          // Challenge incluso nell'URL per riutilizzo
          nextStep: `/api/auth/login?code=TUO_CODICE&challenge=${otpSessionChallenge}`
        });
      }

      return res.status(400).json({
        error: 'Login fallito',
        details: loginData.data?.signIn?.errors || loginData.errors
      });

    } else {
      // STEP 2: Verifica 2FA con challenge esistente
      if (!storedChallenge) {
        return res.status(400).json({
          error: 'Challenge mancante',
          message: 'Richiedi un nuovo codice 2FA',
          retryUrl: '/api/auth/login'
        });
      }

      console.log('🔑 Verificando codice 2FA...');

      const twoFAResponse = await apiCall('https://api.sorare.com/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: loginMutation,
          variables: {
            input: {
              otpSessionChallenge: storedChallenge,
              otpAttempt: twoFACode
            }
          }
        })
      });

      const twoFAData = await twoFAResponse.json();

      if (twoFAData.data?.signIn?.errors?.length > 0) {
        return res.status(400).json({
          error: 'Codice 2FA non valido',
          details: twoFAData.data.signIn.errors,
          retryUrl: `/api/auth/login?code=NUOVO_CODICE&challenge=${storedChallenge}`,
          hint: 'Riprova con il codice corretto o richiedi nuovo codice'
        });
      }

      const jwt = twoFAData.data?.signIn?.jwtToken?.token;
      
      if (!jwt) {
        return res.status(400).json({
          error: 'JWT non ricevuto',
          data: twoFAData
        });
      }

      // Salva JWT in cookie sicuro
      res.setHeader('Set-Cookie', `sorare_jwt=${jwt}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`);

      return res.status(200).json({
        success: true,
        hasJWT: true,
        message: '🎉 Login 2FA completato! Puoi caricare le tue carte NBA.',
        nextStep: 'Vai a /api/cards per vedere le tue carte personali',
        jwtSaved: true
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Errore di login',
      message: error.message
    });
  }
}
