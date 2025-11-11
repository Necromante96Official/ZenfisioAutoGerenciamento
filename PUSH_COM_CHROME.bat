@echo off
REM ===============================================
REM  PUSH GITHUB COM CHROME - Auto Gerenciamento
REM  v1.0.0.6
REM ===============================================

chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM Caminhos
set "PROJECT_DIR=C:\Users\Clinica\Desktop\= Lucas Tavares =\Automação 2\zenfisio-manager"
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "CHROME_PORTABLE_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

REM Verificar Chrome
if exist "%CHROME_PATH%" (
    set "CHROME=%CHROME_PATH%"
) else if exist "%CHROME_PORTABLE_PATH%" (
    set "CHROME=%CHROME_PORTABLE_PATH%"
) else (
    echo ❌ Chrome não encontrado!
    echo Instale o Google Chrome em: C:\Program Files\Google\Chrome\Application\chrome.exe
    pause
    exit /b 1
)

REM Ir para o diretório
cd /d "%PROJECT_DIR%"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   PUSH GITHUB COM CHROME - Auto Gerenciamento v1.0.0.6     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Diretório: %PROJECT_DIR%
echo Chrome: %CHROME%
echo.

REM Abrir Chrome para login do GitHub
echo [0/8] Abrindo Chrome para autenticação...
echo 🌐 Clique em "Sign in with your browser" quando aparecer
echo.
start "" "%CHROME%" "https://github.com/login"
timeout /t 5 /nobreak

echo.
echo [1/8] Inicializando repositório Git...
call git init
if errorlevel 1 goto :error
echo ✅ Git inicializado
echo.

echo [2/8] Configurando email...
call git config user.email "gerenciamento@zenfisio.local"
echo ✅ Email configurado
echo.

echo [3/8] Configurando nome de usuário...
call git config user.name "Zenfisio Auto Gerenciamento"
echo ✅ Nome configurado
echo.

echo [4/8] Adicionando arquivos...
call git add .
if errorlevel 1 goto :error
echo ✅ Arquivos adicionados
echo.

echo [5/8] Fazendo commit...
call git commit -m "v1.0.0.6 - Auto Gerenciamento Zenfisio - Versão Inicial com README e módulos completos"
if errorlevel 1 goto :error
echo ✅ Commit realizado
echo.

echo [6/8] Configurando branch principal...
call git branch -M main
echo ✅ Branch 'main' configurado
echo.

echo [7/8] Adicionando remote do GitHub...
call git remote remove origin 2>nul
call git remote add origin https://github.com/Necromante96Official/ZenfisioAutoGerenciamento.git
if errorlevel 1 goto :error
echo ✅ Remote adicionado
echo.

echo [8/8] Fazendo push para GitHub...
echo ⚠️  Isso pode levar alguns segundos...
echo 💡 Use a janela do Chrome que foi aberta para autenticar
echo.
call git push -u origin main
if errorlevel 1 goto :error

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ PUSH CONCLUÍDO COM SUCESSO!                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📦 Repositório: https://github.com/Necromante96Official/ZenfisioAutoGerenciamento
echo 📊 Branch: main
echo 📝 Versão: v1.0.0.6
echo.
echo Arquivos no repositório:
git ls-files | find /c /v ""
echo.
echo Status do repositório:
echo ----------
git log --oneline -1
echo ----------
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERRO DURANTE O PUSH
echo.
echo 💡 Dicas:
echo  1. Verifique sua conexão com internet
echo  2. Verifique suas credenciais do GitHub
echo  3. Tente fazer login novamente no Chrome
echo  4. Se o repositório não existir, crie em https://github.com/new
echo.
pause
exit /b 1
