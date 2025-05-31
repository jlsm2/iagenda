# iagenda# Projeto

Este projeto é composto por um **frontend Angular 20** e um **backend em Node.js usando o NestJS**.

---

## 📦 Estrutura do Projeto

/frontend # Projeto Angular
/backend # Projeto NestJS

yaml
Copiar
Editar

---

## 🧭 Requisitos

- Node.js 18+
- npm 9+
- Angular CLI 20
- Banco de dados configurado (PostgreSQL, Oracle, etc.)
- Docker (opcional)

---

## 🔧 Como usar

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-do-repositorio>
2. Instalar dependências
Frontend:
bash
Copiar
Editar
cd frontend
npm install
Backend:
bash
Copiar
Editar
cd backend
npm install
🌐 Frontend (Angular)
Este projeto foi gerado usando Angular CLI versão 20.0.0.

📦 Principais bibliotecas
Angular Standalone Components

Angular Forms / ReactiveForms

Angular Router

RxJS

HttpClient

🚀 Servidor de desenvolvimento
bash
Copiar
Editar
cd frontend
ng serve
Acesse no navegador: http://localhost:4200

A aplicação será recarregada automaticamente ao salvar os arquivos.

🛠️ Gerar componentes e outros artefatos
bash
Copiar
Editar
ng generate component nome-do-componente
Para mais opções:

bash
Copiar
Editar
ng generate --help
🏗️ Build
bash
Copiar
Editar
ng build
Os arquivos compilados serão gerados em dist/.

🧪 Testes
Testes unitários:

bash
Copiar
Editar
ng test
Testes e2e (caso configurado):

bash
Copiar
Editar
ng e2e
⚠️ O Angular CLI não inclui um framework e2e por padrão. Você pode usar Cypress ou Playwright.

📚 Recursos úteis
Documentação Angular

Angular CLI Reference

🖥️ Backend (NestJS)
O backend é construído com NestJS, um framework modular, robusto e altamente escalável para Node.js com TypeScript.

📦 Principais bibliotecas
@nestjs/core

TypeORM / Prisma / Sequelize (dependendo do ORM usado)

JWT (autenticação)

Multer (upload de arquivos)

Class-validator (validação de dados)

Swagger (documentação da API)

🚀 Servidor de desenvolvimento
bash
Copiar
Editar
cd backend
npm run start:dev
Acesse: http://localhost:3000

🔒 Autenticação
A autenticação é feita via JWT. Após login, inclua o token nas requisições protegidas:

makefile
Copiar
Editar
Authorization: Bearer <token>
📁 Upload de arquivos
O backend suporta upload de arquivos (PDFs, arquivos geoespaciais como KMZ/KML/SHP ZIP) usando Multer. Os arquivos são salvos localmente e relacionados a entidades no banco de dados.

🧪 Testes
Testes unitários:

bash
Copiar
Editar
npm run test
Testes end-to-end:

bash
Copiar
Editar
npm run test:e2e
📚 Documentação da API
Se habilitado com Swagger:

http://localhost:3000/api

📄 Licença
Este projeto está licenciado sob os termos da MIT License.