<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎨 AI Studio UX Prototype

Este diretório contém o protótipo inicial de interface exportado do **Google AI Studio** para o projeto **Culling Games Control Panel**.

Ele serviu como o modelo conceitual e base de design system visual (paleta de cores, layout básico, estilos CSS) para a construção da aplicação Angular final de produção.

Para a aplicação final em Angular, testes unitários, testes e2e e instruções completas de execução, consulte o **[README principal na raiz do repositório](../README.md)**.

---

## 🏃 Como Executar este Protótipo Estático Localmente

Se você deseja executar especificamente este protótipo estático exportado (HTML/JS estáticos + Gemini API):

### Pré-requisitos
* **Node.js** instalado

### Passo a Passo

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure sua chave de API do Gemini:**
   Crie ou edite o arquivo `.env.local` e configure a variável:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

3. **Execute o servidor de desenvolvimento do protótipo:**
   ```bash
   npm run dev
   ```