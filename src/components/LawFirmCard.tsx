'use client';

import { LawFirm } from '@/types/lawfirm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlanBadge } from '@/components/PlanBadge';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Globe,
  Clock,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface LawFirmCardProps {
  lawFirm: LawFirm;
  onSelect?: (lawFirm: LawFirm) => void;
  isSelected?: boolean;
}

export function LawFirmCard({ lawFirm, onSelect, isSelected }: LawFirmCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  const handleCardClick = () => {
    onSelect?.(lawFirm);
  };

  const handleContactClick = (e: React.MouseEvent, type: 'phone' | 'email' | 'website') => {
    e.stopPropagation();
    
    switch (type) {
      case 'phone':
        window.open(`tel:${lawFirm.phone}`);
        break;
      case 'email':
        window.open(`mailto:${lawFirm.email}`);
        break;
      case 'website':
        if (lawFirm.website) {
          window.open(lawFirm.website, '_blank');
        }
        break;
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-lg border-2",
        isSelected ? "border-primary shadow-lg" : "border-transparent hover:border-primary/20",
        lawFirm.is_featured && "ring-2 ring-yellow-400/30 bg-gradient-to-br from-yellow-50/50 to-white",
        lawFirm.plan === 'gold' && !lawFirm.is_featured && "ring-1 ring-yellow-300/20 bg-gradient-to-br from-yellow-50/20 to-white",
        lawFirm.plan === 'silver' && !lawFirm.is_featured && "ring-1 ring-gray-300/20 bg-gradient-to-br from-gray-50/20 to-white"
      )}
      onClick={handleCardClick}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <CardContent className="p-0">
        {/* Banner/Header */}
        <div className="relative h-32 bg-gradient-to-r from-primary/10 to-primary/5 overflow-hidden">
          {lawFirm.banner_url && (
            <img 
              src={lawFirm.banner_url} 
              alt={`Banner ${lawFirm.name}`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Plan Badge */}
          <div className="absolute top-3 right-3">
            <PlanBadge plan={lawFirm.plan} size="sm" />
          </div>

          {/* Featured Badge */}
          {lawFirm.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Destaque
              </Badge>
            </div>
          )}

          {/* Logo */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden border-2 border-white">
              {lawFirm.logo_url ? (
                <img 
                  src={lawFirm.logo_url} 
                  alt={`Logo ${lawFirm.name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-primary" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pt-8">
          {/* Header Info */}
          <div className="mb-3">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {lawFirm.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            {/* Founded Year */}
            {lawFirm.founded_year && (
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                Fundado em {lawFirm.founded_year}
              </div>
            )}

            {/* Location */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{lawFirm.address}, {lawFirm.city}</span>
            </div>

            {/* Lawyers Count */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              {lawFirm.lawyers_count} advogado{lawFirm.lawyers_count !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{lawFirm.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({lawFirm.total_reviews} avaliações)
            </span>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {lawFirm.specialties.slice(0, 3).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {lawFirm.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{lawFirm.specialties.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {lawFirm.description}
          </p>

          {/* Contact Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => handleContactClick(e, 'phone')}
            >
              <Phone className="w-3 h-3 mr-1" />
              Ligar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleContactClick(e, 'email')}
            >
              <Mail className="w-3 h-3" />
            </Button>
            {lawFirm.website && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleContactClick(e, 'website')}
              >
                <Globe className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Hover Preview */}
        {showPreview && (
          <div className="absolute inset-x-0 bottom-0 bg-white border-t shadow-lg p-4 z-10 transform transition-all duration-200">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Principais Serviços:</h4>
              <div className="grid grid-cols-1 gap-1">
                {lawFirm.services.slice(0, 3).map((service, index) => (
                  <div key={index} className="text-xs text-muted-foreground flex items-center">
                    <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                    {service}
                  </div>
                ))}
              </div>
              
              {/* Office Hours */}
              <div className="pt-2 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Seg-Sex: {lawFirm.office_hours.monday}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}