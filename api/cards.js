// api/cards.js - Introspection per scoprire schema reale
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const { default: fetch } = await import('node-fetch');
    const SORARE_API_KEY = process.env.SORARE_API_KEY;
    
    const testType = req.query.test || 'rootFields';
    
    const queries = {
      // Scopri i campi root disponibili
      rootFields: `
        query {
          __type(name: "Query") {
            fields {
              name
              description
            }
          }
        }
      `,
      
      // Test query semplici senza connections
      simpleTest: `
        query {
          __schema {
            queryType {
              name
            }
          }
        }
      `,
      
      // Test currentUser (la query che ci interessa di più)
      currentUserTest: `
        query {
          currentUser {
            __typename
            id
          }
        }
      `,
      
      // Test con API key
      apiKeyTest: `
        query {
          currentUser {
            id
            slug
            nickname
          }
        }
      `
    };

    const selectedQuery = queries[testType];
    
    if (!selectedQuery) {
      return res.status(400).json({
        error: 'Test non valido',
        availableTests: Object.keys(queries),
        suggestion: 'Prova: /api/cards?test=rootFields'
      });
    }

    console.log(`Running introspection test: ${testType}`);

    const headers = {
      'Content-Type': 'application/json',
    };

    // Usa API key per test autenticati
    if (SORARE_API_KEY && (testType === 'currentUserTest' || testType === 'apiKeyTest')) {
      headers['APIKEY'] = SORARE_API_KEY;
      console.log('Using API key for authenticated query');
    }

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: selectedQuery
      })
    });

    const responseText = await response.text();
    console.log(`Response for ${testType}:`, responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `HTTP ${response.status}`,
        responseText: responseText,
        test: testType
      });
    }

    const data = JSON.parse(responseText);

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL errors',
        details: data.errors,
        test: testType,
        hint: testType.includes('currentUser') ? 'Potrebbe servire autenticazione diversa' : 'Schema introspection bloccata'
      });
    }

    // Se è rootFields, mostra i campi disponibili in modo leggibile
    if (testType === 'rootFields' && data.data?.__type?.fields) {
      const fields = data.data.__type.fields.map(field => field.name).sort();
      return res.status(200).json({
        success: true,
        message: '✅ Campi root disponibili nell\'API Sorare:',
        availableFields: fields,
        totalFields: fields.length,
        suggestion: 'Ora prova: /api/cards?test=currentUserTest'
      });
    }

    // Se currentUser funziona, è un grande passo avanti
    if (testType.includes('currentUser') && data.data?.currentUser) {
      return res.status(200).json({
        success: true,
        message: '🎉 CurrentUser funziona! API Key valida!',
        userData: data.data.currentUser,
        nextStep: 'Ora possiamo cercare i campi NBA cards',
        test: testType
      });
    }

    res.status(200).json({
      success: true,
      data: data.data,
      message: `✅ Test ${testType} completato!`,
      test: testType
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Errore test',
      message: error.message
    });
  }
}
