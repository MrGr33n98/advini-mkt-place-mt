'use client'

import { useState, useEffect } from 'react'

export interface ShareMetric {
  id: string
  platform: string
  timestamp: Date
  profileId: string
  profileType: 'lawyer' | 'office'
  userAgent?: string
  referrer?: string
  location?: string
}

export interface ShareStats {
  totalShares: number
  sharesByPlatform: Record<string, number>
  sharesLast7Days: number
  sharesLast30Days: number
  topPlatforms: Array<{ platform: string; count: number; percentage: number }>
  dailyShares: Array<{ date: string; count: number }>
  weeklyShares: Array<{ week: string; count: number }>
  monthlyShares: Array<{ month: string; count: number }>
}

export interface ProfileVisit {
  id: string
  profileId: string
  profileType: 'lawyer' | 'office'
  timestamp: Date
  source: 'direct' | 'social' | 'referral' | 'search' | 'qr'
  platform?: string
  referralCode?: string
  userAgent?: string
  ipAddress?: string
  sessionId: string
}

export interface VisitStats {
  totalVisits: number
  uniqueVisitors: number
  visitsLast7Days: number
  visitsLast30Days: number
  visitsBySource: Record<string, number>
  conversionRate: number
  averageSessionDuration: number
  bounceRate: number
  topSources: Array<{ source: string; count: number; percentage: number }>
  dailyVisits: Array<{ date: string; visits: number; uniqueVisitors: number }>
}

