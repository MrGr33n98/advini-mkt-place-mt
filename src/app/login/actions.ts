'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function login(prevState: { message: string | null }, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard') // Futuramente, a área do advogado
}