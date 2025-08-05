'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const initialState = {
  message: null,
}

function LoginButton() {
  const { pending } = useFormStatus()
  return <Button className="w-full" type="submit" aria-disabled={pending}>{pending ? 'Entrando...' : 'Entrar'}</Button>
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Área do Advogado</CardTitle>
          <CardDescription>
            Acesse sua conta para gerenciar seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <LoginButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}