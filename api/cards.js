export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test 1: Environment variables
    const SORARE_EMAIL = process.env.SORARE_EMAIL;
    const SORARE_PASSWORD = process.env.SORARE_PASSWORD;
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    console.log('Environment check:', {
      hasEmail: !!SORARE_EMAIL,
      hasPassword: !!SORARE_PASSWORD,
      hasApiKey: !!SORARE_API_KEY
    });

    if (!SORARE_EMAIL || !SORARE_PASSWORD) {
      return res.status(500).json({ 
        error: 'Missing credentials',
        details: 'SORARE_EMAIL and SORARE_PASSWORD required'
      });
    }

    // Test 2: Import modules
    console.log('Importing modules...');
    const { default: fetch } = await import('node-fetch');
    const bcrypt = await import('bcryptjs');
    console.log('Modules imported successfully');

    // Test 3: Get salt
    console.log('Getting salt for:', SORARE_EMAIL);
    const saltResponse = await fetch(`https://api.sorare.com/api/v1/users/${encodeURIComponent(SORARE_EMAIL)}`);
    
    if (!saltResponse.ok) {
      throw new Error(`Salt request failed: ${saltResponse.status} ${saltResponse.statusText}`);
    }
    
    const saltData = await saltResponse.json();
    console.log('Salt response:', saltData);
    
    if (!saltData.salt) {
      throw new Error('No salt returned from API');
    }

    // Test 4: Hash password
    console.log('Hashing password...');
    const hashedPassword = bcrypt.hashSync(SORARE_PASSWORD, saltData.salt);
    console.log('Password hashed successfully');

    // Test 5: Login query
    const loginQuery = `
      mutation SignInMutation($input: signInInput!) {
        signIn(input: $input) {
          jwtToken(aud: "sorare-nba-manager") {
            token
          }
          errors {
            message
          }
        }
      }
    `;

    console.log('Performing login...');
    const loginHeaders = {
      'Content-Type': 'application/json'
    };
    
    if (SORARE_API_KEY) {
      loginHeaders['APIKEY'] = SORARE_API_KEY;
    }

    const loginResponse = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: loginHeaders,
      body: JSON.stringify({
        query: loginQuery,
        variables: {
          input: {
            email: SORARE_EMAIL,
            password: hashedPassword
          }
        }
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login request failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    console.log('Login response:', JSON.stringify(loginData, null, 2));

    if (loginData.errors) {
      return res.status(400).json({
        error: 'GraphQL login errors',
        details: loginData.errors
      });
    }

    if (loginData.data?.signIn?.errors?.length > 0) {
      return res.status(400).json({
        error: 'Login failed',
        details: loginData.data.signIn.errors
      });
    }

    const jwtToken = loginData.data?.signIn?.jwtToken?.token;
    
    if (!jwtToken) {
      return res.status(400).json({
        error: 'No JWT token received',
        loginData: loginData
      });
    }

    console.log('JWT token received, length:', jwtToken.length);

    // Return success for now
    res.status(200).json({
      success: true,
      message: 'Login successful, JWT obtained',
      tokenLength: jwtToken.length,
      hasApiKey: !!SORARE_API_KEY
    });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      error: 'Function crashed',
      message: error.message,
      stack: error.stack
    });
  }
}
