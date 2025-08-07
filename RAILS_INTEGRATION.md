# Integração Rails + Next.js

Este documento descreve a integração entre o backend Rails (com ActiveAdmin) e o frontend Next.js.

## 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   Next.js       │ ◄──────────────► │   Rails API     │
│   (Frontend)    │                  │   (Backend)     │
│   :3000         │                  │   :3001         │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   ActiveAdmin   │
                                     │   (Admin Panel) │
                                     │   :3001/admin   │
                                     └─────────────────┘
```

## 🚀 Configuração Rápida

### 1. Backend Rails (Porta 3001)

```bash
cd backend/noticed_v2

# Instalar dependências
bundle install

# Configurar banco de dados
rails db:create db:migrate db:seed

# Iniciar servidor
rails server -p 3001
```

### 2. Frontend Next.js (Porta 3000)

```bash
# Na raiz do projeto
npm install

# Iniciar desenvolvimento
npm run dev
```

### 3. Testar Integração

```bash
# Executar script de teste
node scripts/test-rails-integration.js
```

## 📁 Estrutura de Arquivos

### Backend Rails
```
backend/noticed_v2/
├── app/controllers/api/
│   ├── base_controller.rb          # Controller base da API
│   └── v1/
│       ├── base_controller.rb      # Controller base v1
│       ├── posts_controller.rb     # CRUD de posts
│       ├── users_controller.rb     # CRUD de usuários
│       ├── comments_controller.rb  # CRUD de comentários
│       └── admin_users_controller.rb # Leitura de admin users
├── config/
│   ├── initializers/cors.rb        # Configuração CORS
│   └── routes.rb                   # Rotas da API
├── Gemfile                         # Gems (rack-cors, dotenv-rails)
└── .env.local                      # Variáveis de ambiente
```

### Frontend Next.js
```
src/
├── lib/
│   └── rails-api.ts               # Helper para API Rails
├── pages/
│   ├── rails-posts.tsx           # Página de posts (SWR)
│   └── rails-users.tsx           # Página de usuários (SSR)
├── .env.local                     # Variáveis de ambiente
└── next.config.js                 # Configuração de proxy
```

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

#### Backend (.env.local)
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/patient_shiba_nudge"
SECRET_TOKEN=your-secret-token-here
ADMIN_API_TOKEN=development-admin-token
RAILS_ENV=development
PORT=3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001/admin
NEXT_PUBLIC_ADMIN_API_TOKEN=development-admin-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### CORS Configuration

O arquivo `config/initializers/cors.rb` permite requisições do frontend:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3000'
    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
    resource '/admin/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## 🛠️ API Endpoints

### Posts
- `GET /api/v1/posts` - Listar posts (paginado)
- `GET /api/v1/posts/:id` - Visualizar post específico
- `POST /api/v1/posts` - Criar novo post
- `PATCH /api/v1/posts/:id` - Atualizar post
- `DELETE /api/v1/posts/:id` - Deletar post

### Users
- `GET /api/v1/users` - Listar usuários (paginado)
- `GET /api/v1/users/:id` - Visualizar usuário específico
- `POST /api/v1/users` - Criar novo usuário
- `PATCH /api/v1/users/:id` - Atualizar usuário
- `DELETE /api/v1/users/:id` - Deletar usuário

### Comments
- `GET /api/v1/posts/:post_id/comments` - Listar comentários de um post
- `GET /api/v1/posts/:post_id/comments/:id` - Visualizar comentário específico
- `POST /api/v1/posts/:post_id/comments` - Criar novo comentário
- `PATCH /api/v1/posts/:post_id/comments/:id` - Atualizar comentário
- `DELETE /api/v1/posts/:post_id/comments/:id` - Deletar comentário

### Admin Users (Somente Leitura)
- `GET /api/v1/admin_users` - Listar admin users
- `GET /api/v1/admin_users/:id` - Visualizar admin user específico

## 🔐 Autenticação

A API usa autenticação por token via header `X-API-Token`:

```javascript
// Exemplo de requisição autenticada
fetch('http://localhost:3001/api/v1/posts', {
  headers: {
    'Content-Type': 'application/json',
    'X-API-Token': 'development-admin-token'
  }
})
```

## 📊 Uso no Frontend

### Com SWR (Client-Side)

```tsx
import useSWR from 'swr';
import { postsApi } from '@/lib/rails-api';

function PostsList() {
  const { data, error, isLoading } = useSWR('/posts', () => postsApi.getAll());
  
  if (error) return <div>Erro ao carregar</div>;
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div>
      {data.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### Com SSR (Server-Side)

```tsx
import { GetServerSideProps } from 'next';
import { usersApi } from '@/lib/rails-api';

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await usersApi.getAll();
    return { props: { users: data.users } };
  } catch (error) {
    return { props: { users: [], error: error.message } };
  }
};
```

## 🧪 Testes

### Script de Teste Automático

Execute o script de teste para verificar a integração:

```bash
node scripts/test-rails-integration.js
```

O script testa:
- ✅ Conectividade com Rails
- ✅ Endpoints da API
- ✅ Autenticação por token
- ✅ Configuração CORS
- ✅ Respostas JSON válidas
- ✅ Paginação

### Teste Manual

1. **Inicie o Rails:**
   ```bash
   cd backend/noticed_v2
   rails server -p 3001
   ```

2. **Inicie o Next.js:**
   ```bash
   npm run dev
   ```

3. **Acesse as páginas de teste:**
   - Posts: http://localhost:3000/rails-posts
   - Usuários: http://localhost:3000/rails-users

4. **Verifique o ActiveAdmin:**
   - Admin Panel: http://localhost:3001/admin

## 🔄 Proxy Configuration

O `next.config.js` inclui configuração de proxy para facilitar desenvolvimento:

```javascript
async rewrites() {
  return [
    {
      source: '/rails-api/:path*',
      destination: 'http://localhost:3001/api/v1/:path*',
    },
    {
      source: '/rails-admin/:path*',
      destination: 'http://localhost:3001/admin/:path*',
    },
  ];
}
```

## 🚨 Troubleshooting

### Erro de CORS
- Verifique se `rack-cors` está instalado
- Confirme a configuração em `config/initializers/cors.rb`
- Reinicie o servidor Rails

### Erro de Conexão
- Confirme que Rails está rodando na porta 3001
- Verifique as variáveis de ambiente
- Teste conectividade: `curl http://localhost:3001/api/v1/posts`

### Erro de Autenticação
- Verifique se `ADMIN_API_TOKEN` está configurado
- Confirme que o header `X-API-Token` está sendo enviado
- Verifique logs do Rails para detalhes

### Erro de JSON
- Confirme que controllers retornam JSON válido
- Verifique se `defaults: { format: :json }` está nas rotas
- Teste endpoints diretamente com curl ou Postman

## 📈 Próximos Passos

1. **Implementar autenticação JWT** para usuários finais
2. **Adicionar WebSockets** para atualizações em tempo real
3. **Implementar cache Redis** para melhor performance
4. **Adicionar testes automatizados** (RSpec + Jest)
5. **Configurar CI/CD** para deploy automático
6. **Implementar rate limiting** na API
7. **Adicionar logging estruturado** (Lograge + Winston)

## 📚 Recursos Adicionais

- [Rails API Documentation](https://guides.rubyonrails.org/api_app.html)
- [ActiveAdmin Documentation](https://activeadmin.info/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [SWR Documentation](https://swr.vercel.app/)
- [Rack CORS Documentation](https://github.com/cyu/rack-cors)