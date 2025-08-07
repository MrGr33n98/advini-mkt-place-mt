"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveWrapperProps {
  children: ReactNode
  className?: string
}

export function ResponsiveWrapper({ children, className }: ResponsiveWrapperProps) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  )
}