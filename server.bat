@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Zenfisio Manager - Python Server
echo ========================================
echo.

REM Mudar para pasta do script
cd /d "%~dp0"

REM Procurar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo.
    echo Python ja esta instalado em sua maquina.
    echo Execute: python server-python.py
    echo.
    pause
    exit /b 1
)

echo Iniciando servidor...
echo.

REM Iniciar servidor em background
start python server-python.py

REM Aguardar um pouco para o servidor iniciar
timeout /t 2 /nobreak

REM Abrir no navegador
start http://127.0.0.1:5000

echo.
echo Navegador aberto!
echo.
echo Pressione qualquer tecla para fechar esta janela
echo (O servidor continuara rodando em background)
pause
exit /b 0
