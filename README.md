
# iAgenda

Este projeto é composto por um frontend em Angular e um backend em Node.js com o framework NestJS.

## 🚀 Deploy

O deploy da aplicação está disponível no seguinte link:
[https://iagenda-nine.vercel.app/](https://iagenda-nine.vercel.app/)

## 📦 Estrutura do Projeto

O projeto está organizado em duas pastas principais:

* **/frontend/**: Contém o projeto em Angular.
* **/backend/**: Contém o projeto em NestJS.

## 🧭 Requisitos

Para executar este projeto localmente, você precisará ter instalado:

* **Node.js** (versão recomendada pelos arquivos do projeto)
* **npm** ou **Yarn**
* **Angular CLI**
* **Docker** e **Docker Compose**

## 🔧 Como Usar (Com Docker)

A maneira mais simples de executar o projeto é utilizando Docker.

1.  **Clonar o Repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <nome-do-repositorio>
    ```

2.  **Iniciar os Contêineres:**
    Na raiz do projeto, com o Docker em execução, rode o comando:
    ```bash
    docker-compose up --build
    ```
    Este comando irá construir as imagens do frontend e do backend, instalar todas as dependências e iniciar os serviços.

    * O frontend estará acessível em: `http://localhost:4200`
    * O backend estará acessível em: `http://localhost:3000`

## 🖥️ Frontend (Angular 17)

O frontend é construído com Angular 17.

### Gerar Componentes

Para gerar novos componentes ou outros artefatos do Angular, utilize o Angular CLI:

```bash
ng generate component nome-do-componente
````

### Build para Produção

Para compilar o projeto para produção:

```bash
ng build
```

Os arquivos compilados serão gerados no diretório `dist/`.

## ⚙️ Backend (NestJS 10)

O backend é construído com NestJS, utilizando TypeScript.

### Principais Tecnologias

  * **Framework:** NestJS 10
  * **Banco de Dados:** PostgreSQL
  * **ORM:** TypeORM
  * **Autenticação:** JWT (JSON Web Tokens)
  * **Documentação da API:** Swagger (OpenAPI)

### Testes

Para rodar os testes unitários e de cobertura do backend:

1.  Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
2.  Instale as dependências (se ainda não o fez):
    ```bash
    npm install
    ```
3.  Execute os testes:
    ```bash
    # Para rodar os testes unitários
    npm test

    # Para gerar o relatório de cobertura de testes
    npm run test:cov
    ```

### Documentação da API (Swagger)

A documentação interativa da API está disponível via Swagger. Com o backend em execução, acesse:
`http://localhost:3000/api`

## 📄 Licença

Este projeto está licenciado sob os termos da MIT License.

```
```