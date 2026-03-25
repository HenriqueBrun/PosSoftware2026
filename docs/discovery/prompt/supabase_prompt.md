# Prompt: Setup de Projeto e Banco de Dados via Supabase MCP

## Contexto
Este prompt deve ser utilizado pelo **Google Antigravity** para automatizar a criação de infraestrutura de banco de dados no Supabase, garantindo que o schema siga rigorosamente a documentação técnica do projeto.

---

## Instruções de Execução

**Atue como um Engenheiro de Dados utilizando o MCP server do Supabase e a skill `.agent/skills/supabase`. Realize as seguintes tarefas em ordem:**

1.  **Análise de Contexto:** * Leia o arquivo `docs/spec_tech.md` para extrair a definição completa do schema (tabelas, colunas, tipos, chaves estrangeiras e constraints).
2.  **Criação do Projeto:** * Use o     projeto de banco de dados existente chamado `pills` dentro da organização `cqhmektealamvgdmtcwn`.
3.  **Provisionamento de Tabelas:** * Implemente o banco de dados seguindo rigorosamente as especificações extraídas no passo 1.
4.  **Massa de Teste:** * Insira dados fictícios coerentes para permitir a validação imediata da aplicação.
5.  **Limpeza de Resíduos:** * Certifique-se de que o ambiente final esteja limpo de quaisquer dados de exemplo ou configurações temporárias que não constem na especificação original, mantendo apenas os dados de teste solicitados para a aplicação.

---

> **Nota:** Certifique-se de que as orientações necessárias mencionadas em `docs/spec_tech.md` sejam aplicadas durante o provisionamento.