'use client';

import { Lawyer } from '@/types/lawyer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone, Mail, MessageCircle, MapPin, Award } from 'lucide-react';
import { PlanBadge } from './PlanBadge';
import Link from 'next/link';

interface LawyerMapPopupProps {
  lawyer: Lawyer;
}

export function LawyerMapPopup({ lawyer }: LawyerMapPopupProps) {
  const handleContact = (type: 'phone' | 'email' | 'whatsapp') => {
    switch (type) {
      case 'phone':
        window.open(`tel:${lawyer.phone}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${lawyer.email}`, '_blank');
        break;
      case 'whatsapp':
        if (lawyer.whatsapp_url) {
          window.open(lawyer.whatsapp_url, '_blank');
        }
        break;
    }
  };

  return (
    <Card className="w-80 border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{lawyer.name}</h3>
              <PlanBadge plan={lawyer.plan} size="sm" />
            </div>
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{lawyer.average_rating}</span>
              <span className="text-xs text-muted-foreground">
                ({lawyer.total_reviews} avaliações)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1">
            {lawyer.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {lawyer.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialties.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Cuiabá, MT</span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8"
            onClick={() => handleContact('phone')}
          >
            <Phone className="h-3 w-3 mr-1" />
            Ligar
          </Button>
          {lawyer.whatsapp_url && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8"
              onClick={() => handleContact('whatsapp')}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              WhatsApp
            </Button>
          )}
        </div>

        <Link href={`/advogados/${lawyer.slug}`}>
          <Button size="sm" className="w-full h-8">
            Ver Perfil Completo
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}