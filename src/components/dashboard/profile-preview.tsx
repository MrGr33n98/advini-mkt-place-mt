'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  ExternalLink,
  Linkedin,
  Instagram,
  Calendar,
  MessageCircle
} from 'lucide-react'
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

interface ProfilePreviewProps {
  profileData: ProfileData
}

export function ProfilePreview({ profileData }: ProfilePreviewProps) {
  const mockStats = {
    rating: 4.8,
    reviews: 127,
    cases: 89,
    experience: 15
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preview do Perfil Público</CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver Perfil Completo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-card border rounded-lg overflow-hidden">
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            {profileData.banner && (
              <img
                src={profileData.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-12 mb-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profileData.photo} alt={profileData.name} />
                <AvatarFallback className="text-lg">
                  {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contatar
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
              </div>
            </div>

            {/* Name and Title */}
            <div className="space-y-2 mb-4">
              <h3 className="text-xl font-bold">{profileData.name || 'Seu Nome'}</h3>
              <p className="text-muted-foreground">
                Advogado • OAB {profileData.oab || 'XX-XXXXX'}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockStats.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({mockStats.reviews} avaliações)
                </span>
              </div>
            </div>

            {/* Specialties */}
            {profileData.specialties.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty.trim()}
                    </Badge>
                  ))}
                  {profileData.specialties.length > 3 && (
                    <Badge variant="outline">
                      +{profileData.specialties.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Bio */}
            {profileData.bio && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {profileData.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-lg font-bold">{mockStats.cases}</p>
                <p className="text-xs text-muted-foreground">Casos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{mockStats.experience}</p>
                <p className="text-xs text-muted-foreground">Anos</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{mockStats.reviews}</p>
                <p className="text-xs text-muted-foreground">Avaliações</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              {profileData.address && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.address}</span>
                </div>
              )}
              
              {profileData.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{profileData.phone}</span>
                </div>
              )}
              
              {profileData.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </div>
              )}
              
              {profileData.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{profileData.website}</span>
                </div>
              )}
            </div>

            {/* Social Media */}
            {(profileData.linkedin || profileData.instagram) && (
              <div className="flex gap-2 mt-4">
                {profileData.linkedin && (
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                )}
                {profileData.instagram && (
                  <Button size="sm" variant="outline">
                    <Instagram className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}