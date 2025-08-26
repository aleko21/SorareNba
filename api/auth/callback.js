// api/auth/callback.js - Gestisce il callback OAuth
export default async function handler(req, res) {
  const { code, error, state } = req.query;
  
  console.log('OAuth callback received:', { code: !!code, error, state });
  
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`/?error=${encodeURIComponent(error)}&message=OAuth authorization failed`);
  }
  
  if (!code) {
    console.error('No authorization code received');
    return res.redirect('/?error=no_code&message=No authorization code received');
  }
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    const CLIENT_ID = process.env.SORARE_CLIENT_ID;
    const CLIENT_SECRET = process.env.SORARE_CLIENT_SECRET;
    const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://${req.headers.host}`;
    const REDIRECT_URI = `${BASE_URL}/api/auth/callback`;
    
    console.log('Exchanging code for token...');
    
    // Scambia authorization code per access token
    const tokenResponse = await fetch('https://sorare.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });
    
    const tokenData = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    console.log('Token data:', tokenData);
    
    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
    }
    
    if (tokenData.access_token) {
      // Salva access token in cookie sicuro
      const cookieOptions = [
        `sorare_token=${tokenData.access_token}`,
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        'Max-Age=3600', // 1 ora
        'Path=/'
      ].join('; ');
      
      res.setHeader('Set-Cookie', cookieOptions);
      
      console.log('✅ OAuth successful, redirecting to app');
      res.redirect('/?auth=success&message=Login successful');
    } else {
      throw new Error('No access token in response');
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`/?error=server_error&message=${encodeURIComponent(error.message)}`);
  }
}
