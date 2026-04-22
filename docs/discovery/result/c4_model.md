# C4 Architecture Model - Pills Management System

Este documento descreve a arquitetura do sistema **Pills** utilizando o modelo C4, focando nos fluxos de criação de medicamentos, agendamentos, notificações e gestão de estoque.

## 1. System Context Diagram (Nível 1)

O diagrama de contexto mostra como o usuário interage com o sistema e como o sistema se integra com provedores externos de comunicação e autenticação.

```mermaid
C4Context
    title System Context Diagram - Pills Management System

    Person(user, "Usuário", "Paciente ou cuidador que gerencia medicamentos e estoque.")
    
    System(pills_system, "Pills Management System", "Permite o agendamento de medicamentos, controle de estoque e envio de alertas.")

    System_Ext(whatsapp, "WhatsApp Cloud API", "Envia lembretes de medicação via mensagens de WhatsApp.")
    System_Ext(clerk, "Clerk Auth", "Gerencia a identidade e autenticação do usuário.")
    System_Ext(push_service, "Browser Push Service", "Entrega notificações push nativas no navegador.")

    Rel(user, pills_system, "Gerencia medicamentos, confirma doses e monitora estoque", "HTTPS/Web")
    Rel(pills_system, clerk, "Autentica usuários", "OIDC")
    Rel(pills_system, whatsapp, "Envia lembretes", "REST/JSON")
    Rel(pills_system, push_service, "Envia alertas de dose e estoque", "WebPush Protocol")
    Rel(whatsapp, user, "Envia mensagem de WhatsApp", "WhatsApp")
    Rel(push_service, user, "Exibe notificação no dispositivo", "Push")
```

---

## 2. Container Diagram (Nível 2)

O diagrama de containers detalha as aplicações internas e como os dados fluem para os casos de uso específicos.

### Fluxo A: Criação de Medicamento e Notificação
Este fluxo cobre desde o cadastro do medicamento até o envio do lembrete agendado.

```mermaid
C4Container
    title Container Diagram - Fluxo de Medicação

    Person(user, "Usuário", "Paciente")

    Container(web_app, "Web Application", "Next.js, React", "Interface visual para gestão de saúde.")
    
    Container_Boundary(api_boundary, "Backend Services") {
        Container(api, "API Application", "NestJS, Node.js", "Lógica de negócio e orquestração de notificações.")
        Container(cron, "Notification Cron", "NestJS Task Scheduling", "Processo em segundo plano que verifica eventos pendentes a cada minuto.")
    }

    ContainerDb(db, "Database", "PostgreSQL (Supabase)", "Armazena medicamentos, eventos de agenda e assinaturas push.")

    System_Ext(whatsapp, "WhatsApp Cloud API", "Gateway de mensagens.")
    System_Ext(push, "Web Push Service", "Serviço de push do navegador.")

    Rel(user, web_app, "Cria medicamento", "HTTPS")
    Rel(web_app, api, "Faz requisição POST /medications", "JSON/HTTPS")
    
    Rel(api, db, "Persiste medicamento e gera MedicationEvents", "Prisma/SQL")
    
    Rel(cron, api, "Trigger: checkAndNotifyDueEvents()", "Internal Call")
    Rel(api, db, "Busca eventos PENDING com horário <= NOW", "Prisma/SQL")
    
    Rel(api, whatsapp, "Envia lembrete", "REST")
    Rel(api, push, "Envia notificação push", "WebPush")
```

### Fluxo B: Criação (Atualização) de Estoque e Notificação
Este fluxo ocorre quando o usuário confirma o consumo de um medicamento, disparando a baixa no estoque e o alerta de reposição.

```mermaid
C4Container
    title Container Diagram - Fluxo de Estoque e Alerta

    Person(user, "Usuário", "Paciente")

    Container(web_app, "Web Application", "Next.js, React", "Usuário clica em 'Confirmar Dose'.")
    
    Container(api, "API Application", "NestJS", "Processa a baixa e valida regras de alerta.")

    ContainerDb(db, "Database", "PostgreSQL", "Atualiza a quantidade de estoque.")

    System_Ext(push, "Web Push Service", "Alerta o usuário sobre estoque baixo.")

    Rel(user, web_app, "Confirma consumo do medicamento", "UI Click")
    Rel(web_app, api, "PATCH /medications/events/:id (status: TAKEN)", "JSON/HTTPS")
    
    Rel(api, db, "Decrementa estoque e atualiza status do evento", "SQL")
    Rel(db, api, "Retorna novo saldo de estoque", "Prisma")
    
    Rel(api, api, "Verifica: newStock <= lowStockAlert", "Lógica Interna")
    
    Rel(api, push, "Envia alerta de 'Estoque Baixo'", "WebPush")
```

## Resumo dos Fluxos

| Fluxo | Trigger | Ação Principal | Resultado |
| :--- | :--- | :--- | :--- |
| **Medicamento** | Cadastro via UI | `generateSchedule()` no Backend | Inserção de múltiplos registros na tabela `MedicationEvent`. |
| **Notificação** | Cron (1m) | `checkAndNotifyDueEvents()` | Envio de mensagens via WhatsApp e Push. |
| **Estoque** | Confirmação de Dose | `updateEventStatus()` (decremento) | Atualização da coluna `stock` e possível trigger de `sendLowStockAlert()`. |
