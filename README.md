# WebScraper Lenovo — API REST

API RESTful em Node.js que extrai notebooks da marca Lenovo do site de testes [webscraper.io](https://webscraper.io/test-sites/e-commerce/static/computers/laptops), percorrendo todas as páginas do catálogo, e os expõe em formato JSON ordenados do mais barato para o mais caro.

---

## Como rodar

**Pré-requisitos:** Node.js 18 ou superior.

```bash
# 1. Clone o repositório
git clone https://github.com/BRUNOTGTH19/webscraper-lenovo.git
cd webscraper-lenovo

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

O servidor sobe em `http://localhost:3000` por padrão.  
Para usar outra porta: `PORT=8080 npm start`

---

## Endpoints

### `GET /api/lenovo`
Retorna todos os notebooks Lenovo encontrados em todas as páginas do catálogo, ordenados por preço (crescente).

**Exemplo de resposta:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "name": "ThinkPad T540p",
      "price": 1178.99,
      "description": "15.6\", Core i5-4200M, 4GB, 500GB, Win7 Pro 64bit",
      "rating": 1,
      "reviewCount": 2,
      "link": "https://webscraper.io/test-sites/e-commerce/static/product/33"
    },
    {
      "name": "ThinkPad X240",
      "price": 1311.99,
      "description": "12.5\", Core i5-4300U, 8GB, 240GB SSD, Win7 Pro 64bit",
      "rating": 3,
      "reviewCount": 12,
      "link": "https://webscraper.io/test-sites/e-commerce/static/product/35"
    }
  ]
}
```

### `GET /health`
Health check da API.

```json
{ "status": "ok", "timestamp": "2026-05-15T12:00:00.000Z" }
```

---

## Estrutura do projeto

```
src/
  index.js        # Servidor Express e definição das rotas
  scraper.js      # Lógica de scraping, paginação e extração dos dados
  tls-client.js   # Cliente HTTP com fingerprint TLS (bônus)
```

---

## Decisões técnicas

### Node.js
Escolhido por ter ecossistema maduro para scraping (cheerio, axios), sintaxe assíncrona natural com async/await e facilidade para expor APIs REST com Express.

### cheerio
Parser HTML leve e com API no estilo jQuery — ideal para scraping de páginas estáticas como o site alvo, onde o conteúdo já está no HTML inicial sem depender de JavaScript. Alternativas como `node-html-parser` foram descartadas por ter seletores menos expressivos.

### axios
Cliente HTTP simples e amplamente testado, usado como fallback quando o cliente TLS não está disponível.

### express
Framework minimalista para expor a API REST. Suficiente para o escopo do projeto sem overhead desnecessário.

### node-tls-client (bônus)
Permite imitar o fingerprint TLS/JA3/HTTP2 de um navegador real (Chrome 120), dificultando a detecção do crawler por sistemas anti-bot. A biblioteca é carregada com `try/catch` — se não estiver disponível no ambiente, o sistema faz fallback automático para axios sem quebrar.

### Extração do rating
O site webscraper.io codifica o rating via atributo `data-rating="X"` num elemento `<p>` dentro do bloco `.ratings`. O seletor `.ratings p[data-rating]` captura esse atributo diretamente, retornando um inteiro de 1 a 5.

### Extração do reviewCount
O número de reviews está em `<span itemprop="reviewCount">` dentro do bloco `.ratings .review-count`. O seletor extrai esse valor diretamente do marcador semântico do Schema.org presente na página.

### Paginação
O catálogo tem 20 páginas. O scraper percorre todas elas detectando o link `rel="next"` na paginação. Um delay de 500ms é aplicado entre cada página para não sobrecarregar o servidor. Isso garante que nenhum produto Lenovo seja perdido.

### Retry com backoff
A função `fetchWithRetry` tenta até 3 vezes com delay crescente (1s, 2s, 3s) em caso de falhas de rede ou respostas 429/5xx, tornando o scraper resiliente em ambientes instáveis.

### Filtro Lenovo
O filtro aceita tanto `"lenovo"` quanto `"thinkpad"` no nome do produto, já que todos os ThinkPads são fabricados pela Lenovo e o site os lista sem o prefixo da marca em alguns casos.