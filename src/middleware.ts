import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware de Integração com Active Admin
 * 
 * Este middleware permite que o Active Admin controle:
 * - Redirecionamentos dinâmicos
 * - Controle de acesso a páginas
 * - Feature flags em nível de rota
 * - Configurações de cache
 * - A/B testing
 * - Manutenção programada
 */

interface AdminConfig {
  redirects: Array<{
    source: string
    destination: string
    permanent: boolean
    enabled: boolean
  }>
  featureFlags: Array<{
    key: string
    enabled: boolean
    rolloutPercentage: number
    targetPaths?: string[]
  }>
  maintenance: {
    enabled: boolean
    allowedPaths: string[]
    message: string
  }
  accessControl: Array<{
    path: string
    requiredRole: string
    enabled: boolean
  }>
  abTests: Array<{
    key: string
    enabled: boolean
    variants: Array<{
      name: string
      weight: number
      path: string
    }>
    targetPaths: string[]
  }>
}

// Cache para configurações do admin (evita muitas chamadas à API)
let adminConfigCache: AdminConfig | null = null
let lastConfigFetch = 0
const CONFIG_CACHE_TTL = 60000 // 1 minuto

async function getAdminConfig(): Promise<AdminConfig> {
  const now = Date.now()
  
  // Retorna cache se ainda válido
  if (adminConfigCache && (now - lastConfigFetch) < CONFIG_CACHE_TTL) {
    return adminConfigCache
  }
  
  // Configuração padrão (modo desenvolvimento)
  const defaultConfig: AdminConfig = {
    redirects: [],
    featureFlags: [],
    maintenance: {
      enabled: false,
      allowedPaths: ['/admin', '/api'],
      message: 'Site em manutenção. Voltamos em breve!'
    },
    accessControl: [],
    abTests: []
  }
  
  // Se não tiver URL da API configurada, retorna configuração padrão
  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.ADMIN_API_TOKEN) {
    console.log('API URL or token not configured, using default config')
    adminConfigCache = defaultConfig
    lastConfigFetch = now
    return defaultConfig
  }
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/middleware_config`, {
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 60 } // Cache por 60 segundos
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch admin config: ${response.status}`)
    }
    
    const config = await response.json()
    adminConfigCache = config
    lastConfigFetch = now
    
    return config
  } catch (error) {
    console.log('Using default config due to API error:', error instanceof Error ? error.message : 'Unknown error')
    
    // Retorna configuração padrão em caso de erro
    adminConfigCache = defaultConfig
    lastConfigFetch = now
    return defaultConfig
  }
}

