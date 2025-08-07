"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useChat } from '@/hooks/use-chat'
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Circle,
  Paperclip,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
  type: 'text' | 'file' | 'image'
  fileUrl?: string
  fileName?: string
}

interface Conversation {
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
  messages: Message[]
}

// Mock data
const mockConversations: Conversation[] = [
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
    messages: [
      {
        id: 'm1',
        senderId: 'client1',
        senderName: 'Maria Santos',
        content: 'Boa tarde, Dr. Silva! Gostaria de tirar uma dúvida sobre meu processo.',
        timestamp: '14:25',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm2',
        senderId: 'lawyer1',
        senderName: 'Dr. Silva',
        content: 'Boa tarde, Maria! Claro, pode me contar qual é sua dúvida.',
        timestamp: '14:27',
        isRead: true,
        type: 'text'
      },
      {
        id: 'm3',
        senderId: 'client1',
        senderName: 'Maria Santos',
        content: 'Obrigada pela orientação sobre o processo',
        timestamp: '10:30',
        isRead: false,
        type: 'text'
      }
    ]
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
    messages: [
      {
        id: 'm4',
        senderId: 'client2',
        senderName: 'João Oliveira',
        content: 'Quando podemos agendar a próxima reunião?',
        timestamp: 'Ontem 16:45',
        isRead: true,
        type: 'text'
      }
    ]
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
    messages: [
      {
        id: 'm5',
        senderId: 'client3',
        senderName: 'Ana Costa',
        content: 'Recebi os documentos, obrigada!',
        timestamp: '2 dias atrás',
        isRead: false,
        type: 'text'
      }
    ]
  }
]

export function ChatSystem() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    sendMessage,
    getActiveConversation,
    getConversationMessages
  } = useChat()
  
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const selectedConversation = getActiveConversation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversationId ? getConversationMessages(activeConversationId) : []])

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return

    sendMessage(activeConversationId, newMessage)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const markAsRead = (conversationId: string) => {
    // This will be handled by the useChat hook
  }

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Conversas
              {totalUnreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {totalUnreadCount}
                </Badge>
              )}
            </h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(600px-120px)]">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => {
                setActiveConversation(conversation.id)
                markAsRead(conversation.id)
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.participantAvatar} />
                    <AvatarFallback>
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Circle 
                    className={`absolute -bottom-1 -right-1 h-3 w-3 ${
                      conversation.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">
                      {conversation.participantName}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage?.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.content}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  
                  {!conversation.isOnline && conversation.lastSeen && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Visto {conversation.lastSeen.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.participantAvatar} />
                      <AvatarFallback>
                        {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Circle 
                      className={`absolute -bottom-1 -right-1 h-3 w-3 ${
                        selectedConversation.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedConversation.participantName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.isOnline ? 'Online' : `Visto ${selectedConversation.lastSeen?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Arquivar conversa</DropdownMenuItem>
                      <DropdownMenuItem>Bloquear usuário</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(activeConversationId ? getConversationMessages(activeConversationId) : []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 'lawyer1' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'lawyer1'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.senderId === 'lawyer1' && (
                          <div className="ml-2">
                            {message.status === 'read' ? (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            ) : (
                              <Check className="h-3 w-3 opacity-70" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de Mensagem */}
            <div className="p-4 border-t bg-background">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-sm text-muted-foreground">
                Escolha uma conversa da lista para começar a conversar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}