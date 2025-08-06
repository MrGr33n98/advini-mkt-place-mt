'use client';

import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, DollarSign, Star, Phone, Mail, Sparkles } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { PlanBadge } from "./PlanBadge";
import { useState } from "react";

interface LawyerListCardProps {
  lawyer: Lawyer;
  onSelect: (lawyer: Lawyer) => void;
  isSelected: boolean;
}

export default function LawyerListCard({ lawyer, onSelect, isSelected }: LawyerListCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(lawyer);
    }
  };

  const isFeatured = lawyer.is_featured;
  const isPremiumPlan = lawyer.plan === 'gold' || lawyer.plan === 'silver';

  return (
    <Card 
      onClick={() => onSelect(lawyer)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative overflow-hidden",
        "hover:shadow-lg hover:-translate-y-1",
        isSelected && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
        isFeatured && "border-amber-300 shadow-amber-100 shadow-lg",
        isPremiumPlan && "hover:shadow-xl"
      )}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Destaque
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className={cn(
              "transition-all duration-300",
              isPremiumPlan && "ring-2 ring-offset-2",
              lawyer.plan === 'gold' && "ring-amber-400",
              lawyer.plan === 'silver' && "ring-slate-400"
            )}>
              <AvatarFallback className={cn(
                lawyer.plan === 'gold' && "bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-800",
                lawyer.plan === 'silver' && "bg-gradient-to-br from-slate-100 to-gray-100 text-slate-800"
              )}>
                {getInitials(lawyer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{lawyer.name}</CardTitle>
              {lawyer.oab && (
                <p className="text-sm text-muted-foreground mt-1">OAB {lawyer.oab}</p>
              )}
            </div>
          </div>
          <PlanBadge plan={lawyer.plan} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating */}
        {lawyer.average_rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{lawyer.average_rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({lawyer.total_reviews} avaliações)
            </span>
          </div>
        )}

        {/* Specialties */}
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.slice(0, 2).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            {lawyer.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{lawyer.specialties.length - 2} mais
              </Badge>
            )}
          </div>
        </div>
        
        {/* Price */}
        {lawyer.consultation_fee && (
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
            isPremiumPlan ? "bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20" : "bg-muted/50"
          )}>
            <DollarSign className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Consulta a partir de</p>
              <p className="text-lg font-semibold text-primary">
                R$ {lawyer.consultation_fee.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* Hover Preview */}
        {isHovered && lawyer.bio && (
          <div className="bg-muted/30 p-3 rounded-lg border-l-4 border-primary animate-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {lawyer.bio}
            </p>
          </div>
        )}

        {/* Contact Preview on Hover */}
        {isHovered && (lawyer.phone || lawyer.email) && (
          <div className="flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
            {lawyer.phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                <Phone className="w-3 h-3" />
                <span className="hidden sm:inline">Telefone</span>
              </div>
            )}
            {lawyer.email && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">Email</span>
              </div>
            )}
          </div>
        )}
        
        <Button 
          asChild 
          className={cn(
            "w-full transition-all duration-300",
            isPremiumPlan && "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          )} 
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`/advogados/${lawyer.slug}`}>
            Ver Perfil Completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}