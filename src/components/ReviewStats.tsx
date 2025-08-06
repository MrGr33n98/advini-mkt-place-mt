import { Review } from "@/types/review";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, MessageSquare, ThumbsUp } from "lucide-react";

interface ReviewStatsProps {
  reviews: Review[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhuma avaliação disponível</p>
        </CardContent>
      </Card>
    );
  }

  // Calcular estatísticas
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: (reviews.filter(review => review.rating === rating).length / totalReviews) * 100
  }));

  const reviewsWithResponse = reviews.filter(review => review.lawyer_response).length;
  const responseRate = (reviewsWithResponse / totalReviews) * 100;

  const totalHelpfulVotes = reviews.reduce((sum, review) => sum + (review.helpful_votes || 0), 0);

  // Avaliações recentes (últimos 30 dias)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentReviews = reviews.filter(review => new Date(review.created_at) >= thirtyDaysAgo);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Avaliação média */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Baseado em {totalReviews} avaliações
          </p>
        </CardContent>
      </Card>

      {/* Total de avaliações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            {recentReviews.length} nos últimos 30 dias
          </p>
        </CardContent>
      </Card>

      {/* Taxa de resposta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
          <MessageSquare className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseRate.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            {reviewsWithResponse} de {totalReviews} respondidas
          </p>
        </CardContent>
      </Card>

      {/* Votos úteis */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Votos Úteis</CardTitle>
          <ThumbsUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHelpfulVotes}</div>
          <p className="text-xs text-muted-foreground">
            Total de votos recebidos
          </p>
        </CardContent>
      </Card>

      {/* Distribuição de avaliações */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribuição de Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-16">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1">
                <Progress value={percentage} className="h-2" />
              </div>
              <div className="text-sm text-muted-foreground w-12 text-right">
                {count}
              </div>
              <div className="text-sm text-muted-foreground w-12 text-right">
                {percentage.toFixed(0)}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}