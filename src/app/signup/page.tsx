'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const initialState = {
  message: null,
}

function SignupButton() {
  const { pending } = useFormStatus()
  return <Button className="w-full" type="submit" aria-disabled={pending}>{pending ? 'Criando conta...' : 'Criar conta'}</Button>
}

export default function SignupPage() {
  const [state, formAction] = useFormState(signup, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para começar a divulgar seu trabalho.
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
              <Input id="password" name="password" type="password" placeholder="••••••••" minLength={6} required />
            </div>
            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <SignupButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}