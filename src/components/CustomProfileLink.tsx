'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Link,
  Copy,
  Check,
  Edit,
  Save,
  X,
  ExternalLink,
  QrCode,
  BarChart3,
  Eye,
  Users,
  Calendar
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface CustomLink {
  id: string
  slug: string
  originalUrl: string
  customUrl: string
  title: string
  description: string
  isActive: boolean
  createdAt: Date
  expiresAt?: Date
  clicks: number
  uniqueVisitors: number
  lastAccessed?: Date
}

interface CustomProfileLinkProps {
  lawyerId: string
  lawyerName: string
  originalUrl: string
  className?: string
}

export function CustomProfileLink({
  lawyerId,
  lawyerName,
  originalUrl,
  className = ''
}: CustomProfileLinkProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([])
  const [newSlug, setNewSlug] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkDescription, setLinkDescription] = useState('')
  const [copied, setCopied] = useState(false)

  // Carregar links existentes
  useEffect(() => {
    const savedLinks = localStorage.getItem(`customLinks_${lawyerId}`)
    if (savedLinks) {
      setCustomLinks(JSON.parse(savedLinks))
    }
  }, [lawyerId])

  // Salvar links no localStorage
  const saveLinks = (links: CustomLink[]) => {
    localStorage.setItem(`customLinks_${lawyerId}`, JSON.stringify(links))
    setCustomLinks(links)
  }

  // Gerar slug automático baseado no nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  }

  // Verificar se slug está disponível
  const isSlugAvailable = (slug: string) => {
    return !customLinks.some(link => link.slug === slug && link.isActive)
  }

  // Criar novo link personalizado
  const createCustomLink = () => {
    if (!newSlug.trim()) {
      toast.error('Digite um nome para o link')
      return
    }

    const slug = generateSlug(newSlug)
    
    if (!isSlugAvailable(slug)) {
      toast.error('Este nome já está em uso')
      return
    }

    const newLink: CustomLink = {
      id: Date.now().toString(),
      slug,
      originalUrl,
      customUrl: `${window.location.origin}/p/${slug}`,
      title: linkTitle || `Perfil de ${lawyerName}`,
      description: linkDescription || `Confira o perfil profissional de ${lawyerName}`,
      isActive: true,
      createdAt: new Date(),
      clicks: 0,
      uniqueVisitors: 0
    }

    const updatedLinks = [...customLinks, newLink]
    saveLinks(updatedLinks)
    
    setNewSlug('')
    setLinkTitle('')
    setLinkDescription('')
    setIsEditing(false)
    
    toast.success('Link personalizado criado!')
  }

  // Copiar link para área de transferência
  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copiado!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  // Desativar link
  const deactivateLink = (linkId: string) => {
    const updatedLinks = customLinks.map(link =>
      link.id === linkId ? { ...link, isActive: false } : link
    )
    saveLinks(updatedLinks)
    toast.success('Link desativado')
  }

  // Ativar link
  const activateLink = (linkId: string) => {
    const updatedLinks = customLinks.map(link =>
      link.id === linkId ? { ...link, isActive: true } : link
    )
    saveLinks(updatedLinks)
    toast.success('Link ativado')
  }

  // Gerar QR Code para link
  const generateQRCode = (url: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`
  }

  // Estatísticas dos links
  const totalClicks = customLinks.reduce((sum, link) => sum + link.clicks, 0)
  const totalVisitors = customLinks.reduce((sum, link) => sum + link.uniqueVisitors, 0)
  const activeLinks = customLinks.filter(link => link.isActive).length

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Links personalizados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Links Personalizados</DialogTitle>
            <DialogDescription>
              Crie e gerencie links personalizados para seu perfil
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Link className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{activeLinks}</div>
                  <div className="text-sm text-muted-foreground">Links Ativos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Eye className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{totalClicks}</div>
                  <div className="text-sm text-muted-foreground">Total Cliques</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{totalVisitors}</div>
                  <div className="text-sm text-muted-foreground">Visitantes</div>
                </CardContent>
              </Card>
            </div>

            {/* Criar novo link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Criar Novo Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">Nome do Link</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="flex-1 flex">
                      <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                        {window.location.origin}/p/
                      </span>
                      <Input
                        id="slug"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        placeholder="seu-nome"
                        className="rounded-l-none"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use apenas letras, números e hífens
                  </p>
                </div>

                {isEditing && (
                  <>
                    <div>
                      <Label htmlFor="title">Título (opcional)</Label>
                      <Input
                        id="title"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder={`Perfil de ${lawyerName}`}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição (opcional)</Label>
                      <Input
                        id="description"
                        value={linkDescription}
                        onChange={(e) => setLinkDescription(e.target.value)}
                        placeholder={`Confira o perfil profissional de ${lawyerName}`}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button onClick={createCustomLink} disabled={!newSlug.trim()}>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? 'Menos Opções' : 'Mais Opções'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de links existentes */}
            {customLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seus Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{link.customUrl}</span>
                          <Badge variant={link.isActive ? 'default' : 'secondary'}>
                            {link.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {link.clicks} cliques • {link.uniqueVisitors} visitantes únicos
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Criado em {link.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => copyLink(link.customUrl)}
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copiar link</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(link.customUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Abrir link</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const qrUrl = generateQRCode(link.customUrl)
                                  window.open(qrUrl, '_blank')
                                }}
                              >
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>QR Code</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Button
                          variant={link.isActive ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => 
                            link.isActive 
                              ? deactivateLink(link.id) 
                              : activateLink(link.id)
                          }
                        >
                          {link.isActive ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}