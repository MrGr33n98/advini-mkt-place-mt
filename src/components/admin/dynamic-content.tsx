"use client"

/**
 * Componentes para Renderização Dinâmica de Conteúdo
 * 
 * Estes componentes permitem que o Active Admin controle completamente
 * o conteúdo e layout do frontend Next.js em tempo real.
 */

import React, { useEffect, useState } from 'react'
import { useContentBlocks, useAdminConfig, useFeatureFlag, useTheme } from '@/lib/admin-integration'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Star, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Quote,
  Shield,
  Zap,
  Heart,
  Award,
  TrendingUp
} from 'lucide-react'

// ===== DYNAMIC PAGE RENDERER =====

interface DynamicPageProps {
  pageId?: string
  slug?: string
}

export function DynamicPage({ pageId, slug }: DynamicPageProps) {
  const contentBlocks = useContentBlocks(pageId)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for content blocks
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [pageId, slug])

  if (isLoading) {
    return <DynamicPageSkeleton />
  }

  if (contentBlocks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Nenhum conteúdo encontrado para esta página. Configure os blocos de conteúdo no Active Admin.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {contentBlocks.map((block) => (
        <DynamicContentBlock key={block.id} block={block} />
      ))}
    </div>
  )
}

// ===== DYNAMIC CONTENT BLOCK RENDERER =====

interface DynamicContentBlockProps {
  block: any // ContentBlock type from admin-integration
}

export function DynamicContentBlock({ block }: DynamicContentBlockProps) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock content={block.content} metadata={block.metadata} />
    case 'features':
      return <FeaturesBlock content={block.content} metadata={block.metadata} />
    case 'testimonials':
      return <TestimonialsBlock content={block.content} metadata={block.metadata} />
    case 'pricing':
      return <PricingBlock content={block.content} metadata={block.metadata} />
    case 'faq':
      return <FAQBlock content={block.content} metadata={block.metadata} />
    case 'custom':
      return <CustomBlock content={block.content} metadata={block.metadata} />
    default:
      return null
  }
}

// ===== HERO BLOCK =====

interface HeroBlockProps {
  content: {
    title: string
    subtitle: string
    description: string
    primaryCTA: {
      text: string
      href: string
    }
    secondaryCTA?: {
      text: string
      href: string
    }
    backgroundImage?: string
    stats?: Array<{
      value: string
      label: string
    }>
  }
  metadata: {
    variant?: 'default' | 'centered' | 'split'
    showStats?: boolean
  }
}

export function HeroBlock({ content, metadata }: HeroBlockProps) {
  const isFeatureEnabled = useFeatureFlag('hero_animations')
  const variant = metadata.variant || 'default'

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      {content.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        />
      )}
      
      <div className="container relative mx-auto px-4">
        <div className={`grid gap-12 ${variant === 'split' ? 'lg:grid-cols-2' : ''} items-center`}>
          <div className={variant === 'centered' ? 'text-center' : ''}>
            <Badge variant="secondary" className="mb-4">
              {content.subtitle}
            </Badge>
            
            <h1 className={`text-4xl font-bold tracking-tight text-gray-900 lg:text-6xl ${
              isFeatureEnabled.isEnabled ? 'animate-fade-in-up' : ''
            }`}>
              {content.title}
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-3xl">
              {content.description}
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" asChild>
                <a href={content.primaryCTA.href}>
                  {content.primaryCTA.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              {content.secondaryCTA && (
                <Button variant="outline" size="lg" asChild>
                  <a href={content.secondaryCTA.href}>
                    {content.secondaryCTA.text}
                  </a>
                </Button>
              )}
            </div>
            
            {metadata.showStats && content.stats && (
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {content.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {variant === 'split' && (
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 p-8">
                <div className="h-full w-full rounded-xl bg-white/10 backdrop-blur-sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ===== FEATURES BLOCK =====

interface FeaturesBlockProps {
  content: {
    title: string
    description: string
    features: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  metadata: {
    layout?: 'grid' | 'list'
    columns?: number
  }
}

export function FeaturesBlock({ content, metadata }: FeaturesBlockProps) {
  const layout = metadata.layout || 'grid'
  const columns = metadata.columns || 3

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      shield: Shield,
      zap: Zap,
      heart: Heart,
      award: Award,
      users: Users,
      star: Star,
      'trending-up': TrendingUp,
      'check-circle': CheckCircle,
    }
    return icons[iconName] || CheckCircle
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>
        
        <div className={`grid gap-8 ${
          layout === 'grid' 
            ? `md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns}`
            : 'max-w-4xl mx-auto'
        }`}>
          {content.features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon)
            
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ===== TESTIMONIALS BLOCK =====

interface TestimonialsBlockProps {
  content: {
    title: string
    testimonials: Array<{
      name: string
      role: string
      company: string
      content: string
      avatar?: string
      rating: number
    }>
  }
  metadata: {
    layout?: 'carousel' | 'grid'
    showRatings?: boolean
  }
}

export function TestimonialsBlock({ content, metadata }: TestimonialsBlockProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {content.title}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                {metadata.showRatings && (
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center">
                  {testimonial.avatar && (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== PRICING BLOCK =====

interface PricingBlockProps {
  content: {
    title: string
    description: string
    plans: Array<{
      name: string
      price: string
      period: string
      description: string
      features: string[]
      isPopular?: boolean
      ctaText: string
      ctaHref: string
    }>
  }
  metadata: {
    showAnnualDiscount?: boolean
  }
}

export function PricingBlock({ content, metadata }: PricingBlockProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {content.plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 ${
                plan.isPopular 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.isPopular ? 'default' : 'outline'}
                  asChild
                >
                  <a href={plan.ctaHref}>
                    {plan.ctaText}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== FAQ BLOCK =====

interface FAQBlockProps {
  content: {
    title: string
    faqs: Array<{
      question: string
      answer: string
    }>
  }
  metadata: {
    layout?: 'accordion' | 'grid'
  }
}

export function FAQBlock({ content, metadata }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {content.title}
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {content.faqs.map((faq, index) => (
            <Card key={index} className="mb-4">
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <CardTitle className="text-lg flex justify-between items-center">
                  {faq.question}
                  <span className="text-2xl">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </CardTitle>
              </CardHeader>
              
              {openIndex === index && (
                <CardContent className="pt-0">
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ===== CUSTOM BLOCK =====

interface CustomBlockProps {
  content: any
  metadata: any
}

export function CustomBlock({ content, metadata }: CustomBlockProps) {
  // This allows for completely custom HTML/React content
  // managed through Active Admin
  
  if (content.html) {
    return (
      <section 
        className={metadata.className || 'py-20'}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    )
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <Alert>
          <AlertDescription>
            Bloco customizado não configurado. Configure o conteúdo no Active Admin.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  )
}

// ===== LOADING SKELETON =====

export function DynamicPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Skeleton className="h-4 w-24 mx-auto mb-4" />
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-[600px] mx-auto mb-8" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-8">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ===== ADMIN CONFIG WRAPPER =====

interface AdminConfigWrapperProps {
  configKey: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminConfigWrapper({ configKey, children, fallback }: AdminConfigWrapperProps) {
  const { value, isActive } = useAdminConfig(configKey)
  
  if (!isActive || !value) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
}

// ===== FEATURE FLAG WRAPPER =====

interface FeatureFlagWrapperProps {
  flagKey: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureFlagWrapper({ flagKey, children, fallback }: FeatureFlagWrapperProps) {
  const { isEnabled } = useFeatureFlag(flagKey)
  
  if (!isEnabled) {
    return fallback ? <>{fallback}</> : null
  }
  
  return <>{children}</>
}