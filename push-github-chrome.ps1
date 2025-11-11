# Script PowerShell para Push com Chrome
# Auto Gerenciamento Zenfisio v1.0.0.6

# Cores
$colors = @{
    info = "Cyan"
    success = "Green"
    warning = "Yellow"
    error = "Red"
}

# Definir variáveis de ambiente
$env:GIT_TRACE = 0
$env:GIT_TRACE_PERFORMANCE = 0

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor $colors.success
Write-Host "║    PUSH GITHUB - Auto Gerenciamento Zenfisio v1.0.0.6      ║" -ForegroundColor $colors.success
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor $colors.success

# Diretório do projeto
$projectDir = "C:\Users\Clinica\Desktop\= Lucas Tavares =\Automação 2\zenfisio-manager"

# Ir para o diretório
Set-Location $projectDir

Write-Host "📁 Diretório: $projectDir`n" -ForegroundColor $colors.info

# Função para executar git
function Invoke-Git {
    param([string]$Arguments)
    
    $parts = $Arguments -split ' '
    Write-Host "▶ git $Arguments" -ForegroundColor $colors.info
    
    & git $parts
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao executar: git $Arguments" -ForegroundColor $colors.error
        return $false
    }
    return $true
}

# Passo 1: Git Init
Write-Host "[1/7] Inicializando repositório Git..." -ForegroundColor $colors.info
if (!(Invoke-Git "init")) { exit 1 }
Write-Host "✅ Git inicializado`n" -ForegroundColor $colors.success

# Passo 2: Git Config Email
Write-Host "[2/7] Configurando email..." -ForegroundColor $colors.info
if (!(Invoke-Git "config user.email gerenciamento@zenfisio.local")) { exit 1 }
Write-Host "✅ Email configurado`n" -ForegroundColor $colors.success

# Passo 3: Git Config Name
Write-Host "[3/7] Configurando nome de usuário..." -ForegroundColor $colors.info
if (!(Invoke-Git "config user.name Zenfisio Auto Gerenciamento")) { exit 1 }
Write-Host "✅ Nome configurado`n" -ForegroundColor $colors.success

# Passo 4: Git Add
Write-Host "[4/7] Adicionando arquivos..." -ForegroundColor $colors.info
if (!(Invoke-Git "add .")) { exit 1 }
Write-Host "✅ Arquivos adicionados`n" -ForegroundColor $colors.success

# Passo 5: Git Commit
Write-Host "[5/7] Fazendo commit..." -ForegroundColor $colors.info
if (!(Invoke-Git "commit -m v1.0.0.6 - Auto Gerenciamento Zenfisio - Versão Inicial")) { exit 1 }
Write-Host "✅ Commit realizado`n" -ForegroundColor $colors.success

# Passo 6: Git Branch e Remote
Write-Host "[6/7] Configurando branch e remote..." -ForegroundColor $colors.info
if (!(Invoke-Git "branch -M main")) { exit 1 }

# Remover remote se já existir
git remote remove origin 2>$null

if (!(Invoke-Git "remote add origin https://github.com/Necromante96Official/ZenfisioAutoGerenciamento.git")) { exit 1 }
Write-Host "✅ Branch e remote configurados`n" -ForegroundColor $colors.success

# Passo 7: Git Push (abrirá Chrome para autenticação)
Write-Host "[7/7] Fazendo push para GitHub..." -ForegroundColor $colors.warning
Write-Host "⚠️  Uma janela do CHROME vai abrir para autenticação..." -ForegroundColor $colors.warning
Write-Host "   Faça login com sua conta GitHub`n" -ForegroundColor $colors.info

# Tentar abrir Chrome
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (Test-Path $chromePath) {
    Write-Host "🌐 Abrindo Chrome..." -ForegroundColor $colors.info
    & $chromePath "https://github.com/login" &
    Start-Sleep -Seconds 3
}

# Fazer push
& git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor $colors.success
    Write-Host "║              ✅ PUSH CONCLUÍDO COM SUCESSO!                 ║" -ForegroundColor $colors.success
    Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor $colors.success
    
    Write-Host "📦 Repositório: https://github.com/Necromante96Official/ZenfisioAutoGerenciamento" -ForegroundColor $colors.success
    Write-Host "📊 Branch: main" -ForegroundColor $colors.success
    Write-Host "📝 Versão: v1.0.0.6`n" -ForegroundColor $colors.success
    
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor $colors.info
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} else {
    Write-Host "`n❌ Erro ao fazer push" -ForegroundColor $colors.error
    Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor $colors.error
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}
