const express = require('express');
const { scrapeLenovoLaptops } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir CORS (caso o frontend esteja em outro domínio)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Rota principal que retorna os produtos em JSON
app.get('/api/lenovo', async (req, res) => {
  try {
    const products = await scrapeLenovoLaptops();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('[api] Erro ao extrair produtos:', error.message);
    res.status(500).json({
      success: false,
      error: 'Falha ao obter os produtos Lenovo.',
      details: error.message,
    });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`[server] API rodando em http://localhost:${PORT}`);
  console.log(`[server] Endpoint: http://localhost:${PORT}/api/lenovo`);
});