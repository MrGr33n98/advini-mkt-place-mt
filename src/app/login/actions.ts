'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function login(prevState: { message: string | null }, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = cookies()
  const supabase = createClient()

  await supabase.auth.signOut()

  revalidatePath('/', 'layout')
  redirect('/login')
}