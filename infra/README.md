# 💊 Pills — Terraform Infrastructure as Code

Provisiona toda a infraestrutura de produção do projeto Pills com um único comando.

## Arquitetura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Clerk      │     │   Vercel     │     │  Supabase    │
│  (Auth)      │     │  (Hosting)   │     │ (PostgreSQL) │
│              │     │              │     │              │
│ Managed via  │     │ ┌──────────┐ │     │  sa-east-1   │
│  Dashboard   │────▶│ │ Frontend │ │────▶│  (São Paulo) │
│              │     │ │ Next.js  │ │     │              │
│              │     │ └──────────┘ │     │              │
│              │     │ ┌──────────┐ │     │              │
│              │────▶│ │ Backend  │ │────▶│              │
│              │     │ │ NestJS   │ │     │              │
│              │     │ └──────────┘ │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Pré-requisitos

1. **Terraform CLI** >= 1.5.0 — [Instalar](https://developer.hashicorp.com/terraform/install)
2. **Tokens de API:**
   - Vercel API Token → [vercel.com/account/settings/tokens](https://vercel.com/account/settings/tokens)
   - Supabase Access Token → [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
   - Clerk Keys → [dashboard.clerk.com](https://dashboard.clerk.com)
3. **Vercel GitHub Integration** instalada no repositório

## Quick Start

### 1. Configurar variáveis

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com seus tokens REAIS
```

### 2. Inicializar

```bash
terraform init
```

### 3. Planejar (dry-run)

```bash
terraform plan
```

### 4. Aplicar

```bash
terraform apply
```

> ⚠️ O primeiro `apply` importará os projetos existentes do Vercel e Supabase.
> Nenhum dado será perdido — os import blocks apenas adotam os recursos para gerenciamento via Terraform.

## Estrutura de Arquivos

| Arquivo | Descrição |
|---|---|
| `main.tf` | Providers (Vercel, Supabase) e versões |
| `variables.tf` | Todas as variáveis de input |
| `supabase.tf` | Projeto Supabase + API settings |
| `vercel-frontend.tf` | Projeto Vercel frontend + env vars |
| `vercel-backend.tf` | Projeto Vercel backend + env vars |
| `outputs.tf` | URLs e IDs dos recursos provisionados |
| `terraform.tfvars.example` | Template de variáveis (sem segredos) |

## Variáveis

| Nome | Tipo | Sensível | Descrição |
|---|---|---|---|
| `vercel_api_token` | string | ✅ | Token da API Vercel |
| `vercel_team_id` | string | | Team/Org ID |
| `supabase_access_token` | string | ✅ | Token Supabase |
| `supabase_organization_id` | string | | Org slug |
| `supabase_project_ref` | string | | Project ref existente |
| `supabase_db_password` | string | ✅ | Senha do PostgreSQL |
| `clerk_publishable_key` | string | | Publishable key |
| `clerk_secret_key` | string | ✅ | Secret key |
| `database_url` | string | ✅ | Connection string (pgbouncer) |
| `direct_url` | string | ✅ | Connection string (direct) |
| `vapid_public_key` | string | | VAPID public |
| `vapid_private_key` | string | ✅ | VAPID private |
| `vapid_email` | string | | VAPID email |
| `cron_secret` | string | ✅ | Cron job secret |
| `github_repo` | string | | GitHub repo path |

## Gerenciamento

### Ver estado atual
```bash
terraform show
```

### Atualizar após mudanças
```bash
terraform plan    # Revisar mudanças
terraform apply   # Aplicar
```

### Destruir infraestrutura
```bash
terraform destroy  # ⚠️ CUIDADO: remove TUDO
```

## Notas Importantes

- **Clerk** não tem provider Terraform oficial. Chaves são gerenciadas manualmente via Dashboard e injetadas como variáveis.
- **State local**: O state é armazenado localmente (`terraform.tfstate`). Para equipes, considere migrar para um backend remoto (S3, Terraform Cloud, etc).
- **Segredos**: Nunca faça commit de `terraform.tfvars` — ele contém tokens sensíveis.
