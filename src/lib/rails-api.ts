// Rails API integration helper
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const ADMIN_API_TOKEN = process.env.NEXT_PUBLIC_ADMIN_API_TOKEN;

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function railsApiFetch(path: string, options: ApiOptions = {}) {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  const url = `${API_URL}${path}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add API token for authentication
  if (ADMIN_API_TOKEN) {
    defaultHeaders['X-API-Token'] = ADMIN_API_TOKEN;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Rails API Error:', error);
    throw error;
  }
}

// Convenience methods for common HTTP operations
export const railsApi = {
  get: (path: string, options?: ApiOptions) => 
    railsApiFetch(path, { ...options, method: 'GET' }),
  
  post: (path: string, data?: any, options?: ApiOptions) => 
    railsApiFetch(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: (path: string, data?: any, options?: ApiOptions) => 
    railsApiFetch(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: (path: string, data?: any, options?: ApiOptions) => 
    railsApiFetch(path, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: (path: string, options?: ApiOptions) => 
    railsApiFetch(path, { ...options, method: 'DELETE' }),
};

// Type definitions for Rails API responses
export interface RailsPost {
  id: number;
  title: string;
  body: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    email: string;
    created_at: string;
  };
  comments_count: number;
  comments?: RailsComment[];
}

export interface RailsUser {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  genero?: string;
  idioma_preferido?: string;
  contato_emergencia_nome?: string;
  contato_emergencia_telefone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  agendamentos_count: number;
  avaliacoes_count: number;
  agendamentos?: RailsAppointment[];
  avaliacoes?: RailsReview[];
}

export interface RailsLawyer {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  oab: string;
  especialidades: string[];
  bio?: string;
  experiencia_anos?: number;
  valor_consulta?: number;
  valor_hora?: number;
  endereco_escritorio?: string;
  cidade_escritorio?: string;
  estado_escritorio?: string;
  cep_escritorio?: string;
  telefone_escritorio?: string;
  site?: string;
  linkedin?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'suspenso';
  verificado: boolean;
  disponivel: boolean;
  foto_perfil?: string;
  created_at: string;
  updated_at: string;
  agendamentos_count: number;
  avaliacoes_count: number;
  avaliacao_media?: number;
  agendamentos?: RailsAppointment[];
  avaliacoes?: RailsReview[];
}

export interface RailsAppointment {
  id: number;
  user_id: number;
  lawyer_id: number;
  data_agendamento: string;
  hora_inicio: string;
  hora_fim: string;
  tipo_consulta: 'presencial' | 'online' | 'telefone';
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'reagendado';
  descricao?: string;
  valor?: number;
  link_reuniao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  user: Partial<RailsUser>;
  lawyer: Partial<RailsLawyer>;
  avaliacao?: RailsReview;
}

export interface RailsReview {
  id: number;
  user_id: number;
  lawyer_id: number;
  appointment_id?: number;
  nota: number;
  comentario?: string;
  recomendaria: boolean;
  created_at: string;
  updated_at: string;
  user: Partial<RailsUser>;
  lawyer: Partial<RailsLawyer>;
  appointment?: Partial<RailsAppointment>;
}

export interface RailsComment {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  post: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    email: string;
  };
}

export interface RailsApiResponse<T> {
  [key: string]: T | any;
  meta?: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

// Specific API methods for different resources
export const postsApi = {
  getAll: (page = 1, perPage = 10) => 
    railsApi.get(`/posts?page=${page}&per_page=${perPage}`),
  
  getById: (id: number) => 
    railsApi.get(`/posts/${id}`),
  
  create: (post: { title: string; body: string; user_id: number }) => 
    railsApi.post('/posts', { post }),
  
  update: (id: number, post: Partial<{ title: string; body: string; published_at: string }>) => 
    railsApi.patch(`/posts/${id}`, { post }),
  
  delete: (id: number) => 
    railsApi.delete(`/posts/${id}`),
};

export const usersApi = {
  getAll: (page = 1, perPage = 10, filters?: { 
    nome?: string; 
    email?: string; 
    cidade?: string; 
    estado?: string; 
    ativo?: boolean;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters
    });
    return railsApi.get(`/users?${params}`);
  },
  
  getById: (id: number) => 
    railsApi.get(`/users/${id}`),
  
  create: (user: { 
    nome: string; 
    email: string; 
    telefone?: string; 
    cpf?: string;
    password: string; 
    password_confirmation: string;
  }) => 
    railsApi.post('/users', { user }),
  
  update: (id: number, user: Partial<RailsUser>) => 
    railsApi.patch(`/users/${id}`, { user }),
  
  delete: (id: number) => 
    railsApi.delete(`/users/${id}`),

  activate: (id: number) => 
    railsApi.patch(`/users/${id}/activate`),

  deactivate: (id: number) => 
    railsApi.patch(`/users/${id}/deactivate`),

  getStats: () => 
    railsApi.get('/users/stats'),
};

export const lawyersApi = {
  getAll: (page = 1, perPage = 10, filters?: { 
    nome?: string; 
    email?: string; 
    oab?: string;
    especialidades?: string[];
    cidade_escritorio?: string; 
    estado_escritorio?: string; 
    status?: string;
    verificado?: boolean;
    disponivel?: boolean;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(`${key}[]`, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    return railsApi.get(`/lawyers?${params}`);
  },
  
  getById: (id: number) => 
    railsApi.get(`/lawyers/${id}`),
  
  create: (lawyer: Partial<RailsLawyer>) => 
    railsApi.post('/lawyers', { lawyer }),
  
  update: (id: number, lawyer: Partial<RailsLawyer>) => 
    railsApi.patch(`/lawyers/${id}`, { lawyer }),
  
  delete: (id: number) => 
    railsApi.delete(`/lawyers/${id}`),

  approve: (id: number) => 
    railsApi.patch(`/lawyers/${id}/approve`),

  reject: (id: number) => 
    railsApi.patch(`/lawyers/${id}/reject`),

  suspend: (id: number) => 
    railsApi.patch(`/lawyers/${id}/suspend`),

  reactivate: (id: number) => 
    railsApi.patch(`/lawyers/${id}/reactivate`),

  verify: (id: number) => 
    railsApi.patch(`/lawyers/${id}/verify`),

  getStats: () => 
    railsApi.get('/lawyers/stats'),

  getAvailable: (filters?: { 
    especialidades?: string[];
    cidade?: string;
    estado?: string;
    data?: string;
  }) => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(`${key}[]`, v));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    
    return railsApi.get(`/lawyers/available?${params}`);
  },
};

export const appointmentsApi = {
  getAll: (page = 1, perPage = 10, filters?: { 
    user_id?: number;
    lawyer_id?: number;
    status?: string;
    tipo_consulta?: string;
    data_inicio?: string;
    data_fim?: string;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters
    });
    return railsApi.get(`/appointments?${params}`);
  },
  
  getById: (id: number) => 
    railsApi.get(`/appointments/${id}`),
  
  create: (appointment: {
    user_id: number;
    lawyer_id: number;
    data_agendamento: string;
    hora_inicio: string;
    hora_fim: string;
    tipo_consulta: string;
    descricao?: string;
  }) => 
    railsApi.post('/appointments', { appointment }),
  
  update: (id: number, appointment: Partial<RailsAppointment>) => 
    railsApi.patch(`/appointments/${id}`, { appointment }),
  
  delete: (id: number) => 
    railsApi.delete(`/appointments/${id}`),

  confirm: (id: number) => 
    railsApi.patch(`/appointments/${id}/confirm`),

  cancel: (id: number, reason?: string) => 
    railsApi.patch(`/appointments/${id}/cancel`, { reason }),

  reschedule: (id: number, newDateTime: { data_agendamento: string; hora_inicio: string; hora_fim: string }) => 
    railsApi.patch(`/appointments/${id}/reschedule`, newDateTime),

  complete: (id: number) => 
    railsApi.patch(`/appointments/${id}/complete`),

  getStats: () => 
    railsApi.get('/appointments/stats'),

  getByUser: (userId: number, page = 1, perPage = 10) => 
    railsApi.get(`/users/${userId}/appointments?page=${page}&per_page=${perPage}`),

  getByLawyer: (lawyerId: number, page = 1, perPage = 10) => 
    railsApi.get(`/lawyers/${lawyerId}/appointments?page=${page}&per_page=${perPage}`),
};

export const reviewsApi = {
  getAll: (page = 1, perPage = 10, filters?: { 
    user_id?: number;
    lawyer_id?: number;
    appointment_id?: number;
    nota_min?: number;
    nota_max?: number;
  }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...filters
    });
    return railsApi.get(`/reviews?${params}`);
  },
  
  getById: (id: number) => 
    railsApi.get(`/reviews/${id}`),
  
  create: (review: {
    user_id: number;
    lawyer_id: number;
    appointment_id?: number;
    nota: number;
    comentario?: string;
    recomendaria: boolean;
  }) => 
    railsApi.post('/reviews', { review }),
  
  update: (id: number, review: Partial<RailsReview>) => 
    railsApi.patch(`/reviews/${id}`, { review }),
  
  delete: (id: number) => 
    railsApi.delete(`/reviews/${id}`),

  getByUser: (userId: number, page = 1, perPage = 10) => 
    railsApi.get(`/users/${userId}/reviews?page=${page}&per_page=${perPage}`),

  getByLawyer: (lawyerId: number, page = 1, perPage = 10) => 
    railsApi.get(`/lawyers/${lawyerId}/reviews?page=${page}&per_page=${perPage}`),

  getStats: () => 
    railsApi.get('/reviews/stats'),
};

export const commentsApi = {
  getAll: (postId: number, page = 1, perPage = 10) => 
    railsApi.get(`/posts/${postId}/comments?page=${page}&per_page=${perPage}`),
  
  getById: (postId: number, id: number) => 
    railsApi.get(`/posts/${postId}/comments/${id}`),
  
  create: (postId: number, comment: { body: string; user_id: number }) => 
    railsApi.post(`/posts/${postId}/comments`, { comment }),
  
  update: (postId: number, id: number, comment: { body: string }) => 
    railsApi.patch(`/posts/${postId}/comments/${id}`, { comment }),
  
  delete: (postId: number, id: number) => 
    railsApi.delete(`/posts/${postId}/comments/${id}`),
};