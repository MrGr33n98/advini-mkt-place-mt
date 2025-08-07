"use client"

import { useMemo } from 'react'

export function useMemoizedData<T>(data: T, dependencies: React.DependencyList): T {
  return useMemo(() => data, dependencies)
}