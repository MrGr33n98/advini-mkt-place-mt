'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { createClient } from '@/lib/supabase/client'
import { Star, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  id: string
  client_name: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export default function ReviewsPage() {
  const { user, loading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      if (!user) return

      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('lawyer_id', user.id)

        if (error) throw error

        setReviews(data || [])
      } catch (error) {
        console.error('Erro ao buscar reviews:', error)
        toast.error('Não foi possível carregar as avaliações')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [user])

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'delete') => {
    const supabase = createClient()

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId)

        if (error) throw error
        
        setReviews(prev => prev.filter(review => review.id !== reviewId))
        toast.success('Avaliação removida com sucesso')
      } else {
        const { error } = await supabase
          .from('reviews')
          .update({ status: action === 'approve' ? 'approved' : 'rejected' })
          .eq('id', reviewId)

        if (error) throw error

        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' } 
            : review
        ))
        
        toast.success(`Avaliação ${action === 'approve' ? 'aprovada' : 'rejeitada'}`)
      }
    } catch (error) {
      console.error(`Erro ao ${action} review:`, error)
      toast.error('Não foi possível realizar a ação')
    }
  }

  if (loading || isLoading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Faça login para acessar as avaliações</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Avaliações</h1>

        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Você ainda não possui avaliações.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-semibold mr-4">{review.client_name}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleReviewAction(review.id, 'approve')}
                          >
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleReviewAction(review.id, 'reject')}
                          >
                            <XCircle className="h-5 w-5 text-red-500" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => handleReviewAction(review.id, 'delete')}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  {review.status !== 'pending' && (
                    <div className="mt-2 text-sm">
                      Status: {' '}
                      <span className={`
                        font-semibold 
                        ${review.status === 'approved' ? 'text-green-500' : 'text-red-500'}
                      `}>
                        {review.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MadeWithDyad />
    </div>
  )
}