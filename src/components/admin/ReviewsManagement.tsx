'use client';

import { useEffect, useState } from 'react';
import { useReviews } from '@/hooks/use-rails-api';
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
  Star, 
  Eye, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  User,
  Scale,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface ReviewsManagementProps {
  onReviewSelect?: (reviewId: number) => void;
}

export function ReviewsManagement({ onReviewSelect }: ReviewsManagementProps) {
  const {
    data: reviews,
    loading,
    error,
    meta,
    fetchAll,
    approve,
    reject,
    remove,
    stats,
    statsLoading,
    fetchStats
  } = useReviews();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    usuario_id: '',
    advogado_id: '',
    nota_min: '',
    nota_max: '',
    aprovado: undefined as boolean | undefined
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
      toast.success('Avaliação aprovada com sucesso!');
    } catch (error) {
      toast.error('Erro ao aprovar avaliação');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await reject(id);
      toast.success('Avaliação rejeitada com sucesso!');
    } catch (error) {
      toast.error('Erro ao rejeitar avaliação');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta avaliação?')) {
      try {
        await remove(id);
        toast.success('Avaliação excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir avaliação');
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar avaliações: {error}
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
              <div className="text-sm text-muted-foreground">Total de Avaliações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
              <div className="text-sm text-muted-foreground">Aprovadas</div>
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
              <div className="text-2xl font-bold text-blue-600">
                {stats.media_geral?.toFixed(1) || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Média Geral</div>
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
            <Input
              placeholder="Nota Mínima"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={filters.nota_min}
              onChange={(e) => setFilters(prev => ({ ...prev, nota_min: e.target.value }))}
            />
            <Input
              placeholder="Nota Máxima"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={filters.nota_max}
              onChange={(e) => setFilters(prev => ({ ...prev, nota_max: e.target.value }))}
            />
            <Select
              value={filters.aprovado?.toString() || 'all'}
              onValueChange={(value) => setFilters(prev => ({ 
                ...prev, 
                aprovado: value === 'all' ? undefined : value === 'true' 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Aprovadas</SelectItem>
                <SelectItem value="false">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Avaliações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avaliações ({meta?.total_count || 0})</span>
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
                    <TableHead>Nota</TableHead>
                    <TableHead>Comentário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        #{review.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {review.usuario?.nome} {review.usuario?.sobrenome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.usuario?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          <div>
                            <div className="font-medium">
                              {review.advogado?.nome} {review.advogado?.sobrenome}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              OAB: {review.advogado?.oab}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStars(review.nota)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {review.comentario ? (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 mt-1 flex-shrink-0" />
                              <div className="truncate" title={review.comentario}>
                                {review.comentario}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Sem comentário</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={review.aprovado ? 'default' : 'secondary'}>
                          {review.aprovado ? 'Aprovada' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(review.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onReviewSelect?.(review.id)}
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
                          {!review.aprovado && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(review.id)}
                                className="text-green-600"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(review.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
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
                ({meta.total_count} avaliações no total)
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