function getUserId(request: NextRequest): string {
  // Tenta obter o ID do usuário de diferentes fontes
  const authCookie = request.cookies.get('auth_token')?.value
  const sessionCookie = request.cookies.get('session_id')?.value
  const userIdHeader = request.headers.get('x-user-id')
  
  if (authCookie) {
    try {
      // Decodifica o JWT para obter o user ID
      const payload = JSON.parse(atob(authCookie.split('.')[1]))
      return payload.user_id || payload.sub
    } catch {
      // Ignora erro de decodificação
    }
  }
  
  if (userIdHeader) {
    return userIdHeader
  }
  
  if (sessionCookie) {
    return sessionCookie
  }
  
  // Gera um ID temporário baseado no IP e User-Agent
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return btoa(`${ip}-${userAgent}`).slice(0, 16)
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

function isFeatureEnabled(
  flag: AdminConfig['featureFlags'][0], 
  userId: string, 
  pathname: string
): boolean {
  if (!flag.enabled) return false
  
  // Verifica se a rota está nos caminhos alvo
  if (flag.targetPaths && flag.targetPaths.length > 0) {
    const isTargetPath = flag.targetPaths.some(path => 
      pathname.startsWith(path) || pathname.match(new RegExp(path))
    )
    if (!isTargetPath) return false
  }
  
  // Verifica rollout percentage
  if (flag.rolloutPercentage < 100) {
    const hash = hashString(userId + flag.key)
    const percentage = hash % 100
    return percentage < flag.rolloutPercentage
  }
  
  return true
}

function selectABTestVariant(
  test: AdminConfig['abTests'][0],
  userId: string
): string | null {
  if (!test.enabled || test.variants.length === 0) return null
  
  const hash = hashString(userId + test.key)
  const totalWeight = test.variants.reduce((sum, variant) => sum + variant.weight, 0)
  const randomValue = hash % totalWeight
  
  let currentWeight = 0
  for (const variant of test.variants) {
    currentWeight += variant.weight
    if (randomValue < currentWeight) {
      return variant.name
    }
  }
  
  return test.variants[0].name // Fallback para primeira variante
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const userId = getUserId(request)
  
  try {
    const config = await getAdminConfig()
    
    // 1. Verificar modo de manutenção
    if (config.maintenance.enabled) {
      const isAllowedPath = config.maintenance.allowedPaths.some(path => 
        pathname.startsWith(path)
      )
      
      if (!isAllowedPath) {
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Manutenção</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  min-height: 100vh; 
                  margin: 0; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-align: center;
                }
                .container { max-width: 500px; padding: 2rem; }
                h1 { font-size: 2.5rem; margin-bottom: 1rem; }
                p { font-size: 1.2rem; opacity: 0.9; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>🔧 Manutenção</h1>
                <p>${config.maintenance.message}</p>
              </div>
            </body>
          </html>
          `,
          {
            status: 503,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Retry-After': '3600', // 1 hora
            },
          }
        )
      }
    }
    
    // 2. Verificar controle de acesso
    const accessRule = config.accessControl.find(rule => 
      rule.enabled && pathname.startsWith(rule.path)
    )
    
    if (accessRule) {
      const userRole = request.headers.get('x-user-role') || 'guest'
      
      if (userRole !== accessRule.requiredRole && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
    
    // 3. Verificar redirecionamentos dinâmicos
    const redirect = config.redirects.find(r => 
      r.enabled && (pathname === r.source || pathname.startsWith(r.source))
    )
    
    if (redirect) {
      const url = new URL(redirect.destination, request.url)
      return NextResponse.redirect(url, redirect.permanent ? 301 : 302)
    }
    
    // 4. Processar A/B Tests
    const abTest = config.abTests.find(test => 
      test.enabled && test.targetPaths.some(path => 
        pathname.startsWith(path) || pathname.match(new RegExp(path))
      )
    )
    
    if (abTest) {
      const variant = selectABTestVariant(abTest, userId)
      if (variant) {
        const variantConfig = abTest.variants.find(v => v.name === variant)
        if (variantConfig && variantConfig.path !== pathname) {
          const url = new URL(variantConfig.path + search, request.url)
          const response = NextResponse.rewrite(url)
          
          // Adiciona headers para tracking do A/B test
          response.headers.set('x-ab-test', abTest.key)
          response.headers.set('x-ab-variant', variant)
          
          return response
        }
      }
    }
    
    // 5. Processar Feature Flags
    const response = NextResponse.next()
    
    // Adiciona headers com feature flags ativas
    const activeFlags = config.featureFlags
      .filter(flag => isFeatureEnabled(flag, userId, pathname))
      .map(flag => flag.key)
    
    if (activeFlags.length > 0) {
      response.headers.set('x-feature-flags', activeFlags.join(','))
    }
    
    // Adiciona header com user ID para tracking
    response.headers.set('x-user-id', userId)
    
    // Adiciona headers de cache baseados na configuração
    if (pathname.startsWith('/api/')) {
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    } else if (pathname.startsWith('/static/') || pathname.includes('.')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    } else {
      response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    }
    
    return response
    
  } catch (error) {
    console.error('Middleware error:', error)
    
    // Em caso de erro, permite que a requisição continue normalmente
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}