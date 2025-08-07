'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Star, TrendingUp, TrendingDown, Clock, MessageSquare, Eye, CheckCircle } from 'lucide-react'
import { ReviewStats } from '@/types/review'

interface ReviewStatsProps {
  stats: ReviewStats;
}

export function ReviewStatsComponent({ stats }: ReviewStatsProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGrowthIcon = (percentage: number) => {
    if (percentage > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (percentage < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <div className="h-4 w-4" />
  }

  const getGrowthColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600'
    if (percentage < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Avaliação Média */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${getRatingColor(stats.average_rating)}`}>
              {stats.average_rating.toFixed(1)}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(stats.average_rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Baseado em {stats.total_reviews} avaliações
          </p>
        </CardContent>
      </Card>

      {/* Total de Avaliações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_reviews}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {getGrowthIcon(stats.growth_percentage)}
            <span className={getGrowthColor(stats.growth_percentage)}>
              {stats.growth_percentage > 0 ? '+' : ''}{stats.growth_percentage.toFixed(1)}%
            </span>
            <span>vs mês anterior</span>
          </div>
        </CardContent>
      </Card>

      {/* Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.pending_reviews}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando moderação
          </p>
        </CardContent>
      </Card>

      {/* Taxa de Resposta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.response_rate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Tempo médio: {stats.average_response_time}h
          </p>
        </CardContent>
      </Card>

      {/* Distribuição de Estrelas */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.rating_distribution[rating as keyof typeof stats.rating_distribution];
              const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <Progress value={percentage} className="flex-1" />
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm text-muted-foreground">{count}</span>
                    <Badge variant="secondary" className="text-xs">
                      {percentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status das Avaliações */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Status das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved_reviews}</div>
              <p className="text-sm text-muted-foreground">Aprovadas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected_reviews}</div>
              <p className="text-sm text-muted-foreground">Rejeitadas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.hidden_reviews}</div>
              <p className="text-sm text-muted-foreground">Ocultas</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pending_reviews}</div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crescimento Mensal */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Crescimento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.this_month}</div>
              <p className="text-sm text-muted-foreground">Este Mês</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.last_month}</div>
              <p className="text-sm text-muted-foreground">Mês Anterior</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center space-x-2">
            {getGrowthIcon(stats.growth_percentage)}
            <span className={`text-lg font-semibold ${getGrowthColor(stats.growth_percentage)}`}>
              {stats.growth_percentage > 0 ? '+' : ''}{stats.growth_percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-muted-foreground">de crescimento</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}