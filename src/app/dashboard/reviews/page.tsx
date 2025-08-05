'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
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

const mockReviews: Review[] = [
  {
    id: '1',
    client_name: 'Pedro Santos',
    rating: 5,
    comment: 'Excelente profissional! Me ajudou muito com meu caso.',
    status: 'pending',
    created_at: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    client_name: 'Maria Silva',
    rating: 4,
    comment: 'Muito atencioso e dedicado.',
    status: 'approved',
    created_at: '2024-03-10T14:30:00Z'
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete') {
      setReviews(prev => prev.filter(review => review.id !== reviewId))
      toast.success('Avaliação removida com sucesso')
    } else {
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' } 
          : review
      ))
      toast.success(`Avaliação ${action === 'approve' ? 'aprovada' : 'rejeitada'}`)
    }
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