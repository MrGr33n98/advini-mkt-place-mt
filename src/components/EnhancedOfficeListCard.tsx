'use client';

import { Office } from "@/types/office";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Star, Users, Phone, Mail, Globe, 
  MessageSquare, ExternalLink, Building2, Shield,
  Award, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { reviews } from "@/data/reviews";

interface EnhancedOfficeListCardProps {
  office: Office;
}

export default function EnhancedOfficeListCard({ office }: EnhancedOfficeListCardProps) {
  const officeReviews = reviews.filter(
    (review) => review.office_id === office.id && review.status === "approved"
  );

  const averageRating = office.rating || 
    (officeReviews.length > 0 
      ? officeReviews.reduce((acc, review) => acc + review.rating, 0) / officeReviews.length 
      : 0);

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (office.phone) {
      window.open(`https://wa.me/${office.phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPlanLabel = (tier: string) => {
    switch (tier) {
      case 'gold': return 'Gold';
      case 'silver': return 'Silver';
      default: return 'Básico';
    }
  };

  return (
    <Link href={`/escritorios/${office.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-lg overflow-hidden border-2 border-border group-hover:border-primary/30 transition-colors">
                <img 
                  src={office.logo_url} 
                  alt={office.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              {office.is_sponsored && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5">
                    <Star className="h-3 w-3 mr-1" />
                    Patrocinado
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {office.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>Escritório de Advocacia</span>
                    <Badge className={`${getPlanBadgeColor(office.plan_tier)} text-xs`}>
                      {getPlanLabel(office.plan_tier)}
                    </Badge>
                  </div>
                </div>
                
                {averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{averageRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({officeReviews.length})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Descrição */}
          {office.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {office.description}
            </p>
          )}
          
          {/* Especialidades */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {office.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {specialty}
                </Badge>
              ))}
              {office.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{office.specialties.length - 3} mais
                </Badge>
              )}
            </div>
          </div>
          
          {/* Informações principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-red-500" />
              <span className="line-clamp-1">{office.address}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{office.lawyers?.length || 0} advogados</span>
            </div>
            
            {office.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="line-clamp-1">{office.phone}</span>
              </div>
            )}
            
            {office.website && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4 text-purple-500" />
                <span className="line-clamp-1">Website disponível</span>
              </div>
            )}
          </div>
          
          {/* Destaques do plano */}
          {office.plan_tier === 'gold' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Escritório Premium</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-yellow-700">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Perfil verificado</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Resposta rápida</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleContact}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contatar
            </Button>
            <Button 
              size="sm" 
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground"
            >
              Ver Perfil
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}