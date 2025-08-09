@echo off
echo 🛑 Parando todos os containers...
docker-compose down

echo 🧹 Limpando containers, volumes e imagens...
docker-compose down -v --remove-orphans
docker system prune -f

echo 🔨 Reconstruindo backend com cache limpo...
docker-compose build --no-cache backend

echo 🚀 Iniciando serviços...
docker-compose up -d

echo ⏳ Aguardando serviços inicializarem (30 segundos)...
timeout /t 30

echo 📊 Verificando status dos containers...
docker-compose ps

echo 📋 Verificando logs do backend...
docker-compose logs backend --tail=30

echo 🗄️ Executando migrações...
docker-compose exec backend rails db:create db:migrate

echo 🌱 Executando seeds...
docker-compose exec backend rails db:seed

echo ✅ Processo concluído!
echo 🌐 Backend disponível em: http://localhost:3002
echo 👑 Active Admin disponível em: http://localhost:3002/admin
echo 📧 Login admin: admin@example.com
echo 🔑 Senha admin: password