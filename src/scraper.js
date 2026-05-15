const cheerio = require('cheerio');
const browserClient = require('./tls-client');

const BASE_URL = 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops';
const MAX_RETRIES = 3;

/**
 * Realiza a requisição HTTP com retry e backoff em caso de falha de rede
 * ou respostas de erro transitórias (429, 5xx).
 */
async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`[scraper] Tentativa ${attempt} de ${retries}: ${url}`);
      const result = await browserClient.get(url);

      if (result.status === 429 || result.status >= 500) {
        const delay = 1000 * attempt;
        console.warn(`[scraper] Status ${result.status} — aguardando ${delay}ms antes de retry.`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      return result;
    } catch (err) {
      console.error(`[scraper] Erro na tentativa ${attempt}: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error(`Falha após ${retries} tentativas para: ${url}`);
}

/**
 * Extrai os produtos Lenovo de uma página já carregada.
 * O rating usa o atributo data-rating="X" presente no <p> dentro de .ratings.
 * O reviewCount usa o <span itemprop="reviewCount"> dentro de .review-count.
 */
function extractProducts($) {
  const products = [];

  $('.thumbnail').each((i, el) => {
    const $el = $(el);
    const titleEl = $el.find('a.title');
    const name = (titleEl.attr('title') || titleEl.text() || '').trim();

    // Filtro: aceita "lenovo" ou "thinkpad" (todos ThinkPads são Lenovo)
    const lowerName = name.toLowerCase();
    if (!lowerName.includes('lenovo') && !lowerName.includes('thinkpad')) return;

    // Preço — remove símbolo de moeda e converte para float
    const priceText = $el.find('.price').text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    // Descrição
    const description = $el.find('.description').text().trim();

    // Rating — atributo data-rating="X" no <p> dentro de .ratings
    const ratingEl = $el.find('.ratings p[data-rating]');
    const rating = ratingEl.length
      ? parseInt(ratingEl.attr('data-rating'), 10)
      : null;

    // Número de reviews — <span itemprop="reviewCount"> dentro de .review-count
    const reviewSpan = $el.find('.ratings .review-count span[itemprop="reviewCount"]');
    const reviewCount = reviewSpan.length
      ? parseInt(reviewSpan.text().trim(), 10) || 0
      : 0;

    // Link do produto
    const href = titleEl.attr('href');
    const link = href ? `https://webscraper.io${href}` : BASE_URL;

    products.push({ name, price, description, rating, reviewCount, link });
  });

  return products;
}

/**
 * Scrapa todos os notebooks Lenovo percorrendo todas as páginas de laptops,
 * retornando os produtos ordenados do mais barato para o mais caro.
 */
async function scrapeLenovoLaptops() {
  const allProducts = [];
  let page = 1;

  console.log(`[scraper] Iniciando coleta em todas as páginas...`);

  while (true) {
    const url = page === 1 ? BASE_URL : `${BASE_URL}?page=${page}`;
    const { data: html } = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const products = extractProducts($);
    allProducts.push(...products);

    console.log(`[scraper] Página ${page}: ${products.length} produto(s) Lenovo encontrado(s).`);

    // Verifica se existe próxima página
    const hasNextPage = $('.pagination a[rel="next"]').length > 0;
    if (!hasNextPage) break;

    page++;

    // Delay entre páginas para não sobrecarregar o servidor
    await new Promise(r => setTimeout(r, 500));
  }

  // Ordenação por preço (ascendente)
  allProducts.sort((a, b) => a.price - b.price);

  console.log(`[scraper] Total: ${allProducts.length} produto(s) Lenovo encontrado(s) em ${page} página(s).`);
  return allProducts;
}

module.exports = { scrapeLenovoLaptops };