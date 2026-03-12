# Resumo das Revisões - Documentos de Descoberta

**Data:** 11 de Março de 2026  
**Escopo:** Validação de consistência, identificação de gaps e aderência aos requisitos entre PRD, Especificação Técnica e Especificação de UI.

---

## Correções Realizadas

### 1. **PRD - Erros de Grafia e Nomenclatura**

✅ Corrigido:
- `fisico` → `físico` (Diferenciais, linha 25)
- `multiplas` → `múltiplas` (Persona Maria)
- Nomenclatura de requisitos: `RFN-XX` → `RF-XX` (Requisitos Funcionais)

### 2. **PRD - Especificação de Criticidade de Lembretes**

✅ Adicionado:
- Seção "Frequência de Relembretes por Criticidade" no RF-03
- Detalhe: Alta (a cada 15 min/2h), Média (a cada 30 min/1h), Baixa (sem relembretes)

### 3. **PRD - Clarificação de Canais V1 vs V2**

✅ Atualizado:
- RF-04 agora especifica: V1 suporta push notification e email
- V2 adiciona suporte para SMS e WhatsApp
- V1 (MVP) agora inclui "Configurações de conta e preferências de notificação"

### 4. **Especificação de UI - Interfaces Faltantes**

✅ Adicionadas:
- **INT-10 - Recuperação de Senha**
  - Formulário com email
  - Link seguro com validade limitada (1 hora)
  - Acessível via "Esqueci minha senha" no login

- **INT-11 - Configurações de Conta**
  - Gerenciamento de dados pessoais
  - Preferências de notificação
  - Opções de logout e deleção de conta (com confirmação)

### 5. **Especificação Técnica - Endpoints Detalhados**

✅ Expandida seção "Padrão de Nomenclatura" com:
- **Endpoints de Autenticação**: registro, login, recuperação de senha, refresh token
- **Endpoints de Usuário**: CRUD, preferências de notificação, deleção de conta
- **Endpoints de Medicamentos**: CRUD completo
- **Endpoints de Agendamento e Histórico**: horários, confirmações, relatórios

### 6. **Especificação Técnica - Conformidade LGPD**

✅ Adicionada seção completa "Conformidade com LGPD" que inclui:
- **Direitos do Usuário**: acesso, esquecimento, portabilidade, retificação
- **Consentimento e Transparência**: banner, política, termos, consentimento por canal
- **Segurança de Dados**: criptografia em repouso/trânsito, auditoria, retenção
- **Terceiros**: verificação de conformidade com Supabase, provedores SMS/WhatsApp, New Relic

---

## Gaps Identificados e Resolvidos

| Gap | Documento | Resolução |
|-----|-----------|-----------|
| Falta de interface de recuperação de senha | spec_ui | ✅ INT-10 adicionada |
| Falta de interface de configurações | spec_ui | ✅ INT-11 adicionada |
| Endpoints incompletos para recuperação de senha | spec_tech | ✅ POST /auth/forgot-password, POST /auth/reset-password adicionados |
| Endpoints para gerenciar preferências não definidos | spec_tech | ✅ GET/PUT /users/{id}/preferences adicionados |
| LGPD não detalha implementação | spec_tech | ✅ Seção completa adicionada |
| Criticidade não define frequência de lembretes | PRD | ✅ Detalhe adicionado em RF-03 |
| Canais de notificação V1 vs V2 inconsistentes | PRD | ✅ Clarificado: V1 = push + email, V2 = SMS + WhatsApp |

---

## Consistência Validada

### Entre PRD e Especificação de UI

✅ **RF-01 (Cadastro de Usuário)** ↔ **INT-02 (Cadastro de Usuário)**
- Campos, botões e critérios alinhados

✅ **RF-02 (Cadastro de Medicamentos)** ↔ **INT-05 (Cadastro de Medicamento)**
- Todos os campos especificados (Nome, Dosagem, Frequência, Horários, Duração, Criticidade, Canal)

✅ **RF-05 (Confirmação)** ↔ **INT-07 (Confirmação de Tomada)**
- Ações (Confirmar, Adiar, Ignorar) definidas
- Integração com notificações confirmada

✅ **RF-06 (Histórico)** ↔ **INT-08 e INT-09 (Histórico + Calendário)**
- Visualizações em lista e calendário suportadas

✅ **RF-07 (Integração com Google Calendar)** ↔ **INT-09 (Visualização em Calendário)**
- Sincronização e eventos automáticos confirmados

### Entre PRD e Especificação Técnica

✅ **RNF-02 (Disponibilidade 99,5% uptime)**
- Arquitetura cloud-native com Kubernetes suporta requisito

✅ **RNF-03 (Escalabilidade)**
- SOA com Event Queue e microserviços permite escalabilidade horizontal

✅ **RNF-04 (Segurança de Dados)**
- JWT, criptografia bcrypt/TLS, RBAC, LGPD detalhados

✅ **RNF-05 (Performance < 1 minuto)**
- Notification Scheduler  garante disparo tempestivo
- Observabilidade monitora latência

---

## Recomendações Adicionais

### 1. **Clarificar Fluxo de Confirmação Multicanal**
- Quando email/SMS forem adicionados em V2, definir como usuário confirma via esses canais
- Sugestão: Webhook para processar respostas (ex: responder "Tomado" no SMS)

### 2. **Documentar Modelo de Dados**
- Criar diagrama ER (Entity-Relationship) para auxiliar desenvolvimento
- Mapear relações: User → Medications → Schedules → Confirmations

### 3. **Definir SLAs de Notificação**
- Tempo máximo aceitável de falha em envio?
- Retry policy completa (exponential backoff?)
- Dead letter queue para notificações falhadas?

### 4. **Segurança de Webhooks**
- Especificar autenticação para webhooks (hmac-sha256 signature?)
- Rate limiting e validação de origin esperada

### 5. **Testes de Aceitação**
- Atualizar Critérios de Aceitação com cenários de teste
- Ex: "Validar que relembretes de medicamento alta criticidade disparam a cada 15 min"

---

## Status Final

✅ **Todos os documentos revisados e atualizados**
✅ **Consistência validada entre PRD, spec_tech e spec_ui**
✅ **Gaps resolvidos com interfaces e endpoints adicionados**
✅ **Conformidade LGPD documentada**

**Próximos Passos:**  
1. Implementar modelo de dados baseado em spec_tech
2. Iniciar desenvolvimento de API backend (NestJS)
3. Desenvolver frontend (React/Next.js) com interfaces definidas
