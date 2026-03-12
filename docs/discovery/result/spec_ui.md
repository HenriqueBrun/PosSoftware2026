# Especificação de UI

## Interfaces gráficas

### INT-01 - Tela de Boas-Vindas

* Página
* **Campos:** nenhum
* **Botões:** Criar Conta, Entrar
* **Links:** Termos de Uso, Política de Privacidade
* **Considerações:**

  * Primeira tela exibida ao usuário.
  * Deve apresentar logo do produto e nome de forma clara. (Pills)
  * Deve apresentar proposta de valor do produto de forma simples: *"Nunca esqueça seus medicamentos novamente"*.
  * Layout simples com foco em acessibilidade e leitura rápida.

---

### INT-02 - Cadastro de Usuário

* Formulário
* **Campos:** Nome Completo, Email, Telefone, Senha, Confirmar Senha
* **Botões:** Criar Conta, Voltar
* **Considerações:**

  * Validação de senha forte.
  * Validação de formato de email e telefone.
  * Indicação visual clara de erros de preenchimento.

---

### INT-03 - Login

* Formulário
* **Campos:** Email, Senha
* **Botões:** Entrar
* **Links:** Esqueci minha senha, Criar Conta
* **Considerações:**

  * Opção de login simplificado.
  * Mensagens claras em caso de erro de autenticação.

---

### INT-04 - Dashboard / Home

* Página
* **Campos:**
  * Lista de medicamentos do dia com horários programados e botão de confirmação
* **Botões:** Adicionar Medicamento, editar medicamentos existentes, botão de confirmação para cada medicamento dentro do item da lista
* **Links:** Ver Histórico, Configurações de conta, Calendário
* **Considerações:**

  * Tela principal do sistema.
  * Interface simples e visual para reduzir esforço cognitivo.

---

### INT-05 - Cadastro de Medicamento

* Formulário
* **Campos:**

  * Nome do Medicamento
  * Dosagem
  * Frequência (intervalo ou dias da semana)
  * Horários Iniciais
  * Duração do Tratamento (data de início e fim ou número de dias ou semanas)
  * Criticidade (Alta, Média, Baixa)
  * Canal Preferencial de Lembrete (App, SMS, WhatsApp, Email)
* **Botões:** Salvar Medicamento, Cancelar
* **Links:** nenhum
* **Considerações:**

  * Interface simplificada com opções pré-definidas para acelerar cadastro.
  
---

### INT-06 - Lista de Medicamentos

* Tabela / Lista
* **Campos:** Nome do Medicamento, Dosagem, Frequência, Próximo Horário
* **Botões:** Editar, Excluir, Adicionar Medicamento
* **Links:** Ver Detalhes
* **Considerações:**

  * Interface clara e escaneável e paginada.
  * Uso de ícones para facilitar compreensão.

---

### INT-07 - Confirmação de Tomada

* Modal / Componente de ação rápida
* **Campos:** Nome do Medicamento, Horário Programado
* **Botões:** Confirmar Tomada, Adiar, Ignorar
* **Links:** Ver Detalhes do Medicamento
* **Considerações:**

  * Deve ser acionado a partir de notificação.
  * Interação com **um clique** para confirmação.
  * Deve registrar automaticamente no histórico.

---

### INT-08 - Histórico de Adesão

* Página
* **Campos:**

  * Lista de medicamentos tomados
  * Lista de medicamentos esquecidos
  * Data e horário
* **Botões:** Filtrar, Exportar
* **Links:** Voltar para Home
* **Considerações:**

  * Visualização em **lista ou calendário**.
  * Destaque visual para medicamentos não tomados.

---

### INT-09 - Visualização em Calendário

* Calendário
* **Campos:** Eventos de medicação
* **Botões:** Navegar mês, Sincronizar Calendário
* **Links:** Ver Detalhes do Evento
* **Considerações:**

  * Integração com Google Calendar.
  * Eventos exibidos automaticamente após cadastro de medicamento.

---

### INT-10 - Recuperação de Senha

* Formulário
* **Campos:** Email
* **Botões:** Enviar Link de Recuperação, Voltar
* **Considerações:**

  * Acessível via link "Esqueci minha senha" na tela de login.
  * Envio de link seguro para resetar senha via email.
  * Link de recuperação deve ter validade limitada (ex: 1 hora).

---

### INT-11 - Configurações de Conta

* Página com abas/seções
* **Campos:**

  * Nome Completo
  * Email
  * Telefone
  * Senha (com opção de alterar)
* **Botões:** Salvar Alterações, Cancelar, Logout, Deletar Conta (com confirmação)
* **Links:** Voltar para Dashboard
* **Considerações:**

  * Interface para gerenciar dados pessoais e preferências de notificação.
  * Confirmar alteração de senha com senha atual.
  * Operação de deleção de conta deve ser irreversível (com dupla confirmação).

---

## Fluxo de Navegação

Fluxo principal do usuário:

1. Tela de Boas-Vindas
2. Cadastro ou Login
3. Acesso ao Dashboard
4. Cadastro de Medicamento
5. Sistema agenda horários automaticamente
6. Usuário recebe lembretes
7. Usuário confirma tomada
8. Registro é salvo no histórico

Fluxos secundários:

**Gestão de Medicamentos**

Dashboard → Lista de Medicamentos → Editar / Excluir

**Consulta de Histórico**

Dashboard → Histórico → Filtros → Visualização por lista ou calendário

---

## Diretrizes para IA

A IA que interpretar este documento deve considerar:

1. **Cada INT representa uma interface distinta do sistema.**

2. **Campos** representam elementos de entrada ou informação exibida ao usuário.

3. **Botões** representam ações principais que devem disparar eventos no sistema.

4. **Links** representam navegação entre interfaces.

5. A IA deve priorizar:

* Simplicidade de uso
* Redução de carga cognitiva
* Acessibilidade
* Interações rápidas (principalmente para confirmação de medicamentos)

6. Interfaces devem ser **mobile-first**, pois o principal canal de uso será smartphone.

7. Elementos críticos da experiência:

* Confirmar medicamento rapidamente
* Visualizar próximos medicamentos com clareza
* Receber lembretes de forma confiável

8. Em implementações futuras, a IA pode expandir a UI com:

* insights de adesão
* recomendações de horários
* compartilhamento de histórico com médicos ou cuidadores.
