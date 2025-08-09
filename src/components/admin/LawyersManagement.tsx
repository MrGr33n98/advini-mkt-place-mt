'use client';

import { useEffect, useState } from 'react';
import { useLawyers } from '@/hooks/use-rails-api';
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
  UserPlus, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Pause, 
  Play,
  Shield,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface LawyersManagementProps {
  onLawyerSelect?: (lawyerId: number) => void;
}

export function LawyersManagement({ onLawyerSelect }: LawyersManagementProps) {
  const {
    data: lawyers,
    loading,
    error,
    meta,
    fetchAll,
    approve,
    reject,
    suspend,
    reactivate,
    verify,
    remove,
    stats,
    statsLoading,
    fetchStats
  } = useLawyers();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nome: '',
    email: '',
    oab: '',
    cidade_escritorio: '',
    estado_escritorio: '',
    status: '',
    verificado: undefined as boolean | undefined,
    disponivel: undefined as boolean | undefined
  });

  useEffect(() => {
    fetchAll(currentPage, 10, filters);
    fetchStats();
  }, [fetchAll, fetchStats, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAll(1, 10, filters);
  };

  const handleApprove = async (id: number) => {
    try {
      await approve(id);
      toast.success('Advogado aprovado com sucesso!');
    } catch (error) {
      toast.error('Erro ao aprovar advogado');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await reject(id);
      toast.success('Advogado rejeitado com sucesso!');
    } catch (error) {
      toast.error('Erro ao rejeitar advogado');
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      await suspend(id);
      toast.success('Advogado suspenso com sucesso!');
    } catch (error) {
      toast.error('Erro ao suspender advogado');
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await reactivate(id);
      toast.success('Advogado reativado com sucesso!');
    } catch (error) {
      toast.error('Erro ao reativar advogado');
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await verify(id);
      toast.success('Advogado verificado com sucesso!');
    } catch (error) {
      toast.error('Erro ao verificar advogado');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este advogado?')) {
      try {
        await remove(id);
        toast.success('Advogado excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir advogado');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'secondary',
      aprovado: 'default',
      rejeitado: 'destructive',
      suspenso: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar advogados: {error}
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
              <div className="text-sm text-muted-foreground">Total de Advogados</div>
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
              <div className="text-2xl font-bold text-green-600">{stats.aprovados}</div>
              <div className="text-sm text-muted-foreground">Aprovados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.verificados}</div>
              <div className="text-sm text-muted-foreground">Verificados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.disponiveis}</div>
              <div className="text-sm text-muted-foreground">Disponíveis</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input
              placeholder="Nome"
              value={filters.nome}
              onChange={(e) => setFilters(prev => ({ ...prev, nome: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={filters.email}
              onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder="OAB"
              value={filters.oab}
              onChange={(e) => setFilters(prev => ({ ...prev, oab: e.target.value }))}
            />
            <Input
              placeholder="Cidade"
              value={filters.cidade_escritorio}
              onChange={(e) => setFilters(prev => ({ ...prev, cidade_escritorio: e.target.value }))}
            />
            <Input
              placeholder="Estado"
              value={filters.estado_escritorio}
              onChange={(e) => setFilters(prev => ({ ...prev, estado_escritorio: e.target.value }))}
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
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.verificado?.toString() || 'all'}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                verificado: value === 'all' ? undefined : value === 'true' 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Verificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Verificados</SelectItem>
                <SelectItem value="false">Não Verificados</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Advogados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Advogados ({meta?.total_count || 0})</span>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Advogado
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>OAB</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verificado</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Agendamentos</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lawyers.map((lawyer) => (
                    <TableRow key={lawyer.id}>
                      <TableCell className="font-medium">
                        {lawyer.nome} {lawyer.sobrenome}
                      </TableCell>
                      <TableCell>{lawyer.email}</TableCell>
                      <TableCell>{lawyer.oab}</TableCell>
                      <TableCell>
                        {lawyer.cidade_escritorio && lawyer.estado_escritorio 
                          ? `${lawyer.cidade_escritorio}/${lawyer.estado_escritorio}` 
                          : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(lawyer.status)}</TableCell>
                      <TableCell>
                        <Badge variant={lawyer.verificado ? 'default' : 'secondary'}>
                          {lawyer.verificado ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lawyer.avaliacao_media?.toFixed(1) || 'N/A'}</span>
                          <span className="text-muted-foreground">
                            ({lawyer.avaliacoes_count || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{lawyer.agendamentos_count || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLawyerSelect?.(lawyer.id)}
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
                          {lawyer.status === 'pendente' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(lawyer.id)}
                                className="text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(lawyer.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          {lawyer.status === 'aprovado' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspend(lawyer.id)}
                              className="text-orange-600"
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {lawyer.status === 'suspenso' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReactivate(lawyer.id)}
                              className="text-green-600"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!lawyer.verificado && lawyer.status === 'aprovado' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(lawyer.id)}
                              className="text-blue-600"
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lawyer.id)}
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
                ({meta.total_count} advogados no total)
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