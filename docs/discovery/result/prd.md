# Definição de Requisitos do Produto (PRD)

## Descrição do produto

**Problema**  
Pacientes que dependem de medicamentos contínuos ou controlados frequentemente esquecem de tomar seus remédios no horário correto devido à rotina agitada, sobrecarga cognitiva ou dificuldades de organização. As soluções atuais exigem alto nível de disciplina do usuário e não oferecem suporte proativo suficiente, o que resulta em baixa adesão ao tratamento e aumento do risco de complicações de saúde.

**Solução**  
Desenvolver uma plataforma digital de gerenciamento de medicação que simplifique o controle de prescrições e horários de medicamentos, oferecendo lembretes inteligentes e multicanal (app, SMS, WhatsApp e e-mail), integração com calendários e mecanismos de suporte ativo que ajudem o usuário a manter consistência no tratamento.

Para **pacientes que utilizam medicamentos contínuos ou controlados**, o produto oferece uma maneira simples e confiável de organizar prescrições, receber lembretes eficazes e acompanhar sua rotina de medicação, reduzindo esquecimentos e aumentando a adesão ao tratamento.

**Nossos Diferenciais**
 
- Interface simples e focada em acessibilidade
- Notificações multicanal (App, SMS, WhatsApp e Email)  
- Lembretes inteligentes e configuráveis por criticidade do medicamento 
- Integração com calendários (Google Calendar)
- Gerar calendário físico para impressão e consulta offline  
- Histórico de adesão ao tratamento 

---

# Perfis de Usuário

- Pacientes com doenças crônicas  
- Pacientes com múltiplos medicamentos diários  
- Pacientes com dificuldades de organização (ex: TDAH)  
- Cuidadores ou familiares responsáveis pela gestão da medicação  

---

## Maria — Paciente com doença crônica

- **Problemas:**  
  - Esquece de tomar medicamentos em horários específicos  
  - Dificuldade em manter disciplina com alarmes simples  
  - Preocupação constante com a eficácia do tratamento  

- **Objetivos:**  
  - Garantir que está tomando os medicamentos corretamente  
  - Reduzir ansiedade relacionada ao tratamento  
  - Simplificar o gerenciamento das múltiplas prescrições  

- **Dados demográficos:**  
  - 45 anos  
  - Possui smartphone e usa aplicativos básicos  

- **Motivações:**  
  - Manter sua saúde controlada  
  - Evitar complicações médicas  
  - Ter segurança no acompanhamento do tratamento  

- **Frustrações:**  
  - Esquecer medicamentos importantes  
  - Aplicativos complexos ou difíceis de usar  
  - Falta de lembretes realmente eficazes  

---

## Henrique — Paciente com rotina desorganizada

- **Problemas:**  
  - Rotina imprevisível e desorganizada  
  - Ignora ou perde notificações comuns  

- **Objetivos:**  
  - Ter um sistema que lembre automaticamente da medicação  
  - Reduzir esforço cognitivo para gerenciar horários  
  - Conseguir acompanhar se tomou ou não o medicamento  

- **Dados demográficos:**  
  - 27 anos  
  - Trabalha em ambiente dinâmico  
  - Diagnóstico de TDAH  

- **Motivações:**  
  - Melhorar qualidade de vida  
  - Evitar esquecimentos frequentes  
  - Automatizar o máximo possível o processo  

- **Frustrações:**  
  - Aplicativos que dependem de configuração complexa  
  - Lembretes fáceis de ignorar  
  - Falta de integração com sua rotina digital  

---

# Principais Funcionalidades

## RF-01 Cadastro de Usuário e Login

Permitir que o usuário crie uma conta e faça login para acessar suas informações de medicação como:

- Nome completo
- Email
- Senha
- Telefone

Critérios de Aceitação:
- O usuário deve conseguir criar uma conta em menos de 2 minutos
- O usuário deve conseguir fazer login com email e senha
- O sistema deve validar a força da senha e a formatação do email
- O sistema deve permitir recuperação de senha via email

## RF-02 Cadastro de Medicamentos

Permitir que o usuário registre medicamentos com informações como:

- Nome do medicamento  
- Dosagem (ex: 500mg)
- Frequência (a cada x horas, dias da semana)
- Horários Inicial (ex: 8h, 14h, 20h)
- Duração do tratamento (ex: 30 dias ou até data específica)
- Criticidade (alta, média, baixa) 
- Canal preferencial para lembretes (app, SMS, WhatsApp, email)

Critérios de Aceitação:

- O usuário deve conseguir cadastrar um medicamento em menos de 1 minuto  
- Deve ser possível editar ou excluir medicamentos  
- O sistema deve gerar automaticamente os horários de medicação baseado na frequência e horários iniciais configurados

