# Especificação Técnica

## Visão Geral Técnica

Este documento define a **arquitetura técnica, stack tecnológica, padrões de desenvolvimento e diretrizes de segurança** para a implementação da plataforma de **gerenciamento de medicação com lembretes inteligentes**.

O objetivo é fornecer um guia claro para:

- Engenheiros de software
- Ferramentas de desenvolvimento assistido por IA

A plataforma permitirá que usuários registrem medicamentos, recebam lembretes multicanal e acompanhem sua adesão ao tratamento. O sistema deverá ser **escalável, seguro, resiliente e orientado a eventos**, suportando crescimento gradual da base de usuários e múltiplos canais de notificação.

---

# Arquitetura de Referência

## Estilo Arquitetural

A arquitetura adotada será baseada em:

**Arquitetura modular orientada a serviços (Service-Oriented Architecture)** com:

- Backend API central
- Workers assíncronos para envio de notificações
- Processamento baseado em eventos
- Integrações externas acopladas via APIs e webhooks

Essa abordagem permite:

- Processamento assíncrono de notificações
- Facilidade de manutenção e evolução da plataforma

---

## Componentes Principais

### 1. Web Client / App

Responsável pela interação com o usuário.

Funções:

- Cadastro de usuários
- Cadastro de medicamentos
- Visualização de histórico
- Confirmação de medicação
- Configuração de notificações

---

### 2. API Backend

Responsável por:

- Gestão de usuários
- Gestão de medicamentos
- Geração de agendas de medicação
- Registro de confirmações
- Integração com notificações
- Integração com calendário

---

### 3. Notification Scheduler

Serviço responsável por:

- Gerar eventos de lembrete
- Gerenciar criticidade dos medicamentos
- Agendar reenvios caso não haja confirmação

Esse serviço consome dados da base e cria eventos para o sistema de notificações.

---

### 4. Notification Service

Serviço responsável pelo envio de mensagens através de:

- Push notifications
- SMS
- WhatsApp
- Email

Cada canal será tratado como um **adapter independente**, facilitando substituição ou expansão.

---

### 5. Event Queue

Fila de eventos responsável por desacoplar:

- Geração de lembretes
- Envio de notificações
- Processamento de confirmações

Permite escalabilidade horizontal.

---

### 6. Persistence Layer

Banco de dados responsável por armazenar:

- Usuários
- Medicamentos
- Agenda de medicação
- Histórico de adesão

---

## Serviço de Observabilidade

Observabilidade será baseada em três pilares:

### Logs

- Logs estruturados em JSON
- Correlação de requisições via Request ID

### Métricas

Monitoramento de:

- Latência de APIs
- Volume de notificações enviadas
- Falhas de envio
- Tempo de processamento de jobs

### Tracing

Tracing distribuído para:

- Fluxos de notificações
- Integrações externas
- Diagnóstico de latência

---

## Autenticação e Autorização

Modelo baseado em **JWT (JSON Web Token)**.

Fluxo:

1. Usuário realiza login
2. Backend gera token JWT
3. Token enviado em requisições subsequentes
4. Middleware valida token

---

## Protocolos de Comunicação

Comunicação interna e externa via:

- **HTTPS / REST APIs**
- **Webhooks para integrações**
- **Mensageria via filas**

Formato padrão de dados:

- **JSON**

---

## Infraestrutura de Deployment

A infraestrutura será baseada em **cloud-native** com containers.

Componentes:

- Containers Docker
- Orquestração via Kubernetes
- Deploy automatizado via CI/CD

Ambientes:

- Development
- Staging
- Production

---

# Stack Tecnológica

## Frontend

- **Linguagem**: TypeScript  
- **Framework web**: React / Next.js  
- **Estilização**: TailwindCSS  

Recursos adicionais:

- Service Workers para notificações

---

## Backend

- **Linguagem**: TypeScript  
- **Runtime**: Node.js  
- **Framework**: NestJS  

### Persistência

- **Banco de dados**: Supabase (PostgreSQL)  

### ORM

- **ORM**: Prisma

---

## Stack de Desenvolvimento

- **IDE**: Antigravity  
- **Gerenciamento de pacotes**:  npm  
- **Ambiente de desenvolvimento local**: Docker Compose  

---

### Infraestrutura como Código (IaC)

- Terraform

---

### Pipeline CI/CD

Ferramentas possíveis:

- GitHub Actions

Pipeline incluirá:

- Lint
- Testes automatizados
- Build
- Security Scan
- Deploy automático

---

## Integrações

### Persistência

- PostgreSQL via Supabase

---

### Deployment

- AWS
- Kubernetes

---

### Segurança (autenticação e autorização)

- JWT
- OAuth2 para integrações externas

---

### Observabilidade

- New Relic

---

# Segurança

## Autenticação e Gestão de Sessão

Autenticação baseada em:

- Email + senha
- JWT tokens
- Refresh tokens

Sessões terão:

- Expiração configurável
- Rotação de tokens
- Revogação em logout

---

## Controle de Acesso e Autorização

Controle baseado em **RBAC (Role Based Access Control)**.

Papéis iniciais:

- Usuário
- Admin (futuro)

---

## Segurança de Dados e Validação

Validações:

- Backend sempre valida dados recebidos
- Sanitização de inputs
- Proteção contra:

  - SQL Injection
  - XSS
  - CSRF

---

### Criptografia e Proteção de Dados

Criptografia aplicada em:

