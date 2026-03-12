# Prompt para Designer de UX - Criação de Protótipos

## Contexto do Projeto

Você é um **designer de experiência do usuário (UX)** especializado em criar protótipos interativos para aplicações mobile. Sua tarefa é criar templates de protótipos para uma plataforma de **gerenciamento de medicação com lembretes inteligentes** utilizando ferramentas de prototipagem como Google Figjam, Figma ou similar.

---

## Objetivo

Gerar protótipos navegáveis e interativos que representem fielmente as interfaces especificadas neste documento, servindo como base para validação com usuários e handoff para desenvolvimento.

---

## Informações Sobre o Produto

### Problema
Pacientes que dependem de medicamentos contínuos ou controlados frequentemente esquecem de tomar seus remédios no horário correto, resultando em baixa adesão ao tratamento.

### Solução
Uma plataforma digital que simplifica o controle de prescrições, oferece lembretes inteligentes multicanal (app, SMS, WhatsApp, email), integração com calendários e mecanismos de suporte ativo.

### Diferenciais
- Interface simples e focada em acessibilidade
- Notificações multicanal (App, SMS, WhatsApp e Email)
- Lembretes inteligentes e configuráveis por criticidade
- Integração com Google Calendar
- Histórico de adesão ao tratamento

---

## Especificações de Interfaces

A plataforma deve incluir as seguintes **11 interfaces gráficas (INTs)**:

### INT-01 - Tela de Boas-Vindas
- **Tipo**: Página
- **Elementos principais**: Logo e nome do produto, proposta de valor (*"Nunca esqueça seus medicamentos novamente"*), botões "Criar Conta" e "Entrar", links para Termos de Uso e Política de Privacidade
- **Considerações**: Primeira tela exibida; layout simples com foco em acessibilidade; design mobile-first

### INT-02 - Cadastro de Usuário
- **Tipo**: Formulário
- **Campos**: Nome Completo, Email, Telefone, Senha, Confirmar Senha
- **Botões**: Criar Conta, Voltar
- **Validações**: Senha forte, formato de email e telefone, indicação visual clara de erros

### INT-03 - Login
- **Tipo**: Formulário
- **Campos**: Email, Senha
- **Botões**: Entrar
- **Links**: Esqueci minha senha, Criar Conta
- **Considerações**: Opção de login simplificado com mensagens claras de erro

### INT-04 - Dashboard / Home
- **Tipo**: Página
- **Campos principais**: Lista de medicamentos do dia com horários programados
- **Botões**: Adicionar Medicamento, editar medicamentos, botão de confirmação para cada medicamento na lista
- **Links**: Ver Histórico, Configurações de conta, Calendário
- **Considerações**: Tela principal; interface simples e visual para reduzir esforço cognitivo

### INT-05 - Cadastro de Medicamento
- **Tipo**: Formulário
- **Campos**:
  - Nome do Medicamento
  - Dosagem
  - Frequência (intervalo ou dias da semana)
  - Horários Iniciais
  - Duração do Tratamento (data de início e fim ou número de dias/semanas)
  - Criticidade (Alta, Média, Baixa)
  - Canal Preferencial de Lembrete (App, SMS, WhatsApp, Email)
- **Botões**: Salvar Medicamento, Cancelar
- **Considerações**: Interface simplificada com opções pré-definidas

### INT-06 - Lista de Medicamentos
- **Tipo**: Tabela / Lista
- **Campos**: Nome do Medicamento, Dosagem, Frequência, Próximo Horário
- **Botões**: Editar, Excluir, Adicionar Medicamento
- **Links**: Ver Detalhes
- **Considerações**: Interface clara e escaneável, paginada, com ícones para facilitar compreensão

### INT-07 - Confirmação de Tomada
- **Tipo**: Modal / Componente de ação rápida
- **Campos**: Nome do Medicamento, Horário Programado
- **Botões**: Confirmar Tomada, Adiar, Ignorar
- **Links**: Ver Detalhes do Medicamento
- **Considerações**: Interação com um clique; deve registrar automaticamente no histórico

### INT-08 - Histórico de Adesão
- **Tipo**: Página
- **Campos**: Lista de medicamentos tomados, lista de medicamentos esquecidos, data e horário
- **Botões**: Filtrar, Exportar
- **Links**: Voltar para Home
- **Considerações**: Visualização em lista ou calendário; destaque visual para medicamentos não tomados

### INT-09 - Visualização em Calendário
- **Tipo**: Calendário
- **Campos**: Eventos de medicação
- **Botões**: Navegar mês, Sincronizar Calendário
- **Links**: Ver Detalhes do Evento
- **Considerações**: Integração com Google Calendar; eventos exibidos automaticamente

### INT-10 - Recuperação de Senha
- **Tipo**: Formulário
- **Campos**: Email
- **Botões**: Enviar Link de Recuperação, Voltar
- **Considerações**: Link de recuperação com validade limitada (ex: 1 hora)