export function useShareMetrics(profileId: string, profileType: 'lawyer' | 'office') {
  const [shareMetrics, setShareMetrics] = useState<ShareMetric[]>([])
  const [visitMetrics, setVisitMetrics] = useState<ProfileVisit[]>([])
  const [shareStats, setShareStats] = useState<ShareStats>({
    totalShares: 0,
    sharesByPlatform: {},
    sharesLast7Days: 0,
    sharesLast30Days: 0,
    topPlatforms: [],
    dailyShares: [],
    weeklyShares: [],
    monthlyShares: []
  })
  const [visitStats, setVisitStats] = useState<VisitStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    visitsLast7Days: 0,
    visitsLast30Days: 0,
    visitsBySource: {},
    conversionRate: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
    topSources: [],
    dailyVisits: []
  })

  // Carregar métricas do localStorage
  useEffect(() => {
    const savedShares = localStorage.getItem(`share_metrics_${profileId}`)
    const savedVisits = localStorage.getItem(`visit_metrics_${profileId}`)

    if (savedShares) {
      const parsedShares = JSON.parse(savedShares).map((metric: any) => ({
        ...metric,
        timestamp: new Date(metric.timestamp)
      }))
      setShareMetrics(parsedShares)
      calculateShareStats(parsedShares)
    }

    if (savedVisits) {
      const parsedVisits = JSON.parse(savedVisits).map((visit: any) => ({
        ...visit,
        timestamp: new Date(visit.timestamp)
      }))
      setVisitMetrics(parsedVisits)
      calculateVisitStats(parsedVisits)
    }
  }, [profileId])

  // Calcular estatísticas de compartilhamento
  const calculateShareStats = (metrics: ShareMetric[]) => {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalShares = metrics.length
    const sharesLast7Days = metrics.filter(m => m.timestamp >= last7Days).length
    const sharesLast30Days = metrics.filter(m => m.timestamp >= last30Days).length

    // Shares por plataforma
    const sharesByPlatform = metrics.reduce((acc, metric) => {
      acc[metric.platform] = (acc[metric.platform] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top plataformas
    const topPlatforms = Object.entries(sharesByPlatform)
      .map(([platform, count]) => ({
        platform,
        count,
        percentage: (count / totalShares) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Shares diários (últimos 30 dias)
    const dailyShares = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const count = metrics.filter(m => 
        m.timestamp.toISOString().split('T')[0] === dateStr
      ).length
      dailyShares.push({ date: dateStr, count })
    }

    // Shares semanais (últimas 12 semanas)
    const weeklyShares = []
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      const count = metrics.filter(m => 
        m.timestamp >= weekStart && m.timestamp < weekEnd
      ).length
      weeklyShares.push({ 
        week: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`, 
        count 
      })
    }

    // Shares mensais (últimos 12 meses)
    const monthlyShares = []
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      const count = metrics.filter(m => 
        m.timestamp >= monthStart && m.timestamp <= monthEnd
      ).length
      monthlyShares.push({ 
        month: `${monthStart.getMonth() + 1}/${monthStart.getFullYear()}`, 
        count 
      })
    }

    setShareStats({
      totalShares,
      sharesByPlatform,
      sharesLast7Days,
      sharesLast30Days,
      topPlatforms,
      dailyShares,
      weeklyShares,
      monthlyShares
    })
  }

  // Calcular estatísticas de visitas
  const calculateVisitStats = (visits: ProfileVisit[]) => {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalVisits = visits.length
    const uniqueVisitors = new Set(visits.map(v => v.sessionId)).size
    const visitsLast7Days = visits.filter(v => v.timestamp >= last7Days).length
    const visitsLast30Days = visits.filter(v => v.timestamp >= last30Days).length

    // Visitas por fonte
    const visitsBySource = visits.reduce((acc, visit) => {
      const source = visit.source
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Top fontes
    const topSources = Object.entries(visitsBySource)
      .map(([source, count]) => ({
        source,
        count,
        percentage: (count / totalVisits) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Visitas diárias (últimos 30 dias)
    const dailyVisits = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      const dayVisits = visits.filter(v => 
        v.timestamp.toISOString().split('T')[0] === dateStr
      )
      const uniqueVisitorsDay = new Set(dayVisits.map(v => v.sessionId)).size
      dailyVisits.push({ 
        date: dateStr, 
        visits: dayVisits.length, 
        uniqueVisitors: uniqueVisitorsDay 
      })
    }

    // Métricas simuladas (em um cenário real, viriam do backend)
    const conversionRate = Math.random() * 10 // 0-10%
    const averageSessionDuration = Math.random() * 300 + 60 // 1-6 minutos
    const bounceRate = Math.random() * 50 + 20 // 20-70%

    setVisitStats({
      totalVisits,
      uniqueVisitors,
      visitsLast7Days,
      visitsLast30Days,
      visitsBySource,
      conversionRate,
      averageSessionDuration,
      bounceRate,
      topSources,
      dailyVisits
    })
  }

  // Registrar compartilhamento
  const trackShare = (platform: string) => {
    const newMetric: ShareMetric = {
      id: Date.now().toString(),
      platform,
      timestamp: new Date(),
      profileId,
      profileType,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    }

    const updatedMetrics = [...shareMetrics, newMetric]
    setShareMetrics(updatedMetrics)
    localStorage.setItem(`share_metrics_${profileId}`, JSON.stringify(updatedMetrics))
    calculateShareStats(updatedMetrics)

    // Simular geolocalização (em produção, seria feito no backend)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const updatedMetric = {
          ...newMetric,
          location: `${position.coords.latitude},${position.coords.longitude}`
        }
        const updatedMetricsWithLocation = updatedMetrics.map(m => 
          m.id === newMetric.id ? updatedMetric : m
        )
        setShareMetrics(updatedMetricsWithLocation)
        localStorage.setItem(`share_metrics_${profileId}`, JSON.stringify(updatedMetricsWithLocation))
      })
    }
  }

  // Registrar visita
  const trackVisit = (source: 'direct' | 'social' | 'referral' | 'search' | 'qr', platform?: string, referralCode?: string) => {
    const sessionId = sessionStorage.getItem('sessionId') || Date.now().toString()
    sessionStorage.setItem('sessionId', sessionId)

    const newVisit: ProfileVisit = {
      id: Date.now().toString(),
      profileId,
      profileType,
      timestamp: new Date(),
      source,
      platform,
      referralCode,
      userAgent: navigator.userAgent,
      sessionId
    }

    const updatedVisits = [...visitMetrics, newVisit]
    setVisitMetrics(updatedVisits)
    localStorage.setItem(`visit_metrics_${profileId}`, JSON.stringify(updatedVisits))
    calculateVisitStats(updatedVisits)
  }

  // Obter métricas de um período específico
  const getMetricsForPeriod = (days: number) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    
    const periodShares = shareMetrics.filter(m => m.timestamp >= cutoffDate)
    const periodVisits = visitMetrics.filter(v => v.timestamp >= cutoffDate)

    return {
      shares: periodShares,
      visits: periodVisits,
      shareCount: periodShares.length,
      visitCount: periodVisits.length,
      uniqueVisitors: new Set(periodVisits.map(v => v.sessionId)).size
    }
  }

  // Exportar dados
  const exportMetrics = () => {
    const data = {
      profileId,
      profileType,
      exportDate: new Date().toISOString(),
      shareMetrics,
      visitMetrics,
      shareStats,
      visitStats
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `metrics_${profileId}_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    shareMetrics,
    visitMetrics,
    shareStats,
    visitStats,
    trackShare,
    trackVisit,
    getMetricsForPeriod,
    exportMetrics
  }
}