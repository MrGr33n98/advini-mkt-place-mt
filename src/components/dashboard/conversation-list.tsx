"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircle, 
  Search, 
  Circle,
  MoreVertical,
  Archive,
  Trash2,
  UserX
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChat } from '@/hooks/use-chat'

interface ConversationSummary {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  participantRole: 'client' | 'lawyer'
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  lastSeen?: string
  isArchived: boolean
  isPinned: boolean
  tags: string[]
}

// Mock data
const mockConversations: ConversationSummary[] = [
  {
    id: '1',
    participantId: 'client1',
    participantName: 'Maria Santos',
    participantAvatar: '/avatars/maria.jpg',
    participantRole: 'client',
    lastMessage: 'Obrigada pela orientação sobre o processo',
    lastMessageTime: '10:30',
    unreadCount: 2,
    isOnline: true,
    isArchived: false,
    isPinned: true,
    tags: ['urgente', 'trabalhista']
  },
  {
    id: '2',
    participantId: 'client2',
    participantName: 'João Oliveira',
    participantAvatar: '/avatars/joao.jpg',
    participantRole: 'client',
    lastMessage: 'Quando podemos agendar a próxima reunião?',
    lastMessageTime: 'Ontem',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '2 horas atrás',
    isArchived: false,
    isPinned: false,
    tags: ['civil']
  },
  {
    id: '3',
    participantId: 'client3',
    participantName: 'Ana Costa',
    participantAvatar: '/avatars/ana.jpg',
    participantRole: 'client',
    lastMessage: 'Recebi os documentos, obrigada!',
    lastMessageTime: '2 dias',
    unreadCount: 1,
    isOnline: false,
    lastSeen: '1 dia atrás',
    isArchived: false,
    isPinned: false,
    tags: ['família']
  },
  {
    id: '4',
    participantId: 'client4',
    participantName: 'Carlos Silva',
    participantAvatar: '/avatars/carlos.jpg',
    participantRole: 'client',
    lastMessage: 'Preciso de ajuda com contrato',
    lastMessageTime: '3 dias',
    unreadCount: 0,
    isOnline: true,
    isArchived: false,
    isPinned: false,
    tags: ['empresarial']
  },
  {
    id: '5',
    participantId: 'client5',
    participantName: 'Lucia Ferreira',
    participantAvatar: '/avatars/lucia.jpg',
    participantRole: 'client',
    lastMessage: 'Processo finalizado com sucesso!',
    lastMessageTime: '1 semana',
    unreadCount: 0,
    isOnline: false,
    lastSeen: '3 dias atrás',
    isArchived: true,
    isPinned: false,
    tags: ['concluído']
  }
]

interface ConversationListProps {
  onSelectConversation?: (conversationId: string) => void
  selectedConversationId?: string
}

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const {
    conversations,
    setActiveConversation,
    pinConversation,
    archiveConversation,
    deleteConversation,
    getTotalUnreadCount
  } = useChat()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showArchived, setShowArchived] = useState(false)

  const filteredConversations = conversations
    .filter(conv => conv.isArchived === showArchived)
    .filter(conv =>
      conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Pinned conversations first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // Then by unread count
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1
      
      // Finally by last message time
      const aTime = a.lastMessage?.timestamp.getTime() || 0
      const bTime = b.lastMessage?.timestamp.getTime() || 0
      return bTime - aTime
    })

  const totalUnreadCount = getTotalUnreadCount()

  const handleArchiveConversation = (conversationId: string) => {
    archiveConversation(conversationId)
  }

  const handlePinConversation = (conversationId: string) => {
    pinConversation(conversationId)
  }

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId)
  }

  const getStatusColor = (conversation: any) => {
    if (conversation.unreadCount > 0) return 'text-primary'
    if (conversation.isOnline) return 'text-green-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {showArchived ? 'Conversas Arquivadas' : 'Conversas Ativas'}
            {!showArchived && totalUnreadCount > 0 && (
              <Badge variant="destructive">
                {totalUnreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas, mensagens ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                {showArchived ? 'Nenhuma conversa arquivada' : 'Nenhuma conversa ativa'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {showArchived 
                  ? 'Suas conversas arquivadas aparecerão aqui'
                  : 'Suas conversas com clientes aparecerão aqui'
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors relative ${
                  selectedConversationId === conversation.id ? 'bg-muted' : ''
                } ${conversation.isPinned ? 'bg-blue-50/50' : ''}`}
                onClick={() => onSelectConversation?.(conversation.id)}
              >
                {conversation.isPinned && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      Fixada
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participantAvatar} />
                      <AvatarFallback>
                        {conversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Circle 
                      className={`absolute -bottom-1 -right-1 h-4 w-4 ${
                        conversation.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium text-sm truncate ${getStatusColor(conversation)}`}>
                        {conversation.participantName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessage?.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePinConversation(conversation.id)}>
                              {conversation.isPinned ? 'Desfixar' : 'Fixar'} conversa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveConversation(conversation.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              {conversation.isArchived ? 'Desarquivar' : 'Arquivar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserX className="h-4 w-4 mr-2" />
                              Bloquear usuário
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteConversation(conversation.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir conversa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1 mr-2">
                        {conversation.lastMessage?.content || 'Nenhuma mensagem'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {conversation.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {conversation.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {conversation.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{conversation.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {!conversation.isOnline && conversation.lastSeen && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Visto {conversation.lastSeen.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}