This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Frontend (Next.js)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

### Backend (Rails with Docker)

Para executar o backend Rails, você precisa ter Docker instalado e rodando. 

#### Pré-requisitos:
1. **Instalar Docker Desktop:** [Download aqui](https://www.docker.com/products/docker-desktop/)
2. **Iniciar Docker Desktop:** Certifique-se que o Docker Desktop está rodando (ícone na bandeja do sistema)

#### Executar o Backend:

1. **Verificar se Docker está rodando:**
   ```bash
   docker info
   ```

2. **Iniciar o backend:**
   ```bash
   # Windows
   start-backend.bat
   
   # Ou manualmente
   docker-compose up --build backend
   ```

3. **Parar o backend:**
   ```bash
   # Windows
   stop-backend.bat
   
   # Ou manualmente
   docker-compose down
   ```

4. **Acessar o Admin:**
   - URL: [http://localhost:3002/admin](http://localhost:3002/admin)
   - O banco de dados PostgreSQL será criado automaticamente
   - As migrações serão executadas automaticamente

#### Troubleshooting:
- Se aparecer erro "The system cannot find the file specified", inicie o Docker Desktop
- Se o build falhar, tente: `docker-compose down && docker-compose up --build --force-recreate`

### Vantagens do Docker

- ✅ Resolve problemas de compatibilidade do Windows
- ✅ Ambiente isolado e consistente
- ✅ Fácil setup para novos desenvolvedores
- ✅ Banco PostgreSQL incluído
- ✅ Todas as dependências gerenciadas automaticamente

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
