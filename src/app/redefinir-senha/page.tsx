'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ValidatedInput } from '@/components/ui/validated-input';
import { useFormValidation } from '@/hooks/use-form-validation';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/auth-validation';
import { z } from 'zod';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  const token = searchParams.get('token');

  const {
    values,
    validation,
    isFormValid,
    updateField,
    getFieldValidation,
  } = useFormValidation({
    rules: [
      {
        field: 'token',
        schema: z.string().min(1, 'Token é obrigatório'),
      },
      {
        field: 'password',
        schema: z.string()
          .min(8, 'Senha deve ter pelo menos 8 caracteres')
          .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
          .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
          .regex(/\d/, 'Senha deve conter pelo menos um número')
          .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
      },
      {
        field: 'confirmPassword',
        schema: z.string().min(1, 'Confirmação de senha é obrigatória'),
      },
    ],
  });

  // Inicializar valores
  useEffect(() => {
    updateField('token', token || '');
    updateField('password', '');
    updateField('confirmPassword', '');
  }, [token, updateField]);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    // Validar token
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-token?token=${token}`);
        const data = await response.json();
        
        const isValid = response.ok && data.isValid;
        setTokenValid(isValid);
        
        if (isValid) {
          updateField('token', token);
        }
      } catch (err) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token, updateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !tokenValid) {
      return;
    }

    // Verificar se as senhas coincidem
    if (values.password !== values.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: values.token,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir senha');
      }

      setIsSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        router.push('/login?message=password-reset-success');
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Token inválido ou expirado
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Link Inválido
            </CardTitle>
            <CardDescription className="text-gray-600">
              Este link de recuperação é inválido ou expirou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Links de recuperação expiram em 1 hora por motivos de segurança.
            </p>
            <div className="space-y-3">
              <Link href="/esqueci-senha">
                <Button className="w-full">
                  Solicitar novo link
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Voltar ao login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validando token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Validando link de recuperação...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Senha Redefinida!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sua senha foi alterada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
            <Link href="/login">
              <Button className="w-full">
                Ir para o login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-gray-600">
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <ValidatedInput
                  label="Nova Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={values.password || ''}
                  onChange={(value) => updateField('password', value)}
                  error={getFieldValidation('password').error}
                  isValidating={getFieldValidation('password').isValidating}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <ValidatedInput
                  label="Confirmar Nova Senha"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={values.confirmPassword || ''}
                  onChange={(value) => updateField('confirmPassword', value)}
                  error={getFieldValidation('confirmPassword').error}
                  isValidating={getFieldValidation('confirmPassword').isValidating}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                <strong>Requisitos da senha:</strong>
              </p>
              <ul className="text-xs text-blue-600 mt-1 space-y-1">
                <li>• Pelo menos 8 caracteres</li>
                <li>• Uma letra maiúscula</li>
                <li>• Uma letra minúscula</li>
                <li>• Um número</li>
                <li>• Um caractere especial</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Redefinindo...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Redefinir Senha
                </>
              )}
            </Button>

            <div className="text-center">
              <Link 
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Voltar ao login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}