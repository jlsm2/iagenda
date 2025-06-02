iAgenda
Este projeto é composto por um frontend Angular 20 e um backend em Node.js usando o NestJS.

📦 Estrutura do Projeto
O projeto está organizado da seguinte forma:

/
├── frontend/   # Projeto Angular
└── backend/    # Projeto NestJS

🧭 Requisitos
Para executar este projeto, você precisará ter instalado:

Node.js 18+

npm 9+

Angular CLI 20

Um banco de dados configurado (PostgreSQL, Oracle, etc., dependendo da configuração do backend)

Docker (opcional, para facilitar a configuração do ambiente)

🔧 Como Usar
Siga os passos abaixo para configurar e executar o projeto localmente.

1. Clonar o Repositório
Primeiro, clone o repositório para sua máquina local:

git clone <url-do-repositorio>
cd <nome-do-repositorio>

2. Instalar Dependências
Navegue para cada pasta (frontend e backend) e instale as respectivas dependências.

Frontend (Angular):

cd frontend
npm install

Backend (NestJS):

cd backend
npm install

🌐 Frontend (Angular)
Esta aplicação frontend foi gerada utilizando Angular CLI versão 20.0.0.

📦 Principais Bibliotecas e Conceitos
Angular Standalone Components

Angular Forms / ReactiveForms

Angular Router

RxJS

HttpClient para comunicação com a API

🚀 Servidor de Desenvolvimento
Para iniciar o servidor de desenvolvimento do frontend:

cd frontend
ng serve

Após iniciar, acesse a aplicação no seu navegador em: http://localhost:4200.
A aplicação será recarregada automaticamente sempre que você salvar alterações nos arquivos.

🛠️ Gerar Componentes e Outros Artefatos
Para gerar novos componentes ou outros artefatos Angular via CLI:

ng generate component nome-do-componente

Para visualizar todas as opções de geração:

ng generate --help

🏗️ Build para Produção
Para compilar o projeto para produção:

ng build

Os arquivos compilados serão gerados no diretório dist/.

🧪 Testes
Testes Unitários:

ng test

Testes End-to-End (E2E):

ng e2e

⚠️ Nota: O Angular CLI não inclui um framework de E2E por padrão a partir de versões mais recentes. Você pode integrar ferramentas como Cypress ou Playwright para testes E2E.

📚 Recursos Úteis do Angular
Documentação Oficial do Angular

Referência da Angular CLI

🖥️ Backend (NestJS)
O backend é construído com NestJS, um framework modular, robusto e altamente escalável para Node.js, utilizando TypeScript.

📦 Principais Bibliotecas e Conceitos
@nestjs/core e outros módulos fundamentais do NestJS

ORM (Object-Relational Mapper) como TypeORM, Prisma, ou Sequelize (verifique a implementação específica do projeto)

Autenticação via JWT (JSON Web Tokens)

Multer para upload de arquivos

class-validator e class-transformer para validação e transformação de dados de entrada (DTOs)

Swagger (OpenAPI) para documentação interativa da API

🚀 Servidor de Desenvolvimento
Para iniciar o servidor de desenvolvimento do backend:

cd backend
npm run start:dev

Por padrão, o servidor NestJS estará acessível em: http://localhost:3000.

🔒 Autenticação
A autenticação da API é realizada utilizando JWT. Após um login bem-sucedido, o cliente recebe um token de acesso. Este token deve ser incluído no cabeçalho Authorization de todas as requisições para endpoints protegidos:

Authorization: Bearer <seu-token-jwt>

📁 Upload de Arquivos
O backend suporta o upload de diversos tipos de arquivos, incluindo PDFs e arquivos geoespaciais como KMZ, KML e arquivos SHP (geralmente enviados como um arquivo ZIP). A biblioteca Multer é utilizada para gerenciar o upload. Os arquivos são tipicamente salvos localmente no servidor e suas informações (como caminho e metadados) são relacionadas a entidades no banco de dados.

🧪 Testes
Testes Unitários:

npm run test

Testes End-to-End (E2E):

npm run test:e2e

📚 Documentação da API (Swagger)
Se a documentação da API via Swagger estiver habilitada e configurada no projeto, você geralmente pode acessá-la em:

http://localhost:3000/api (ou o caminho configurado para o Swagger UI).

📄 Licença
Este projeto está licenciado sob os termos da MIT License.
