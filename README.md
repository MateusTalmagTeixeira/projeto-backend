# <div align="center">

# 🚀 Digital Store - API Back-End

API RESTful robusta e escalável desenvolvida para o ecossistema de e-commerce da **Digital Store**.
Projetada com arquitetura limpa, segurança integrada e rotas padronizadas para alta performance.

[![Status: Online](https://img.shields.io/badge/Status-Online-success?style=for-the-badge)]()
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=nodedotjs)]()
[![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)]()
[![MySQL](https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql)]()

</div>

---

## 🛠️ Tecnologias & Ferramentas

* **Runtime:** `Node.js` & `Express.js`
* **Banco de Dados & ORM:** `MySQL` & `Sequelize ORM`
* **Autenticação & Segurança:** `JWT (JSON Web Token)` & `Bcrypt`
* **Testes Automatizados:** `Jest` & `Supertest`

---

## ⚙️ Configuração e Execução Local

Siga os passos abaixo para rodar o ambiente de desenvolvimento em sua máquina:

1. **Clone o repositório e acesse a pasta:**
   ```bash
   git clone <url-do-repositorio>
   cd projeto-backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Duplique o arquivo de exemplo e preencha com as credenciais do seu banco de dados MySQL:
   ```bash
   cp .env.example .env
   ```

4. **Crie o banco de dados local:**
   ```sql
   CREATE DATABASE digital_store;
   ```

5. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

6. **Execute a camada de testes automatizados:**
   ```bash
   npm test
   ```

---

## 🔌 Endpoints Principais da API

### 👤 Usuários
* `POST /v1/user` — Cadastro de novo usuário
* `POST /v1/user/token` — Autenticação e geração de token JWT
* `GET /v1/user/:id` — Consulta de dados do usuário
* `PUT /v1/user/:id` — Atualização cadastral
* `DELETE /v1/user/:id` — Exclusão de conta

### 🏷️ Categorias
* `GET /v1/category/search` — Busca avançada de categorias
* `GET /v1/category/:id` — Detalhes por ID
* `POST /v1/category` — Cadastro de categoria *(Admin)*
* `PUT /v1/category/:id` — Atualização de categoria *(Admin)*
* `DELETE /v1/category/:id` — Remoção de categoria *(Admin)*

### 📦 Produtos
* `GET /v1/product/search` — Listagem e filtros de produtos
* `GET /v1/product/:id` — Detalhes completos do produto
* `POST /v1/product` — Cadastro de novo produto *(Admin)*
* `PUT /v1/product/:id` — Atualização de produto *(Admin)*
* `DELETE /v1/product/:id` — Remoção de produto *(Admin)*

---

## 👥 Autoria e Equipe

<<<<<<< HEAD
Projeto desenvolvido de forma colaborativa para a entrega institucional, unindo rigor técnico, boas práticas de API REST e componentização back-end de mercado.

---

## 👥 Colaboração & Engenharia

Projeto desenvolvido com foco em arquitetura limpa, segurança e boas práticas de engenharia de software:

* **Desenvolvimento & Arquitetura:** Larissa Talmag
* **Code Review & Pair Programming:** Mateus Talmag

- **Revisão Técnica & Testes da API:** Validado por Mateus Talmag.
=======
Projeto desenvolvido de forma colaborativa em dupla (**Larissa Talmag** e **Mateus Talmag**) para a entrega institucional, com atuação conjunta em todas as etapas da API RESTful, arquitetura, banco de dados, segurança, testes e documentação:

* **Arquitetura da API & Organização (MVC / Camadas):** Larissa Talmag & Mateus Talmag
* **Desenvolvimento Back-End, Rotas & Regras de Negócio:** Larissa Talmag & Mateus Talmag
* **Banco de Dados, Modelagem & Migrations (MySQL / Sequelize):** Larissa Talmag & Mateus Talmag
* **Autenticação, Segurança & Tratamento de Erros (JWT / Bcrypt):** Larissa Talmag & Mateus Talmag
* **Testes Automatizados, Code Review & Documentação (Swagger / README):** Larissa Talmag & Mateus Talmag
>>>>>>> 3112730 (docs: unifica autoria conjunta da dupla no README)
