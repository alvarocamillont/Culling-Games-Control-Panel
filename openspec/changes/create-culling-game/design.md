## Context

A aplicação do Painel de Controle dos Culling Games (Jogo do Abate) será uma SPA (Single Page Application) desenvolvida em Angular com Server-Side Rendering (SSR). Ela fornecerá uma interface tática em tempo real para gerenciar feiticeiros e seus pontos. Como não há um backend persistente externo, o estado dos participantes será gerenciado em memória pelo próprio servidor SSR do Angular (`server.ts`) e persistido temporariamente via LocalStorage no cliente como fallback.

A interface visual completa da aplicação já está totalmente desenhada no modelo de UX em [index.html](file:///Users/alvarocamilloneto/antigravity/Culling-Games-Control-Panel/ux%20example/index.html). Embora o protótipo apresente uma estrutura que simula componentes (próxima ao React/HTML estático), o objetivo deste projeto é traduzir esse layout e toda a sua riqueza visual (estilização Tailwind CSS, classes, cores, scanlines e animações) para a arquitetura de componentes do Angular.

## Goals / Non-Goals

**Goals:**
- Criar a SPA Angular com suporte a SSR e API interna no `server.ts`.
- Garantir compatibilidade total com os conceitos modernos do Angular (Standalone Components, Signals, control flow `@if` e `@for`).
- Integrar Tailwind CSS para reproduzir fielmente o design dark mode tático fornecido no template de UX (`ux example/index.html`), convertendo a estrutura original para o Angular.
- Fornecer endpoints no SSR (`GET /api/players`, `POST /api/players`, `PUT /api/players/:id/points`, etc.) com persistência em memória.
- Configurar suporte a testes unitários com Vitest e testes E2E/Regressão Visual com Playwright.

**Non-Goals:**
- Integração com banco de dados externo persistente (PostgreSQL, MongoDB, etc.). Toda a persistência em backend será temporária em memória.
- Autenticação e autorização complexas de usuários (o painel é de acesso livre de simulação).

## Decisions

### 1. Arquitetura de Componentes Standalone
Adotaremos componentes standalone para manter o projeto modular e enxuto. Cada componente do Angular irá herdar a estrutura correspondente de HTML/Tailwind presente no protótipo `ux example/index.html`:
- `CullingGamesBoardComponent`: Smart Component principal atuando como container de tela, gerenciador das ações do serviço e controlador do layout de duas colunas do protótipo.
- `PlayerRegistrationComponent`: Dumb Component contendo o formulário de cadastro de feiticeiros (mapeado da seção "Participation" do template).
- `PlayerGridComponent`: Dumb Component responsável por renderizar a grid de cards de feiticeiros e disparar eventos de alteração de status/pontos/deletar (mapeado da grid central do template).
- `KoganeLogsComponent`: Dumb Component para exibição do feed de logs do Kogane (mapeado do terminal de logs no rodapé esquerdo do template).
- `RulesModalComponent`: Dumb Component para exibir o modal de regras (mapeado do modal flutuante do template).

*Alternativas consideradas:* Componentes clássicos baseados em NgModule. Rejeitado por ser considerado uma prática legada no Angular moderno.

### 2. Gerenciamento de Estado Reativo com Signals
Utilizaremos `signal`, `computed` e `effect` do Angular para manter o estado sincronizado em tempo real na interface (ex.: contadores da barra de estatísticas e filtros da grid).
- Um serviço global `CullingGamesService` manterá o estado de feiticeiros como um signal privado de escrita e exporá signals de leitura para os componentes.

*Alternativas consideradas:* NgRx Store. Rejeitado devido ao escopo simples do projeto, evitando complexidade acidental.

### 3. Servidor SSR do Angular (`server.ts`) como API Backend
Usaremos a infraestrutura de SSR nativa do Angular para servir endpoints de API no mesmo servidor Express que serve a aplicação. O estado será mantido em memória no array global do `server.ts`.

*Alternativas consideradas:* Criar um backend separado em Node.js/NestJS. Rejeitado para simplificar o deploy e manter o tutorial focado em uma única stack unificada.

### 4. Estilização com Tailwind CSS
Integrar Tailwind CSS v4 ou versão compatível recomendada pelo CLI para estilizar a aplicação com o tema escuro tático, utilizando as fontes e cores customizadas (asfalto, roxo expansão de domínio, verde pulso e vermelho carmesim).

## Risks / Trade-offs

- **[Risco] Perda de dados no reinício do servidor** → Como o estado no backend SSR é em memória, qualquer reinício do servidor apagará os novos feiticeiros cadastrados.
  - *Mitigação:* O cliente salvará e sincronizará o estado com o `localStorage` do navegador como fallback e re-hidratará a lista de feiticeiros quando necessário, além de fornecer um botão de "Reset Database" para carregar a matriz inicial.
- **[Risco] Concorrência de Estado no SSR** → Multi-usuários acessando o painel podem compartilhar o estado em memória do backend Express de forma inesperada se não planejado.
  - *Mitigação:* O estado em memória no servidor será mantido globalmente e servido a todos. Para fins de simulação e tutorial educacional, este comportamento é aceitável.
