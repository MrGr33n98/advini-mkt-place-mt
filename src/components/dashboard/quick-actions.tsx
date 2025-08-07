'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users, 
  Settings,
  BarChart,
  Star,
  Clock,
  Phone,
  Mail,
  Edit,
  Share2,
  Download
} from 'lucide-react'
import Link from 'next/link'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  badge?: string
  shortcut?: string
}

const quickActions: QuickAction[] = [
  {
    id: 'new-appointment',
    title: 'Novo Agendamento',
    description: 'Agendar consulta com cliente',
    icon: Calendar,
    href: '/dashboard/appointments/new',
    color: 'blue',
    shortcut: 'Ctrl+N'
  },
  {
    id: 'respond-reviews',
    title: 'Responder Avaliações',
    description: 'Responder avaliações pendentes',
    icon: Star,
    href: '/dashboard/reviews',
    color: 'yellow',
    badge: '3'
  },
  {
    id: 'update-profile',
    title: 'Atualizar Perfil',
    description: 'Editar informações profissionais',
    icon: Edit,
    href: '/dashboard/profile',
    color: 'green'
  },
  {
    id: 'view-analytics',
    title: 'Ver Analytics',
    description: 'Relatórios de performance',
    icon: BarChart,
    href: '/dashboard/analytics',
    color: 'purple'
  },
  {
    id: 'new-case',
    title: 'Novo Caso',
    description: 'Registrar novo caso jurídico',
    icon: FileText,
    href: '/dashboard/cases/new',
    color: 'orange'
  },
  {
    id: 'client-messages',
    title: 'Mensagens',
    description: 'Ver mensagens de clientes',
    icon: MessageSquare,
    href: '/dashboard/messages',
    color: 'blue',
    badge: '7'
  },
  {
    id: 'schedule-call',
    title: 'Agendar Ligação',
    description: 'Agendar ligação de retorno',
    icon: Phone,
    color: 'green',
    onClick: () => console.log('Agendar ligação')
  },
  {
    id: 'send-proposal',
    title: 'Enviar Proposta',
    description: 'Criar e enviar proposta',
    icon: Mail,
    color: 'purple',
    onClick: () => console.log('Enviar proposta')
  },
  {
    id: 'share-profile',
    title: 'Compartilhar Perfil',
    description: 'Compartilhar link do perfil',
    icon: Share2,
    color: 'orange',
    onClick: () => console.log('Compartilhar perfil')
  },
  {
    id: 'export-data',
    title: 'Exportar Dados',
    description: 'Baixar relatórios em PDF',
    icon: Download,
    color: 'red',
    onClick: () => console.log('Exportar dados')
  }
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900',
    border: 'border-blue-200 dark:border-blue-800'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    text: 'text-green-600 dark:text-green-400',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900',
    border: 'border-green-200 dark:border-green-800'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900',
    border: 'border-purple-200 dark:border-purple-800'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-600 dark:text-orange-400',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900',
    border: 'border-orange-200 dark:border-orange-800'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-600 dark:text-red-400',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900',
    border: 'border-red-200 dark:border-red-800'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    text: 'text-yellow-600 dark:text-yellow-400',
    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900',
    border: 'border-yellow-200 dark:border-yellow-800'
  }
}

export function QuickActions() {
  const handleAction = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Ações Rápidas</span>
        </CardTitle>
        <CardDescription>
          Acesso rápido às funcionalidades mais utilizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            const colors = colorClasses[action.color]
            
            const ActionButton = (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className={`h-auto p-4 flex flex-col items-start space-y-2 w-full text-left ${colors.hover} transition-all duration-200`}
                  onClick={() => handleAction(action)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                      <IconComponent className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {action.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                      {action.shortcut && (
                        <Badge variant="outline" className="text-xs">
                          {action.shortcut}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </motion.div>
            )

            return action.href ? (
              <Link key={action.id} href={action.href}>
                {ActionButton}
              </Link>
            ) : (
              <div key={action.id}>
                {ActionButton}
              </div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Dica de Produtividade</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Use os atalhos de teclado para acessar rapidamente as ações mais frequentes. 
            Pressione <kbd className="px-1 py-0.5 bg-background rounded text-xs">Ctrl+N</kbd> para novo agendamento.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}