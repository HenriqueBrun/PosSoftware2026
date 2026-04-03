# Lean Canvas — Pills

> Plataforma de Gerenciamento de Medicação com Lembretes Inteligentes

| **Data** | 03/04/2026 |
|----------|------------|
| **Iteração** | 1 — MVP |

---

## 🔴 PROBLEMA

**Top 3 problemas dos usuários:**

1. **Esquecimento frequente de medicamentos** — Pacientes com rotina agitada, sobrecarga cognitiva ou TDAH esquecem de tomar medicamentos nos horários corretos, comprometendo a adesão ao tratamento
2. **Lembretes ineficazes** — Alarmes e apps atuais são fáceis de ignorar, dependem de alta disciplina do usuário e não escalam por criticidade do medicamento
3. **Dificuldade de organização de múltiplas prescrições** — Gerenciar vários medicamentos com horários, dosagens e frequências diferentes gera sobrecarga cognitiva significativa

### Alternativas Existentes

- Alarmes manuais no celular
- Cadernos / calendários físicos
- Apps genéricos de lembrete (Google Calendar, alarmes)
- Apps de saúde com configuração complexa
- Planilhas ou anotações manuais

---

## 💡 SOLUÇÃO

**Funcionalidades-chave do MVP:**

1. **Cadastro simples de medicamentos** — Interface intuitiva com nome, dosagem, frequência, horários e criticidade (Alta/Média/Baixa) — cadastro em menos de 1 minuto
2. **Lembretes inteligentes por criticidade** — Sistema de relembretes automáticos baseado na criticidade: Alta (a cada 15min por 2h), Média (a cada 30min por 1h), Baixa (1 lembrete apenas)
3. **Confirmação de tomada em 1 clique** — Ação rápida direto da notificação, com registro automático no histórico de adesão
4. **Histórico de adesão ao tratamento** — Dashboard visual com medicamentos tomados vs esquecidos, permitindo acompanhamento da consistência

---

## 🎯 PROPOSTA ÚNICA DE VALOR

> **"Nunca esqueça seus medicamentos novamente."**

Plataforma que simplifica o gerenciamento de medicação com lembretes inteligentes que se adaptam à criticidade de cada medicamento, garantindo que os lembretes certos cheguem no canal certo, na hora certa — reduzindo esquecimentos e aumentando a adesão ao tratamento sem exigir disciplina do usuário.

---

## 🏆 VANTAGEM COMPETITIVA

- **Lembretes inteligentes por criticidade** — Nenhum concorrente escala a intensidade de lembretes com base na criticidade do medicamento (Alta/Média/Baixa)
- **Notificações multicanal** (App, SMS, WhatsApp, Email) — Abordagem omnichannel que acompanha o usuário onde ele está
- **Interface focada em acessibilidade** — Projetada para redução máxima de carga cognitiva (mobile-first, 1 clique para confirmar)
- **Conformidade com LGPD desde o dia 1** — Direito ao esquecimento, portabilidade e exportação de dados integrados na arquitetura

---

## 👥 SEGMENTO DE CLIENTES

**Público-alvo principal:**

1. Pacientes com doenças crônicas (diabetes, hipertensão, hipotireoidismo)
2. Pacientes com múltiplos medicamentos diários
3. Pacientes com dificuldades de organização (ex: TDAH)
4. Cuidadores ou familiares responsáveis pela gestão de medicação de terceiros

### Early Adopters

- **Jovens adultos (25-35 anos) com TDAH** que utilizam medicação controlada contínua e possuem rotina dinâmica/desorganizada
- **Pacientes recém-diagnosticados** com doenças crônicas que estão iniciando tratamento contínuo e ainda não estabeleceram uma rotina de medicação

---

## 📊 MÉTRICAS CHAVE

| Métrica | Descrição | Meta MVP |
|---------|-----------|----------|
| **Taxa de adesão** | Medicações confirmadas / medicações programadas | > 80% |
| **Taxa de retenção** | Usuários ativos após 30 dias | > 60% |
| **Taxa de confirmação pós-lembrete** | % de confirmações após receber lembrete | > 70% |
| **Medicamentos por usuário** | Média de medicamentos cadastrados | ≥ 2 |
| **Tempo de cadastro** | Tempo médio para cadastrar um medicamento | < 1 min |
| **Engajamento com notificações** | Taxa de abertura/interação com lembretes | > 50% |

---

## 📢 CANAIS

**Aquisição:**

- SEO (blog com conteúdo sobre adesão a tratamentos)
- Redes sociais (Instagram, TikTok — conteúdo sobre saúde e organização)
- Parcerias com clínicas e consultórios médicos
- Indicação de usuários (programa de referral)
- App stores (Google Play, Apple App Store)