- Senhas → Hash com bcrypt
- Comunicação → TLS

---

## Segurança da Infraestrutura e Configuração

Boas práticas:

- Variáveis sensíveis fora do código
- Rotação de chaves

---

## Segurança no Desenvolvimento e Operação (DevSecOps)

Pipeline incluirá:

- Dependency vulnerability scanning
- Static code analysis

---

## Conformidade com LGPD (Lei Geral de Proteção de Dados)

### Direitos do Usuário

- **Direito de acesso**: Endpoint para baixar dados pessoais em formato legível (`GET /users/{id}/data-export`)
- **Direito ao esquecimento**: Opção de deletar conta e todos os dados associados (`DELETE /users/{id}`)
- **Direito de portabilidade**: Possibilidade de exportar dados em formato estruturado
- **Direito de retificação**: Endpoints para atualizar dados pessoais (`PUT /users/{id}`)

### Consentimento e Transparência

- Banner de consentimento para coleta de dados ao registrar usuário
- Política de Privacidade e Termos de Uso acessíveis e em linguagem clara
- Consentimento explícito para cada canal de notificação (app, SMS, WhatsApp, email)

### Segurança de Dados

- Criptografia de dados sensíveis em repouso (senhas com bcrypt, dados em AES-256)
- Criptografia em trânsito (TLS 1.2+)
- Logs de acesso para dados sensíveis (auditoria)
- Retenção mínima de dados (logs excluídos após 90 dias)

### Terceiros (Data Processors)

- Supabase (PostgreSQL): Contrato de Processamento de Dados assinado
- Provedores de SMS/WhatsApp/Email: Verificar conformidade com LGPD
- New Relic (observabilidade): Conformidade validada

---

# APIs

## Endpoint Principal

Base path:

/api/v1

---

## Versionamento

Versionamento via URI:

/api/v1
/api/v2

---

## Padrão de Nomenclatura

Padrão RESTful:

GET /users
POST /users
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}

GET /meds
POST /meds
PUT /meds/{id}
DELETE /meds/{id}

GET /meds-schedules
POST /meds-confirmations

GET /users/{id}/preferences
PUT /users/{id}/preferences

---

## Endpoints de Autenticação

### Públicos

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login com email e senha
- `POST /auth/forgot-password` - Solicitar recuperação de senha
- `POST /auth/reset-password` - Resetar senha com token

### Protegidos

- `POST /auth/logout` - Logout do usuário autenticado
- `POST /auth/refresh` - Renovar token JWT

---

## Endpoints de Usuário

### Protegidos

- `GET /users/{id}` - Obter dados do usuário
- `PUT /users/{id}` - Atualizar dados do usuário (nome, telefone, etc.)
- `GET /users/{id}/preferences` - Obter preferências de notificação
- `PUT /users/{id}/preferences` - Atualizar preferências (canais ativos, lembretes)
- `DELETE /users/{id}` - Deletar conta (requer confirmação)

---

## Endpoints de Medicamentos

### Protegidos

- `GET /meds` - Listar medicamentos do usuário
- `POST /meds` - Criar novo medicamento
- `PUT /meds/{id}` - Atualizar medicamento
- `DELETE /meds/{id}` - Deletar medicamento
- `GET /meds/{id}` - Obter detalhes de um medicamento

---

## Endpoints de Agendamento e Histórico

### Protegidos

- `GET /meds-schedules` - Listar agendamentos de medicação
- `GET /meds-schedules/{id}/today` - Listar medicamentos do dia
- `POST /meds-confirmations` - Confirmar tomada de medicamento
- `GET /adherence-history` - Obter histórico de adesão
- `GET /adherence-history?start-date={date}&end-date={date}` - Histórico com filtro por data

---

## Autenticação

Endpoints protegidos exigem:

Authorization: Bearer <token>

---

## Endpoints Públicos

- Registro de usuário
- Login
- Recuperação de senha

---

## Webhooks

Utilizados para:

- Confirmações via SMS
- Confirmações via WhatsApp
- Confirmações via email
- Integrações externas

---

# Tenancy

## Estratégia

A plataforma utilizará **single-tenant database com isolamento lógico por usuário**.

Cada usuário possui:

- Medicamentos próprios
- Histórico próprio
- Configurações próprias

---

## Isolamento

Isolamento garantido por:

- Foreign keys
- Filtros obrigatórios por `user_id`

---

## Identificação

Usuários identificados por:

- UUID

---

## Migrações

Gerenciadas via:

- Prisma Migrations

Processo:

- Versionamento de schema
- Migrações automáticas no deploy

---

## Segurança

Regras de acesso sempre filtram por:

user_id do token autenticado    

---

# Diretrizes para Desenvolvimento Assistido por IA

Ferramentas de IA utilizadas no desenvolvimento devem seguir as seguintes regras:

1. **Respeitar a arquitetura definida neste documento**

2. **Não introduzir dependências fora da stack definida sem justificativa**

3. **Manter padrões de API REST**

4. **Respeitar modelo de dados e regras de segurança**

5. **Sempre validar dados no backend**

6. **Evitar lógica de negócio no frontend**

7. **Utilizar tipagem forte (TypeScript)**

8. **Seguir separação de responsabilidades**

 -   Camadas recomendadas:

 -   Controller
 -   Service
 -   Repository
 -   Domain

9. **Código gerado deve incluir testes unitários quando possível**

10. **Qualquer alteração estrutural deve ser refletida neste documento**