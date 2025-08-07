'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidatedInput } from "@/components/ui/validated-input"
import { SocialButton } from "@/components/ui/social-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useFormValidation } from '@/hooks/use-form-validation'
import { 
  nameValidation, 
  emailValidation, 
  passwordValidation, 
  oabValidation, 
  phoneValidation 
} from '@/lib/auth-validation'
import { Eye, EyeOff, Scale, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'

const SPECIALTIES = [
  { value: 'civil', label: 'Direito Civil' },
  { value: 'criminal', label: 'Direito Criminal' },
  { value: 'trabalho', label: 'Direito do Trabalho' },
  { value: 'tributario', label: 'Direito Tributário' },
  { value: 'empresarial', label: 'Direito Empresarial' },
  { value: 'familia', label: 'Direito de Família' },
  { value: 'previdenciario', label: 'Direito Previdenciário' },
  { value: 'consumidor', label: 'Direito do Consumidor' }
]

const STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const router = useRouter()

  const { values, updateField, getFieldValidation, isFormValid } = useFormValidation({
    rules: [
      { field: 'name', schema: nameValidation },
      { field: 'email', schema: emailValidation },
      { field: 'password', schema: passwordValidation },
      { field: 'oab', schema: oabValidation },
      { field: 'phone', schema: phoneValidation }
    ]
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleSocialLogin = async (provider: 'google' | 'linkedin') => {
    setSocialLoading(provider)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`Registro com ${provider === 'google' ? 'Google' : 'LinkedIn'} realizado com sucesso!`)
      router.push('/onboarding')
    } catch (error) {
      toast.error(`Erro ao registrar com ${provider === 'google' ? 'Google' : 'LinkedIn'}`)
    } finally {
      setSocialLoading(null)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid || !acceptedTerms) return

    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Conta criada com sucesso!')
      router.push('/onboarding')
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
    }
    return value
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    updateField('phone', formatted)
  }

  const canProceedStep1 = values.name && values.email && values.password && values.confirmPassword
  const canProceedStep2 = values.oab && values.phone && selectedSpecialties.length > 0
  const canSubmit = canProceedStep1 && canProceedStep2 && values.address && values.city && selectedState && acceptedTerms

  const nameValidationState = getFieldValidation('name')
  const emailValidationState = getFieldValidation('email')
  const passwordValidationState = getFieldValidation('password')
  const oabValidationState = getFieldValidation('oab')
  const phoneValidationState = getFieldValidation('phone')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Junte-se à Plataforma</h1>
          <p className="text-gray-600">Crie sua conta profissional em poucos passos</p>
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
              {currentStep === 1 && 'Informações Básicas'}
              {currentStep === 2 && 'Dados Profissionais'}
              {currentStep === 3 && 'Localização e Confirmação'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Vamos começar com suas informações pessoais'}
              {currentStep === 2 && 'Agora precisamos dos seus dados profissionais'}
              {currentStep === 3 && 'Finalize seu cadastro com a localização do escritório'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Social Login - apenas no primeiro passo */}
                <div className="space-y-3">
                  <SocialButton
                    provider="google"
                    isLoading={socialLoading === 'google'}
                    onClick={() => handleSocialLogin('google')}
                  >
                    Registrar com Google
                  </SocialButton>
                  <SocialButton
                    provider="linkedin"
                    isLoading={socialLoading === 'linkedin'}
                    onClick={() => handleSocialLogin('linkedin')}
                  >
                    Registrar com LinkedIn
                  </SocialButton>
                </div>

                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <span className="text-sm text-muted-foreground">ou</span>
                  <Separator className="flex-1" />
                </div>

                {/* Step 1 Form */}
                <div className="space-y-4">
                  <ValidatedInput
                    id="name"
                    label="Nome Completo"
                    placeholder="Digite seu nome completo"
                    value={values.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    error={nameValidationState.error}
                    isValid={nameValidationState.isValid}
                    isValidating={nameValidationState.isValidating}
                    description="Nome que aparecerá no seu perfil"
                  />

                  <ValidatedInput
                    id="email"
                    label="Email Profissional"
                    type="email"
                    placeholder="seu@email.com"
                    value={values.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={emailValidationState.error}
                    isValid={emailValidationState.isValid}
                    isValidating={emailValidationState.isValidating}
                    description="Este será seu email de login"
                  />

                  <ValidatedInput
                    id="password"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite uma senha segura"
                    value={values.password || ''}
                    onChange={(e) => updateField('password', e.target.value)}
                    error={passwordValidationState.error}
                    isValid={passwordValidationState.isValid}
                    isValidating={passwordValidationState.isValidating}
                    description="Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo"
                  />

                  <ValidatedInput
                    id="confirmPassword"
                    label="Confirmar Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Digite a senha novamente"
                    value={values.confirmPassword || ''}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    error={values.password && values.confirmPassword && values.password !== values.confirmPassword ? 'Senhas não coincidem' : null}
                    isValid={values.password && values.confirmPassword && values.password === values.confirmPassword}
                  />

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPassword ? 'Ocultar' : 'Mostrar'} senha
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'} confirmação
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <ValidatedInput
                  id="oab"
                  label="Número da OAB"
                  placeholder="123456"
                  value={values.oab || ''}
                  onChange={(e) => updateField('oab', e.target.value.replace(/\D/g, ''))}
                  error={oabValidationState.error}
                  isValid={oabValidationState.isValid}
                  isValidating={oabValidationState.isValidating}
                  description="Apenas números, entre 4 e 6 dígitos"
                />

                <ValidatedInput
                  id="phone"
                  label="Telefone"
                  placeholder="(11) 99999-9999"
                  value={values.phone || ''}
                  onChange={handlePhoneChange}
                  error={phoneValidationState.error}
                  isValid={phoneValidationState.isValid}
                  isValidating={phoneValidationState.isValidating}
                  description="Telefone para contato com clientes"
                />

                <div className="space-y-2">
                  <Label>Áreas de Atuação</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SPECIALTIES.map((specialty) => (
                      <div key={specialty.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={specialty.value}
                          checked={selectedSpecialties.includes(specialty.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSpecialties([...selectedSpecialties, specialty.value])
                            } else {
                              setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty.value))
                            }
                          }}
                        />
                        <Label htmlFor={specialty.value} className="text-sm">
                          {specialty.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selecione suas principais áreas de atuação ({selectedSpecialties.length} selecionadas)
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <ValidatedInput
                  id="address"
                  label="Endereço do Escritório"
                  placeholder="Rua, número, complemento"
                  value={values.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  description="Endereço completo do seu escritório"
                />

                <ValidatedInput
                  id="city"
                  label="Cidade"
                  placeholder="Digite a cidade"
                  value={values.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                />

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="cursor-pointer">
                      Concordo com os{" "}
                      <Link href="/termos" className="text-blue-600 hover:underline">
                        termos de uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-blue-600 hover:underline">
                        política de privacidade
                      </Link>
                    </Label>
                    <p className="text-muted-foreground mt-1">
                      Ao aceitar, você concorda em receber comunicações sobre a plataforma.
                    </p>
                  </div>
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
                    (currentStep === 1 && !canProceedStep1) ||
                    (currentStep === 2 && !canProceedStep2)
                  }
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    'Criando conta...'
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Faça login
              </Link>
            </div>
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