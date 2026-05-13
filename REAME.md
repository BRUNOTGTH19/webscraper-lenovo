# WebScraper Lenovo - API REST

API RESTful que extrai notebooks da marca Lenovo do site de testes
[webscraper.io](https://webscraper.io/test-sites/e-commerce/static/computers/laptops)
e os expõe em formato JSON, ordenados do mais barato para o mais caro.

## Funcionalidades

- Extrai todos os campos disponíveis: nome, preço, descrição, avaliação, número de reviews e link.
- Ordena os produtos por preço (ascendente).
- **Bônus**: Utiliza cliente HTTP com fingerprint TLS/JA3/HTTP2 de navegador real
  (biblioteca `tls-client`) para evitar bloqueios por fingerprint.

## Tecnologias utilizadas

- **Node.js** – Plataforma de execução JavaScript.
- **Express** – Framework web minimalista para criação da API.
- **cheerio** – Parser HTML que implementa o núcleo do jQuery para Node.js.
- **tls-client** – Cliente HTTP que imita assinaturas TLS/JA3/HTTP2 de navegadores reais.

## Decisões técnicas

### 1. Node.js + Express

Optei por Node.js por ser a stack mais comum em projetos de web scraping e por sua
excelente performance em I/O não bloqueante. O Express foi escolhido por ser leve,
amplamente adotado e oferecer uma API simples para definir rotas.

### 2. Cheerio para parsing HTML

O site de testes é estático (HTML renderizado no servidor), portanto não há
necessidade de um navegador headless. Com o Cheerio, o HTML é analisado rapidamente
e o código de extração fica limpo e legível, similar a seletores jQuery.

### 3. Cliente HTTP com fingerprint TLS (bônus)

Para atender o requisito bônus, utilizei a biblioteca `tls-client`, que permite
especificar um `clientIdentifier` correspondente a um navegador real (Chrome 120).
Isso gera uma assinatura TLS/JA3 autêntica, reduzindo drasticamente a chance de
bloqueio por sistemas anti-bot.

### 4. Separação de responsabilidades

O código está dividido em três módulos:

- `tls-client.js` – Configuração do cliente HTTP com fingerprint.
- `scraper.js` – Lógica de extração e ordenação dos produtos.
- `index.js` – Inicialização do servidor Express e definição da rota.

Essa separação facilita a manutenção, testes unitários e reutilização.

### 5. Tratamento de erros

A rota `/api/lenovo` captura exceções e retorna um JSON com a mensagem de erro,
permitindo que o consumidor da API trate falhas adequadamente.

## Como executar

### Pré-requisitos

- Node.js 18+ e npm 9+

### Instalação

```bash
# Clone o repositório (ou copie os arquivos para uma pasta)
cd webscraper-lenovo

# Instale as dependências
npm install