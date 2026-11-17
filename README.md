# 🚀 Digital Store - API Back-End

API RESTful robusta e escalável desenvolvida para o ecossistema de e-commerce da **Digital Store**. Projetada com arquitetura limpa, segurança integrada e rotas padronizadas para alta performance.

## 🛠️ Tecnologias & Ferramentas
- **Runtime:** Node.js & Express.js
- **Banco de Dados & ORM:** MySQL & Sequelize ORM
- **Autenticação & Segurança:** JWT (JSON Web Token) & Bcrypt
- **Testes Automatizados:** Jest & Supertest

## ⚙️ Configuração e Execução Local
Siga os passos abaixo para rodar o ambiente de desenvolvimento em sua máquina:
1. Clone o repositório e acesse a pasta:
   ```bash
   git clone <url-do-repositorio>
   cd projeto-backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Crie o banco de dados local:
   ```sql
   CREATE DATABASE digital_store;
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```
6. Execute a camada de testes automatizados:
   ```bash
   npm test
   ```

## 🔌 Endpoints Principais da API
### 👤 Usuários
- `POST /v1/user` — Cadastro de novo usuário
- `POST /v1/user/token` — Autenticação e geração de token JWT
- `GET /v1/user/:id` — Consulta de dados do usuário
- `PUT /v1/user/:id` — Atualização cadastral
- `DELETE /v1/user/:id` — Exclusão de conta

### 🏷️ Categorias
- `GET /v1/category/search` — Busca avançada de categorias
- `GET /v1/category/:id` — Detalhes por ID
- `POST /v1/category` — Cadastro de categoria (Admin)
- `PUT /v1/category/:id` — Atualização de categoria (Admin)
- `DELETE /v1/category/:id` — Remoção de categoria (Admin)

### 📦 Produtos
- `GET /v1/product/search` — Listagem e filtros de produtos
- `GET /v1/product/:id` — Detalhes completos do produto
- `POST /v1/product` — Cadastro de novo produto (Admin)
- `PUT /v1/product/:id` — Atualização de produto (Admin)
- `DELETE /v1/product/:id` — Remoção de produto (Admin)

## 👥 Autoria e Equipe
Projeto desenvolvido de forma colaborativa para a entrega institucional, unindo rigor técnico, boas práticas de API REST e componentização back-end de mercado.
