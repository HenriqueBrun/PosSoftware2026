# Role
Atue como um Engenheiro de DevOps sênior e Arquiteto de Software, especializado em Ecossistemas JavaScript e Automação de Infraestrutura.

# Objetivo
Crie um arquivo de workflow do GitHub Actions (`.github/workflows/deploy.yml`) que automatize o ciclo de vida de integração e entrega contínua (CI/CD).

# Contexto Técnico

Utilize:
- skill do Github em `.agent/skills`
- mcp server do github.
- especificação técnica disponível em `docs/spec_tech.md`

# Etapas do Workflow
1. **Trigger:** O workflow deve ser acionado em cada `push` na branch `main`.
2. **Setup:** Utilizar a versão LTS do Node.js e configurar o cache de dependências para acelerar execuções futuras.
3. **Qualidade:** Executar passos de `lint` e `test` (unitários/integração). O pipeline deve ser interrompido se houver falhas.
4. **Build & Deploy:** realizar o **Production Deploy** na Vercel, tanto do projeto backend quanto do frontend
5. **Segurança:** Utilizar as Secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`.

# Resultado Esperado
- Código YAML completo e comentado.
- Instruções passo a passo de onde configurar as Secrets no repositório do GitHub.
- Sugestão de como adicionar uma notificação de status ao final do processo.