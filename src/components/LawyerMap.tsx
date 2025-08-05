'use client';

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Lawyer } from '@/types/lawyer';

interface LawyerMapProps {
  lawyers: Lawyer[];
}

export default function LawyerMap(props: LawyerMapProps) {
  const Map = useMemo(() => dynamic(
    () => import('@/components/InteractiveLawyerMap'),
    { 
      loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
      ssr: false
    }
  ), [])

  return <Map {...props} />
}