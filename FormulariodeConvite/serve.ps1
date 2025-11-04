Param(
    [int]$Port = 8000
)

# Move para a pasta do script (raiz do projeto) e inicia servidor HTTP
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location $scriptDir

Write-Host "Iniciando servidor local em: $scriptDir na porta $Port`n"

# Tenta Python (python ou python3)
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Usando: python -m http.server $Port"
    & python -m http.server $Port
    exit
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    Write-Host "Usando: python3 -m http.server $Port"
    & python3 -m http.server $Port
    exit
}

# Se não houver Python, tenta npx (http-server)
if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Host "Python não encontrado. Usando npx http-server . -p $Port"
    & npx http-server . -p $Port
    exit
}

Write-Host "Nenhum servidor encontrado (Python ou npx). Por favor rode manualmente um dos comandos abaixo:" -ForegroundColor Yellow
Write-Host "  python -m http.server 8000"
Write-Host "  npx http-server . -p 8000"
