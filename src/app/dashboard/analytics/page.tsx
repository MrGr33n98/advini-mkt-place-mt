'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, Star, ThumbsUp } from 'lucide-react'

// Dados mockados para o gráfico
const mockMonthlyViews = [
  { month: 'Jan', views: 45 },
  { month: 'Fev', views: 52 },
  { month: 'Mar', views: 78 },
  { month: 'Abr', views: 90 },
  { month: 'Mai', views: 81 },
  { month: 'Jun', views: 56 }
];

// Dados mockados para as métricas
const mockAnalytics = {
  profile_views: 402,
  total_reviews: 12,
  average_rating: 4.7,
  monthly_views: mockMonthlyViews
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Estatísticas</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 flex items-center">
              <Eye className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-muted-foreground">Visualizações do Perfil</p>
                <p className="text-2xl font-bold">{mockAnalytics.profile_views}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center">
              <ThumbsUp className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-muted-foreground">Total de Avaliações</p>
                <p className="text-2xl font-bold">{mockAnalytics.total_reviews}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center">
              <Star className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-muted-foreground">Média de Avaliações</p>
                <p className="text-2xl font-bold">{mockAnalytics.average_rating}/5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visualizações Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.monthly_views}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </div>
  )
}