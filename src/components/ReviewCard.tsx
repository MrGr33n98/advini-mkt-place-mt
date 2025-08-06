import { Review } from "@/types/review";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Pin, ThumbsUp, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
  showLawyerResponse?: boolean;
  onHelpfulVote?: (reviewId: string) => void;
}

export function ReviewCard({ review, showLawyerResponse = true, onHelpfulVote }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulVote = () => {
    if (!hasVoted) {
      setHasVoted(true);
      onHelpfulVote?.(review.id);
    }
  };

  return (
    <Card className="relative">
      {review.is_pinned && (
        <div className="absolute top-3 right-3">
          <Pin className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{review.client_name}</h3>
              {review.case_type && (
                <Badge variant="outline" className="text-xs">
                  {review.case_type}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        
        {/* Ações da avaliação */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpfulVote}
            disabled={hasVoted}
            className={`text-sm ${hasVoted ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${hasVoted ? 'fill-current' : ''}`} />
            Útil ({review.helpful_votes || 0})
          </Button>
        </div>

        {/* Resposta do advogado */}
        {showLawyerResponse && review.lawyer_response && (
          <>
            <Separator />
            <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Resposta do Advogado</span>
                <span className="text-xs text-blue-600">
                  {format(new Date(review.lawyer_response.created_at), "d 'de' MMM", { locale: ptBR })}
                </span>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                {review.lawyer_response.message}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}