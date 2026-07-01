# Especificação de Projeto: Sistema de Registro e Monitoramento - Culling Games (Jogo do Abate)

## 1. Visão Geral do Projeto e Objetivos Educacionais
Este projeto é um tutorial prático de Engenharia AI-Native que demonstra um fluxo de trabalho moderno de desenvolvimento de software acelerado por inteligência artificial. O produto final é uma aplicação web (SPA com SSR) que atua como painel de controle para o "Jogo do Abate" (*Jujutsu Kaisen*). 

Mais do que apenas gerar código front-end de alta performance e rigor técnico, o objetivo central deste projeto é demonstrar a transição perfeita de modelos conceituais para a engenharia de produção, integrando orquestração de agentes locais e validação contínua.

## 2. Stack Tecnológica e Ferramentas AI
* **Front-end:** Angular v21.
* **Orientação de IA:** O agente gerador de código (Antigravity) deve consumir e aplicar as diretrizes oficiais de IA do Angular disponíveis em [https://angular.dev/ai/agent-skills](https://angular.dev/ai/agent-skills).
* **Estilização:** Tailwind CSS (abordagem utility-first).
* **Testes Unitários:** Vitest (conforme diretrizes de frameworks alternativos da documentação oficial em [https://angular.dev/guide/testing#other-test-frameworks](https://angular.dev/guide/testing#other-test-frameworks)).
* **Testes E2E e Automação Visual:** Playwright integrado a ambientes Chrome Headless.
* **Back-end/Estado:** API embutida no servidor SSR do Angular (`server.ts`) com armazenamento temporário em memória.

## 3. Fluxos de Trabalho Avançados e Integração de Agentes (Foco do Tutorial)
Para dar suporte ao tutorial, o projeto deve ser estruturado de forma a facilitar as seguintes práticas de orquestração e transição de ciclo de vida:

* **Exportação do Ciclo de Vida do Google AI Studio (Lifecycle Export):** Geração de projetos com um clique, permitindo a transferência impecável de protótipos em nuvem (multi-agentes) diretamente para workspaces locais de produção.
* **Do Protótipo à Produção (Prototyping to Production):** Uma arquitetura que suporte a transição estruturada de conceitos de UI criados em ambientes sandbox para fluxos de trabalho locais complexos e rigorosos.
* **Verificação Contínua e Atuação no Navegador (Continuous Verification & Browser Actuation):** Implementação de uma camada de comando explícita (`/browser`), mapeando o uso de ferramentas de agentes autônomos para executar ações diretamente em ambientes de teste baseados em Chrome headless.
* **Testes de Regressão Visual Orientados por IA (AI-Driven Visual Regression):** Capacitação do repositório para o treinamento de agentes locais, permitindo que eles orquestrem o deploy de builds locais e utilizem instâncias reais do navegador para verificar visualmente as mudanças no código.

## 4. Requisitos Não Funcionais (Arquitetura e Qualidade)
As seguintes diretrizes arquiteturais são mandatórias para a geração de código:
* **Conformidade Angular 21:** Uso exclusivo de Componentes Standalone, gerenciamento de estado reativo nativo com Signals (`signal`, `computed`, `effect`) e nova sintaxe de fluxo de controle (`@if`, `@for`).
* **Simplicidade Extrema:** Evitar complexidade acidental. O código deve ser o mais simples possível, com intenção de negócio claramente expressa na nomenclatura de funções e variáveis, facilitando a leitura por agentes autônomos e desenvolvedores.
* **Arquitetura DRY (Don't Repeat Yourself):** Centralização de estados e requisições HTTP em serviços injetáveis. Zero duplicação de lógica ou layouts, otimizando o repositório para as verificações visuais e unitárias.
* **Testabilidade Nativa:** A separação de responsabilidades (Dumb/Smart components) deve garantir que o Vitest possa validar a lógica isoladamente, enquanto o Playwright atua nas validações de regressão visual no navegador.

## 5. Requisitos Funcionais
O sistema deve implementar as seguintes funcionalidades no painel:
1.  **Registro de Feiticeiros (Participantes):** Formulário reativo para inscrição de jogadores. Campos obrigatórios: Nome, Colônia (Local de Entrada) e Técnica Amaldiçoada.
2.  **Monitoramento (Dashboard):** Grid ou lista em tempo real mostrando os jogadores ativos. Deve exibir: Nome, Colônia, Status (Vivo/Morto) e Pontuação Atual.
3.  **Gestão de Pontos e Regras:** Interface simplificada dentro do dashboard para adicionar ou remover pontos dos jogadores, aplicando as dinâmicas do Jogo do Abate.

## 6. Diretrizes de Design de Interface (Para Stitch / UX)
* **Tema Visual:** Dark mode nativo com estética utilitária, tática e sombria.
* **Paleta de Cores:** Fundo principal em tons escuros profundos (asfalto, grafite), textos em alto contraste e elementos de destaque em cores de energia amaldiçoada (Roxo Expansão de Domínio, Vermelho Carmesim ou Verde Fluorescente).
* **Responsividade Integrada:** Layout fluido usando Tailwind CSS. Adaptável de formulários colapsáveis em mobile para painéis de registro e monitoramento lado a lado em desktops, garantindo que os testes de regressão visual via Playwright cubram múltiplos *viewports*.

## 7. Estrutura de Componentes e Integração SSR
* **Gerenciamento de Estado:** Um serviço centralizado `CullingGamesService` que gerencia as chamadas via `HttpClient` para a API interna e expõe os dados através de Read-Only Signals.
* **Arquitetura de Componentes (Standalone):**
    * `CullingGamesBoardComponent` (Smart Component / Container de tela)
    * `PlayerRegistrationComponent` (Dumb Component / Formulário de entrada)
    * `PlayerGridComponent` (Dumb Component / Exibição da listagem)
* **Endpoints do Servidor SSR (`server.ts`):**
    * `GET /api/players` -> Retorna a lista de feiticeiros.
    * `POST /api/players` -> Insere um novo participante no array em memória.
    * `PUT /api/players/:id/points` -> Atualiza os pontos de um participante específico.