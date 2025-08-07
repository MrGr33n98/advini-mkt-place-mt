"use client"

import { useState } from "react"
import { ArrowLeft, MessageSquare, Users, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatSystem } from "@/components/dashboard/chat-system"
import { ConversationList } from "@/components/dashboard/conversation-list"
import { OnlineStatus } from "@/components/dashboard/online-status"

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("chat")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sistema de Chat</h1>
              <p className="text-gray-600">Comunique-se com seus clientes em tempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Principal
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Conversas
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Status Online
            </TabsTrigger>
          </TabsList>

          {/* Chat Principal */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat em Tempo Real</CardTitle>
                <CardDescription>
                  Interface principal para comunicação com clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatSystem />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista de Conversas */}
          <TabsContent value="conversations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Conversas</CardTitle>
                <CardDescription>
                  Visualize e organize todas as suas conversas ativas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConversationList />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Online */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status e Presença</CardTitle>
                <CardDescription>
                  Gerencie seu status online e veja quem está disponível
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OnlineStatus />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversas Ativas</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens Não Lidas</p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes Online</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio de Resposta</p>
                  <p className="text-2xl font-bold text-purple-600">2min</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}