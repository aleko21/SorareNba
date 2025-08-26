// api/cards.js - Test minimale per debug
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    const { default: fetch } = await import('node-fetch');

    // Query ULTRA-SEMPLICE per test connessione
    const minimalQuery = `
      query {
        __typename
      }
    `;

    console.log('Testing minimal query with API key...');

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'APIKEY': SORARE_API_KEY
      },
      body: JSON.stringify({
        query: minimalQuery
      })
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status}`,
        responseText: responseText,
        headers: Object.fromEntries(response.headers.entries())
      });
    }

    const data = JSON.parse(responseText);

    res.status(200).json({
      success: true,
      message: '✅ API Key funziona!',
      data: data,
      step: 'Connessione base OK, prossimo step: login + carte personali'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Connection test failed',
      message: error.message
    });
  }
}