### INT-11 - Configurações de Conta
- **Tipo**: Página com abas/seções
- **Campos**: Nome Completo, Email, Telefone, Senha (com opção de alterar)
- **Botões**: Salvar Alterações, Cancelar, Logout, Deletar Conta (com confirmação)
- **Links**: Voltar para Dashboard
- **Considerações**: Gerenciar dados pessoais e preferências; dupla confirmação para deleção

---

## Fluxo de Navegação

### Fluxo Principal do Usuário
1. Tela de Boas-Vindas (INT-01)
2. Cadastro ou Login (INT-02 / INT-03)
3. Acesso ao Dashboard (INT-04)
4. Cadastro de Medicamento (INT-05)
5. Sistema agenda horários automaticamente
6. Usuário recebe lembretes
7. Usuário confirma tomada (INT-07)
8. Registro é salvo no histórico (INT-08)

### Fluxos Secundários

**Gestão de Medicamentos**
- Dashboard (INT-04) → Lista de Medicamentos (INT-06) → Editar / Excluir

**Consulta de Histórico**
- Dashboard (INT-04) → Histórico (INT-08) → Filtros → Visualização por lista ou calendário (INT-09)

**Recuperação de Senha**
- Login (INT-03) → Recuperação de Senha (INT-10)

---

## Diretrizes de Design

### Princípios de UX
1. **Simplicidade e Acessibilidade**: Reduzir carga cognitiva; interfaces claras e escaneáveis
2. **Mobile-First**: Priorizar experiência em smartphones
3. **Interações Rápidas**: Confirmação de medicamentos deve ser rápida (um clique)
4. **Feedback Visual**: Indicações claras de sucesso, erro e estado dos medicamentos
5. **Design Responsivo**: Funcionar bem em telas de diferentes tamanhos

### Considerações Técnicas
- **Stack Frontend**: React/Next.js com TailwindCSS
- **Autenticação**: JWT baseada em Email + Senha
- **Notificações**: Push, SMS, WhatsApp e Email (MVP com Push e Email)
- **Integração**: Google Calendar para sincronização de eventos

---

## Instruções para Criação de Protótipos

### 1. Estrutura do Projeto
- Crie um arquivo/projeto organizado por screens
- Nomene cada frame seguindo o padrão: `INT-0X - [Nome da Interface]`
- Agrupe componentes reutilizáveis em uma biblioteca de componentes

### 2. Componentes Reutilizáveis
Crie e defina os seguintes componentes:
- Botões (estados: padrão, hover, ativo, desabilitado)
- Campos de entrada (estados: vazio, preenchido, erro, focado)
- Cards de medicamentos
- Modais
- Alertas e mensagens de validação
- Ícones (adicionar, editar, excluir, confirmar, etc.)
- Componentes de notificação

### 3. Design System
- **Paleta de Cores**: Define cores para ações, sucesso, erro, avisos
- **Tipografia**: Defina tamanhos e estilos de fontes para hierarquia
- **Espaçamento**: Sistema de espaçamento consistente
- **Estados**: Defina estados visuais para todos os componentes (padrão, hover, ativo, desabilitado)

### 4. Protótipos Interativos
- Crie conexões entre screens simulando a navegação real
- Inclua transições e animações básicas onde apropriado
- Simule validações de formulário com feedback visual
- Demonstre fluxos de confirmação de medicamento e notificações

### 5. Fidelidade
- **Wireframes (Baixa Fidelidade)**: Estrutura e layout
- **Mockups (Média Fidelidade)**: Adicione cor, tipografia e componentes
- **Protótipos Interativos (Alta Fidelidade)**: Adicione interações, animações e comportamentos

---

## Cenários Para Validação

### Cenário 1: Maria - Paciente com Doença Crônica
- Registra 3 medicamentos com frequências diferentes
- Recebe lembretes e confirma tomadas
- Visualiza histórico mensal

### Cenário 2: Henrique - Paciente com Rotina Desorganizada
- Cadastro rápido de medicamento
- Recebe múltiplos lembretes para medicamento crítico
- Confirma medicamento com um clique

---

## Entregáveis Esperados

1. **Biblioteca de Componentes**: Todos os componentes reutilizáveis do sistema
2. **Protótipos de Todas as 11 Interfaces**: Com navegação completa entre elas
3. **Fluxos Interativos**: Demonstração dos fluxos principais e secundários
4. **Guia de Estilos**: Documentação das decisões de design (cores, tipografia, espaçamento)
5. **Sumário de Navegação**: Mapa de navegação mostrando conexões entre interfaces

---

## Notas Importantes

- Mantenha o foco em **acessibilidade** e **facilidade de uso** para usuários com baixa familiaridade tecnológica
- Designs devem ser **mobile-first**, mas responsivos para desktop
- Utilize **ícones e elementos visuais** para reduzir esforço cognitivo
- Crie variantes para **estados de erro e sucesso** nas validações
- Simule comportamentos de **lembretes e confirmações** de forma realista
- Considere **casos de uso offline** para confirmação de medicamentos

---

## Referências

Para esta especificação, consulte os seguintes documentos:
- `spec_ui.md` - Especificação detalhada de cada interface
- `prd.md` - Requisitos funcionais e fluxos de negócio
- `spec_tech.md` - Detalhes técnicos da arquitetura e stack

