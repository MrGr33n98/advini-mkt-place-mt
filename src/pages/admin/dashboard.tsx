'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Scale, 
  Calendar, 
  Star, 
  BarChart3, 
  Settings,
  Home,
  RefreshCw
} from 'lucide-react';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { LawyersManagement } from '@/components/admin/LawyersManagement';
import { AppointmentsManagement } from '@/components/admin/AppointmentsManagement';
import { ReviewsManagement } from '@/components/admin/ReviewsManagement';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const handleRefresh = () => {
    toast.success('Dados atualizados!');
    // Aqui você pode adicionar lógica para recarregar os dados
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">
              Gerencie usuários, advogados, agendamentos e avaliações
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="lawyers" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Advogados
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setActiveTab('users')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +20% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setActiveTab('lawyers')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Advogados</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setActiveTab('appointments')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">456</div>
                  <p className="text-xs text-muted-foreground">
                    +8% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => setActiveTab('reviews')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">789</div>
                  <p className="text-xs text-muted-foreground">
                    +15% em relação ao mês passado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="h-6 w-6" />
                    <span>Gerenciar Usuários</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('lawyers')}
                  >
                    <Scale className="h-6 w-6" />
                    <span>Aprovar Advogados</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('appointments')}
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Ver Agendamentos</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setActiveTab('reviews')}
                  >
                    <Star className="h-6 w-6" />
                    <span>Moderar Avaliações</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo advogado cadastrado</p>
                      <p className="text-xs text-muted-foreground">Dr. João Silva - há 2 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Agendamento confirmado</p>
                      <p className="text-xs text-muted-foreground">Maria Santos - há 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova avaliação pendente</p>
                      <p className="text-xs text-muted-foreground">Avaliação de 5 estrelas - há 10 minutos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UsersManagement onUserSelect={setSelectedUserId} />
          </TabsContent>

          {/* Lawyers Tab */}
          <TabsContent value="lawyers">
            <LawyersManagement onLawyerSelect={setSelectedLawyerId} />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <AppointmentsManagement onAppointmentSelect={setSelectedAppointmentId} />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <ReviewsManagement onReviewSelect={setSelectedReviewId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}