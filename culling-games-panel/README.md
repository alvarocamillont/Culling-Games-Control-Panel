# 🏯 Culling Games Control Panel — Angular App

Este diretório contém o código-fonte da aplicação Angular modernizada para o **Painel de Controle do Jogo do Abate**.

Para uma explicação didática detalhada sobre a arquitetura do projeto, fluxo de desenvolvimento agêntico (AI Studio + Antigravity), e conceitos de Jujutsu Kaisen aplicados, consulte o **[README principal na raiz do repositório](../README.md)**.

---

## 🚀 Comandos Rápidos

Abaixo estão os comandos disponíveis para execução a partir deste diretório (`culling-games-panel/`).

### 📦 Instalação de Dependências
```bash
npm install
```

### ⚡ Servidor de Desenvolvimento
Inicia o servidor de desenvolvimento local com renderização do lado do servidor (SSR) ativa:
```bash
npm run start
```
* Acesse em: [http://localhost:4200](http://localhost:4200)

### 🧪 Testes Unitários (Vitest)
Executa a suíte de testes unitários rápidos usando o Vitest integrado:
* **Modo interativo (Watch):** `npx ng test`
* **Modo de execução única (CI):** `npx ng test --watch=false`

### 🎭 Testes E2E (Playwright)
Executa os testes ponta a ponta simulando interações reais no navegador:
* **Modo Headless (Silencioso):** `npm run e2e`
* **Interface Visual do Playwright:** `npm run e2e:ui`

> [!NOTE]
> O Playwright irá iniciar automaticamente o servidor Angular em segundo plano. Não é necessário executar `npm run start` separadamente antes de iniciar os testes E2E.

### 🏗️ Build de Produção
Compila o projeto otimizado para produção:
```bash
npm run build
```
Os arquivos gerados serão salvos na pasta `dist/`.
