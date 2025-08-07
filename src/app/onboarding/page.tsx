'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Scale, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  Target,
  Briefcase,
  Star,
  Clock,
  Shield,
  Zap
} from 'lucide-react'

const FEATURES = [
  {
    id: 'case-management',
    icon: Briefcase,
    title: 'Gestão de Casos',
    description: 'Organize e acompanhe todos os seus processos em um só lugar',
    benefits: ['Controle de prazos', 'Histórico completo', 'Documentos organizados']
  },
  {
    id: 'client-portal',
    icon: Users,
    title: 'Portal do Cliente',
    description: 'Seus clientes podem acompanhar o andamento dos casos',
    benefits: ['Transparência total', 'Comunicação direta', 'Satisfação do cliente']
  },
  {
    id: 'document-automation',
    icon: FileText,
    title: 'Automação de Documentos',
    description: 'Gere petições e contratos automaticamente',
    benefits: ['Templates prontos', 'Economia de tempo', 'Padronização']
  },
  {
    id: 'calendar',
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Nunca mais perca um prazo ou audiência',
    benefits: ['Lembretes automáticos', 'Sincronização', 'Planejamento eficiente']
  },
  {
    id: 'communication',
    icon: MessageSquare,
    title: 'Comunicação Integrada',
    description: 'Chat, email e notificações em uma plataforma',
    benefits: ['Centralização', 'Histórico completo', 'Resposta rápida']
  },
  {
    id: 'analytics',
    icon: Target,
    title: 'Relatórios e Analytics',
    description: 'Insights sobre seu escritório e performance',
    benefits: ['Métricas importantes', 'Crescimento', 'Tomada de decisão']
  }
]

const GOALS = [
  { id: 'organize', label: 'Organizar melhor meus casos', icon: Briefcase },
  { id: 'clients', label: 'Melhorar comunicação com clientes', icon: Users },
  { id: 'deadlines', label: 'Controlar prazos e audiências', icon: Clock },
  { id: 'documents', label: 'Automatizar documentos', icon: FileText },
  { id: 'growth', label: 'Fazer meu escritório crescer', icon: Target },
  { id: 'efficiency', label: 'Aumentar produtividade', icon: Zap }
]

const TEAM_SIZES = [
  { id: 'solo', label: 'Apenas eu', description: 'Advogado autônomo' },
  { id: 'small', label: '2-5 pessoas', description: 'Escritório pequeno' },
  { id: 'medium', label: '6-20 pessoas', description: 'Escritório médio' },
  { id: 'large', label: '20+ pessoas', description: 'Escritório grande' }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [selectedTeamSize, setSelectedTeamSize] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const router = useRouter()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleFinish = async () => {
    setIsLoading(true)

    try {
      // Simular salvamento das preferências
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Configuração concluída! Bem-vindo à plataforma!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao finalizar configuração. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedStep2 = selectedFeatures.length > 0
  const canProceedStep3 = selectedGoals.length > 0
  const canFinish = selectedTeamSize !== ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo à Plataforma!</h1>
          <p className="text-gray-600">Vamos personalizar sua experiência em alguns passos</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Passo {currentStep} de {totalSteps}</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'Conheça a Plataforma'}
              {currentStep === 2 && 'Escolha suas Funcionalidades'}
              {currentStep === 3 && 'Defina seus Objetivos'}
              {currentStep === 4 && 'Configurações Finais'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Descubra como podemos transformar seu escritório'}
              {currentStep === 2 && 'Selecione as funcionalidades que mais interessam'}
              {currentStep === 3 && 'Conte-nos o que você quer alcançar'}
              {currentStep === 4 && 'Últimos detalhes para personalizar sua experiência'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conta criada com sucesso!</h3>
                  <p className="text-gray-600">
                    Agora vamos configurar sua plataforma para atender perfeitamente às suas necessidades.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold">Segurança Garantida</h4>
                    <p className="text-sm text-gray-600">
                      Seus dados e de seus clientes estão protegidos com criptografia de ponta.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Zap className="w-8 h-8 text-green-600 mb-2" />
                    <h4 className="font-semibold">Produtividade Máxima</h4>
                    <p className="text-sm text-gray-600">
                      Automatize tarefas repetitivas e foque no que realmente importa.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Este processo levará apenas alguns minutos e você poderá alterar tudo depois.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-6">
                  Selecione as funcionalidades que mais interessam ao seu escritório:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon
                    const isSelected = selectedFeatures.includes(feature.id)
                    
                    return (
                      <div
                        key={feature.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFeatureToggle(feature.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{feature.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {feature.benefits.map((benefit, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <p className="text-xs text-center text-gray-500">
                  {selectedFeatures.length} funcionalidades selecionadas
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-6">
                  Quais são seus principais objetivos com a plataforma?
                </p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {GOALS.map((goal) => {
                    const Icon = goal.icon
                    const isSelected = selectedGoals.includes(goal.id)
                    
                    return (
                      <div
                        key={goal.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleGoalToggle(goal.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              isSelected ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="font-medium">{goal.label}</span>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <p className="text-xs text-center text-gray-500">
                  {selectedGoals.length} objetivos selecionados
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Tamanho da sua equipe</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Isso nos ajuda a personalizar a experiência para seu escritório
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {TEAM_SIZES.map((size) => (
                        <div
                          key={size.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTeamSize === size.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTeamSize(size.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{size.label}</h4>
                              <p className="text-sm text-gray-600">{size.description}</p>
                            </div>
                            {selectedTeamSize === size.id && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additional-info" className="text-base font-medium">
                      Informações adicionais (opcional)
                    </Label>
                    <p className="text-sm text-gray-600 mb-2">
                      Conte-nos mais sobre suas necessidades específicas
                    </p>
                    <Textarea
                      id="additional-info"
                      placeholder="Ex: Trabalho principalmente com direito trabalhista, preciso de integração com sistema X, etc."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Quase pronto!</h4>
                  <p className="text-sm text-green-700">
                    Após finalizar, você será direcionado para seu dashboard personalizado 
                    com base nas suas preferências.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 2 && !canProceedStep2) ||
                    (currentStep === 3 && !canProceedStep3)
                  }
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={!canFinish || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    'Finalizando...'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar
                    </>
                  )}
                </Button>
              )}
            </div>

            {currentStep < totalSteps && (
              <div className="text-center text-sm">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Pular configuração
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Plataforma Jurídica. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}