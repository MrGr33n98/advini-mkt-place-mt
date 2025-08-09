'use client';

import { useEffect, useState } from 'react';
import { useUsers } from '@/hooks/use-rails-api';
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
import { Loader2, Search, UserPlus, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface UsersManagementProps {
  onUserSelect?: (userId: number) => void;
}

export function UsersManagement({ onUserSelect }: UsersManagementProps) {
  const {
    data: users,
    loading,
    error,
    meta,
    fetchAll,
    activate,
    deactivate,
    remove,
    stats,
    statsLoading,
    fetchStats
  } = useUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    nome: '',
    email: '',
    cidade: '',
    estado: '',
    ativo: undefined as boolean | undefined
  });

  useEffect(() => {
    fetchAll(currentPage, 10, filters);
    fetchStats();
  }, [fetchAll, fetchStats, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAll(1, 10, filters);
  };

  const handleActivate = async (id: number) => {
    try {
      await activate(id);
      toast.success('Usuário ativado com sucesso!');
    } catch (error) {
      toast.error('Erro ao ativar usuário');
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivate(id);
      toast.success('Usuário desativado com sucesso!');
    } catch (error) {
      toast.error('Erro ao desativar usuário');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await remove(id);
        toast.success('Usuário excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar usuários: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total de Usuários</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
              <div className="text-sm text-muted-foreground">Usuários Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.novos_mes}</div>
              <div className="text-sm text-muted-foreground">Novos este Mês</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.com_agendamentos}</div>
              <div className="text-sm text-muted-foreground">Com Agendamentos</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              placeholder="Cidade"
              value={filters.cidade}
              onChange={(e) => setFilters(prev => ({ ...prev, cidade: e.target.value }))}
            />
            <Input
              placeholder="Estado"
              value={filters.estado}
              onChange={(e) => setFilters(prev => ({ ...prev, estado: e.target.value }))}
            />
            <Select
              value={filters.ativo?.toString() || 'all'}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                ativo: value === 'all' ? undefined : value === 'true' 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativos</SelectItem>
                <SelectItem value="false">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usuários ({meta?.total_count || 0})</span>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
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
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Agendamentos</TableHead>
                    <TableHead>Avaliações</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.telefone || '-'}</TableCell>
                      <TableCell>
                        {user.cidade && user.estado ? `${user.cidade}/${user.estado}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.ativo ? 'default' : 'secondary'}>
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.agendamentos_count || 0}</TableCell>
                      <TableCell>{user.avaliacoes_count || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUserSelect?.(user.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.ativo ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivate(user.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivate(user.id)}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
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
                ({meta.total_count} usuários no total)
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