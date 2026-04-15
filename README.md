# 💊 Pills — Gerenciamento Inteligente de Medicação

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2011-E0234E)](https://nestjs.com/)
[![Terraform](https://img.shields.io/badge/Infra-Terraform-623CE4)](https://www.terraform.io/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E)](https://supabase.com/)

O **Pills** é uma plataforma digital projetada para simplificar o controle de prescrições e horários de medicamentos. Focado em pacientes com doenças crônicas ou rotinas complexas (como TDAH), o sistema oferece lembretes inteligentes e multicanal para garantir a máxima adesão ao tratamento.

---

## 🚀 Visão Geral

O esquecimento da medicação é um dos maiores obstáculos para a eficácia de tratamentos contínuos. O Pills resolve isso através de:
- **Lembretes Proativos**: Notificações que escalam em frequência baseadas na criticidade do remédio.
- **Multicanalidade**: Alertas via App (Web Push), Email, e futuramente WhatsApp e SMS.
- **Histórico de Adesão**: Acompanhamento visual de doses tomadas e esquecidas.
- **Infraestrutura como Código**: Ambiente de produção resiliente e automatizado.

---

## 🛠️ Stack Tecnológica

### Frontend (`apps/frontend`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Biblioteca UI**: React 19 + Tailwind CSS 4
- **Autenticação**: [Clerk](https://clerk.com/)

### Backend (`apps/backend`)
- **Framework**: [NestJS 11](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Notificações**: Web-Push (VAPID)
- **Autenticação**: Clerk SDK + Passport JWT

### Infraestrutura & Dados
- **Banco de Dados**: PostgreSQL (Gerenciado via [Supabase](https://supabase.com/))
- **Hospedagem**: [Vercel](https://vercel.com/) (Frontend e Serverless Functions Backend)
- **IaC**: [Terraform](https://www.terraform.io/)

---

## 📂 Estrutura do Repositório

```bash
.
├── apps/
│   ├── backend/          # API NestJS (Logística, Agendamento e Notificações)
│   └── frontend/         # Web App Next.js (Interface do Usuário)
├── docs/
│   ├── discovery/        # Materiais de pesquisa (PRD, Personas, Lean Canvas)
│   └── design_system.md  # Guia de identidade visual
├── infra/                # Arquivos Terraform para Vercel e Supabase
├── docker-compose.yml    # Setup do ambiente de desenvolvimento local
└── package.json          # Workspace root
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose
- Contas no Clerk e Vercel (para variáveis de ambiente)

### 1. Clonar e Instalar
```bash
git clone https://github.com/HenriqueBrun/PosSoftware2026.git
cd PosSoftware2026
npm install
```

### 2. Configurar Variáveis
Copie o arquivo `.env.example` (se disponível) ou configure as seguintes chaves no seu `.env` raiz:
- `DATABASE_URL` (local ou Supabase)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### 3. Subir com Docker
```bash
docker-compose up -d
```
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`
- **Postgres**: `localhost:5432`

---

## ☁️ Infraestrutura (IaC)

O projeto utiliza **Terraform** para garantir que o ambiente de produção seja idêntico ao desenvolvimento.

Para aplicar mudanças na infra:
```bash
cd infra
terraform init
terraform plan
terraform apply
```
*Certifique-se de configurar o arquivo `terraform.tfvars` antes.*

---

## 📄 Documentação Complementar

Para entender mais sobre o processo de design e requisitos:
- [Product Requirements Document (PRD)](file:///Users/henriquepires/Projects/PosSoftware2026/docs/discovery/result/prd.md)
- [Especificação Técnica](file:///Users/henriquepires/Projects/PosSoftware2026/docs/discovery/result/spec_tech.md)
- [Design System](file:///Users/henriquepires/Projects/PosSoftware2026/docs/design_system.md)

---

## 👨‍💻 Autor

**Henrique Pires** — *Projeto desenvolvido para a disciplina de Pós-Graduação em Engenharia de Software 2026.*
