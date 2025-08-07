"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Circle, 
  Users, 
  Clock,
  MessageCircle,
  Phone,
  Video,
  Settings
} from 'lucide-react'

interface UserStatus {
  id: string
  name: string
  avatar?: string
  role: 'client' | 'lawyer'
  isOnline: boolean
  lastSeen?: string
  status: 'available' | 'busy' | 'away' | 'offline'
  customMessage?: string
}

// Mock data
const mockUsers: UserStatus[] = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: '/avatars/maria.jpg',
    role: 'client',
    isOnline: true,
    status: 'available'
  },
  {
    id: '2',
    name: 'João Oliveira',
    avatar: '/avatars/joao.jpg',
    role: 'client',
    isOnline: false,
    lastSeen: '2 horas atrás',
    status: 'offline'
  },
  {
    id: '3',
    name: 'Ana Costa',
    avatar: '/avatars/ana.jpg',
    role: 'client',
    isOnline: true,
    status: 'busy',
    customMessage: 'Em reunião'
  },
  {
    id: '4',
    name: 'Carlos Silva',
    avatar: '/avatars/carlos.jpg',
    role: 'client',
    isOnline: true,
    status: 'away',
    customMessage: 'Volto em 30 min'
  },
  {
    id: '5',
    name: 'Lucia Ferreira',
    avatar: '/avatars/lucia.jpg',
    role: 'client',
    isOnline: false,
    lastSeen: '1 dia atrás',
    status: 'offline'
  }
]

const statusConfig = {
  available: {
    label: 'Disponível',
    color: 'fill-green-500 text-green-500',
    bgColor: 'bg-green-100 text-green-800'
  },
  busy: {
    label: 'Ocupado',
    color: 'fill-red-500 text-red-500',
    bgColor: 'bg-red-100 text-red-800'
  },
  away: {
    label: 'Ausente',
    color: 'fill-yellow-500 text-yellow-500',
    bgColor: 'bg-yellow-100 text-yellow-800'
  },
  offline: {
    label: 'Offline',
    color: 'fill-gray-400 text-gray-400',
    bgColor: 'bg-gray-100 text-gray-800'
  }
}

interface OnlineStatusProps {
  showOnlyOnline?: boolean
  onStartChat?: (userId: string) => void
}

export function OnlineStatus({ showOnlyOnline = false, onStartChat }: OnlineStatusProps) {
  const [users, setUsers] = useState<UserStatus[]>(mockUsers)
  const [myStatus, setMyStatus] = useState<'available' | 'busy' | 'away' | 'offline'>('available')
  const [isOnline, setIsOnline] = useState(true)
  const [customMessage, setCustomMessage] = useState('')

  // Simular atualizações de status em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => {
        // Simular mudanças aleatórias de status
        if (Math.random() < 0.1) { // 10% chance de mudança
          const statuses: ('available' | 'busy' | 'away' | 'offline')[] = ['available', 'busy', 'away', 'offline']
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
          return {
            ...user,
            status: newStatus,
            isOnline: newStatus !== 'offline',
            lastSeen: newStatus === 'offline' ? 'Agora' : undefined
          }
        }
        return user
      }))
    }, 10000) // Atualizar a cada 10 segundos

    return () => clearInterval(interval)
  }, [])

  const filteredUsers = showOnlyOnline 
    ? users.filter(user => user.isOnline)
    : users

  const onlineCount = users.filter(user => user.isOnline).length
  const totalCount = users.length

  const handleStatusChange = (newStatus: 'available' | 'busy' | 'away' | 'offline') => {
    setMyStatus(newStatus)
    setIsOnline(newStatus !== 'offline')
  }

  return (
    <div className="space-y-4">
      {/* Meu Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Meu Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="online-toggle">Status Online</Label>
            </div>
            <Switch
              id="online-toggle"
              checked={isOnline}
              onCheckedChange={(checked) => {
                setIsOnline(checked)
                if (!checked) {
                  setMyStatus('offline')
                } else {
                  setMyStatus('available')
                }
              }}
            />
          </div>

          {isOnline && (
            <div className="space-y-2">
              <Label>Status de Disponibilidade</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['available', 'busy', 'away'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={myStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className="justify-start"
                  >
                    <Circle className={`h-3 w-3 mr-2 ${statusConfig[status].color}`} />
                    {statusConfig[status].label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/lawyer.jpg" />
              <AvatarFallback>EU</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Dr. Silva (Você)</span>
                <Badge variant="outline" className={statusConfig[myStatus].bgColor}>
                  {statusConfig[myStatus].label}
                </Badge>
              </div>
              {customMessage && (
                <p className="text-sm text-muted-foreground">{customMessage}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários Online */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {showOnlyOnline ? 'Usuários Online' : 'Todos os Usuários'}
              <Badge variant="secondary">
                {showOnlyOnline ? onlineCount : `${onlineCount}/${totalCount}`}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {filteredUsers.length === 0 ? (
              <div className="p-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">
                  {showOnlyOnline ? 'Nenhum usuário online' : 'Nenhum usuário encontrado'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {showOnlyOnline 
                    ? 'Quando seus clientes ficarem online, eles aparecerão aqui'
                    : 'Seus clientes aparecerão aqui quando se conectarem'
                  }
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-b hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Circle 
                          className={`absolute -bottom-1 -right-1 h-4 w-4 ${statusConfig[user.status].color}`}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{user.name}</span>
                          <Badge variant="outline" className={`text-xs ${statusConfig[user.status].bgColor}`}>
                            {statusConfig[user.status].label}
                          </Badge>
                        </div>
                        
                        {user.customMessage && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.customMessage}
                          </p>
                        )}
                        
                        {!user.isOnline && user.lastSeen && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Visto {user.lastSeen}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações rápidas */}
                    {user.isOnline && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStartChat?.(user.id)}
                          className="h-8 w-8 p-0"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para gerenciar status online
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [status, setStatus] = useState<'available' | 'busy' | 'away' | 'offline'>('available')
  const [lastSeen, setLastSeen] = useState<string>()

  useEffect(() => {
    // Detectar quando o usuário fica offline/online
    const handleOnline = () => {
      setIsOnline(true)
      setStatus('available')
      setLastSeen(undefined)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setStatus('offline')
      setLastSeen(new Date().toLocaleString('pt-BR'))
    }

    // Detectar visibilidade da página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setStatus('away')
      } else {
        setStatus('available')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const updateStatus = (newStatus: 'available' | 'busy' | 'away' | 'offline') => {
    setStatus(newStatus)
    setIsOnline(newStatus !== 'offline')
    if (newStatus === 'offline') {
      setLastSeen(new Date().toLocaleString('pt-BR'))
    }
  }

  return {
    isOnline,
    status,
    lastSeen,
    updateStatus
  }
}