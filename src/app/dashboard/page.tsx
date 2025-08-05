'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '../navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meu Dashboard</h1>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: advogado@exemplo.com</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/profile">Editar Perfil</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/reviews">Gerenciar Avaliações</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/planos">Gerenciar Assinatura</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/analytics">Ver Estatísticas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <MadeWithDyad />
    </div>
  )
}