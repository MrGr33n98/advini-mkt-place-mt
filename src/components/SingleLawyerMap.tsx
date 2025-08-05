'use client';

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface SingleLawyerMapProps {
  latitude: number;
  longitude: number;
}

export default function SingleLawyerMap(props: SingleLawyerMapProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/InteractiveSingleLawyerMap'),
    { 
      loading: () => <Skeleton className="h-[200px] w-full rounded-lg" />,
      ssr: false
    }
  ), [])

  return <Map {...props} />
}