'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function signup(prevState: { message: string | null }, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

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