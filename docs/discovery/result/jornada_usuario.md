# Jornada do Usuário — Pills

> Plataforma de Gerenciamento de Medicação com Lembretes Inteligentes

| **Persona** | Henrique Silva — 27 anos, Desenvolvedor, TDAH + Hipertensão |
|-------------|--------------------------------------------------------------|
| **Data**    | 03/04/2026                                                   |
| **Iteração**| 1 — MVP                                                     |

---

## Mapa da Jornada do Usuário — Modelo de Serviço

| Jornada do Usuário: Pills | 1. Descoberta e Primeiro Acesso | 2. Cadastro de Medicamentos | 3. Recebimento de Lembretes | 4. Confirmação e Acompanhamento | 5. Problema ou Esquecimento |
|---|---|---|---|---|---|
| **O que o cliente está sentindo?** | Curiosidade e esperança. Cansado de esquecer medicamentos e quer algo que finalmente funcione sem depender da sua disciplina. | Alívio por ser rápido e simples. Sente que talvez dessa vez consiga manter a rotina de medicação organizada. | Surpresa positiva ao receber o lembrete no horário certo. Sente que o app está "cuidando" dele. | Satisfação ao ver seu histórico de adesão crescendo. Sensação de controle sobre o próprio tratamento. | Frustração ao perceber que esqueceu um medicamento apesar dos lembretes, ou ansiedade ao notar uma falha no histórico. |
| **Por que o cliente está se sentindo assim?** | Já tentou alarmes, cadernos e outros apps que exigiam configuração complexa e falhavam em mantê-lo engajado. Precisa de algo que lide com seu TDAH. | O cadastro leva menos de 1 minuto. A interface é limpa, com opções pré-definidas (criticidade, frequência) que reduzem decisões. Não precisa pensar muito. | O sistema de lembretes inteligentes respeita a criticidade: para hipertensão (Alta), reenvia a cada 15min se não houver resposta. Recebe no canal que escolheu (push/email). | Consegue visualizar no dashboard que está 90%+ em dia. A confirmação com 1 clique é rápida e não interrompe o fluxo de trabalho. | Estava em uma reunião longa e ignorou todos os relembretes. Ou o horário configurado não combina mais com sua nova rotina. |
| **Como nós nos comunicamos com o cliente?** | Landing page com proposta clara: "Nunca esqueça seus medicamentos novamente". Onboarding guiado com tutorial rápido de 3 passos. | Formulário intuitivo com validação em tempo real. Feedback visual de sucesso após salvar. Sugestões inteligentes de horários com base na frequência. | Push notification no horário exato. Relembretes automáticos por criticidade (15min/30min). Email como canal secundário. Em V2: WhatsApp. | Dashboard com cards visuais de medicamentos do dia. Histórico com indicadores de adesão (tomado ✓ / esquecido ✗). Notificação semanal com resumo de adesão. | Notificação empática: "Percebemos que você pode ter perdido uma dose. Tudo bem, isso acontece! Quer ajustar seus horários?". Link direto para reagendar. |
| **Qual ação executamos nos bastidores?** | Registro do usuário via JWT. Criação de perfil no banco PostgreSQL (Supabase). Setup de preferências de notificação padrão. Tracking de origem do usuário. | Persistência do medicamento com Prisma. Geração automática de agenda de horários (MedicationEvent). Criação de jobs no Notification Scheduler com base na criticidade. | Notification Scheduler dispara evento na fila. Notification Service envia via canal preferencial (push/email). Se sem confirmação: fila de relembretes baseada na criticidade (Alta: 8x, Média: 2x, Baixa: 0x). | Registro de confirmação no histórico (MedicationConfirmation). Cálculo de taxa de adesão em tempo real. Atualização do dashboard via API. Geração de relatório semanal. | Log do evento como "missed". Análise de padrão de horários perdidos. Sugestão proativa de reagendamento via notificação. Registro do feedback do usuário para melhoria contínua. |

---

## Detalhamento por Etapa

### 📱 Etapa 1 — Descoberta e Primeiro Acesso

**Touchpoints:**
- Landing page / App Store
- Tela de Boas-Vindas (INT-01)
- Cadastro de Usuário (INT-02)
- Login (INT-03)

