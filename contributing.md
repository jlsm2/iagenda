## 🚀 Como colaborar

1. Crie uma branch com um nome apropriado (ver convenções abaixo).
2. Faça suas alterações localmente.
3. Abra um **Pull Request (PR)** com as modificações desejadas.

---

## Convenções de Branches

Use o padrão:

Exemplos:
- `feature/adicionar-tarefas-flexiveis`
- `fix/erro-geracao-rotina`
- `refactor/limpeza-codigo-rotina`

Tipos recomendados:
- `feature` – nova funcionalidade
- `fix` – correção de bug
- `refactor` – refatoração
- `docs` – alterações em documentação
- `test` – adição ou alteração em testes

---

## 💬 Mensagens de Commit

Formato sugerido:
Exemplos:
- `feat: adicionar suporte a atividades desejadas`
- `fix: corrigir bug de horário sobreposto`
- `refactor: separar lógica de geração em serviço`

---

## 🔍 Revisão de Código

- Revise com atenção se o PR altera funcionalidades críticas.
- Teste localmente sempre que possível.
- Evite aprovar PRs com código comentado, console.log desnecessários ou commits não organizados.

---

## Rodando o Projeto Localmente

1. **Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/)** na sua máquina.
2. Certifique-se de que o Docker esteja aberto e rodando.
3. Na raiz do projeto, execute:

```bash
docker-compose up --build
