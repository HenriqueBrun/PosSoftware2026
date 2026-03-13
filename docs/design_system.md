# Design System — Pills

## Identidade Visual

- **Produto:** Pills
- **Proposta:** Nunca esqueça seus medicamentos novamente
- **Público:** Pacientes com doenças crônicas, cuidadores, pessoas com TDAH

---

## Tokens de Design

### Cores

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#137fec` | Ações principais, CTAs, botões primários |
| `primary-dark` | `#0d5fad` | Hover/active do primário |
| `background` | `#ffffff` | Fundo principal |
| `surface` | `#f4f7fb` | Cards, painéis, modais |
| `text-primary` | `#1a1a2e` | Textos principais |
| `text-secondary` | `#5a6a7a` | Textos secundários, labels |
| `success` | `#22c55e` | Confirmação de tomada |
| `warning` | `#f59e0b` | Criticidade média |
| `danger` | `#ef4444` | Criticidade alta, ações destrutivas |
| `border` | `#e2e8f0` | Bordas de componentes |

### Tipografia

- **Fonte:** Inter (Google Fonts)
- **Pesos:** 400, 500, 600, 700
- **Escala:** 12 / 14 / 16 / 18 / 24 / 32 / 48px

### Espaçamento

Base: `4px` — Escala: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`

### Border Radius

| Token | Valor |
|---|---|
| `sm` | `6px` |
| `md` | `12px` (padrão) |
| `lg` | `16px` |
| `full` | `9999px` (pills/badges) |

---

## Componentes Base

### Botão Primário
- Background: `primary`, texto branco, radius `12px`, padding `12px 24px`
- Hover: `primary-dark` com transição 200ms

### Botão Secundário
- Background: transparente, borda `border`, texto `text-primary`

### Card
- Background: `surface`, sombra leve (`0 1px 3px rgba(0,0,0,0.1)`), radius `12px`

### Badge de Criticidade
- Alta: background `danger/10`, texto `danger`
- Média: background `warning/10`, texto `warning`
- Baixa: background `success/10`, texto `success`

---

## Modo

- **Modo padrão:** Light
- **V2:** Dark mode (a definir)

---

## Diretrizes de Acessibilidade

- Contraste mínimo AA (WCAG 2.1)
- Tamanho mínimo de toque: `44x44px`
- Labels em todos os inputs
- Foco visível em elementos interativos
