# Digital Store - API Back-end

API RESTful desenvolvida em Node.js, Express, Sequelize e MySQL para o projeto final de Back-end da Digital College.

## Tecnologias
- Node.js & Express.js
- MySQL & Sequelize ORM
- JWT & Bcrypt
- Jest & Supertest

## Setup e Execução
1. Instale as dependências: `npm install`
2. Duplique `.env.example` para `.env` e configure o seu MySQL.
3. Crie o banco no MySQL: `CREATE DATABASE digital_store;`
4. Inicie o servidor: `npm run dev`
5. Rode os testes automatizados: `npm test`

## Endpoints Principais
- **Usuários:** `POST /v1/user`, `POST /v1/user/token`, `GET /v1/user/:id`, `PUT /v1/user/:id`, `DELETE /v1/user/:id`
- **Categorias:** `GET /v1/category/search`, `GET /v1/category/:id`, `POST /v1/category`, `PUT /v1/category/:id`, `DELETE /v1/category/:id`
- **Produtos:** `GET /v1/product/search`, `GET /v1/product/:id`, `POST /v1/product`, `PUT /v1/product/:id`, `DELETE /v1/product/:id`
