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

// Password recovery schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

// Individual field schemas for real-time validation
export const emailSchema = z.string().email("Email inválido");
export const passwordSchema = z.string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial");

export const nameSchema = z.string().min(2, "Nome deve ter pelo menos 2 caracteres");
export const oabNumberSchema = z.string().regex(/^\d{4,6}$/, "Número da OAB deve ter entre 4 e 6 dígitos");
export const phoneSchema = z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone deve estar no formato (XX) XXXXX-XXXX");
export const specialtiesSchema = z.array(z.string()).min(1, "Selecione pelo menos uma especialidade");
export const addressSchema = z.string().min(5, "Endereço deve ter pelo menos 5 caracteres");
export const citySchema = z.string().min(2, "Cidade deve ter pelo menos 2 caracteres");
export const stateSchema = z.string().length(2, "Estado deve ter 2 caracteres");
export const termsSchema = z.boolean().refine(val => val === true, "Você deve aceitar os termos de uso");

// Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;