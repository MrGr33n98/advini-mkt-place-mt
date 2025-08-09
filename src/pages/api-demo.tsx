'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  RefreshCw, 
  Users, 
  Scale, 
  Calendar, 
  Star,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { railsApiFetch } from '@/lib/rails-api';
import { toast } from 'sonner';
import { useUsers, useLawyers, useAppointments, useReviews } from '@/hooks/use-rails-api';

interface ApiStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
  };
  lawyers: {
    total: number;
    pending: number;
    approved: number;
    verified: number;
  };
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  reviews: {
    total: number;
    approved: number;
    pending: number;
    average_rating: number;
  };
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export default function ApiDemo() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [apiResponses, setApiResponses] = useState<ApiResponse[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const addApiResponse = (response: ApiResponse) => {
    setApiResponses(prev => [response, ...prev.slice(0, 9)]); // Keep last 10 responses
  };

  const testApiEndpoint = async (endpoint: string, method: string = 'GET', data?: any) => {
    setLoading(true);
    const timestamp = new Date().toISOString();
    
    try {
      const response = await railsApiFetch(endpoint, {
        method,
        ...(data && { body: JSON.stringify(data) })
      });
      
      addApiResponse({
        success: true,
        data: response,
        timestamp
      });
      
      toast.success(`API ${method} ${endpoint} - Sucesso!`);
      return response;
    } catch (error) {
      addApiResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp
      });
      
      toast.error(`API ${method} ${endpoint} - Erro!`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersStats, lawyersStats, appointmentsStats, reviewsStats] = await Promise.all([
        testApiEndpoint('/api/users/stats'),
        testApiEndpoint('/api/lawyers/stats'),
        testApiEndpoint('/api/appointments/stats'),
        testApiEndpoint('/api/reviews/stats')
      ]);

      setStats({
        users: usersStats,
        lawyers: lawyersStats,
        appointments: appointmentsStats,
        reviews: reviewsStats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const testCrudOperations = async () => {
    try {
      // Test GET
      await testApiEndpoint('/api/users?page=1&per_page=5');
      
      // Test POST (create user)
      await testApiEndpoint('/api/users', 'POST', {
        nome: 'Usuário Teste',
        sobrenome: 'API Demo',
        email: `teste-${Date.now()}@example.com`,
        telefone: '11999999999'
      });
      
      // Test GET lawyers
      await testApiEndpoint('/api/lawyers?page=1&per_page=5');
      
      // Test GET appointments
      await testApiEndpoint('/api/appointments?page=1&per_page=5');
      
      toast.success('Testes CRUD concluídos!');
    } catch (error) {
      toast.error('Erro nos testes CRUD');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Demo da API Rails</h1>
            <p className="text-gray-600 mt-1">
              Demonstração da integração entre Next.js e Rails API
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchStats} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar Stats
            </Button>
            <Button onClick={testCrudOperations} disabled={loading} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Testar CRUD
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="responses">Respostas da API</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* API Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Status da API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Rails API: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Autenticação: OK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>CORS: Configurado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Última atualização: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.users.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{stats.users.active} ativos</Badge>
                      <Badge variant="outline">{stats.users.new_this_month} novos</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Advogados</CardTitle>
                    <Scale className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.lawyers.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">{stats.lawyers.approved} aprovados</Badge>
                      <Badge variant="secondary">{stats.lawyers.pending} pendentes</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.appointments.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">{stats.appointments.confirmed} confirmados</Badge>
                      <Badge variant="outline">{stats.appointments.completed} concluídos</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.reviews.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">★ {stats.reviews.average_rating?.toFixed(1)}</Badge>
                      <Badge variant="secondary">{stats.reviews.approved} aprovadas</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Endpoints de Usuários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/users')}
                    disabled={loading}
                  >
                    GET /api/users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/users/stats')}
                    disabled={loading}
                  >
                    GET /api/users/stats
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/users/1')}
                    disabled={loading}
                  >
                    GET /api/users/:id
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Endpoints de Advogados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/lawyers')}
                    disabled={loading}
                  >
                    GET /api/lawyers
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/lawyers/stats')}
                    disabled={loading}
                  >
                    GET /api/lawyers/stats
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/lawyers/1')}
                    disabled={loading}
                  >
                    GET /api/lawyers/:id
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Endpoints de Agendamentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/appointments')}
                    disabled={loading}
                  >
                    GET /api/appointments
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/appointments/stats')}
                    disabled={loading}
                  >
                    GET /api/appointments/stats
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Endpoints de Avaliações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/reviews')}
                    disabled={loading}
                  >
                    GET /api/reviews
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => testApiEndpoint('/api/reviews/stats')}
                    disabled={loading}
                  >
                    GET /api/reviews/stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* API Responses Tab */}
          <TabsContent value="responses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Respostas da API</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiResponses.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      Nenhuma resposta da API ainda. Teste alguns endpoints!
                    </div>
                  ) : (
                    apiResponses.map((response, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {response.success ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Badge variant={response.success ? 'default' : 'destructive'}>
                              {response.success ? 'Sucesso' : 'Erro'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(response.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                          {JSON.stringify(response.data || response.error, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}