'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { ResponsiveGrid, useBreakpoint } from '@/components/ui/responsive'
import { AccessibleButton, ScreenReaderAnnouncement, useReducedMotion } from '@/components/ui/accessibility'
import { useMemoizedData } from '@/hooks/use-performance'
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
  const { isMobile } = useBreakpoint()
  const prefersReducedMotion = useReducedMotion()
  
  // Memoizar dados para otimização de performance
  const memoizedKpiData = useMemoizedData(kpiData, [])
  
  // Configuração responsiva do grid
  const gridConfig = {
    cols: {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 3,
      '2xl': 3
    },
    gap: {
      xs: 3,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 6,
      '2xl': 6
    }
  }

  return (
    <>
      <ScreenReaderAnnouncement 
        message={`Exibindo ${memoizedKpiData.length} indicadores de performance`}
        priority="polite"
      />
      <ResponsiveGrid {...gridConfig}>
        {memoizedKpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? {} : { delay: index * 0.1 }}
          >
          <Card 
            className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            role="article"
            aria-labelledby={`kpi-title-${index}`}
            aria-describedby={`kpi-desc-${index}`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle 
                id={`kpi-title-${index}`}
                className="text-sm font-medium text-muted-foreground"
              >
                {kpi.title}
              </CardTitle>
              <div 
                className={`p-2 rounded-lg ${colorClasses[kpi.color]}`}
                aria-hidden="true"
              >
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div 
                    className="text-2xl font-bold"
                    aria-label={`Valor atual: ${kpi.value}`}
                  >
                    {kpi.value}
                  </div>
                  <p 
                    id={`kpi-desc-${index}`}
                    className="text-xs text-muted-foreground mt-1"
                  >
                    {kpi.description}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={kpi.changeType === 'increase' ? 'default' : 'destructive'}
                    className="text-xs"
                    aria-label={`${kpi.changeType === 'increase' ? 'Aumento' : 'Diminuição'} de ${Math.abs(kpi.change)} por cento`}
                  >
                    {kpi.changeType === 'increase' ? (
                      <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" aria-hidden="true" />
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
    </ResponsiveGrid>
    </>
  )
}