## Why

Esta alteração introduz o Painel de Controle dos Culling Games (Jogo do Abate), servindo como um tutorial prático de Engenharia AI-Native. A aplicação permitirá aos administradores do jogo registrar feiticeiros, monitorar seus status em tempo real e gerenciar a distribuição e transferência de pontos conforme as regras do jogo.

## What Changes

- **Interface de Controle Tática (Dark Mode)**: Criação de uma interface responsiva baseada no modelo `ux example/index.html` com tema escuro e visual militar/tático.
- **Registro de Feiticeiros**: Implementação de formulário reativo para cadastrar feiticeiros com campos para Nome, Colônia de Início, Técnica Amaldiçoada, Pontos Iniciais e Status de Vida.
- **Dashboard de Monitoramento**: Exibição dos feiticeiros em grid com cards interativos de fácil visualização de status (Vivo/Morto) e pontuação.
- **Controle Estatístico**: Painel exibindo em tempo real o total de feiticeiros ativos, pontos distribuídos e taxa de mortalidade.
- **Busca e Filtros Dinâmicos**: Filtros por nome, técnica amaldiçoada, colônia de origem e status de vida (Vivo/Morto/Todos).
- **Gestão de Pontos e Transferências**: Controles para ajuste manual de pontos por jogador e simulador de transferência de pontos entre participantes (através do Kogane).
- **Visualizador de Regras**: Janela modal exibindo as regras oficiais do Jogo do Abate.

## Capabilities

### New Capabilities
- `player-registration`: Inscrição de participantes com validação de campos obrigatórios (Nome, Colônia) e opcionais (Técnica Amaldiçoada, Pontos Iniciais, Status Inicial).
- `dashboard-monitoring`: Monitoramento em tempo real dos participantes em grid com cards coloridos pelo status de vida, estatísticas gerais (Total, Pontos, Mortalidade) e filtros avançados.
- `points-management`: Ajustes incrementais de pontos por jogador, simulação de transferência de pontos de um feiticeiro para outro e visualização de regras do jogo em modal.

### Modified Capabilities

## Impact

- **Front-end (Angular)**: Criação de componentes standalone de alta performance com Signals para gerenciamento de estado reativo e sintaxe moderna do fluxo de controle.
- **Back-end (Vite/SSR Express)**: Criação de rotas de API no servidor SSR (`GET /api/players`, `POST /api/players`, `PUT /api/players/:id/points`) para gerenciamento do estado dos feiticeiros em memória.
- **Estilização (Tailwind CSS)**: Configuração do Tailwind CSS no projeto Angular para aplicar a identidade visual escura e tática.
- **Testes (Vitest & Playwright)**: Configuração e implementação de testes unitários com Vitest e testes E2E com Playwright para regressão visual e funcional.
