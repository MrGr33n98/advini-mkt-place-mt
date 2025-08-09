'use client';

import { useEffect, useState } from 'react';
import { useAppointments } from '@/hooks/use-rails-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Loader2, 
  Search, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Clock,
  User,
  Scale
} from 'lucide-react';
import { toast } from 'sonner';

interface AppointmentsManagementProps {
  onAppointmentSelect?: (appointmentId: number) => void;
}

export function AppointmentsManagement({ onAppointmentSelect }: AppointmentsManagementProps) {
  const {
    data: appointments,
    loading,
    error,
    meta,
    fetchAll,
    confirm,
    cancel,
    complete,
    remove,
    stats,
    statsLoading,
    fetchStats
  } = useAppointments();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    usuario_id: '',
    advogado_id: '',
    status: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    fetchAll(currentPage, 10, filters);
    fetchStats();
  }, [fetchAll, fetchStats, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAll(1, 10, filters);
  };

  const handleConfirm = async (id: number) => {
    try {
      await confirm(id);
      toast.success('Agendamento confirmado com sucesso!');
    } catch (error) {
      toast.error('Erro ao confirmar agendamento');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancel(id);
      toast.success('Agendamento cancelado com sucesso!');
    } catch (error) {
      toast.error('Erro ao cancelar agendamento');
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await complete(id);
      toast.success('Agendamento marcado como concluído!');
    } catch (error) {
      toast.error('Erro ao completar agendamento');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await remove(id);
        toast.success('Agendamento excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir agendamento');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'secondary',
      confirmado: 'default',
      cancelado: 'destructive',
      concluido: 'outline'
    } as const;

    const colors = {
      pendente: 'text-yellow-600',
      confirmado: 'text-green-600',
      cancelado: 'text-red-600',
      concluido: 'text-blue-600'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar agendamentos: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total de Agendamentos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.confirmados}</div>
              <div className="text-sm text-muted-foreground">Confirmados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.concluidos}</div>
              <div className="text-sm text-muted-foreground">Concluídos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.cancelados}</div>
              <div className="text-sm text-muted-foreground">Cancelados</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              placeholder="ID do Usuário"
              type="number"
              value={filters.usuario_id}
              onChange={(e) => setFilters(prev => ({ ...prev, usuario_id: e.target.value }))}
            />
            <Input
              placeholder="ID do Advogado"
              type="number"
              value={filters.advogado_id}
              onChange={(e) => setFilters(prev => ({ ...prev, advogado_id: e.target.value }))}
            />
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                status: value === 'all' ? '' : value 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Data Início"
              type="date"
              value={filters.data_inicio}
              onChange={(e) => setFilters(prev => ({ ...prev, data_inicio: e.target.value }))}
            />
            <Input
              placeholder="Data Fim"
              type="date"
              value={filters.data_fim}
              onChange={(e) => setFilters(prev => ({ ...prev, data_fim: e.target.value }))}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Agendamentos ({meta?.total_count || 0})</span>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Advogado</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        #{appointment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {appointment.usuario?.nome} {appointment.usuario?.sobrenome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.usuario?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {appointment.advogado?.nome} {appointment.advogado?.sobrenome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              OAB: {appointment.advogado?.oab}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {formatDateTime(appointment.data_hora)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.duracao_minutos} min
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(appointment.valor)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={appointment.descricao}>
                          {appointment.descricao || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAppointmentSelect?.(appointment.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Ações baseadas no status */}
                          {appointment.status === 'pendente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleConfirm(appointment.id)}
                                className="text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancel(appointment.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {appointment.status === 'confirmado' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleComplete(appointment.id)}
                                className="text-blue-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancel(appointment.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginação */}
          {meta && meta.total_pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Página {meta.current_page} de {meta.total_pages} 
                ({meta.total_count} agendamentos no total)
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.current_page >= meta.total_pages}
                  onClick={() => setCurrentPage(prev => Math.min(meta.total_pages, prev + 1))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}