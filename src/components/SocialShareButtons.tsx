'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare,
  Mail,
  Copy,
  QrCode,
  Download,
  TrendingUp,
  Users,
  Eye
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

interface ShareData {
  title: string
  description: string
  url: string
  image?: string
  hashtags?: string[]
}

interface ShareMetrics {
  totalShares: number
  facebookShares: number
  twitterShares: number
  linkedinShares: number
  whatsappShares: number
  emailShares: number
  copyShares: number
  qrCodeViews: number
}

interface SocialShareButtonsProps {
  shareData: ShareData
  variant?: 'default' | 'compact' | 'expanded'
  showMetrics?: boolean
  trackingId?: string
  className?: string
}

export function SocialShareButtons({
  shareData,
  variant = 'default',
  showMetrics = false,
  trackingId,
  className = ''
}: SocialShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [metrics, setMetrics] = useState<ShareMetrics>({
    totalShares: 0,
    facebookShares: 0,
    twitterShares: 0,
    linkedinShares: 0,
    whatsappShares: 0,
    emailShares: 0,
    copyShares: 0,
    qrCodeViews: 0
  })

  // Função para rastrear compartilhamentos
  const trackShare = (platform: keyof ShareMetrics) => {
    const newMetrics = {
      ...metrics,
      [platform]: metrics[platform] + 1,
      totalShares: metrics.totalShares + 1
    }
    setMetrics(newMetrics)
    
    // Salvar métricas no localStorage
    if (trackingId) {
      const existingMetrics = JSON.parse(localStorage.getItem('shareMetrics') || '{}')
      existingMetrics[trackingId] = newMetrics
      localStorage.setItem('shareMetrics', JSON.stringify(existingMetrics))
    }
  }

  // Função para gerar URL personalizada
  const generateCustomUrl = () => {
    const baseUrl = window.location.origin
    const customPath = trackingId ? `/shared/${trackingId}` : shareData.url
    return `${baseUrl}${customPath}`
  }

  // Função para compartilhar no Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(generateCustomUrl())}&quote=${encodeURIComponent(shareData.description)}`
    window.open(url, '_blank', 'width=600,height=400')
    trackShare('facebookShares')
    toast.success('Compartilhado no Facebook!')
  }

  // Função para compartilhar no Twitter
  const shareOnTwitter = () => {
    const hashtags = shareData.hashtags?.join(',') || 'advogado,direito'
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.description)}&url=${encodeURIComponent(generateCustomUrl())}&hashtags=${hashtags}`
    window.open(url, '_blank', 'width=600,height=400')
    trackShare('twitterShares')
    toast.success('Compartilhado no Twitter!')
  }

  // Função para compartilhar no LinkedIn
  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(generateCustomUrl())}`
    window.open(url, '_blank', 'width=600,height=400')
    trackShare('linkedinShares')
    toast.success('Compartilhado no LinkedIn!')
  }

  // Função para compartilhar no WhatsApp
  const shareOnWhatsApp = () => {
    const text = `${shareData.title}\n\n${shareData.description}\n\n${generateCustomUrl()}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    trackShare('whatsappShares')
    toast.success('Compartilhado no WhatsApp!')
  }

  // Função para compartilhar por email
  const shareByEmail = () => {
    const subject = encodeURIComponent(shareData.title)
    const body = encodeURIComponent(`${shareData.description}\n\nConfira em: ${generateCustomUrl()}`)
    const url = `mailto:?subject=${subject}&body=${body}`
    window.open(url)
    trackShare('emailShares')
    toast.success('Email de compartilhamento aberto!')
  }

  // Função para copiar link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateCustomUrl())
      trackShare('copyShares')
      toast.success('Link copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  // Função para gerar QR Code
  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateCustomUrl())}`
    trackShare('qrCodeViews')
    return qrUrl
  }

  // Função para baixar QR Code
  const downloadQRCode = async () => {
    try {
      const qrUrl = generateQRCode()
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-code-${trackingId || 'profile'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('QR Code baixado!')
    } catch (error) {
      toast.error('Erro ao baixar QR Code')
    }
  }

  // Função para compartilhamento nativo
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: generateCustomUrl()
        })
        trackShare('totalShares')
        toast.success('Compartilhado com sucesso!')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Erro ao compartilhar')
        }
      }
    } else {
      setIsOpen(true)
    }
  }

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={nativeShare} className={className}>
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compartilhar perfil</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsOpen(true)}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar Perfil</DialogTitle>
            <DialogDescription>
              Escolha como deseja compartilhar este perfil
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Botões de redes sociais */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareOnFacebook} className="justify-start">
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button variant="outline" onClick={shareOnTwitter} className="justify-start">
                <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button variant="outline" onClick={shareOnLinkedIn} className="justify-start">
                <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={shareOnWhatsApp} className="justify-start">
                <MessageSquare className="mr-2 h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
            </div>

            {/* Outras opções */}
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" onClick={shareByEmail} className="justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Compartilhar por Email
              </Button>
              <Button variant="outline" onClick={copyLink} className="justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Copiar Link
              </Button>
            </div>

            {/* QR Code */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <img 
                      src={generateQRCode()} 
                      alt="QR Code" 
                      className="w-16 h-16 border rounded"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={downloadQRCode}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Métricas de compartilhamento */}
            {showMetrics && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Estatísticas de Compartilhamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Total
                      </span>
                      <Badge variant="secondary">{metrics.totalShares}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        QR Views
                      </span>
                      <Badge variant="secondary">{metrics.qrCodeViews}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}