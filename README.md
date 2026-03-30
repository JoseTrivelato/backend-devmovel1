#  Backend - Projeto DevMóvel

Este é o backend do projeto de Desenvolvimento Móvel. Trata-se de uma API RESTful completa (CRUD) construída para gerenciar o cadastro de usuários.

## Tecnologias Utilizadas
* **Node.js** com **Express**
* **PostgreSQL** (rodando em contêiner Docker)
* **CORS** (para permitir a comunicação com o Flutter)
* **Swagger** (para documentação da API)

## Rotas da API
* `GET /usuarios` - Lista todos os usuários cadastrados.
* `POST /usuarios` - Cria um novo usuário.
* `PUT /usuarios/:id` - Atualiza os dados de um usuário existente.
* `DELETE /usuarios/:id` - Remove um usuário do banco de dados.

## Como rodar o projeto localmente
1. Clone este repositório.
2. Abra o terminal na pasta do projeto e rode `npm install` para instalar as dependências.
3. Suba o banco de dados rodando `docker compose up -d`.
4. Inicie o servidor com o comando `node app.js`.
5. O servidor estará rodando em `http://localhost:3000`.
