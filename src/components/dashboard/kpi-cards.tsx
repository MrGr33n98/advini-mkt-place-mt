'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  DollarSign,
  Target,
  Award
} from 'lucide-react'

interface KPIData {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  description: string
  target?: number
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange'
}

const kpiData: KPIData[] = [
  {
    title: 'Visualizações do Perfil',
    value: 1247,
    change: 12.5,
    changeType: 'increase',
    icon: Eye,
    description: 'vs. mês anterior',
    target: 1500,
    color: 'blue'
  },
  {
    title: 'Taxa de Conversão',
    value: '8.4%',
    change: 2.1,
    changeType: 'increase',
    icon: Target,
    description: 'visitantes → clientes',
    color: 'green'
  },
  {
    title: 'Avaliação Média',
    value: 4.8,
    change: 0.2,
    changeType: 'increase',
    icon: Star,
    description: 'baseado em 47 avaliações',
    color: 'yellow'
  },
  {
    title: 'Novos Clientes',
    value: 23,
    change: -5.2,
    changeType: 'decrease',
    icon: Users,
    description: 'este mês',
    color: 'purple'
  },
  {
    title: 'Receita Estimada',
    value: 'R$ 18.5k',
    change: 15.3,
    changeType: 'increase',
    icon: DollarSign,
    description: 'últimos 30 dias',
    color: 'green'
  },
  {
    title: 'Agendamentos',
    value: 34,
    change: 8.7,
    changeType: 'increase',
    icon: Calendar,
    description: 'próximos 7 dias',
    color: 'orange'
  }
]

const colorClasses = {
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  green: 'text-green-600 bg-green-50 dark:bg-green-950',
  yellow: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
  purple: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
  red: 'text-red-600 bg-red-50 dark:bg-red-950',
  orange: 'text-orange-600 bg-orange-50 dark:bg-orange-950'
}

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {kpiData.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colorClasses[kpi.color]}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {kpi.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={kpi.changeType === 'increase' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {kpi.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(kpi.change)}%
                  </Badge>
                </div>
              </div>
              
              {kpi.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Meta: {kpi.target}</span>
                    <span>{Math.round((Number(kpi.value) / kpi.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((Number(kpi.value) / kpi.target) * 100, 100)}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}