---

## RF-03 Sistema de Lembretes Inteligentes

Enviar lembretes automáticos para os horários de medicação configurados.

Critérios de Aceitação:

- O sistema deve disparar notificações no horário configurado  
- Caso o usuário não confirme a tomada, novos lembretes podem ser enviados com frequência baseada na criticidade do medicamento
- A frequência dos lembretes deve respeitar a criticidade do medicamento

**Frequência de Relembretes por Criticidade:**

- **Alta**: Relembretes a cada 15 minutos por 2 horas (máx. 8 tentativas)
- **Média**: Relembretes a cada 30 minutos por 1 hora (máx. 2 tentativas)
- **Baixa**: Sem relembretes automáticos (apenas 1 lembretes no horário programado)

---

## RF-04 Notificações Multicanal

Permitir que o usuário escolha onde deseja receber lembretes:

- Push notification (app)
- SMS
- WhatsApp
- Email

Critérios de Aceitação:

- O usuário pode escolher um ou múltiplos canais  
- O sistema deve respeitar a preferência configurada  
- Notificações devem ser enviadas no horário correto
- **MVP (V1)**: Apenas push notifications e email
- **V2**: Suporte completo para SMS e WhatsApp  

---

## RF-05 Confirmação de Tomada de Medicamento

Permitir que o usuário confirme quando tomou o medicamento.

Critérios de Aceitação:

- O usuário deve conseguir confirmar a medicação em um clique na notificação web/app
- O usuário deve conseguir confirmar a medicação respondendo à notificação (ex: responder "Tomado" no WhatsApp, SMS ou email)  
- O sistema deve registrar a confirmação no histórico  
- Caso não haja confirmação, o sistema pode enviar lembretes adicionais baseados na criticidade do medicamento

---

## RF-06 Histórico de Adesão ao Tratamento

Disponibilizar um histórico da adesão do usuário aos medicamentos.

Critérios de Aceitação:

- O usuário deve visualizar quais medicamentos foram tomados ou esquecidos em uma lista ou calendário

---

## RF-07 Integração com Calendários

Permitir sincronização com calendários digitais.

Critérios de Aceitação:

- Eventos de medicação devem aparecer no calendário do usuário após cadastro 
- Alterações no aplicativo devem atualizar automaticamente o calendário  
- Integração com Google Calendar

---

# Requisitos Não Funcionais

## RNF-01 Usabilidade

A interface deve ser simples, acessível e intuitiva, permitindo que usuários com baixo nível de familiaridade tecnológica consigam utilizar o sistema facilmente.

---

## RNF-02 Disponibilidade

O sistema deve possuir alta disponibilidade, com uptime mínimo de 99,5%.

---

## RNF-03 Escalabilidade

A arquitetura deve suportar crescimento gradual da base de usuários sem degradação significativa de performance.

---

## RNF-04 Segurança de Dados

Dados de saúde e informações pessoais dos usuários devem ser protegidos seguindo boas práticas de segurança e conformidade com a LGPD.

---

## RNF-05 Performance

Notificações devem ser disparadas com atraso máximo de 1 minuto em relação ao horário programado.

---

# Métricas de Sucesso

- Taxa de adesão ao tratamento (medicações confirmadas / medicações programadas)
- Redução da taxa de medicamentos esquecidos
- Número médio de medicamentos cadastrados por usuário
- Taxa de retenção de usuários (30, 60 e 90 dias)
- Taxa de confirmação de medicação após lembrete
- Engajamento com notificações (abertura/interação)

---

# Premissas e restrições

Premissas:

- Usuários possuem smartphone ou acesso a canais digitais  
- Usuários estão dispostos a registrar seus medicamentos inicialmente  
- Usuários autorizam envio de notificações  

Restrições:

- Integrações com WhatsApp podem exigir APIs pagas  
- Dependência de serviços externos para envio de SMS  
- Integração com calendários depende de permissões do usuário  

---

# Escopo

## V1 — MVP

- Cadastro de usuário e login
- Cadastro de medicamentos    
- Lembretes via push notification  
- Lembretes via email
- Confirmação de tomada de medicamento  
- Histórico básico de adesão  
- Interface simples e responsiva
- Configurações de conta e preferências de notificação  

---

## V2 — Expansão de canais

- Notificações via SMS  
- Integração com WhatsApp  
- Integração com email  
- Integração com calendários  

---

## V3 — Inteligência e automação

- Lembretes adaptativos baseados no comportamento do usuário  
- Insights de adesão ao tratamento  
- Relatórios avançados de saúde  
- Compartilhamento de dados com médicos ou cuidadores  