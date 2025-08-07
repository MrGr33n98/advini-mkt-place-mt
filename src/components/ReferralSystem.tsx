'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Users,
  Gift,
  Star,
  Trophy,
  Share2,
  Copy,
  Mail,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Check
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface Referral {
  id: string
  referredEmail: string
  referredName: string
  status: 'pending' | 'registered' | 'active' | 'converted'
  referralDate: Date
  conversionDate?: Date
  reward: number
  rewardStatus: 'pending' | 'earned' | 'paid'
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalEarnings: number
  paidEarnings: number
  pendingEarnings: number
  conversionRate: number
  currentLevel: string
  nextLevelTarget: number
  progress: number
}

interface ReferralLevel {
  name: string
  minReferrals: number
  rewardMultiplier: number
  bonusReward: number
  benefits: string[]
  color: string
}

interface ReferralSystemProps {
  lawyerId: string
  lawyerName: string
  className?: string
}

const referralLevels: ReferralLevel[] = [
  {
    name: 'Bronze',
    minReferrals: 0,
    rewardMultiplier: 1,
    bonusReward: 0,
    benefits: ['R$ 50 por indicação convertida', 'Suporte básico'],
    color: 'text-amber-600'
  },
  {
    name: 'Prata',
    minReferrals: 5,
    rewardMultiplier: 1.2,
    bonusReward: 100,
    benefits: ['R$ 60 por indicação convertida', 'Bônus de R$ 100', 'Suporte prioritário'],
    color: 'text-gray-500'
  },
  {
    name: 'Ouro',
    minReferrals: 15,
    rewardMultiplier: 1.5,
    bonusReward: 300,
    benefits: ['R$ 75 por indicação convertida', 'Bônus de R$ 300', 'Suporte VIP', 'Destaque no perfil'],
    color: 'text-yellow-500'
  },
  {
    name: 'Platina',
    minReferrals: 30,
    rewardMultiplier: 2,
    bonusReward: 500,
    benefits: ['R$ 100 por indicação convertida', 'Bônus de R$ 500', 'Suporte dedicado', 'Marketing personalizado'],
    color: 'text-blue-500'
  }
]

