// api/cards.js - TEST MINIMALE
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    
    // ✅ Query MINIMALE per test connessione
    const MINIMAL_QUERY = `
      query {
        __typename
      }
    `;

    console.log('Testing minimal GraphQL query...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: MINIMAL_QUERY
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status}`,
        responseText: responseText,
        headers: Object.fromEntries(response.headers.entries())
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({
        error: 'JSON parse error',
        responseText: responseText,
        parseError: parseError.message
      });
    }

    res.status(200).json({
      success: true,
      message: '✅ Connessione GraphQL funziona!',
      data: data,
      rawResponse: responseText
    });

  } catch (error) {
    console.error('Connection Error:', error);
    res.status(500).json({
      error: 'Connection failed',
      message: error.message,
      stack: error.stack
    });
  }
}
