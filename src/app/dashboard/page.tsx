'use client'

import { motion } from 'framer-motion'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { NotificationsCenter } from '@/components/dashboard/notifications-center'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentActivities } from '@/components/dashboard/recent-activities'
import { AppointmentBadges } from '@/components/dashboard/appointment-badges'
import { AppointmentReminders } from '@/components/dashboard/appointment-reminders'
import { ChatPreview } from '@/components/dashboard/chat-preview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  Target, 
  Award, 
  Users,
  Calendar,
  MessageSquare,
  Star,
  BarChart3,
  Zap
} from 'lucide-react'

const mockUser = {
  name: "Dr. João da Silva",
  profileCompletion: 85,
  planType: "Pro",
  memberSince: "Janeiro 2023"
}

const achievements = [
  { title: "Top Rated", description: "Avaliação 4.8+ por 3 meses", icon: Star },
  { title: "Client Magnet", description: "50+ novos clientes este ano", icon: Users },
  { title: "Response Hero", description: "Resposta em menos de 2h", icon: MessageSquare }
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header com boas-vindas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo de volta, {mockUser.name.split(' ')[1]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua performance e atividades recentes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Award className="h-3 w-3 mr-1" />
            Plano {mockUser.planType}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Membro desde {mockUser.memberSince}
          </Badge>
        </div>
      </motion.div>

      {/* Progresso do perfil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Complete seu perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Perfis completos recebem 3x mais visualizações
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {mockUser.profileCompletion}%
                </div>
                <Progress value={mockUser.profileCompletion} className="w-32 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges de Agendamentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AppointmentBadges />
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <KPICards />
      </motion.div>

      {/* Lembretes de Agendamentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <AppointmentReminders />
      </motion.div>

      {/* Grid principal com gráficos e ações */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráficos Analytics - 2 colunas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <AnalyticsCharts />
        </motion.div>

        {/* Sidebar com ações rápidas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <QuickActions />
          
          {/* Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Conquistas</span>
              </CardTitle>
              <CardDescription>
                Seus marcos de sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon
                return (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grid inferior com chat e atividades */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ChatPreview />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <RecentActivities />
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Impulsione seu crescimento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Descubra insights personalizados para aumentar sua base de clientes
                </p>
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Relatório Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}