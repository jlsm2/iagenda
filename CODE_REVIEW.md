# Processo de Code Review

Este documento estabelece as regras para a revisão de código.

## 1. Quem Revisa?

Todo Pull Reques deve ser revisado e aprovado por uma pessoa da equipe antes de ser integrado à branch principal. O autor do PR não deve aprovar o seu próprio PR.

## 2. Como Escolher o Revisor?

O processo de escolha do revisor segue duas etapas:

1.  Voluntariado: Após a criação do PR, o autor deve notificar a equipe e aguardar que um revisor se voluntarie para analisar o código.
2.  Indicação: Se nenhum revisor se voluntariar dentro de um período razoável, o autor do PR deve indicar um revisor, mencionando-o diretamente nos comentários do PR e no canal de comunicação.

## 3. Critérios de Verificação

O revisor deve focar nos critérios abaixo para garantir a qualidade do código:

* Legibilidade: O código é claro e fácil de entender? As variáveis e funções tem bons nomes?
* Boas Práticas: O código segue a arquitetura definida para o projeto? Foram removidos códigos comentados e console.log de depuração?
* Testes: A nova funcionalidade está coberta pelos testes? Todos os testes existentes e novos passam com sucesso?

## 4. Padrão de Comentários

Para manter a comunicação clara e objetiva, usaremos um padrão simples:

* [OBRIGATÓRIO]: Usado para apontar um problema que precisa ser corrigido antes da aprovação.
    * Exemplo: `[OBRIGATÓRIO] A validação de e-mail está a falhar para e-mails com subdomínios.`

* [SUGESTÃO]: Uma ideia para melhorar o código, mas que não impede a aprovação do PR. A decisão de aplicar a sugestão é do autor.
    * Exemplo: `[SUGESTÃO] Talvez pudéssemos extrair esta lógica para uma função auxiliar para reutilizá-la depois.`

* [DÚVIDA]: Usado quando o revisor não entendeu uma parte do código.
    * Exemplo: `[DÚVIDA] Não entendi por que esta variável precisa ser pública. Poderia me explicar o motivo?`

## 5. Condições para Aprovação

Um PR pode ser aprovado e integrado à main quando as seguintes condições forem atendidas:

1.  Receber a aprovação de um revisor da equipe.
2.  Todos os comentários marcados como [OBRIGATÓRIO] devem ter sido resolvidos pelo autor.
3.  Todos os testes automatizados devem passar com sucesso.
