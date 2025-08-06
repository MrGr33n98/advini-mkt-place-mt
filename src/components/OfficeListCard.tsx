'use client';

import { Office } from '@/types/office';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Briefcase, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfficeListCardProps {
  office: Office;
}

export function OfficeListCard({ office }: OfficeListCardProps) {
  return (
    <Card className={cn("flex flex-col", office.is_sponsored && "border-secondary shadow-lg")}>
      {office.is_sponsored && (
        <div className="bg-secondary text-secondary-foreground text-xs font-bold text-center py-1 rounded-t-lg flex items-center justify-center gap-1">
          <Zap className="h-3 w-3" />
          PATROCINADO
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-4">
          <img src={office.logo_url} alt={office.name} className="h-12 w-12 rounded-md object-cover" />
          <div>
            <CardTitle className="text-lg">{office.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {office.rating || 'N/A'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {office.description}
        </p>
        <div className="flex items-start gap-2">
          <Briefcase className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            {office.specialties.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline">{spec}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/escritorios/${office.slug}`}>
            Ver Perfil do Escritório
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}