"use client"

import { useState, useEffect, useCallback } from 'react'

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'image'
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

export interface ChatConversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar?: string
  lastMessage?: ChatMessage
  unreadCount: number
  isOnline: boolean
  lastSeen?: Date
  isPinned: boolean
  isArchived: boolean
  tags: string[]
}

export interface ChatState {
  conversations: ChatConversation[]
  activeConversationId: string | null
  messages: Record<string, ChatMessage[]>
  isLoading: boolean
  error: string | null
}

export function useChat() {
  const [state, setState] = useState<ChatState>({
    conversations: [],
    activeConversationId: null,
    messages: {},
    isLoading: false,
    error: null
  })

  // Simular dados iniciais
  useEffect(() => {
    const mockConversations: ChatConversation[] = [
      {
        id: '1',
        participantId: 'user1',
        participantName: 'Maria Silva',
        participantAvatar: '/default-avatar.png',
        unreadCount: 2,
        isOnline: true,
        isPinned: false,
        isArchived: false,
        tags: ['cliente', 'divórcio'],
        lastMessage: {
          id: 'msg1',
          senderId: 'user1',
          senderName: 'Maria Silva',
          content: 'Olá, gostaria de agendar uma consulta sobre divórcio consensual.',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          type: 'text',
          status: 'delivered'
        }
      },
      {
        id: '2',
        participantId: 'user2',
        participantName: 'João Santos',
        participantAvatar: '/default-avatar.png',
        unreadCount: 0,
        isOnline: false,
        lastSeen: new Date(Date.now() - 15 * 60 * 1000),
        isPinned: true,
        isArchived: false,
        tags: ['cliente', 'contrato'],
        lastMessage: {
          id: 'msg2',
          senderId: 'user2',
          senderName: 'João Santos',
          content: 'Obrigado pela orientação sobre o contrato. Muito esclarecedor!',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: 'text',
          status: 'read'
        }
      },
      {
        id: '3',
        participantId: 'user3',
        participantName: 'Ana Costa',
        participantAvatar: '/default-avatar.png',
        unreadCount: 1,
        isOnline: true,
        isPinned: false,
        isArchived: false,
        tags: ['cliente', 'trabalhista'],
        lastMessage: {
          id: 'msg3',
          senderId: 'user3',
          senderName: 'Ana Costa',
          content: 'Preciso de ajuda com uma questão trabalhista urgente.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          type: 'text',
          status: 'delivered'
        }
      }
    ]

    const mockMessages: Record<string, ChatMessage[]> = {
      '1': [
        {
          id: 'msg1-1',
          senderId: 'user1',
          senderName: 'Maria Silva',
          content: 'Olá, Dr. João! Espero que esteja bem.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg1-2',
          senderId: 'lawyer',
          senderName: 'Dr. João da Silva',
          content: 'Olá, Maria! Estou bem, obrigado. Como posso ajudá-la?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg1-3',
          senderId: 'user1',
          senderName: 'Maria Silva',
          content: 'Gostaria de agendar uma consulta sobre divórcio consensual. Meu marido e eu decidimos nos separar de forma amigável.',
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          type: 'text',
          status: 'delivered'
        }
      ],
      '2': [
        {
          id: 'msg2-1',
          senderId: 'user2',
          senderName: 'João Santos',
          content: 'Dr. João, obrigado pela orientação sobre o contrato.',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg2-2',
          senderId: 'lawyer',
          senderName: 'Dr. João da Silva',
          content: 'De nada, João! Fico feliz em ter ajudado. Se tiver mais dúvidas, não hesite em entrar em contato.',
          timestamp: new Date(Date.now() - 18 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: 'msg2-3',
          senderId: 'user2',
          senderName: 'João Santos',
          content: 'Muito esclarecedor! Vou revisar os pontos que você mencionou.',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: 'text',
          status: 'read'
        }
      ]
    }

    setState(prev => ({
      ...prev,
      conversations: mockConversations,
      messages: mockMessages
    }))
  }, [])

  const sendMessage = useCallback((conversationId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'lawyer',
      senderName: 'Dr. João da Silva',
      content,
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    }

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [conversationId]: [...(prev.messages[conversationId] || []), newMessage]
      }
    }))

    // Simular envio
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        }
      }))
    }, 1000)

    // Simular entrega
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [conversationId]: prev.messages[conversationId].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        }
      }))
    }, 2000)
  }, [])

  const markAsRead = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
      messages: {
        ...prev.messages,
        [conversationId]: prev.messages[conversationId]?.map(msg =>
          msg.senderId !== 'lawyer' ? { ...msg, status: 'read' } : msg
        ) || []
      }
    }))
  }, [])

  const setActiveConversation = useCallback((conversationId: string | null) => {
    setState(prev => ({ ...prev, activeConversationId: conversationId }))
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [markAsRead])

  const pinConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    }))
  }, [])

  const archiveConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, isArchived: !conv.isArchived } : conv
      )
    }))
  }, [])

  const deleteConversation = useCallback((conversationId: string) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.filter(conv => conv.id !== conversationId),
      messages: Object.fromEntries(
        Object.entries(prev.messages).filter(([id]) => id !== conversationId)
      ),
      activeConversationId: prev.activeConversationId === conversationId ? null : prev.activeConversationId
    }))
  }, [])

  const getTotalUnreadCount = useCallback(() => {
    return state.conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }, [state.conversations])

  const getActiveConversation = useCallback(() => {
    return state.conversations.find(conv => conv.id === state.activeConversationId) || null
  }, [state.conversations, state.activeConversationId])

  const getConversationMessages = useCallback((conversationId: string) => {
    return state.messages[conversationId] || []
  }, [state.messages])

  return {
    ...state,
    sendMessage,
    markAsRead,
    setActiveConversation,
    pinConversation,
    archiveConversation,
    deleteConversation,
    getTotalUnreadCount,
    getActiveConversation,
    getConversationMessages
  }
}