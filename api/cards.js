const SORARE_EMAIL = process.env.SORARE_EMAIL;
const SORARE_PASSWORD = process.env.SORARE_PASSWORD;  
const SORARE_API_KEY = process.env.SORARE_API_KEY;

async function getSorareJWT() {
  const { default: fetch } = await import('node-fetch');
  const bcrypt = await import('bcryptjs');
  
  try {
    // 1. Ottieni salt
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${SORARE_EMAIL}`);
    const { salt } = await saltResponse.json();
    
    // 2. Hash password  
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, salt);
    
    // 3. Login
    const loginQuery = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          jwtToken(aud: "sorare-nba-manager") {
            token
          }
          errors { message }
        }
      }
    `;
    
    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'APIKEY': SORARE_API_KEY  // ← Usa API key anche per login
      },
      body: JSON.stringify({
        query: loginQuery,
        variables: {
          input: { email: SORARE_EMAIL, password: hashedPassword }
        }
      })
    });
    
    const data = await response.json();
    return data.data?.signIn?.jwtToken?.token;
    
  } catch (error) {
    console.error('Errore login:', error);
    return null;
  }
}

export default async function handler(req, res) {
  const jwtToken = await getSorareJWT();
  
  const response = await fetch('https://api.sorare.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,       // Per autenticazione  
      'APIKEY': SORARE_API_KEY,                   // Per rate limits alti
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY_LIMITED_CARDS })
  });
  
  // ... resto del codice
}
