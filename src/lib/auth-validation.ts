import { z } from 'zod'

// Esquemas de validação para autenticação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email deve ter um formato válido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
  oab: z
    .string()
    .min(1, 'Número da OAB é obrigatório')
    .regex(/^\d{4,6}$/, 'Número da OAB deve ter entre 4 e 6 dígitos'),
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX'),
  specialties: z
    .array(z.string())
    .min(1, 'Selecione pelo menos uma área de atuação'),
  address: z
    .string()
    .min(1, 'Endereço é obrigatório')
    .min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z
    .string()
    .min(1, 'Estado é obrigatório')
    .length(2, 'Estado deve ter 2 caracteres'),
  terms: z
    .boolean()
    .refine(val => val === true, 'Você deve aceitar os termos de uso')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// Esquemas individuais para validação em tempo real
export const emailValidation = z
  .string()
  .email('Email deve ter um formato válido')

export const passwordValidation = z
  .string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Deve conter pelo menos um caractere especial')

export const nameValidation = z
  .string()
  .min(2, 'Nome deve ter pelo menos 2 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')

export const oabValidation = z
  .string()
  .regex(/^\d{4,6}$/, 'Número da OAB deve ter entre 4 e 6 dígitos')

export const phoneValidation = z
  .string()
  .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (XX) XXXXX-XXXX')

// Tipos TypeScript derivados dos esquemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>