'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BarChart as Chart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, Star, MessageSquare, Calendar, Bell, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const mockUser = {
  profileCompletion: 85,
};

const mockStats = {
  profileViews: 245,
  averageRating: 4.8,
  pendingReviews: 2
};

const mockAppointments = [
  { id: "1", clientName: "Maria Oliveira", date: "2024-05-10T14:30:00" },
  { id: "2", clientName: "Carlos Santos", date: "2024-05-12T10:00:00" },
];

const mockRecentReviews = [
  { id: "1", clientName: "Pedro Santos", rating: 5, comment: "Excelente profissional!" },
];

const mockMonthlyViews = [
  { month: 'Jan', views: 45 },
  { month: 'Fev', views: 52 },
  { month: 'Mar', views: 67 },
  { month: 'Abr', views: 81 },
  { month: 'Mai', views: 56 }
];

export default function DashboardPage() {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações do Perfil</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.profileViews}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageRating} / 5</div>
            <p className="text-xs text-muted-foreground">Baseado em 12 avaliações</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockStats.pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Aguardando sua aprovação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral de Desempenho</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <Chart data={mockMonthlyViews}>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </Chart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Resumo de suas últimas interações.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Próximos Agendamentos</h3>
              {mockAppointments.map(app => (
                <div key={app.id} className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{app.clientName}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(app.date)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Últimas Avaliações</h3>
              {mockRecentReviews.map(rev => (
                <div key={rev.id} className="flex items-center">
                  <User className="h-4 w-4 mr-3 text-muted-foreground" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{rev.clientName}</p>
                    <p className="text-sm text-muted-foreground truncate">"{rev.comment}"</p>
                  </div>
                  <div className="ml-auto font-medium flex items-center">{rev.rating} <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" /></div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/reviews">
                Ver todas as atividades <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}