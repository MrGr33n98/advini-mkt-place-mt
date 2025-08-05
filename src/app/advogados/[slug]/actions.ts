'use server'

import { createClient } from '@/lib/supabase/server'
import { reviewSchema } from '@/lib/validation'
import { z } from 'zod'

export async function createReview(
  lawyerId: string, 
  prevState: { message: string | null }, 
  formData: FormData
) {
  // Validate input
  const validationResult = reviewSchema.safeParse({
    rating: Number(formData.get('rating')),
    comment: formData.get('comment') as string
  })

  if (!validationResult.success) {
    return { 
      message: validationResult.error.errors[0].message 
    }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        lawyer_id: lawyerId,
        client_name: formData.get('name') as string,
        rating: validationResult.data.rating,
        comment: validationResult.data.comment,
        status: 'pending'
      })

    if (error) throw error

    return { message: 'Avaliação enviada com sucesso! Aguardando aprovação.' }
  } catch (error) {
    console.error('Erro ao criar review:', error)
    return { message: 'Não foi possível enviar a avaliação.' }
  }
}