export function ReferralSystem({
  lawyerId,
  lawyerName,
  className = ''
}: ReferralSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0,
    paidEarnings: 0,
    pendingEarnings: 0,
    conversionRate: 0,
    currentLevel: 'Bronze',
    nextLevelTarget: 5,
    progress: 0
  })
  const [referralEmail, setReferralEmail] = useState('')
  const [referralName, setReferralName] = useState('')
  const [copied, setCopied] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedReferrals = localStorage.getItem(`referrals_${lawyerId}`)
    if (savedReferrals) {
      const parsedReferrals = JSON.parse(savedReferrals).map((ref: any) => ({
        ...ref,
        referralDate: new Date(ref.referralDate),
        conversionDate: ref.conversionDate ? new Date(ref.conversionDate) : undefined
      }))
      setReferrals(parsedReferrals)
      calculateStats(parsedReferrals)
    }
  }, [lawyerId])

  // Calcular estatísticas
  const calculateStats = (referralList: Referral[]) => {
    const total = referralList.length
    const successful = referralList.filter(r => r.status === 'converted').length
    const pending = referralList.filter(r => r.status === 'pending').length
    const totalEarnings = referralList.reduce((sum, r) => sum + (r.rewardStatus === 'earned' || r.rewardStatus === 'paid' ? r.reward : 0), 0)
    const paidEarnings = referralList.reduce((sum, r) => sum + (r.rewardStatus === 'paid' ? r.reward : 0), 0)
    const pendingEarnings = totalEarnings - paidEarnings
    const conversionRate = total > 0 ? (successful / total) * 100 : 0

    // Determinar nível atual
    let currentLevel = referralLevels[0]
    for (const level of referralLevels) {
      if (successful >= level.minReferrals) {
        currentLevel = level
      }
    }

    // Próximo nível
    const nextLevel = referralLevels.find(level => level.minReferrals > successful)
    const nextLevelTarget = nextLevel ? nextLevel.minReferrals : successful
    const progress = nextLevel ? (successful / nextLevel.minReferrals) * 100 : 100

    setStats({
      totalReferrals: total,
      successfulReferrals: successful,
      pendingReferrals: pending,
      totalEarnings,
      paidEarnings,
      pendingEarnings,
      conversionRate,
      currentLevel: currentLevel.name,
      nextLevelTarget,
      progress
    })
  }

  // Salvar referrals
  const saveReferrals = (newReferrals: Referral[]) => {
    localStorage.setItem(`referrals_${lawyerId}`, JSON.stringify(newReferrals))
    setReferrals(newReferrals)
    calculateStats(newReferrals)
  }

  // Gerar código de indicação
  const generateReferralCode = () => {
    return `REF-${lawyerId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-4)}`
  }

  // Gerar link de indicação
  const generateReferralLink = () => {
    const code = generateReferralCode()
    return `${window.location.origin}/registro?ref=${code}&lawyer=${lawyerId}`
  }

  // Enviar indicação por email
  const sendReferralEmail = () => {
    if (!referralEmail.trim()) {
      toast.error('Digite um email válido')
      return
    }

    const newReferral: Referral = {
      id: Date.now().toString(),
      referredEmail: referralEmail,
      referredName: referralName || referralEmail.split('@')[0],
      status: 'pending',
      referralDate: new Date(),
      reward: 50, // Valor base
      rewardStatus: 'pending'
    }

    const updatedReferrals = [...referrals, newReferral]
    saveReferrals(updatedReferrals)

    // Simular envio de email
    const referralLink = generateReferralLink()
    const subject = `${lawyerName} te indicou nossa plataforma jurídica`
    const body = `Olá ${newReferral.referredName}!\n\n${lawyerName} te indicou nossa plataforma jurídica. Cadastre-se usando o link abaixo e ganhe benefícios exclusivos:\n\n${referralLink}\n\nAproveite!`
    
    const mailtoUrl = `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)

    setReferralEmail('')
    setReferralName('')
    toast.success('Indicação enviada!')
  }

  // Copiar link de indicação
  const copyReferralLink = async () => {
    try {
      const link = generateReferralLink()
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copiado!')
    } catch (error) {
      toast.error('Erro ao copiar link')
    }
  }

  // Compartilhar no WhatsApp
  const shareOnWhatsApp = () => {
    const link = generateReferralLink()
    const message = `Olá! Eu uso esta plataforma jurídica e recomendo muito. Cadastre-se usando meu link de indicação e ganhe benefícios: ${link}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success('Compartilhado no WhatsApp!')
  }

  // Simular conversão de indicação (para demonstração)
  const simulateConversion = (referralId: string) => {
    const updatedReferrals = referrals.map(ref => {
      if (ref.id === referralId && ref.status === 'pending') {
        return {
          ...ref,
          status: 'converted' as const,
          conversionDate: new Date(),
          rewardStatus: 'earned' as const
        }
      }
      return ref
    })
    saveReferrals(updatedReferrals)
    toast.success('Indicação convertida! Recompensa adicionada.')
  }

  const currentLevelData = referralLevels.find(level => level.name === stats.currentLevel) || referralLevels[0]
  const nextLevelData = referralLevels.find(level => level.minReferrals > stats.successfulReferrals)

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sistema de indicações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sistema de Indicações</DialogTitle>
            <DialogDescription>
              Indique colegas e ganhe recompensas por cada conversão
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="refer">Indicar</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="rewards">Recompensas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Nível atual */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className={`h-5 w-5 ${currentLevelData.color}`} />
                    Nível {stats.currentLevel}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progresso para {nextLevelData?.name || 'Máximo'}</span>
                      <span>{stats.successfulReferrals}/{stats.nextLevelTarget}</span>
                    </div>
                    <Progress value={stats.progress} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {currentLevelData.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{stats.totalReferrals}</div>
                    <div className="text-sm text-muted-foreground">Total Indicações</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">{stats.successfulReferrals}</div>
                    <div className="text-sm text-muted-foreground">Convertidas</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Taxa Conversão</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">R$ {stats.totalEarnings}</div>
                    <div className="text-sm text-muted-foreground">Total Ganho</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="refer" className="space-y-6">
              {/* Indicar por email */}
              <Card>
                <CardHeader>
                  <CardTitle>Indicar por Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email do indicado</Label>
                    <Input
                      id="email"
                      type="email"
                      value={referralEmail}
                      onChange={(e) => setReferralEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Nome (opcional)</Label>
                    <Input
                      id="name"
                      value={referralName}
                      onChange={(e) => setReferralName(e.target.value)}
                      placeholder="Nome do indicado"
                    />
                  </div>
                  <Button onClick={sendReferralEmail} disabled={!referralEmail.trim()}>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Indicação
                  </Button>
                </CardContent>
              </Card>

              {/* Compartilhar link */}
              <Card>
                <CardHeader>
                  <CardTitle>Compartilhar Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={generateReferralLink()}
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={copyReferralLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={shareOnWhatsApp} className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" onClick={() => {
                      const link = generateReferralLink()
                      const text = `Confira esta plataforma jurídica: ${link}`
                      if (navigator.share) {
                        navigator.share({ title: 'Indicação', text, url: link })
                      }
                    }} className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {referrals.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma indicação ainda</p>
                  </CardContent>
                </Card>
              ) : (
                referrals.map((referral) => (
                  <Card key={referral.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{referral.referredName}</div>
                          <div className="text-sm text-muted-foreground">{referral.referredEmail}</div>
                          <div className="text-xs text-muted-foreground">
                            Indicado em {referral.referralDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            referral.status === 'converted' ? 'default' :
                            referral.status === 'active' ? 'secondary' : 'outline'
                          }>
                            {referral.status === 'pending' && 'Pendente'}
                            {referral.status === 'registered' && 'Registrado'}
                            {referral.status === 'active' && 'Ativo'}
                            {referral.status === 'converted' && 'Convertido'}
                          </Badge>
                          <div className="text-sm font-medium mt-1">
                            R$ {referral.reward}
                          </div>
                          {referral.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => simulateConversion(referral.id)}
                              className="mt-2"
                            >
                              Simular Conversão
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              {/* Níveis de recompensa */}
              <div className="grid gap-4">
                {referralLevels.map((level) => (
                  <Card key={level.name} className={stats.currentLevel === level.name ? 'ring-2 ring-primary' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Award className={`h-5 w-5 ${level.color}`} />
                          <span className="font-medium">{level.name}</span>
                          {stats.currentLevel === level.name && (
                            <Badge>Atual</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {level.minReferrals}+ indicações
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {level.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Resumo financeiro */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">R$ {stats.paidEarnings}</div>
                      <div className="text-sm text-muted-foreground">Pago</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">R$ {stats.pendingEarnings}</div>
                      <div className="text-sm text-muted-foreground">Pendente</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">R$ {stats.totalEarnings}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}