import { useState, useMemo } from "react";
import { Review } from "@/types/review";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewFilters, ReviewFilters as ReviewFiltersType } from "@/components/ReviewFilters";
import { ReviewPagination } from "@/components/ReviewPagination";
import { ReviewStats } from "@/components/ReviewStats";
import { ReviewForm } from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MessageSquare } from "lucide-react";

interface EnhancedReviewSectionProps {
  reviews: Review[];
  lawyerId: string;
  allowNewReviews?: boolean;
}

export function EnhancedReviewSection({ 
  reviews, 
  lawyerId, 
  allowNewReviews = true 
}: EnhancedReviewSectionProps) {
  const [filters, setFilters] = useState<ReviewFiltersType>({
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Obter tipos de caso únicos
  const caseTypes = useMemo(() => {
    const types = reviews
      .map(review => review.case_type)
      .filter((type): type is string => Boolean(type));
    return Array.from(new Set(types));
  }, [reviews]);

  // Aplicar filtros e ordenação
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews];

    // Aplicar filtros
    if (filters.rating) {
      filtered = filtered.filter(review => review.rating >= filters.rating!);
    }

    if (filters.caseType) {
      filtered = filtered.filter(review => review.case_type === filters.caseType);
    }

    if (filters.showOnlyWithResponse) {
      filtered = filtered.filter(review => review.lawyer_response);
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [reviews, filters]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredAndSortedReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Resetar página quando filtros mudam
  const handleFiltersChange = (newFilters: ReviewFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Resetar página quando itens por página mudam
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Simular voto útil
  const handleHelpfulVote = (reviewId: string) => {
    console.log(`Voto útil para avaliação ${reviewId}`);
    // Aqui você implementaria a lógica para salvar o voto
  };

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <ReviewStats reviews={reviews} />

      {/* Botão para nova avaliação */}
      {allowNewReviews && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}
          </Button>
        </div>
      )}

      {/* Formulário de nova avaliação */}
      {showReviewForm && (
        <Card>
          <CardContent className="p-6">
            <ReviewForm
              lawyerId={lawyerId}
              onReviewSubmitted={() => setShowReviewForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <ReviewFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        caseTypes={caseTypes}
        totalReviews={reviews.length}
        filteredCount={filteredAndSortedReviews.length}
      />

      {/* Lista de avaliações */}
      <div className="space-y-4">
        {paginatedReviews.length > 0 ? (
          paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpfulVote={handleHelpfulVote}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma avaliação encontrada
              </h3>
              <p className="text-muted-foreground">
                {reviews.length === 0
                  ? 'Este advogado ainda não possui avaliações.'
                  : 'Nenhuma avaliação corresponde aos filtros selecionados.'}
              </p>
              {reviews.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleFiltersChange({ sortBy: 'newest' })}
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Paginação */}
      {filteredAndSortedReviews.length > 0 && (
        <ReviewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSortedReviews.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}