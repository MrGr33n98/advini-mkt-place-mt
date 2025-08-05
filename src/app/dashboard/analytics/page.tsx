'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Eye, Star, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

interface Analytics {
  profile_views: number
  total_reviews: number
  average_rating: number
  monthly_views: { month: string, views: number }[]
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return

      const supabase = createClient()
      
      try {
        // Buscar métricas de visualizações
        const { data: viewsData, error: viewsError } = await supabase
          .from('lawyer_views')
          .select('*')
          .eq('lawyer_id', user.id)

        // Buscar métricas de reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('lawyer_id', user.id)
          .eq('status', 'approved')

        if (viewsError || reviewsError) {
          throw new Error('Erro ao buscar analytics')
        }

        const monthlyViews = processMonthlyViews(viewsData)

        setAnalytics({
          profile_views: viewsData.length,
          total_reviews: reviewsData.length,
          average_rating: calculateAverageRating(reviewsData),
          monthly_views: monthlyViews
        })
      } catch (error) {
        console.error('Erro ao buscar analytics:', error)
        toast.error('Não foi possível carregar as estatísticas')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  const processMonthlyViews = (viewsData: any[]) => {
    const monthMap = new Map()
    
    viewsData.forEach(view => {
      const month = new Date(view.created_at).toLocaleString('default', { month: 'short' })
      monthMap.set(month, (monthMap.get(month) || 0) + 1)
    })

    return Array.from(monthMap, ([month, views]) => ({ month, views }))
  }

  const calculateAverageRating = (reviewsData: any[]) => {
    if (reviewsData.length === 0) return 0
    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0)
    return Number((totalRating / reviewsData.length).toFixed(1))
  }

  if (loading || isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Faça login para acessar as estatísticas</div>
  }

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
                <p className="text-2xl font-bold">{analytics?.profile_views || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center">
              <ThumbsUp className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-muted-foreground">Total de Avaliações</p>
                <p className="text-2xl font-bold">{analytics?.total_reviews || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center">
              <Star className="h-8 w-8 text-primary mr-4" />
              <div>
                <p className="text-muted-foreground">Média de Avaliações</p>
                <p className="text-2xl font-bold">{analytics?.average_rating || 0}/5</p>
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
              <BarChart data={analytics?.monthly_views}>
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