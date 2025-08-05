import { z } from 'zod'

export const lawyerProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  oab: z.string().regex(/^[A-Z]{2}-\d{4,6}$/, "OAB inválido. Use o formato XX-12345"),
  phone: z.string().regex(/^\(\d{2}\)\s*\d{4,5}-\d{4}$/, "Telefone inválido. Use o formato (XX) 9999-9999"),
  specialties: z.array(z.string()).min(1, "Selecione pelo menos uma especialidade"),
  bio: z.string().max(500, "Biografia muito longa").optional()
})

export const reviewSchema = z.object({
  rating: z.number().min(1, "Avaliação mínima é 1").max(5, "Avaliação máxima é 5"),
  comment: z.string().min(10, "Comentário muito curto").max(500, "Comentário muito longo")
})