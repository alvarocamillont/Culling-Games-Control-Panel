## 1. Setup e Inicialização

- [ ] 1.1 Confirmar instalação do Angular CLI localmente e criar novo projeto Angular com SSR (`culling-games-panel`)
- [ ] 1.2 Configurar o Tailwind CSS no projeto Angular recém-criado
- [ ] 1.3 Instalar e configurar o Vitest para testes unitários no projeto
- [ ] 1.4 Configurar o Playwright para testes de regressão visual e E2E no projeto

## 2. API Backend e Serviço de Estado

- [ ] 2.1 Criar interfaces e tipos de dados para Sorcerer e Kogane Log
- [ ] 2.2 Configurar rotas de API em memória no `server.ts` do Angular SSR (`GET /api/players`, `POST /api/players`, `PUT /api/players/:id/points`, `DELETE /api/players/:id`)
- [ ] 2.3 Criar o serviço `CullingGamesService` com HttpClient e Signals para gerenciar estado reativo de feiticeiros e logs com fallback de LocalStorage

## 3. Desenvolvimento de Componentes Standalone

- [ ] 3.1 Desenvolver o `PlayerRegistrationComponent` com formulário reativo e validação de campos obrigatórios/valores padrão
- [ ] 3.2 Desenvolver o `PlayerGridComponent` para listagem de feiticeiros em grid (cards coloridos baseados em status, toggle de status, exclusão e alteração de pontos)
- [ ] 3.3 Desenvolver o `KoganeLogsComponent` para renderizar o console tático de logs no rodapé esquerdo
- [ ] 3.4 Desenvolver o `RulesModalComponent` para exibir as regras do Culling Game
- [ ] 3.5 Criar o componente container principal `CullingGamesBoard` que coordena os subcomponentes, estatísticas globais da barra superior e filtros (busca por texto, colônia e status)

## 4. Estilização e Integração Visual

- [ ] 4.1 Configurar fontes (Inter, JetBrains Mono, Space Grotesk) no `index.html` do app
- [ ] 4.2 Integrar estilos globais (scanlines, pulso de aviso/ativo, animações de brilho, scrollbar fina) do modelo de UX em `styles.css`
- [ ] 4.3 Montar o layout principal no `app.component.html` integrando o painel de controle completo com cabeçalho e rodapé táticos

## 5. Testes e Validação

- [ ] 5.1 Implementar testes unitários no Vitest para verificar lógica do `CullingGamesService` e validação do formulário
- [ ] 5.2 Implementar testes E2E/Regressão Visual no Playwright para simular fluxos de cadastro, alteração rápida de pontos, transferência de pontos e modal de regras
- [ ] 5.3 Validar a aplicação no navegador via agente `/browser` e garantir build de produção funcional
