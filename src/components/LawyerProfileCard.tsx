'use client';

import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Phone, Mail, Award, MapPin, Copy, Share2, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SingleLawyerMap from "./SingleLawyerMap";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "./ReviewCard";

export default function LawyerProfileCard({ lawyer }: { lawyer: Lawyer }) {
  const lawyerReviews = reviews.filter(
    (review) => review.lawyer_id === lawyer.id && review.status === "approved"
  );

  const pinnedReviews = lawyerReviews.filter((review) => review.is_pinned);
  const regularReviews = lawyerReviews.filter((review) => !review.is_pinned);
  const allReviews = [...pinnedReviews, ...regularReviews];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado para a área de transferência!`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${lawyer.name}`,
      text: `Confira o perfil de ${lawyer.name}, especialista em ${lawyer.specialties.join(', ')}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Perfil compartilhado com sucesso!");
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link do perfil copiado para a área de transferência!");
      }
    } catch (error) {
      toast.error("Não foi possível compartilhar o perfil.");
      console.error("Error sharing:", error);
    }
  };

  const averageRating = lawyer.average_rating || 
    (lawyerReviews.length > 0 
      ? lawyerReviews.reduce((acc, review) => acc + review.rating, 0) / lawyerReviews.length 
      : 0);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-xl">
              <AvatarFallback>{getInitials(lawyer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{lawyer.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Advogado(a)
                {averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    • <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {averageRating.toFixed(1)}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Compartilhar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Especialidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((spec) => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
        
        {lawyer.bio && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Biografia</h3>
            <p className="text-muted-foreground">{lawyer.bio}</p>
          </div>
        )}

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
            {lawyer.oab && (
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">OAB</p>
                  <p className="text-sm text-muted-foreground">{lawyer.oab}</p>
                </div>
              </div>
            )}
            {lawyer.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <a 
                      href={lawyer.whatsapp_url || `https://wa.me/${lawyer.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      {lawyer.phone}
                    </a>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(lawyer.phone!, 'Telefone')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            {lawyer.email && (
              <div className="flex items-center justify-between col-span-1 md:col-span-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a 
                      href={`mailto:${lawyer.email}`} 
                      className="text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      {lawyer.email}
                    </a>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(lawyer.email!, 'Email')}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização
          </h3>
          <div className="overflow-hidden rounded-lg">
            <SingleLawyerMap latitude={lawyer.latitude} longitude={lawyer.longitude} />
          </div>
        </div>

        {allReviews.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Avaliações dos Clientes ({allReviews.length})
              </h3>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}