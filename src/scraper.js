const cheerio = require('cheerio');
const browserClient = require('./tls-client');

const BASE_URL = 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops';

async function scrapeLenovoLaptops() {
  console.log(`[scraper] Acessando ${BASE_URL} ...`);
  const { data: html } = await browserClient.get(BASE_URL);
  const $ = cheerio.load(html);

  const products = [];

  $('.thumbnail').each((i, el) => {
    const $el = $(el);
    const titleEl = $el.find('.title');
    const name = (titleEl.attr('title') || titleEl.text() || '').trim();

    // FILTRO: aceita "lenovo" ou "thinkpad" (todos ThinkPads são Lenovo)
    const lowerName = name.toLowerCase();
    if (!lowerName.includes('lenovo') && !lowerName.includes('thinkpad')) return;

    // Preço
    const priceText = $el.find('.price').text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    // Descrição
    const description = $el.find('.description').text().trim();

    // Avaliação (estrelas)
    const ratingEl = $el.find('[data-rating]');
    const rating = ratingEl.length ? parseInt(ratingEl.attr('data-rating'), 10) : null;

    // Número de reviews
    const reviewText = $el.find('.ratings p.pull-right').text().trim();
    const reviewCount = parseInt(reviewText.replace(/[^0-9]/g, ''), 10) || 0;

    // Link do produto
    const href = titleEl.attr('href');
    const link = href ? `https://webscraper.io${href}` : BASE_URL;

    // Captura argumentos adicionais (HDD, RAM etc.) presentes na descrição
    const specifications = description;

    products.push({
      name,
      price,
      description,
      rating,
      reviewCount,
      link,
      specifications,   // campo extra com as especificações
    });
  });

  // Ordenação por preço (ascendente)
  products.sort((a, b) => a.price - b.price);

  console.log(`[scraper] ${products.length} produto(s) Lenovo encontrado(s).`);
  return products;
}

module.exports = { scrapeLenovoLaptops };