import { Review } from "@/types/review";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, Pin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="relative">
      {review.is_pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-primary" />
        </div>
      )}
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{review.client_name}</h3>
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
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(review.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
      </CardContent>
    </Card>
  );
}