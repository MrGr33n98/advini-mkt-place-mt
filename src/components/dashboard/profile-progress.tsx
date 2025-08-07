'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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

interface ProfileProgressProps {
  profileData: ProfileData
}

export function ProfileProgress({ profileData }: ProfileProgressProps) {
  const requirements = [
    {
      id: 'basic-info',
      label: 'Informações Básicas',
      description: 'Nome, email, telefone e OAB',
      completed: !!(profileData.name && profileData.email && profileData.phone && profileData.oab),
      weight: 25
    },
    {
      id: 'professional-info',
      label: 'Informações Profissionais',
      description: 'Especialidades e biografia',
      completed: !!(profileData.specialties.length > 0 && profileData.bio),
      weight: 20
    },
    {
      id: 'photos',
      label: 'Fotos do Perfil',
      description: 'Foto de perfil e banner',
      completed: !!(profileData.photo && profileData.banner),
      weight: 20
    },
    {
      id: 'contact-info',
      label: 'Informações de Contato',
      description: 'Endereço e website',
      completed: !!(profileData.address && profileData.website),
      weight: 15
    },
    {
      id: 'social-media',
      label: 'Redes Sociais',
      description: 'LinkedIn e Instagram',
      completed: !!(profileData.linkedin || profileData.instagram),
      weight: 10
    },
    {
      id: 'verification',
      label: 'Verificação',
      description: 'Documentos verificados',
      completed: false, // Placeholder - seria verificado no backend
      weight: 10
    }
  ]

  const completedRequirements = requirements.filter(req => req.completed)
  const totalWeight = requirements.reduce((sum, req) => sum + (req.completed ? req.weight : 0), 0)
  const progressPercentage = Math.round(totalWeight)

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excelente', color: 'bg-green-100 text-green-800' }
    if (percentage >= 70) return { label: 'Bom', color: 'bg-yellow-100 text-yellow-800' }
    if (percentage >= 50) return { label: 'Regular', color: 'bg-orange-100 text-orange-800' }
    return { label: 'Incompleto', color: 'bg-red-100 text-red-800' }
  }

  const status = getProgressStatus(progressPercentage)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Completude do Perfil</CardTitle>
          <Badge className={status.color}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso Geral</span>
            <span className="text-muted-foreground">{progressPercentage}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground">
            {completedRequirements.length} de {requirements.length} seções completas
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Checklist de Completude</h4>
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <motion.div
                key={requirement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {requirement.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      requirement.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {requirement.label}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {requirement.weight}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {requirement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {progressPercentage < 100 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Complete seu perfil para melhor visibilidade
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Perfis completos recebem até 3x mais visualizações e contatos.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}