'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '../navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { LogOut, User, Star, Eye, MessageSquare, Calendar, Bell, Settings, FileText, CreditCard, BarChart, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart as Chart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Dados mockados para o dashboard
const mockUser = {
  name: "Dr. João da Silva",
  email: "joao.silva@email.com",
  oab: "MT-12345",
  plan: "Pro",
  profileCompletion: 85,
  avatar: "/avatars/joao.jpg"
};

const mockStats = {
  profileViews: 245,
  totalReviews: 12,
  averageRating: 4.8,
  newMessages: 3,
  pendingReviews: 2
};

const mockAppointments = [
  {
    id: "1",
    clientName: "Maria Oliveira",
    date: "2024-05-10T14:30:00",
    type: "Consulta Inicial",
    status: "confirmed"
  },
  {
    id: "2",
    clientName: "Carlos Santos",
    date: "2024-05-12T10:00:00",
    type: "Acompanhamento",
    status: "pending"
  },
  {
    id: "3",
    clientName: "Ana Paula",
    date: "2024-05-15T16:00:00",
    type: "Consulta Inicial",
    status: "confirmed"
  }
];

const mockRecentReviews = [
  {
    id: "1",
    clientName: "Pedro Santos",
    rating: 5,
    comment: "Excelente profissional! Me ajudou muito com meu caso de divórcio.",
    date: "2024-04-28",
    status: "approved"
  },
  {
    id: "2",
    clientName: "Maria Silva",
    rating: 4,
    comment: "Muito atencioso e dedicado.",
    date: "2024-04-25",
    status: "pending"
  }
];

const mockNotifications = [
  {
    id: "1",
    message: "Nova avaliação recebida",
    time: "há 2 horas",
    read: false
  },
  {
    id: "2",
    message: "Novo agendamento de consulta",
    time: "há 5 horas",
    read: false
  },
  {
    id: "3",
    message: "Sua assinatura será renovada em 5 dias",
    time: "há 1 dia",
    read: true
  }
];

const mockMonthlyViews = [
  { month: 'Jan', views: 45 },
  { month: 'Fev', views: 52 },
  { month: 'Mar', views: 67 },
  { month: 'Abr', views: 81 },
  { month: 'Mai', views: 56 }
];

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!')
    router.push('/')
  }

  // Formatador de data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Bem-vindo, {mockUser.name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{mockUser.oab}</Badge>
                <Badge variant="secondary">Plano {mockUser.plan}</Badge>
              </div>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Profile Completion */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completude do Perfil</CardTitle>
                <CardDescription>Complete seu perfil para aumentar suas chances de ser encontrado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{mockUser.profileCompletion}% completo</span>
                    <span>100%</span>
                  </div>
                  <Progress value={mockUser.profileCompletion} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/profile">
                    Completar Perfil
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6 flex items-center">
                  <Eye className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-muted-foreground">Visualizações do Perfil</p>
                    <p className="text-2xl font-bold">{mockStats.profileViews}</p>
                    <p className="text-xs text-green-500">+12% este mês</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center">
                  <Star className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-muted-foreground">Avaliação Média</p>
                    <p className="text-2xl font-bold">{mockStats.averageRating}/5</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${
                            i < Math.floor(mockStats.averageRating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center">
                  <MessageSquare className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-muted-foreground">Novas Mensagens</p>
                    <p className="text-2xl font-bold">{mockStats.newMessages}</p>
                    <p className="text-xs">
                      {mockStats.pendingReviews} avaliações pendentes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {mockAppointments.slice(0, 3).map(appointment => (
                        <div key={appointment.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{appointment.clientName}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(appointment.date)}</p>
                            <p className="text-xs">{appointment.type}</p>
                          </div>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                            {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Nenhum agendamento próximo</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/appointments">
                      Ver Todos
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Avaliações Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mockRecentReviews.length > 0 ? (
                    <div className="space-y-4">
                      {mockRecentReviews.map(review => (
                        <div key={review.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{review.clientName}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{review.comment}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                            <Badge variant={review.status === 'approved' ? 'default' : 'outline'}>
                              {review.status === 'approved' ? 'Aprovado' : 'Pendente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Nenhuma avaliação recente</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/reviews">
                      Gerenciar Avaliações
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Notifications */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {mockNotifications.map(notification => (
                      <div key={notification.id} className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                        <div className={`w-2 h-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-primary'}`} />
                        <div className="flex-grow">
                          <p className={`${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <Button variant="ghost" size="sm">
                            Marcar como lido
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Nenhuma notificação</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todas
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>
                  Gerencie suas informações profissionais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{mockUser.name}</h3>
                    <p className="text-muted-foreground">{mockUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{mockUser.oab}</Badge>
                      <Badge variant="secondary">Plano {mockUser.plan}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-medium mb-2">Informações Básicas</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Nome:</span> {mockUser.name}</p>
                      <p><span className="text-muted-foreground">Email:</span> {mockUser.email}</p>
                      <p><span className="text-muted-foreground">OAB:</span> {mockUser.oab}</p>
                      <p><span className="text-muted-foreground">Telefone:</span> (65) 99999-1234</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Direito Civil</Badge>
                      <Badge>Direito de Família</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Biografia</h4>
                  <p className="text-sm text-muted-foreground">
                    Advogado especialista em direito civil e de família com mais de 15 anos de experiência.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href="/dashboard/profile">
                    Editar Perfil
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Avaliações</CardTitle>
                <CardDescription>
                  Gerencie as avaliações recebidas dos seus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/reviews">
                    Gerenciar Avaliações
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>
                  Gerencie suas consultas e compromissos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/appointments">
                    Ver Agendamentos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Acompanhe o desempenho do seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/analytics">
                    Ver Estatísticas Completas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>
                  Gerencie as configurações da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Conta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Gerencie suas informações pessoais e de acesso
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Editar
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Configure suas preferências de notificação
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Configurar
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Assinatura
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      Gerencie seu plano e informações de pagamento
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Gerenciar
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MadeWithDyad />
    </div>
  )
}