'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MessageSquare, 
  Star, 
  FileText, 
  Phone, 
  Mail,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface Activity {
  id: string
  type: 'appointment' | 'review' | 'message' | 'case' | 'call' | 'email' | 'profile_view'
  title: string
  description: string
  time: string
  client?: {
    name: string
    avatar?: string
    initials: string
  }
  status: 'completed' | 'pending' | 'scheduled' | 'new'
  priority: 'high' | 'medium' | 'low'
  metadata?: {
    rating?: number
    amount?: number
    duration?: string
  }
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'review',
    title: 'Nova avaliação recebida',
    description: 'Maria Santos deixou uma avaliação de 5 estrelas',
    time: '5 min atrás',
    client: { name: 'Maria Santos', initials: 'MS' },
    status: 'new',
    priority: 'high',
    metadata: { rating: 5 }
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Consulta agendada',
    description: 'Consulta sobre direito trabalhista',
    time: '15 min atrás',
    client: { name: 'Carlos Oliveira', initials: 'CO' },
    status: 'scheduled',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'message',
    title: 'Nova mensagem',
    description: 'Pergunta sobre honorários advocatícios',
    time: '1 hora atrás',
    client: { name: 'Ana Silva', initials: 'AS' },
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'case',
    title: 'Caso finalizado',
    description: 'Processo trabalhista concluído com sucesso',
    time: '2 horas atrás',
    client: { name: 'Pedro Costa', initials: 'PC' },
    status: 'completed',
    priority: 'high',
    metadata: { amount: 15000 }
  },
  {
    id: '5',
    type: 'profile_view',
    title: 'Perfil visualizado',
    description: '12 novas visualizações do seu perfil',
    time: '3 horas atrás',
    status: 'new',
    priority: 'low'
  },
  {
    id: '6',
    type: 'call',
    title: 'Ligação realizada',
    description: 'Consulta telefônica sobre divórcio',
    time: '4 horas atrás',
    client: { name: 'Lucia Ferreira', initials: 'LF' },
    status: 'completed',
    priority: 'medium',
    metadata: { duration: '45 min' }
  },
  {
    id: '7',
    type: 'email',
    title: 'E-mail enviado',
    description: 'Proposta de honorários enviada',
    time: '1 dia atrás',
    client: { name: 'Roberto Lima', initials: 'RL' },
    status: 'completed',
    priority: 'low'
  }
]

const activityIcons = {
  appointment: Calendar,
  review: Star,
  message: MessageSquare,
  case: FileText,
  call: Phone,
  email: Mail,
  profile_view: Eye
}

const statusColors = {
  completed: 'text-green-600 bg-green-50 dark:bg-green-950',
  pending: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
  scheduled: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  new: 'text-purple-600 bg-purple-50 dark:bg-purple-950'
}

const priorityColors = {
  high: 'border-red-200 dark:border-red-800',
  medium: 'border-yellow-200 dark:border-yellow-800',
  low: 'border-green-200 dark:border-green-800'
}

export function RecentActivities() {
  const filterActivities = (type?: string) => {
    if (!type || type === 'all') return mockActivities
    return mockActivities.filter(activity => activity.type === type)
  }

  const ActivityItem = ({ activity, index }: { activity: Activity; index: number }) => {
    const IconComponent = activityIcons[activity.type]
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`p-4 border-l-2 ${priorityColors[activity.priority]} hover:bg-muted/50 transition-colors`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${statusColors[activity.status]}`}>
            <IconComponent className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{activity.title}</h4>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${statusColors[activity.status]}`}
                >
                  {activity.status === 'completed' && 'Concluído'}
                  {activity.status === 'pending' && 'Pendente'}
                  {activity.status === 'scheduled' && 'Agendado'}
                  {activity.status === 'new' && 'Novo'}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {activity.description}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {activity.client && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.client.avatar} />
                      <AvatarFallback className="text-xs">
                        {activity.client.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {activity.client.name}
                    </span>
                  </div>
                )}
                
                {activity.metadata && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {activity.metadata.rating && (
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {activity.metadata.rating}
                      </div>
                    )}
                    {activity.metadata.amount && (
                      <span className="font-medium text-green-600">
                        R$ {activity.metadata.amount.toLocaleString()}
                      </span>
                    )}
                    {activity.metadata.duration && (
                      <span>{activity.metadata.duration}</span>
                    )}
                  </div>
                )}
              </div>
              
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>
          Acompanhe suas últimas interações e atividades
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pb-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="appointment">Consultas</TabsTrigger>
              <TabsTrigger value="review">Avaliações</TabsTrigger>
              <TabsTrigger value="message">Mensagens</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filterActivities('all').map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="appointment" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filterActivities('appointment').map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="review" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filterActivities('review').map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="message" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filterActivities('message').map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="p-4 border-t">
          <Button asChild className="w-full">
            <Link href="/dashboard/activities">
              Ver todas as atividades
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}