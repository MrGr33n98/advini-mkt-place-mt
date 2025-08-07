'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { motion } from 'framer-motion'

// Dados mockados para demonstração
const performanceData = [
  { month: 'Jan', views: 245, leads: 12, clients: 8, revenue: 15400 },
  { month: 'Fev', views: 312, leads: 18, clients: 11, revenue: 18200 },
  { month: 'Mar', views: 387, leads: 22, clients: 15, revenue: 24500 },
  { month: 'Abr', views: 456, leads: 28, clients: 19, revenue: 31200 },
  { month: 'Mai', views: 523, leads: 31, clients: 23, revenue: 38900 },
  { month: 'Jun', views: 612, leads: 35, clients: 27, revenue: 42100 }
]

const clientSourceData = [
  { name: 'Busca Orgânica', value: 45, color: '#3b82f6' },
  { name: 'Indicações', value: 30, color: '#10b981' },
  { name: 'Redes Sociais', value: 15, color: '#f59e0b' },
  { name: 'Anúncios', value: 10, color: '#ef4444' }
]

const caseTypeData = [
  { type: 'Trabalhista', cases: 28, revenue: 45200 },
  { type: 'Civil', cases: 22, revenue: 38900 },
  { type: 'Criminal', cases: 15, revenue: 28400 },
  { type: 'Família', cases: 18, revenue: 31200 },
  { type: 'Empresarial', cases: 12, revenue: 52800 }
]

const weeklyActivityData = [
  { day: 'Seg', consultations: 8, calls: 12, emails: 15 },
  { day: 'Ter', consultations: 6, calls: 9, emails: 18 },
  { day: 'Qua', consultations: 10, calls: 15, emails: 12 },
  { day: 'Qui', consultations: 7, calls: 11, emails: 20 },
  { day: 'Sex', consultations: 9, calls: 14, emails: 16 },
  { day: 'Sáb', consultations: 4, calls: 6, emails: 8 },
  { day: 'Dom', consultations: 2, calls: 3, emails: 5 }
]

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="sources">Origem Clientes</TabsTrigger>
          <TabsTrigger value="cases">Tipos de Casos</TabsTrigger>
          <TabsTrigger value="activity">Atividade Semanal</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensal</CardTitle>
                <CardDescription>
                  Evolução de visualizações, leads, clientes e receita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `R$ ${value.toLocaleString()}` : value,
                        name === 'views' ? 'Visualizações' : 
                        name === 'leads' ? 'Leads' : 
                        name === 'clients' ? 'Clientes' : 'Receita'
                      ]}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorViews)"
                      name="Visualizações"
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)"
                      name="Receita"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Origem dos Clientes</CardTitle>
                <CardDescription>
                  Distribuição dos canais de aquisição de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={clientSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Análise por Tipo de Caso</CardTitle>
                <CardDescription>
                  Quantidade de casos e receita por área de atuação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={caseTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenue' ? `R$ ${value.toLocaleString()}` : value,
                        name === 'cases' ? 'Casos' : 'Receita'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cases" fill="#3b82f6" name="Casos" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Receita" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Atividade Semanal</CardTitle>
                <CardDescription>
                  Distribuição de atividades ao longo da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="consultations" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Consultas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calls" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Ligações"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emails" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      name="E-mails"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}