'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function signup(prevState: { message: string | null }, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/confirm-email`
    }
  })

  if (error) {
    return { message: error.message }
  }

  redirect('/confirm-email')
}