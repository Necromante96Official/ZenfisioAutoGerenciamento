@echo off
REM ===============================================
REM  PUSH GITHUB - Auto Gerenciamento Zenfisio
REM  v1.0.0.6
REM ===============================================

chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

REM Forçar Git a usar Chrome para autenticação
set "GIT_ASKPASS="
set "BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "GIT_TRACE=1"

REM Definir diretório do projeto
set "PROJECT_DIR=C:\Users\Clinica\Desktop\= Lucas Tavares =\Automação 2\zenfisio-manager"

REM Ir para o diretório
cd /d "%PROJECT_DIR%"

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    PUSH PARA GITHUB - Auto Gerenciamento Zenfisio v1.0.0.6  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Diretório: %PROJECT_DIR%
echo.

REM Passo 1: Git Init
echo [1/7] Inicializando repositório Git...
call git init
if errorlevel 1 (
    echo ❌ Erro ao inicializar git
    goto :error
)
echo ✅ Git inicializado
echo.

REM Passo 2: Configurar user.email
echo [2/7] Configurando email do Git...
call git config user.email "gerenciamento@zenfisio.local"
if errorlevel 1 (
    echo ❌ Erro ao configurar email
    goto :error
)
echo ✅ Email configurado
echo.

REM Passo 3: Configurar user.name
echo [3/7] Configurando nome do usuário...
call git config user.name "Zenfisio Auto Gerenciamento"
if errorlevel 1 (
    echo ❌ Erro ao configurar nome
    goto :error
)
echo ✅ Nome configurado
echo.

REM Passo 4: Git Add
echo [4/7] Adicionando arquivos ao staging...
call git add .
if errorlevel 1 (
    echo ❌ Erro ao adicionar arquivos
    goto :error
)
echo ✅ Arquivos adicionados
echo.

REM Passo 5: Git Commit
echo [5/7] Fazendo commit...
call git commit -m "v1.0.0.6 - Auto Gerenciamento Zenfisio - Versão Inicial com README, módulo financeiro, evoluções pendentes e limpeza de dados independente"
if errorlevel 1 (
    echo ❌ Erro ao fazer commit
    goto :error
)
echo ✅ Commit realizado
echo.

REM Passo 6: Configurar Branch e Remote
echo [6/7] Configurando branch principal...
call git branch -M main
if errorlevel 1 (
    echo ❌ Erro ao renomear branch
    goto :error
)
echo ✅ Branch 'main' configurado

echo.
echo Adicionando remote do GitHub...
REM Remover remote se já existir
call git remote remove origin 2>nul
REM Adicionar novo remote
call git remote add origin https://github.com/Necromante96Official/ZenfisioAutoGerenciamento.git
if errorlevel 1 (
    echo ❌ Erro ao adicionar remote
    goto :error
)
echo ✅ Remote adicionado
echo.

REM Passo 7: Git Push
echo [7/7] Fazendo push para GitHub...
echo Isso pode levar alguns segundos...
echo.
call git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Erro ao fazer push
    echo Possíveis causas:
    echo  - Credenciais incorretas
    echo  - Repositório não existe
    echo  - Sem acesso à internet
    echo.
    echo Tente novamente com suas credenciais corretas.
    goto :error
)
echo ✅ Push realizado com sucesso
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ PUSH CONCLUÍDO COM SUCESSO!                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📦 Repositório: https://github.com/Necromante96Official/ZenfisioAutoGerenciamento
echo 📊 Branch: main
echo 📝 Commit: v1.0.0.6 - Auto Gerenciamento Zenfisio
echo.
echo Status:
git log --oneline -1
echo.
echo Arquivos:
git ls-files | find /c /v ""
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
exit /b 0

:error
echo.
echo ❌ ERRO DURANTE O PUSH
echo Pressione qualquer tecla para fechar...
pause >nul
exit /b 1
