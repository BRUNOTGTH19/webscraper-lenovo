@"
# WebScraper Lenovo — API REST

API RESTful em Node.js que extrai notebooks da marca Lenovo do site de testes [webscraper.io](https://webscraper.io/test-sites/e-commerce/static/computers/laptops), percorrendo todas as páginas do catálogo, e os expõe em formato JSON ordenados do mais barato para o mais caro.

---

## Como rodar

**Pré-requisitos:** Node.js 18 ou superior.

``````bash
git clone https://github.com/BRUNOTGTH19/webscraper-lenovo.git
cd webscraper-lenovo
npm install
npm start
``````

O servidor sobe em ``http://localhost:3000`` por padrão.
Para usar outra porta: ``PORT=8080 npm start``

---

## Endpoints

### GET /api/lenovo
Retorna todos os notebooks Lenovo encontrados em todas as páginas, ordenados por preço (crescente).

### GET /health
Health check da API. Retorna ``{ "status": "ok", "timestamp": "..." }``

---

## Estrutura do projeto
src/
index.js        # Servidor Express e definição das rotas
scraper.js      # Lógica de scraping, paginação e extração dos dados
tls-client.js   # Cliente HTTP com fingerprint TLS (bônus)

---

## Decisões técnicas

- **Node.js**: ecossistema maduro para scraping com async/await natural e fácil exposição de APIs REST.
- **cheerio**: parser HTML leve com API jQuery — ideal para páginas estáticas onde o conteúdo já está no HTML inicial.
- **axios**: cliente HTTP simples usado como fallback quando o cliente TLS não está disponível.
- **express**: framework minimalista suficiente para o escopo do projeto.
- **node-tls-client (bônus)**: imita fingerprint TLS/JA3/HTTP2 do Chrome 120. Carregado com try/catch — fallback automático para axios se indisponível.
- **Extração do rating**: o site usa atributo ``data-rating="X"`` num ``<p>`` dentro de ``.ratings``. Seletor ``.ratings p[data-rating]`` captura o valor diretamente.
- **Extração do reviewCount**: valor em ``<span itemprop="reviewCount">`` dentro de ``.ratings .review-count``.
- **Paginação**: o catálogo tem 20 páginas. O scraper percorre todas detectando ``rel="next"`` na paginação, com delay de 500ms entre páginas.
- **Retry com backoff**: até 3 tentativas com delay crescente (1s, 2s, 3s) para falhas de rede ou respostas 429/5xx.
- **Filtro Lenovo**: aceita ``lenovo`` ou ``thinkpad`` no nome, já que ThinkPads são Lenovo e nem sempre aparecem com o prefixo da marca.
"@ | Out-File -Encoding utf8 README.md

git add README.md
git status
``````