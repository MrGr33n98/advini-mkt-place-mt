import { useState, useEffect, useCallback } from 'react';
import { 
  usersApi, 
  lawyersApi, 
  appointmentsApi, 
  reviewsApi,
  RailsUser,
  RailsLawyer,
  RailsAppointment,
  RailsReview,
  RailsApiResponse
} from '@/lib/rails-api';

// Hook genérico para operações CRUD
export function useRailsResource<T>(
  apiMethods: {
    getAll: (page?: number, perPage?: number, filters?: any) => Promise<RailsApiResponse<T[]>>;
    getById: (id: number) => Promise<T>;
    create: (data: any) => Promise<T>;
    update: (id: number, data: any) => Promise<T>;
    delete: (id: number) => Promise<void>;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchAll = useCallback(async (page = 1, perPage = 10, filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiMethods.getAll(page, perPage, filters);
      setData(response.data || response);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [apiMethods]);

  const create = useCallback(async (itemData: any) => {
    setLoading(true);
    setError(null);
    try {
      const newItem = await apiMethods.create(itemData);
      setData(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiMethods]);

  const update = useCallback(async (id: number, itemData: any) => {
    setLoading(true);
    setError(null);
    try {
      const updatedItem = await apiMethods.update(id, itemData);
      setData(prev => prev.map(item => 
        (item as any).id === id ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiMethods]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiMethods.delete(id);
      setData(prev => prev.filter(item => (item as any).id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiMethods]);

  return {
    data,
    loading,
    error,
    meta,
    fetchAll,
    create,
    update,
    remove,
    setData,
    setError
  };
}

// Hook específico para usuários
export function useUsers() {
  const resource = useRailsResource<RailsUser>(usersApi);
  
  const activate = useCallback(async (id: number) => {
    try {
      await usersApi.activate(id);
      resource.setData(prev => prev.map(user => 
        user.id === id ? { ...user, ativo: true } : user
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao ativar usuário');
      throw err;
    }
  }, [resource]);

  const deactivate = useCallback(async (id: number) => {
    try {
      await usersApi.deactivate(id);
      resource.setData(prev => prev.map(user => 
        user.id === id ? { ...user, ativo: false } : user
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao desativar usuário');
      throw err;
    }
  }, [resource]);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await usersApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  return {
    ...resource,
    activate,
    deactivate,
    stats,
    statsLoading,
    fetchStats
  };
}

// Hook específico para advogados
export function useLawyers() {
  const resource = useRailsResource<RailsLawyer>(lawyersApi);
  
  const approve = useCallback(async (id: number) => {
    try {
      await lawyersApi.approve(id);
      resource.setData(prev => prev.map(lawyer => 
        lawyer.id === id ? { ...lawyer, status: 'aprovado' as const } : lawyer
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao aprovar advogado');
      throw err;
    }
  }, [resource]);

  const reject = useCallback(async (id: number) => {
    try {
      await lawyersApi.reject(id);
      resource.setData(prev => prev.map(lawyer => 
        lawyer.id === id ? { ...lawyer, status: 'rejeitado' as const } : lawyer
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao rejeitar advogado');
      throw err;
    }
  }, [resource]);

  const suspend = useCallback(async (id: number) => {
    try {
      await lawyersApi.suspend(id);
      resource.setData(prev => prev.map(lawyer => 
        lawyer.id === id ? { ...lawyer, status: 'suspenso' as const } : lawyer
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao suspender advogado');
      throw err;
    }
  }, [resource]);

  const reactivate = useCallback(async (id: number) => {
    try {
      await lawyersApi.reactivate(id);
      resource.setData(prev => prev.map(lawyer => 
        lawyer.id === id ? { ...lawyer, status: 'aprovado' as const } : lawyer
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao reativar advogado');
      throw err;
    }
  }, [resource]);

  const verify = useCallback(async (id: number) => {
    try {
      await lawyersApi.verify(id);
      resource.setData(prev => prev.map(lawyer => 
        lawyer.id === id ? { ...lawyer, verificado: true } : lawyer
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao verificar advogado');
      throw err;
    }
  }, [resource]);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [availableLawyers, setAvailableLawyers] = useState<RailsLawyer[]>([]);
  const [availableLoading, setAvailableLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await lawyersApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchAvailable = useCallback(async (filters?: any) => {
    setAvailableLoading(true);
    try {
      const response = await lawyersApi.getAvailable(filters);
      setAvailableLawyers(response.data || response);
    } catch (err) {
      console.error('Erro ao buscar advogados disponíveis:', err);
    } finally {
      setAvailableLoading(false);
    }
  }, []);

  return {
    ...resource,
    approve,
    reject,
    suspend,
    reactivate,
    verify,
    stats,
    statsLoading,
    fetchStats,
    availableLawyers,
    availableLoading,
    fetchAvailable
  };
}

// Hook específico para agendamentos
export function useAppointments() {
  const resource = useRailsResource<RailsAppointment>(appointmentsApi);
  
  const confirm = useCallback(async (id: number) => {
    try {
      await appointmentsApi.confirm(id);
      resource.setData(prev => prev.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'confirmado' as const } : appointment
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao confirmar agendamento');
      throw err;
    }
  }, [resource]);

  const cancel = useCallback(async (id: number, reason?: string) => {
    try {
      await appointmentsApi.cancel(id, reason);
      resource.setData(prev => prev.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'cancelado' as const } : appointment
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao cancelar agendamento');
      throw err;
    }
  }, [resource]);

  const reschedule = useCallback(async (id: number, newDateTime: any) => {
    try {
      const updated = await appointmentsApi.reschedule(id, newDateTime);
      resource.setData(prev => prev.map(appointment => 
        appointment.id === id ? updated : appointment
      ));
      return updated;
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao reagendar');
      throw err;
    }
  }, [resource]);

  const complete = useCallback(async (id: number) => {
    try {
      await appointmentsApi.complete(id);
      resource.setData(prev => prev.map(appointment => 
        appointment.id === id ? { ...appointment, status: 'concluido' as const } : appointment
      ));
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao concluir agendamento');
      throw err;
    }
  }, [resource]);

  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await appointmentsApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchByUser = useCallback(async (userId: number, page = 1, perPage = 10) => {
    resource.setLoading(true);
    try {
      const response = await appointmentsApi.getByUser(userId, page, perPage);
      return response;
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao buscar agendamentos do usuário');
      throw err;
    } finally {
      resource.setLoading(false);
    }
  }, [resource]);

  const fetchByLawyer = useCallback(async (lawyerId: number, page = 1, perPage = 10) => {
    resource.setLoading(true);
    try {
      const response = await appointmentsApi.getByLawyer(lawyerId, page, perPage);
      return response;
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao buscar agendamentos do advogado');
      throw err;
    } finally {
      resource.setLoading(false);
    }
  }, [resource]);

  return {
    ...resource,
    confirm,
    cancel,
    reschedule,
    complete,
    stats,
    statsLoading,
    fetchStats,
    fetchByUser,
    fetchByLawyer
  };
}

// Hook específico para avaliações
export function useReviews() {
  const resource = useRailsResource<RailsReview>(reviewsApi);
  
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await reviewsApi.getStats();
      setStats(response);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchByUser = useCallback(async (userId: number, page = 1, perPage = 10) => {
    resource.setLoading(true);
    try {
      const response = await reviewsApi.getByUser(userId, page, perPage);
      return response;
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao buscar avaliações do usuário');
      throw err;
    } finally {
      resource.setLoading(false);
    }
  }, [resource]);

  const fetchByLawyer = useCallback(async (lawyerId: number, page = 1, perPage = 10) => {
    resource.setLoading(true);
    try {
      const response = await reviewsApi.getByLawyer(lawyerId, page, perPage);
      return response;
    } catch (err) {
      resource.setError(err instanceof Error ? err.message : 'Erro ao buscar avaliações do advogado');
      throw err;
    } finally {
      resource.setLoading(false);
    }
  }, [resource]);

  return {
    ...resource,
    stats,
    statsLoading,
    fetchStats,
    fetchByUser,
    fetchByLawyer
  };
}