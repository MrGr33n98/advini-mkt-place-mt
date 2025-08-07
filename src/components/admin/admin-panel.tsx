'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Globe, 
  Users, 
  Flag, 
  Palette, 
  BarChart3, 
  Shield, 
  Zap,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { useAdminStore } from '@/lib/admin-integration'
import { toast } from 'sonner'

/**
 * Painel de Administração Frontend
 * 
 * Este componente permite que administradores configurem
 * todo o frontend através de uma interface integrada com o Active Admin
 */

interface AdminPanelProps {
  className?: string
}

export function AdminPanel({ className }: AdminPanelProps) {
  const {
    configs,
    pages,
    contentBlocks,
    availableThemes,
    featureFlags,
    adminUsers,
    isLoading,
    errors,
    fetchConfigs,
    updateConfig,
    createPage,
    updatePage,
    deletePage,
    createContentBlock,
    updateContentBlock,
    deleteContentBlock,
    updateFeatureFlag,
    syncWithBackend
  } = useAdminStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  useEffect(() => {
    // Carrega configurações iniciais
    fetchConfigs()
    syncWithBackend()
  }, [fetchConfigs, syncWithBackend])

  const handleSaveConfig = async () => {
    try {
      // Como configs é um array, vamos salvar todas as configurações
      for (const config of configs) {
        await updateConfig(config.key, config.value)
      }
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
      console.error(error)
    }
  }

  const handleSync = async () => {
    try {
      await syncWithBackend()
      toast.success('Sincronização concluída!')
    } catch (error) {
      toast.error('Erro na sincronização')
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando painel de administração...</span>
        </div>
      </div>
    )
  }

  if (errors.length > 0) {
    return (
      <Alert className="m-4">
        <AlertDescription>
          Erro ao carregar painel: {errors[0]}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Administração Frontend
            </h1>
            <p className="text-gray-600">
              Configure todo o frontend através do Active Admin
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Preview Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="preview-mode">Modo Preview</Label>
              <Switch
                id="preview-mode"
                checked={isPreviewMode}
                onCheckedChange={setIsPreviewMode}
              />
              {isPreviewMode ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </div>
            
            {/* Device Preview */}
            {isPreviewMode && (
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={selectedDevice === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedDevice === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Button onClick={handleSync} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sincronizar
            </Button>
            
            <Button onClick={handleSaveConfig}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Tudo
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Visão Geral
            </Button>
            
            <Button
              variant={activeTab === 'pages' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('pages')}
            >
              <Globe className="h-4 w-4 mr-2" />
              Páginas
            </Button>
            
            <Button
              variant={activeTab === 'content' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('content')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Conteúdo
            </Button>
            
            <Button
              variant={activeTab === 'themes' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('themes')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Temas
            </Button>
            
            <Button
              variant={activeTab === 'features' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('features')}
            >
              <Flag className="h-4 w-4 mr-2" />
              Feature Flags
            </Button>
            
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </Button>
            
            <Button
              variant={activeTab === 'security' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('security')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Segurança
            </Button>
            
            <Button
              variant={activeTab === 'performance' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('performance')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </Button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'pages' && <PagesTab />}
          {activeTab === 'content' && <ContentTab />}
          {activeTab === 'themes' && <ThemesTab />}
          {activeTab === 'features' && <FeaturesTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'performance' && <PerformanceTab />}
        </div>
      </div>
    </div>
  )
}

// Componentes das abas
function OverviewTab() {
  const { configs, pages, contentBlocks, featureFlags } = useAdminStore()
  
  // Helper para buscar configuração específica
  const getConfigValue = (key: string, defaultValue: any = '') => {
    const config = configs.find(c => c.key === key)
    return config?.value || defaultValue
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Visão Geral do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total de Páginas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pages?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blocos de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentBlocks?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Feature Flags Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {featureFlags?.filter(f => f.isEnabled).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configurações básicas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site-name">Nome do Site</Label>
              <Input
                id="site-name"
                value={getConfigValue('siteName')}
                placeholder="Nome do seu site"
              />
            </div>
            
            <div>
              <Label htmlFor="site-description">Descrição</Label>
              <Input
                id="site-description"
                value={getConfigValue('siteDescription')}
                placeholder="Descrição do site"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="maintenance-mode"
                checked={getConfigValue('maintenanceMode', false)}
              />
              <span className="text-sm text-gray-600">
                Ativar modo de manutenção
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PagesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciamento de Páginas</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Página
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Aqui você pode criar, editar e gerenciar todas as páginas do frontend.
            Cada página pode ter seu próprio layout, conteúdo e configurações.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ContentTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciamento de Conteúdo</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Bloco
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Gerencie blocos de conteúdo reutilizáveis que podem ser inseridos
            em qualquer página do site.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function ThemesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciamento de Temas</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tema
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Configure cores, tipografia e estilos visuais do site.
            Crie temas personalizados para diferentes seções.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function FeaturesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Feature Flags</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Feature
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Controle quais funcionalidades estão ativas no frontend.
            Ative/desative recursos sem precisar fazer deploy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function UsersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciamento de Usuários</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Gerencie usuários, permissões e controle de acesso
            às diferentes seções do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Configurações de Segurança</h2>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Configure políticas de segurança, rate limiting,
            CORS e outras configurações de proteção.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function PerformanceTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Monitoramento de Performance</h2>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">
            Monitore métricas de performance, cache,
            tempos de carregamento e otimizações.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel