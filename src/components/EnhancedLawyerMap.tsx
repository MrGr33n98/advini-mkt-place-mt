'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Lawyer } from '@/types/lawyer';

interface EnhancedLawyerMapProps {
  lawyers: Lawyer[];
  center: [number, number];
  zoom: number;
  selectedLawyerId?: string | null;
  onMarkerClick?: (lawyerId: string) => void;
}

export default function EnhancedLawyerMap(props: EnhancedLawyerMapProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/EnhancedInteractiveLawyerMap'),
    { 
      loading: () => (
        <div className="h-full w-full rounded-lg bg-muted/50 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-full w-full rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm">Carregando mapa...</p>
              </div>
            </div>
          </div>
        </div>
      ),
      ssr: false
    }
  ), []);

  return <Map {...props} />;
}