**Entrega do produto:**

- Progressive Web App (PWA) responsivo
- Push notifications (App)
- Email
- SMS (V2)
- WhatsApp (V2)

---

## 💰 ESTRUTURA DE CUSTOS

| Categoria | Detalhes |
|-----------|----------|
| **Infraestrutura** | Supabase (PostgreSQL), Vercel/AWS, domínio e SSL |
| **Desenvolvimento** | Equipe de engenharia (TypeScript, NestJS, Next.js) |
| **Notificações** | Serviço de email (SendGrid/Resend), SMS API (V2), WhatsApp Business API (V2) |
| **Observabilidade** | New Relic |
| **Marketing** | Aquisição de usuários, conteúdo, parcerias |
| **Operações** | CI/CD (GitHub Actions), Docker, Kubernetes |

---

## 💵 FLUXO DE RECEITAS

| Modelo | Descrição |
|--------|-----------|
| **Freemium** | Plano gratuito com até 3 medicamentos e lembretes via push notification |
| **Plano Premium** | R$ 9,90/mês — Medicamentos ilimitados, multicanal (SMS, WhatsApp), histórico avançado, integração com Google Calendar, exportação de relatórios |
| **Plano Família** | R$ 19,90/mês — Até 5 perfis gerenciados (para cuidadores), alertas para familiares, dashboard consolidado |
| **B2B (Futuro)** | Parcerias com clínicas/hospitais para monitoramento remoto de adesão de pacientes |

---

## Visão Geral — Layout do Canvas

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        LEAN CANVAS — Pills                                         │
│                   Gerenciamento de Medicação Inteligente                            │
│                                                                    Data: 03/04/2026│
│                                                                    Iteração: 1     │
├──────────────┬──────────────┬──────────────┬──────────────┬──────────────────────────┤
│   PROBLEMA   │   SOLUÇÃO    │  PROPOSTA    │  VANTAGEM    │  SEGMENTO DE CLIENTES   │
│              │              │  ÚNICA DE    │  COMPETITIVA │                         │
│ • Esqueci-   │ • Cadastro   │  VALOR       │              │ • Pac. doenças crônicas │
│   mento de   │   simples    │              │ • Lembretes  │ • Pac. múltiplos meds   │
│   medicação  │   (<1 min)   │ "Nunca       │   por criti- │ • Pac. com TDAH         │
│ • Lembretes  │ • Lembretes  │  esqueça     │   cidade     │ • Cuidadores/familiares │
│   ineficazes │   inteligen- │  seus medi-  │ • Multi-     │                         │
│ • Sobrecarga │   tes por    │  camentos    │   canal      │ Early Adopters:         │
│   cognitiva  │   criticid.  │  novamente"  │ • Mobile-    │ • Jovens c/ TDAH        │
│              │ • Confirmação│              │   first      │ • Pacientes recém-      │
│ Alternativas:│   em 1 clique│              │ • LGPD       │   diagnosticados        │
│ • Alarmes   │ • Histórico  │              │   nativa     │                         │
│ • Apps      │   de adesão  │              │              │                         │
│ • Cadernos  │              │              │              │                         │
├──────────────┼──────────────┤              ├──────────────┼──────────────────────────┤
│  MÉTRICAS    │              │              │   CANAIS     │                         │
│  CHAVE       │              │              │              │                         │
│              │              │              │ • SEO/Blog   │                         │
│ • Taxa de    │              │              │ • Redes      │                         │
│   adesão>80% │              │              │   Sociais    │                         │
│ • Retenção   │              │              │ • Parcerias  │                         │
│   30d >60%   │              │              │   médicas    │                         │
│ • Engajam.   │              │              │ • App Stores │                         │
│   notif >50% │              │              │ • Referral   │                         │
├──────────────┴──────────────┴──────────────┴──────────────┴──────────────────────────┤
│  ESTRUTURA DE CUSTOS                │  FLUXO DE RECEITAS                            │
│                                     │                                               │
│ • Infraestrutura (Supabase, AWS)    │ • Freemium (até 3 meds, push only)            │
│ • Desenvolvimento (TypeScript)      │ • Premium R$9,90/mês (ilimitado, multicanal)  │
│ • Notificações (Email, SMS, WA)     │ • Família R$19,90/mês (5 perfis)              │
│ • Observabilidade (New Relic)       │ • B2B futuro (clínicas/hospitais)              │
│ • Marketing e Aquisição             │                                               │
└─────────────────────────────────────┴───────────────────────────────────────────────┘
         ◄── PRODUTO ──►                          ◄── MERCADO ──►
```
