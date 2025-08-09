@echo off
echo 📊 Verificando status dos containers...
docker-compose ps

echo.
echo 📋 Logs recentes do backend:
docker-compose logs backend --tail=20

echo.
echo 🔍 Verificando se a porta 3002 está sendo usada...
netstat -an | findstr :3002

echo.
echo 🌐 Testando conectividade...
curl -I http://localhost:3002 2>nul || echo ❌ Não foi possível conectar ao localhost:3002

echo.
echo 📊 Status dos serviços:
docker-compose ps