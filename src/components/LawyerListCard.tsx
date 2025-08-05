'use client';

import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface LawyerListCardProps {
  lawyer: Lawyer;
  onSelect: (lawyer: Lawyer) => void;
  isSelected: boolean;
}

export default function LawyerListCard({ lawyer, onSelect, isSelected }: LawyerListCardProps) {
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(lawyer);
    }
  };

  return (
    <Card 
      onClick={() => onSelect(lawyer)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      className={cn(
        "cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(lawyer.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{lawyer.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((spec) => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
        <Button asChild className="w-full" onClick={(e) => e.stopPropagation()}>
          <Link href={`/advogados/${lawyer.slug}`}>
            Ver Perfil
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}