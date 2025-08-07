'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  Save, 
  User, 
  Camera, 
  Eye, 
  BarChart3,
  MapPin,
  Globe,
  Linkedin,
  Instagram,
  Plus,
  X
} from 'lucide-react'

import { ImageUpload } from '@/components/dashboard/image-upload'
import { ProfileProgress } from '@/components/dashboard/profile-progress'
import { ProfilePreview } from '@/components/dashboard/profile-preview'

interface ProfileData {
  name: string
  email: string
  phone: string
  oab: string
  specialties: string[]
  bio: string
  photo: string
  banner: string
  address: string
  website: string
  linkedin: string
  instagram: string
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<ProfileData>({
    name: 'Dr. João da Silva',
    email: 'joao.silva@email.com',
    phone: '(65) 99999-1234',
    oab: 'MT-12345',
    specialties: ['Direito Civil', 'Direito de Família'],
    bio: 'Com mais de 15 anos de experiência, sou especialista em direito civil e de família, ajudando centenas de clientes a resolverem suas questões com profissionalismo e dedicação.',
    photo: '',
    banner: '',
    address: 'Cuiabá, MT',
    website: 'https://joaosilva.adv.br',
    linkedin: 'https://linkedin.com/in/joaosilva',
    instagram: '@joaosilva.adv'
  })

  const [newSpecialty, setNewSpecialty] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (field: 'photo' | 'banner') => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Perfil Profissional</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações e acompanhe a completude do seu perfil
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="professional">Profissional</TabsTrigger>
                <TabsTrigger value="media">Mídia</TabsTrigger>
                <TabsTrigger value="contact">Contato</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Informações Básicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleChange}
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="oab">Número da OAB *</Label>
                          <Input 
                            id="oab" 
                            name="oab" 
                            value={formData.oab}
                            onChange={handleChange}
                            required 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="professional" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Especialidades</Label>
                        <div className="flex gap-2 mb-2">
                          <Input 
                            value={newSpecialty}
                            onChange={(e) => setNewSpecialty(e.target.value)}
                            placeholder="Digite uma especialidade"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                          />
                          <Button type="button" onClick={addSpecialty} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {specialty}
                              <button
                                type="button"
                                onClick={() => removeSpecialty(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Biografia Profissional</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Conte um pouco sobre sua trajetória profissional, experiência e áreas de atuação"
                          rows={6}
                        />
                        <p className="text-xs text-muted-foreground">
                          {formData.bio.length}/500 caracteres
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Fotos do Perfil
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Foto de Perfil</Label>
                        <p className="text-sm text-muted-foreground">
                          Recomendamos uma foto profissional em alta qualidade
                        </p>
                        <ImageUpload
                          value={formData.photo}
                          onChange={handleImageChange('photo')}
                          aspectRatio="square"
                          placeholder="Upload da foto de perfil"
                          className="max-w-xs"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Banner do Perfil</Label>
                        <p className="text-sm text-muted-foreground">
                          Imagem de capa que aparecerá no topo do seu perfil
                        </p>
                        <ImageUpload
                          value={formData.banner}
                          onChange={handleImageChange('banner')}
                          aspectRatio="banner"
                          placeholder="Upload do banner"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações de Contato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Endereço</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Cidade, Estado"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="website" 
                            name="website" 
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://seusite.com.br"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <Label>Redes Sociais</Label>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="linkedin" 
                              name="linkedin" 
                              value={formData.linkedin}
                              onChange={handleChange}
                              placeholder="https://linkedin.com/in/seuperfil"
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram</Label>
                          <div className="relative">
                            <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              id="instagram" 
                              name="instagram" 
                              value={formData.instagram}
                              onChange={handleChange}
                              placeholder="@seuusuario"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <div className="flex justify-end gap-3 mt-6">
                  <Button type="submit" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Perfil'}
                  </Button>
                </div>
              </form>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileProgress profileData={formData} />
            <ProfilePreview profileData={formData} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}