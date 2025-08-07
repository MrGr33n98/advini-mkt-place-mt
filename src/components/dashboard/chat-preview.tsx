"use client"

import { useState } from "react"
import { MessageSquare, Send, Users, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/hooks/use-chat"

export function ChatPreview() {
  const {
    conversations,
    getTotalUnreadCount,
    setActiveConversation
  } = useChat()
  
  const [quickMessage, setQuickMessage] = useState("")
  
  // Get recent messages from conversations
  const recentMessages = conversations
    .filter(conv => conv.lastMessage && conv.unreadCount > 0)
    .slice(0, 3)
    .map(conv => ({
      id: conv.id,
      sender: conv.participantName,
      avatar: "/default-avatar.png",
      message: conv.lastMessage!.content,
      time: formatTimeAgo(conv.lastMessage!.timestamp),
      unread: conv.unreadCount > 0,
      online: conv.isOnline
    }))

  const unreadCount = getTotalUnreadCount()
  
  function formatTimeAgo(timestamp: Date): string {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      return `${hours}h`
    }
  }

  const handleSendQuickMessage = () => {
    if (quickMessage.trim()) {
      // For quick reply, we could send to the most recent conversation
      const mostRecentConv = conversations
        .filter(conv => conv.unreadCount > 0)
        .sort((a, b) => {
          const aTime = a.lastMessage?.timestamp.getTime() || 0
          const bTime = b.lastMessage?.timestamp.getTime() || 0
          return bTime - aTime
        })[0]
      
      if (mostRecentConv) {
        setActiveConversation(mostRecentConv.id)
        // Navigate to chat page would be handled by parent component
      }
      setQuickMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle>Chat Rápido</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Link href="/dashboard/chat">
            <Button variant="outline" size="sm">
              <ArrowRight className="h-4 w-4 mr-1" />
              Ver Tudo
            </Button>
          </Link>
        </div>
        <CardDescription>
          Mensagens recentes dos seus clientes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de mensagens recentes */}
        <ScrollArea className="h-48">
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                  message.unread 
                    ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.avatar} alt={message.sender} />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {message.online && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {message.sender}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {message.message}
                  </p>
                </div>
                {message.unread && (
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Resposta rápida */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Digite uma resposta rápida..."
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendQuickMessage()}
              className="flex-1"
            />
            <Button 
              size="sm" 
              onClick={handleSendQuickMessage}
              disabled={!quickMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {conversations.filter(conv => conv.isOnline).length}
            </div>
            <div className="text-xs text-gray-500">Clientes Online</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{conversations.length}</div>
            <div className="text-xs text-gray-500">Total Conversas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}