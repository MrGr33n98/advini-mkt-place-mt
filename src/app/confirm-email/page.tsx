import { Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <Mail className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">Confirme seu e-mail</h1>
        <p className="mt-2 text-muted-foreground">
          Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, clique no link para ativar sua conta.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Se não encontrar o e-mail, verifique sua caixa de spam.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
}