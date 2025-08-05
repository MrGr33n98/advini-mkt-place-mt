'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { message: error.message }
  }

  // Supabase envia um e-mail de confirmação. Vamos redirecionar o usuário.
  redirect('/confirm-email')
}