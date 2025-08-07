'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import {
  Share2,
  Eye,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useShareMetrics } from '@/hooks/useShareMetrics'

interface ShareMetricsDashboardProps {
  profileId: string
  profileType: 'lawyer' | 'office'
  className?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function ShareMetricsDashboard({
  profileId,
  profileType,
  className = ''
}: ShareMetricsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const {
    shareStats,
    visitStats,
    getMetricsForPeriod,
    exportMetrics
  } = useShareMetrics(profileId, profileType)

  const periodData = getMetricsForPeriod(parseInt(selectedPeriod))

  // Dados para gráficos
  const platformData = shareStats.topPlatforms.map(platform => ({
    name: platform.platform,
    value: platform.count,
    percentage: platform.percentage
  }))

  const sourceData = visitStats.topSources.map(source => ({
    name: source.source,
    value: source.count,
    percentage: source.percentage
  }))

  // Calcular tendências
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, direction: 'neutral' as const }
    const change = ((current - previous) / previous) * 100
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    }
  }

  const sharesTrend = calculateTrend(shareStats.sharesLast7Days, shareStats.sharesLast30Days - shareStats.sharesLast7Days)
  const visitsTrend = calculateTrend(visitStats.visitsLast7Days, visitStats.visitsLast30Days - visitStats.visitsLast7Days)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Métricas de Compartilhamento</h2>
          <p className="text-muted-foreground">
            Acompanhe o desempenho dos seus compartilhamentos e visitas
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dias</SelectItem>
              <SelectItem value="30">30 dias</SelectItem>
              <SelectItem value="90">90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportMetrics}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Compartilhamentos</p>
                <p className="text-2xl font-bold">{shareStats.totalShares}</p>
                <div className="flex items-center mt-1">
                  {sharesTrend.direction === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                  {sharesTrend.direction === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                  <span className={`text-sm ${
                    sharesTrend.direction === 'up' ? 'text-green-500' : 
                    sharesTrend.direction === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {sharesTrend.value.toFixed(1)}% vs período anterior
                  </span>
                </div>
              </div>
              <Share2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitas</p>
                <p className="text-2xl font-bold">{visitStats.totalVisits}</p>
                <div className="flex items-center mt-1">
                  {visitsTrend.direction === 'up' && <ArrowUp className="h-4 w-4 text-green-500" />}
                  {visitsTrend.direction === 'down' && <ArrowDown className="h-4 w-4 text-red-500" />}
                  <span className={`text-sm ${
                    visitsTrend.direction === 'up' ? 'text-green-500' : 
                    visitsTrend.direction === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {visitsTrend.value.toFixed(1)}% vs período anterior
                  </span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visitantes Únicos</p>
                <p className="text-2xl font-bold">{visitStats.uniqueVisitors}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {((visitStats.uniqueVisitors / visitStats.totalVisits) * 100).toFixed(1)}% do total
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{visitStats.conversionRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Média da indústria: 2.5%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="shares">Compartilhamentos</TabsTrigger>
          <TabsTrigger value="visits">Visitas</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Gráfico de tendência */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Compartilhamentos e Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={shareStats.dailyShares.map((share, index) => ({
                  date: share.date,
                  shares: share.count,
                  visits: visitStats.dailyVisits[index]?.visits || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="shares" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por plataforma e fonte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compartilhamentos por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitas por Fonte</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shares" className="space-y-6">
          {/* Top plataformas */}
          <Card>
            <CardHeader>
              <CardTitle>Plataformas Mais Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shareStats.topPlatforms.map((platform, index) => (
                  <div key={platform.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={platform.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {platform.count} ({platform.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de compartilhamentos por semana */}
          <Card>
            <CardHeader>
              <CardTitle>Compartilhamentos Semanais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shareStats.weeklyShares}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
          {/* Métricas de engajamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">
                  {Math.floor(visitStats.averageSessionDuration / 60)}m {Math.floor(visitStats.averageSessionDuration % 60)}s
                </div>
                <div className="text-sm text-muted-foreground">Duração Média</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MousePointer className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{(100 - visitStats.bounceRate).toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Engajamento</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{visitStats.conversionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de visitas diárias */}
          <Card>
            <CardHeader>
              <CardTitle>Visitas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitStats.dailyVisits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="uniqueVisitors" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top fontes de tráfego */}
          <Card>
            <CardHeader>
              <CardTitle>Principais Fontes de Tráfego</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitStats.topSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium capitalize">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {source.count} ({source.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Comparação de períodos */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Períodos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Últimos 7 dias</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Compartilhamentos:</span>
                      <span className="font-medium">{shareStats.sharesLast7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas:</span>
                      <span className="font-medium">{visitStats.visitsLast7Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de conversão:</span>
                      <span className="font-medium">{visitStats.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Últimos 30 dias</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Compartilhamentos:</span>
                      <span className="font-medium">{shareStats.sharesLast30Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas:</span>
                      <span className="font-medium">{visitStats.visitsLast30Days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitantes únicos:</span>
                      <span className="font-medium">{visitStats.uniqueVisitors}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metas e objetivos */}
          <Card>
            <CardHeader>
              <CardTitle>Metas e Objetivos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Meta de compartilhamentos mensais</span>
                    <span>{shareStats.sharesLast30Days}/100</span>
                  </div>
                  <Progress value={(shareStats.sharesLast30Days / 100) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Meta de visitas mensais</span>
                    <span>{visitStats.visitsLast30Days}/500</span>
                  </div>
                  <Progress value={(visitStats.visitsLast30Days / 500) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Meta de taxa de conversão</span>
                    <span>{visitStats.conversionRate.toFixed(1)}%/5%</span>
                  </div>
                  <Progress value={(visitStats.conversionRate / 5) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}