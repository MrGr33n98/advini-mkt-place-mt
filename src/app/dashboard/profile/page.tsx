'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    oab: '',
    phone: '',
    specialties: '',
    bio: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('lawyers')
        .upsert({
          user_id: user?.id,
          ...formData,
          specialties: formData.specialties.split(',').map(s => s.trim())
        })

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Não foi possível atualizar o perfil')
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!user) {
    return <div>Faça login para acessar o perfil</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Advogado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oab">Número da OAB</Label>
                <Input 
                  id="oab" 
                  name="oab" 
                  value={formData.oab}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
                <Input 
                  id="specialties" 
                  name="specialties" 
                  value={formData.specialties}
                  onChange={handleChange}
                  placeholder="Ex: Direito Civil, Direito do Trabalho"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Conte um pouco sobre sua trajetória profissional"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Salvar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </div>
  )
}