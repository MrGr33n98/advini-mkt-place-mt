'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidatedInput } from '@/components/ui/validated-input'
import { SocialButton } from '@/components/ui/social-button'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useFormValidation } from '@/hooks/use-form-validation'
import { emailValidation, passwordValidation } from '@/lib/auth-validation'
import { Eye, EyeOff, Scale } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const { values, updateField, getFieldValidation, isFormValid } = useFormValidation({
    rules: [
      { field: 'email', schema: emailValidation },
      { field: 'password', schema: passwordValidation }
    ]
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)

    try {
      // Simular login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'linkedin') => {
    setSocialLoading(provider)
    
    try {
      // Simular login social
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Login com ${provider === 'google' ? 'Google' : 'LinkedIn'} realizado com sucesso!`)
      router.push('/dashboard')
    } catch (error) {
      toast.error(`Erro ao fazer login com ${provider === 'google' ? 'Google' : 'LinkedIn'}`)
    } finally {
      setSocialLoading(null)
    }
  }

  const emailValidationState = getFieldValidation('email')
  const passwordValidationState = getFieldValidation('password')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Plataforma Jurídica</h1>
          <p className="text-gray-600">Conectando advogados e clientes</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Área do Advogado</CardTitle>
            <CardDescription className="text-center">
              Acesse sua conta para gerenciar seu perfil profissional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <SocialButton
                provider="google"
                isLoading={socialLoading === 'google'}
                onClick={() => handleSocialLogin('google')}
              >
                Continuar com Google
              </SocialButton>
              <SocialButton
                provider="linkedin"
                isLoading={socialLoading === 'linkedin'}
                onClick={() => handleSocialLogin('linkedin')}
              >
                Continuar com LinkedIn
              </SocialButton>
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <ValidatedInput
                id="email"
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={values.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                error={emailValidationState.error}
                isValid={emailValidationState.isValid}
                isValidating={emailValidationState.isValidating}
                description="Digite seu email profissional"
              />

              <div className="space-y-2">
                <ValidatedInput
                  id="password"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={values.password || ''}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={passwordValidationState.error}
                  isValid={passwordValidationState.isValid}
                  isValidating={passwordValidationState.isValidating}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showPassword ? 'Ocultar' : 'Mostrar'} senha
                    </button>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm">
                  Lembrar de mim
                </Label>
              </div>

              <Button 
                className="w-full" 
                type="submit" 
                disabled={isLoading || !isFormValid}
                size="lg"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Não tem uma conta? </span>
              <Link href="/registro" className="text-blue-600 hover:text-blue-800 font-medium">
                Cadastre-se gratuitamente
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Plataforma Jurídica. Todos os direitos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/termos" className="hover:text-gray-700">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-gray-700">Privacidade</Link>
            <Link href="/contato" className="hover:text-gray-700">Contato</Link>
          </div>
        </div>
      </div>
    </div>
  )
}