@echo off
echo ========================================
echo   Patient Shiba Nudge - Setup Inicial
echo ========================================
echo.

echo 1. Verificando Docker...
docker --version
if %errorlevel% neq 0 (
    echo ERRO: Docker não encontrado. Instale o Docker Desktop primeiro.
    echo Download: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo 2. Verificando se Docker está rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker Desktop não está rodando.
    echo Por favor, inicie o Docker Desktop e tente novamente.
    pause
    exit /b 1
)

echo 3. Instalando dependências do frontend...
npm install

echo 4. Construindo e iniciando o backend...
docker-compose up --build -d

echo.
echo ========================================
echo   Setup concluído com sucesso!
echo ========================================
echo.
echo Frontend: http://localhost:3001
echo Backend Admin: http://localhost:3002/admin
echo.
echo Para parar os serviços: stop-backend.bat
echo.
pause