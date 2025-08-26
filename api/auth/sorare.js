// api/auth/sorare.js - Inizia il flusso OAuth
export default async function handler(req, res) {
  const CLIENT_ID = process.env.SORARE_CLIENT_ID;
  const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://${req.headers.host}`;
  const REDIRECT_URI = `${BASE_URL}/api/auth/callback`;
  
  if (!CLIENT_ID) {
    return res.status(500).json({ 
      error: 'OAuth not configured',
      message: 'SORARE_CLIENT_ID missing in environment variables' 
    });
  }
  
  // Costruisci URL OAuth (stesso formato di NBA Jet)
  const oauthUrl = new URL('https://sorare.com/oauth/authorize');
  oauthUrl.searchParams.set('client_id', CLIENT_ID);
  oauthUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  oauthUrl.searchParams.set('response_type', 'code');
  oauthUrl.searchParams.set('scope', ''); // Scope vuoto come NBA Jet
  
  console.log('Redirecting to OAuth:', oauthUrl.toString());
  console.log('Redirect URI:', REDIRECT_URI);
  
  // Redirect a Sorare OAuth
  res.redirect(302, oauthUrl.toString());
}