**Emoções:** Curiosidade → Esperança → Alívio (cadastro rápido)

**Oportunidades:**
- Onboarding com 3 passos visuais
- Mostrar proposta de valor imediatamente
- Permitir cadastro em menos de 2 minutos
- Tutorial interativo para primeiro medicamento

---

### 💊 Etapa 2 — Cadastro de Medicamentos

**Touchpoints:**
- Cadastro de Medicamento (INT-05)
- Dashboard / Home (INT-04)

**Emoções:** Alívio → Confiança (simplicidade do processo)

**Oportunidades:**
- Cadastro em menos de 1 minuto
- Opções pré-definidas de criticidade (Alta/Média/Baixa)
- Sugestões inteligentes de horários
- Feedback visual de sucesso após salvar
- Geração automática de agenda sem intervenção do usuário

---

### 🔔 Etapa 3 — Recebimento de Lembretes

**Touchpoints:**
- Push notification
- Email
- WhatsApp (V2)
- SMS (V2)

**Emoções:** Surpresa positiva → Segurança ("o app cuida de mim")

**Oportunidades:**
- Lembrete no horário exato (atraso máx. 1 min)
- Relembretes inteligentes por criticidade:
  - **Alta:** a cada 15 min por 2h (máx. 8 tentativas)
  - **Média:** a cada 30 min por 1h (máx. 2 tentativas)
  - **Baixa:** apenas 1 lembrete no horário
- Notificação acionável (confirmar direto do push)
- Canal preferencial respeitado

---

### ✅ Etapa 4 — Confirmação e Acompanhamento

**Touchpoints:**
- Confirmação de Tomada (INT-07)
- Dashboard / Home (INT-04)
- Histórico de Adesão (INT-08)
- Calendário (INT-09)

**Emoções:** Satisfação → Motivação (progresso visível)

**Oportunidades:**
- Confirmação em 1 clique na notificação
- Dashboard com próximas doses do dia
- Histórico visual (tomado ✓ / esquecido ✗)
- Integração com Google Calendar (V2)
- Resumo semanal de adesão por notificação

---

### ⚠️ Etapa 5 — Problema ou Esquecimento

**Touchpoints:**
- Notificação de dose perdida
- Dashboard com gap no histórico
- Configurações de Conta (INT-11)

**Emoções:** Frustração → Ansiedade → Alívio (suporte proativo)

**Oportunidades:**
- Mensagem empática, sem julgamento: "Tudo bem, isso acontece!"
- Sugestão proativa de ajuste de horários
- Link direto para reagendar medicamento
- Análise de padrões de doses perdidas
- Exportação de relatório para compartilhar com médico (V3)

---

## Mapa de Emoções ao longo da Jornada

```
Emoção
  😊 Alta  ·····✦·················✦···············✦···········
           ·   / \               / \             / \
  😐 Neutra····   ·····✦········   ·····✦·······   ···✦·····✦
           ·       \   / \           \   /           \ /
  😟 Baixa ·        ✦   ·            ✦               ✦
           ·
           └──────┬──────┬──────────┬──────────┬──────────┬──
               Descoberta  Cadastro   Lembretes  Acompan.   Problema
                                                             → Resolução
```

**Legenda:**
- ✦ Picos emocionais positivos: cadastro rápido, primeiro lembrete, histórico em dia
- ✦ Vales emocionais: complexidade percebida, dose esquecida
- A jornada deve minimizar vales e maximizar momentos de satisfação

---

## Momentos da Verdade (Moments of Truth)

| Momento | Etapa | Impacto | Ação |
|---------|-------|---------|------|
| **Primeiro lembrete recebido** | 3 | Decisivo para retenção — se funcionar bem, o usuário confia na plataforma | Garantir entrega no horário exato, canal correto |
| **Primeira confirmação** | 4 | Gera sensação de controle e hábito | Feedback visual positivo, animação de celebração |
| **Dose esquecida** | 5 | Pode gerar abandono se a resposta for culpabilizante | Mensagem empática + sugestão de ajuste |
| **Visualização do histórico** | 4 | Motivação ao ver progresso | Gráfico claro, % de adesão visível |
| **1 semana de uso** | 4 | Marco de hábito formado | Notificação de parabéns + resumo |
