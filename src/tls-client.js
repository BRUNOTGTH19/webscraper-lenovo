const axios = require('axios');

let tlsClient;
let usingTLS = false;

try {
  tlsClient = require('node-tls-client');
  usingTLS = true;
} catch (e) {
  console.warn('[tls-client] node-tls-client não disponível, usando axios comum.');
}

const browserClient = {
  async get(url) {
    if (usingTLS) {
      try {
        await tlsClient.initTLS();
        const session = new tlsClient.Session({
          clientIdentifier: tlsClient.ClientIdentifier.chrome_120,
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        });

        console.log('[tls-client] ✅ Usando fingerprint TLS do Chrome 120 (bônus ativado).');
        const response = await session.get(url);
        const body = await response.text();
        await session.close();
        await tlsClient.destroyTLS();
        return { data: body, status: response.status, headers: response.headers };
      } catch (err) {
        console.warn('[tls-client] Falha ao usar node-tls-client, utilizando fallback axios:', err.message);
        // cai propositalmente no fallback abaixo
      }
    }

    // Fallback com axios
    console.log('[tls-client] ⚠️ Usando axios (fingerprint não ativa).');
    const { data, status, headers } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
    });
    return { data, status, headers };
  },
};

module.exports = browserClient;