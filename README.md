@"
# WebScraper Lenovo - API REST

API RESTful que extrai notebooks da marca Lenovo do site de testes
[webscraper.io](https://webscraper.io/test-sites/e-commerce/static/computers/laptops)
e os expõe em formato JSON, ordenados do mais barato para o mais caro.

## Funcionalidades

- Extrai todos os campos disponíveis: nome, preço, descrição, avaliação (rating), número de reviews e link para o produto.
- Ordena os produtos por preço (ascendente).
- **Bônus**: Utiliza cliente HTTP com fingerprint TLS/JA3/HTTP2 de navegador real (Chrome 120), através da biblioteca `node-tls-client`, com fallback automático para `axios` caso a biblioteca nativa não esteja disponível.

## Exemplo de resposta

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
      "reviewCount": 0,
      "link": "https://webscraper.io/test-sites/e-commerce/static/product/33",
      "specifications": "15.6\", Core i5-4200M, 4GB, 500GB, Win7 Pro 64bit"
    },
    {
      "name": "ThinkPad X240",
      "price": 1311.99,
      "description": "12.5\", Core i5-4300U, 8GB, 240GB SSD, Win7 Pro 64bit",
      "rating": 3,
      "reviewCount": 0,
      "link": "https://webscraper.io/test-sites/e-commerce/static/product/35",
      "specifications": "12.5\", Core i5-4300U, 8GB, 240GB SSD, Win7 Pro 64bit"
    }
  ]
}