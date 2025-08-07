'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { ReviewStatsComponent } from '@/components/dashboard/review-stats'
import { ReviewFiltersComponent } from '@/components/dashboard/review-filters'
import { ReviewCard } from '@/components/dashboard/review-card'
import { ReviewResponseComponent } from '@/components/dashboard/review-response'
import { 
  BarChart3, 
  MessageSquare, 
  Plus, 
  Download, 
  Upload,
  RefreshCw,
  Settings,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { toast } from 'sonner'
import { Review, ReviewStats, ReviewFilters } from '@/types/review'

// Dados mockados expandidos
const mockReviews: Review[] = [
  {
    id: "1",
    client_name: "Pedro Santos",
    client_email: "pedro.santos@email.com",
    client_phone: "(11) 99999-9999",
    rating: 5,
    comment: "Excelente profissional! Me ajudou muito com meu caso de divórcio. Sempre muito atencioso e explicou todo o processo de forma clara. Recomendo sem hesitação!",
    status: "approved",
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T11:00:00Z",
    is_pinned: true,
    is_featured: true,
    case_type: "Divórcio",
    service_type: "Consultoria",
    tags: ["excelente", "atencioso", "recomendo"],
    source: "website",
    verification_status: "verified",
    helpful_votes: 12,
    lawyer_response: {
      message: "Muito obrigado pelo seu feedback, Pedro! Fico feliz em ter ajudado você neste momento importante. Estou sempre à disposição.",
      created_at: "2024-03-15T14:00:00Z",
      is_public: true
    }
  },
  {
    id: "2",
    client_name: "Maria Oliveira",
    client_email: "maria.oliveira@email.com",
    rating: 4,
    comment: "Muito atencioso e profissional. Resolveu minha questão trabalhista rapidamente.",
    status: "approved",
    created_at: "2024-03-10T14:30:00Z",
    is_pinned: false,
    is_featured: false,
    case_type: "Trabalhista",
    service_type: "Processo",
    source: "google",
    verification_status: "verified",
    helpful_votes: 8
  },
  {
    id: "3",
    client_name: "Carlos Mendes",
    rating: 5,
    comment: "Resolveu meu processo com muita competência e agilidade. Profissional exemplar!",
    status: "pending",
    created_at: "2024-03-18T09:15:00Z",
    is_pinned: false,
    is_featured: false,
    case_type: "Civil",
    service_type: "Processo",
    source: "facebook",
    verification_status: "unverified"
  },
  {
    id: "4",
    client_name: "Ana Clara",
    rating: 4,
    comment: "Ótimo atendimento e dedicação ao caso. Muito profissional.",
    status: "pending",
    created_at: "2024-03-08T16:45:00Z",
    is_pinned: false,
    is_featured: false,
    case_type: "Família",
    service_type: "Consultoria",
    source: "website",
    verification_status: "verified"
  },
  {
    id: "5",
    client_name: "Roberto Silva",
    rating: 3,
    comment: "Serviço ok, mas poderia ter sido mais rápido na comunicação.",
    status: "approved",
    created_at: "2024-03-05T11:20:00Z",
    is_pinned: false,
    is_featured: false,
    case_type: "Empresarial",
    service_type: "Consultoria",
    source: "manual",
    verification_status: "verified",
    helpful_votes: 2
  },
  {
    id: "6",
    client_name: "Fernanda Costa",
    rating: 2,
    comment: "Não fiquei satisfeita com o atendimento. Esperava mais agilidade.",
    status: "rejected",
    created_at: "2024-03-01T08:30:00Z",
    is_pinned: false,
    is_featured: false,
    case_type: "Consumidor",
    service_type: "Consultoria",
    source: "website",
    verification_status: "suspicious",
    reported_count: 1
  }
];

const mockStats: ReviewStats = {
  total_reviews: 6,
  average_rating: 4.2,
  rating_distribution: {
    5: 2,
    4: 2,
    3: 1,
    2: 1,
    1: 0
  },
  pending_reviews: 2,
  approved_reviews: 3,
  rejected_reviews: 1,
  hidden_reviews: 0,
  this_month: 4,
  last_month: 2,
  growth_percentage: 100,
  response_rate: 33.3,
  average_response_time: 4
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [stats, setStats] = useState<ReviewStats>(mockStats);
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('all');

  // Filtrar e ordenar reviews
  const filteredReviews = reviews
    .filter(review => {
      if (activeTab !== 'all' && review.status !== activeTab) return false;
      if (filters.status && filters.status !== 'all' && review.status !== filters.status) return false;
      if (filters.rating && review.rating < filters.rating) return false;
      if (filters.source && filters.source !== 'all' && review.source !== filters.source) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          review.client_name.toLowerCase().includes(searchLower) ||
          review.comment.toLowerCase().includes(searchLower) ||
          review.case_type?.toLowerCase().includes(searchLower) ||
          review.service_type?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.case_type && !review.case_type?.toLowerCase().includes(filters.case_type.toLowerCase())) return false;
      if (filters.service_type && !review.service_type?.toLowerCase().includes(filters.service_type.toLowerCase())) return false;
      if (filters.is_pinned && !review.is_pinned) return false;
      if (filters.is_featured && !review.is_featured) return false;
      if (filters.has_response && !review.lawyer_response) return false;
      if (filters.verification_status && filters.verification_status !== 'all' && review.verification_status !== filters.verification_status) return false;
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleReviewAction = (reviewId: string, action: string, data?: any) => {
    try {
      setReviews(prev => prev.map(review => {
        if (review.id !== reviewId) return review;
        
        switch (action) {
          case 'approve':
            return { ...review, status: 'approved' as const, updated_at: new Date().toISOString() };
          case 'reject':
            return { ...review, status: 'rejected' as const, updated_at: new Date().toISOString() };
          case 'hide':
            return { ...review, status: 'hidden' as const, updated_at: new Date().toISOString() };
          case 'show':
            return { ...review, status: 'approved' as const, updated_at: new Date().toISOString() };
          case 'pin':
            return { ...review, is_pinned: true, updated_at: new Date().toISOString() };
          case 'unpin':
            return { ...review, is_pinned: false, updated_at: new Date().toISOString() };
          case 'feature':
            return { ...review, is_featured: true, updated_at: new Date().toISOString() };
          case 'unfeature':
            return { ...review, is_featured: false, updated_at: new Date().toISOString() };
          case 'delete':
            return null;
          default:
            return review;
        }
      }).filter(Boolean) as Review[]);
      
      if (action === 'delete') {
        toast.success('Avaliação removida com sucesso');
      } else {
        toast.success('Ação realizada com sucesso');
      }
    } catch (error) {
      toast.error('Não foi possível realizar a ação');
    }
  };

  const handleResponse = (review: Review) => {
    setSelectedReview(review);
    setIsResponseDialogOpen(true);
  };

  const handleSubmitResponse = (response: string, isPublic: boolean) => {
    if (!selectedReview) return;
    
    setReviews(prev => prev.map(review => 
      review.id === selectedReview.id 
        ? {
            ...review,
            lawyer_response: {
              message: response,
              created_at: new Date().toISOString(),
              is_public: isPublic
            },
            updated_at: new Date().toISOString()
          }
        : review
    ));
    
    setIsResponseDialogOpen(false);
    setSelectedReview(null);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return reviews.length;
    return reviews.filter(review => review.status === status).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Avaliações</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie e responda às avaliações dos seus clientes
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <ReviewStatsComponent stats={stats} />

        {/* Filters */}
        <ReviewFiltersComponent 
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {/* Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                Todas ({getTabCount('all')})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pendentes ({getTabCount('pending')})
              </TabsTrigger>
              <TabsTrigger value="approved" className="text-xs">
                Aprovadas ({getTabCount('approved')})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs">
                Rejeitadas ({getTabCount('rejected')})
              </TabsTrigger>
              <TabsTrigger value="hidden" className="text-xs">
                Ocultas ({getTabCount('hidden')})
              </TabsTrigger>
            </TabsList>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy('date')}
                className={sortBy === 'date' ? 'bg-muted' : ''}
              >
                Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy('rating')}
                className={sortBy === 'rating' ? 'bg-muted' : ''}
              >
                Avaliação
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy('status')}
                className={sortBy === 'status' ? 'bg-muted' : ''}
              >
                Status
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredReviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação encontrada</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {activeTab === 'all' 
                      ? 'Você ainda não possui avaliações ou nenhuma avaliação corresponde aos filtros aplicados.'
                      : `Não há avaliações com status "${activeTab}" que correspondam aos filtros aplicados.`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map(review => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onAction={handleReviewAction}
                    onRespond={handleResponse}
                    showClientInfo={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedReview && (
              <ReviewResponseComponent
                review={selectedReview}
                onClose={() => setIsResponseDialogOpen(false)}
                onSubmit={handleSubmitResponse}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <MadeWithDyad />
    </div>
  )
}