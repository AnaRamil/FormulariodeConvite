# Festivite — como rodar (resumo)

Projeto estático (HTML/CSS/JS) para criar convites digitais.

Principais arquivos

- `index.html` — página principal
- `style/index.css` — estilos
- `script.js` — comportamento
- `assets/` — imagens e ícones

Abrir localmente

- Duplo-clique em `index.html` ou, no PowerShell: `ii .\index.html`

Rodar servidor (recomendado)

- Python: `python -m http.server 8000` → abrir `http://localhost:8000`
- Node: `npx http-server . -p 8000` (ou `npx serve . -l 8000`)
- VS Code: usar a extensão Live Server

Observação sobre CSS

- Se o CSS não carregar, verifique em `index.html` se o link usa `style/index.css` (sem `/` no início).

Script útil

- `serve.ps1` (na raiz) inicia um servidor via Python ou `npx` automaticamente. Executar:

  .\serve.ps1 # porta 8000 por padrão
  .\serve.ps1 3000 # porta 3000

Problemas rápidos

- Imagens faltando: confirme a pasta `assets/` e verifique o Console/Network no DevTools.
- Erros JS: veja o Console do navegador.

Contribuir / testar

- Edite `index.html`, `style/index.css` ou `script.js` e recarregue a página (ou use Live Server).

Licença: uso local / educativo.
