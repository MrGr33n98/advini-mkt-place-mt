# Documento de Design - Plataforma Jurídica Profissional

## Overview

Este documento define a arquitetura técnica e design da plataforma jurídica profissional para Mato Grosso. A solução será construída como um **frontend Next.js 15** que consome dados de uma **API Ruby on Rails** com **Active Admin 3.2** para o painel administrativo.

A arquitetura seguirá o padrão **Frontend-Backend Separado**, onde o Next.js atua como cliente que consome uma API REST/GraphQL fornecida pelo Rails, garantindo separação clara de responsabilidades e escalabilidade.

## Architecture

### Arquitetura Geral

A aplicação seguirá uma arquitetura **Client-Server** com frontend e backend completamente separados:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Web Client    │  │   Mobile PWA    │  │  Admin UI    │ │
│  │   (Next.js 15)  │  │   (Next.js)     │  │  (Next.js)   │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/GraphQL
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Rails API     │  │  Active Admin   │  │   GraphQL    │ │
│  │   (REST/JSON)   │  │     3.2         │  │  (Optional)  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   PostgreSQL    │  │   Redis Cache   │  │   Storage    │ │
│  │   (Database)    │  │   (Sessions)    │  │   (S3/R2)    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

**Frontend (Next.js):**
- **Next.js 15** com App Router para SSR/SSG otimizado
- **React 19** com Server Components
- **TypeScript** para type safety
- **Tailwind CSS** + **Shadcn/ui** para styling e componentes
- **Zustand** para gerenciamento de estado
- **React Query/TanStack Query** para cache e sincronização de dados
- **React Hook Form** + **Zod** para formulários e validação
- **Axios** para comunicação com API Rails

**Backend (Ruby on Rails):**
- **Ruby on Rails 7.1+** com API mode
- **Active Admin 3.2** para painel administrativo
- **PostgreSQL** como database principal
- **Redis** para cache e sessions
- **Devise** para autenticação
- **CanCanCan** para autorização
- **Kaminari** para paginação
- **Active Storage** para upload de arquivos
- **Sidekiq** para jobs em background

**Infraestrutura:**
- **Frontend:** Vercel para deploy do Next.js
- **Backend:** Railway/Heroku para deploy do Rails
- **Database:** PostgreSQL (Railway/Heroku Postgres)
- **Cache:** Redis (Upstash/Railway Redis)
- **Storage:** AWS S3 ou Cloudflare R2
- **CDN:** Cloudflare para assets estáticos

## Components and Interfaces

### Estrutura de Pastas (Frontend Next.js)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   ├── login/
│   │   └── registro/
│   ├── (dashboard)/              # Grupo de rotas do dashboard
│   │   ├── advogado/             # Dashboard do advogado
│   │   └── cliente/              # Dashboard do cliente
│   ├── advogados/                # Páginas públicas
│   ├── escritorios/
│   ├── planos/
│   └── globals.css
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (Shadcn)
│   ├── forms/                    # Componentes de formulário
│   ├── layout/                   # Componentes de layout
│   ├── dashboard/                # Componentes específicos do dashboard
│   ├── maps/                     # Componentes de mapa
│   └── common/                   # Componentes reutilizáveis
├── lib/                          # Lógica de negócio
│   ├── api/                      # Cliente API Rails
│   ├── auth/                     # Configuração de autenticação
│   ├── utils/                    # Utilitários gerais
│   └── validations/              # Schemas de validação
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand stores
├── types/                        # Definições TypeScript
├── services/                     # Serviços de API
└── middleware.ts                 # Next.js middleware
```

### Estrutura Backend Rails (Referência)

```
app/
├── controllers/
│   ├── api/
│   │   └── v1/                   # API versioning
│   │       ├── lawyers_controller.rb
│   │       ├── appointments_controller.rb
│   │       ├── reviews_controller.rb
│   │       └── auth_controller.rb
│   └── admin/                    # Active Admin controllers
├── models/
│   ├── user.rb
│   ├── lawyer.rb
│   ├── appointment.rb
│   ├── review.rb
│   └── subscription.rb
├── admin/                        # Active Admin resources
│   ├── users.rb
│   ├── lawyers.rb
│   ├── appointments.rb
│   └── dashboard.rb
├── serializers/                  # JSON serializers
│   ├── lawyer_serializer.rb
│   └── appointment_serializer.rb
└── services/                     # Business logic services
    ├── lawyer_approval_service.rb
    └── notification_service.rb
```

### Componentes Principais

#### 1. Cliente API Rails
```typescript
// lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros de autenticação
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

#### 2. Serviços de API
```typescript
// services/lawyers.ts
import { apiClient } from '@/lib/api/client';
import { Lawyer, LawyerFilters, PaginatedResponse } from '@/types';

export class LawyersService {
  static async getAll(filters?: LawyerFilters): Promise<PaginatedResponse<Lawyer>> {
    const params = new URLSearchParams();
    
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    return apiClient.get<PaginatedResponse<Lawyer>>(`/lawyers?${params}`);
  }

  static async getById(id: string): Promise<Lawyer> {
    return apiClient.get<Lawyer>(`/lawyers/${id}`);
  }

  static async create(data: Partial<Lawyer>): Promise<Lawyer> {
    return apiClient.post<Lawyer>('/lawyers', { lawyer: data });
  }

  static async update(id: string, data: Partial<Lawyer>): Promise<Lawyer> {
    return apiClient.put<Lawyer>(`/lawyers/${id}`, { lawyer: data });
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete(`/lawyers/${id}`);
  }
}

// services/auth.ts
export class AuthService {
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    });
    
    localStorage.setItem('auth_token', response.token);
    return response;
  }

  static async register(userData: RegisterData): Promise<{ token: string; user: User }> {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/register', userData);
    
    localStorage.setItem('auth_token', response.token);
    return response;
  }

  static async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  static async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }
}
```

#### 3. Hooks para Integração com Rails
```typescript
// hooks/useLawyers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LawyersService } from '@/services/lawyers';
import { LawyerFilters } from '@/types';

export function useLawyers(filters?: LawyerFilters) {
  return useQuery({
    queryKey: ['lawyers', filters],
    queryFn: () => LawyersService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useLawyer(id: string) {
  return useQuery({
    queryKey: ['lawyer', id],
    queryFn: () => LawyersService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLawyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LawyersService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
    },
  });
}

// hooks/useAuth.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthService } from '@/services/auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: AuthService.getCurrentUser,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      AuthService.login(email, password),
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      router.push('/');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
```

#### 3. Componentes de Dashboard
```typescript
// components/dashboard/AdminDashboard.tsx
export function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Usuários Ativos"
        value="1,234"
        change="+12%"
        icon={Users}
      />
      <MetricCard
        title="Receita Mensal"
        value="R$ 45,678"
        change="+8%"
        icon={DollarSign}
      />
      <MetricCard
        title="Conversões"
        value="89%"
        change="+3%"
        icon={TrendingUp}
      />
      <MetricCard
        title="Tickets Abertos"
        value="23"
        change="-15%"
        icon={AlertCircle}
      />
    </div>
  );
}
```

## Data Models

### Modelos Rails (Backend)

```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum role: { client: 0, lawyer: 1, admin: 2 }

  has_one :lawyer, dependent: :destroy
  has_many :appointments, foreign_key: 'client_id', dependent: :destroy
  has_many :reviews, foreign_key: 'client_id', dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end

# app/models/lawyer.rb
class Lawyer < ApplicationRecord
  belongs_to :user
  belongs_to :plan, optional: true
  has_many :appointments, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :subscriptions, dependent: :destroy

  enum status: { pending: 0, approved: 1, rejected: 2, suspended: 3 }

  validates :oab, presence: true, uniqueness: true, format: { with: /\A[A-Z]{2}\d{4,6}\z/ }
  validates :specialties, presence: true
  validates :latitude, :longitude, presence: true, if: :approved?

  scope :approved, -> { where(status: :approved) }
  scope :by_specialty, ->(specialty) { where('specialties @> ?', [specialty].to_json) }
  scope :near, ->(lat, lng, distance = 10) {
    where("ST_DWithin(ST_Point(longitude, latitude), ST_Point(?, ?), ?)", lng, lat, distance)
  }

  def average_rating
    reviews.average(:rating)&.round(1) || 0
  end

  def total_reviews
    reviews.count
  end
end

# app/models/appointment.rb
class Appointment < ApplicationRecord
  belongs_to :client, class_name: 'User'
  belongs_to :lawyer
  has_one :review, dependent: :destroy

  enum status: { scheduled: 0, confirmed: 1, completed: 2, cancelled: 3 }

  validates :scheduled_at, presence: true
  validates :duration, presence: true, numericality: { greater_than: 0 }
  validate :scheduled_in_future
  validate :lawyer_availability

  scope :upcoming, -> { where('scheduled_at > ?', Time.current) }
  scope :past, -> { where('scheduled_at < ?', Time.current) }

  private

  def scheduled_in_future
    return unless scheduled_at

    errors.add(:scheduled_at, 'must be in the future') if scheduled_at <= Time.current
  end

  def lawyer_availability
    return unless lawyer && scheduled_at && duration

    overlapping = lawyer.appointments
                        .where.not(id: id)
                        .where(status: [:scheduled, :confirmed])
                        .where(
                          '(scheduled_at, scheduled_at + INTERVAL duration MINUTE) OVERLAPS (?, ?)',
                          scheduled_at,
                          scheduled_at + duration.minutes
                        )

    errors.add(:scheduled_at, 'conflicts with existing appointment') if overlapping.exists?
  end
end

# app/models/plan.rb
class Plan < ApplicationRecord
  has_many :lawyers, dependent: :nullify
  has_many :subscriptions, dependent: :destroy

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :features, presence: true

  scope :active, -> { where(is_active: true) }
end
```

### Tipos TypeScript (Frontend)

```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'lawyer' | 'client';
  created_at: string;
  updated_at: string;
}

export interface Lawyer {
  id: string;
  user_id: string;
  user?: User;
  oab: string;
  specialties: string[];
  bio?: string;
  phone?: string;
  whatsapp_url?: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  plan_id?: string;
  plan?: Plan;
  average_rating?: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  client?: User;
  lawyer_id: string;
  lawyer?: Lawyer;
  scheduled_at: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  meeting_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  client_id: string;
  client?: User;
  lawyer_id: string;
  lawyer?: Lawyer;
  appointment_id?: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  max_listings?: number;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface LawyerFilters {
  specialty?: string;
  location?: string;
  rating?: number;
  page?: number;
  per_page?: number;
  search?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: string[];
}
```

### Serializers Rails (Para referência)

```ruby
# app/serializers/lawyer_serializer.rb
class LawyerSerializer < ActiveModel::Serializer
  attributes :id, :oab, :specialties, :bio, :phone, :whatsapp_url,
             :latitude, :longitude, :status, :average_rating, :total_reviews,
             :created_at, :updated_at

  belongs_to :user
  belongs_to :plan, optional: true

  def average_rating
    object.average_rating&.to_f
  end

  def total_reviews
    object.total_reviews
  end
end

# app/serializers/user_serializer.rb
class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :role, :created_at, :updated_at
end

# app/serializers/appointment_serializer.rb
class AppointmentSerializer < ActiveModel::Serializer
  attributes :id, :scheduled_at, :duration, :status, :notes, :meeting_url,
             :created_at, :updated_at

  belongs_to :client, serializer: UserSerializer
  belongs_to :lawyer, serializer: LawyerSerializer
end
```

## Error Handling

### Tratamento de Erros no Frontend

```typescript
// lib/errors/index.ts
export class ApiError extends Error {
  public readonly status: number;
  public readonly errors?: string[];

  constructor(message: string, status: number = 500, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

export function handleApiError(error: any): ApiError {
  if (error.response) {
    // Erro da API Rails
    const { status, data } = error.response;
    return new ApiError(
      data.message || 'Erro na API',
      status,
      data.errors
    );
  }

  if (error.request) {
    // Erro de rede
    return new ApiError('Erro de conexão com o servidor', 0);
  }

  // Erro desconhecido
  return new ApiError(error.message || 'Erro desconhecido', 500);
}

// hooks/useErrorHandler.ts
import { toast } from 'sonner';
import { ApiError } from '@/lib/errors';

export function useErrorHandler() {
  const handleError = (error: unknown) => {
    console.error('Error:', error);

    if (error instanceof ApiError) {
      if (error.errors && error.errors.length > 0) {
        // Múltiplos erros de validação
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message);
      }
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ocorreu um erro inesperado');
    }
  };

  return { handleError };
}
```

### Tratamento de Erros no Rails (Referência)

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_user!
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from CanCan::AccessDenied, with: :forbidden

  private

  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token.blank?
      render json: { message: 'Token de acesso requerido' }, status: :unauthorized
      return
    end

    begin
      decoded_token = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
      @current_user = User.find(decoded_token[0]['user_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { message: 'Token inválido' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def not_found(exception)
    render json: { 
      message: 'Recurso não encontrado',
      errors: [exception.message]
    }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: {
      message: 'Dados inválidos',
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def forbidden
    render json: { 
      message: 'Acesso negado' 
    }, status: :forbidden
  end
end
```

### Validação Frontend com Zod

```typescript
// lib/validations/lawyer.ts
import { z } from 'zod';

export const createLawyerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  oab: z.string().regex(/^[A-Z]{2}\d{4,6}$/, 'OAB inválida'),
  specialties: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  bio: z.string().max(1000, 'Bio deve ter no máximo 1000 caracteres').optional(),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido').optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateLawyerSchema = createLawyerSchema.partial();

export const appointmentSchema = z.object({
  lawyer_id: z.string().uuid('ID do advogado inválido'),
  scheduled_at: z.string().datetime('Data e hora inválidas'),
  duration: z.number().min(30, 'Duração mínima de 30 minutos').max(240, 'Duração máxima de 4 horas'),
  notes: z.string().max(500, 'Notas devem ter no máximo 500 caracteres').optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Avaliação mínima é 1').max(5, 'Avaliação máxima é 5'),
  comment: z.string().max(1000, 'Comentário deve ter no máximo 1000 caracteres').optional(),
});
```

### Validação Rails (Referência)

```ruby
# app/models/lawyer.rb (validações)
class Lawyer < ApplicationRecord
  validates :oab, presence: true, uniqueness: true, 
            format: { with: /\A[A-Z]{2}\d{4,6}\z/, message: 'formato inválido' }
  validates :specialties, presence: true, length: { minimum: 1 }
  validates :bio, length: { maximum: 1000 }
  validates :phone, format: { with: /\A\(\d{2}\)\s\d{4,5}-\d{4}\z/ }, allow_blank: true
  validates :latitude, inclusion: { in: -90..90 }, allow_nil: true
  validates :longitude, inclusion: { in: -180..180 }, allow_nil: true

  validate :specialties_are_valid

  private

  def specialties_are_valid
    valid_specialties = [
      'Direito Civil', 'Direito Penal', 'Direito Trabalhista',
      'Direito Tributário', 'Direito de Família', 'Direito Empresarial',
      'Direito do Consumidor', 'Direito Ambiental', 'Direito Digital'
    ]

    invalid_specialties = specialties - valid_specialties
    if invalid_specialties.any?
      errors.add(:specialties, "contém especialidades inválidas: #{invalid_specialties.join(', ')}")
    end
  end
end
```

## Testing Strategy

### Testes Frontend (Next.js)

```typescript
// __tests__/services/lawyers.test.ts
import { LawyersService } from '@/services/lawyers';
import { apiClient } from '@/lib/api/client';

jest.mock('@/lib/api/client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('LawyersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch lawyers with filters', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Dr. João Silva', specialties: ['Direito Civil'] }
        ],
        meta: { current_page: 1, per_page: 10, total_pages: 1, total_count: 1 }
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await LawyersService.getAll({ specialty: 'Direito Civil' });

      expect(mockedApiClient.get).toHaveBeenCalledWith('/lawyers?specialty=Direito+Civil');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      const error = new Error('Network error');
      mockedApiClient.get.mockRejectedValue(error);

      await expect(LawyersService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('create', () => {
    it('should create lawyer with valid data', async () => {
      const lawyerData = {
        name: 'Dr. João Silva',
        oab: 'MT12345',
        specialties: ['Direito Civil']
      };

      const mockResponse = { id: '1', ...lawyerData };
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await LawyersService.create(lawyerData);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/lawyers', { lawyer: lawyerData });
      expect(result).toEqual(mockResponse);
    });
  });
});
```

### Testes de Componentes

```typescript
// __tests__/components/LawyerCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LawyerCard } from '@/components/LawyerCard';

const mockLawyer = {
  id: '1',
  name: 'Dr. João Silva',
  specialties: ['Direito Civil', 'Direito de Família'],
  averageRating: 4.8,
  totalReviews: 12,
  bio: 'Advogado especializado em direito civil...'
};

describe('LawyerCard', () => {
  it('should render lawyer information correctly', () => {
    render(<LawyerCard lawyer={mockLawyer} />);

    expect(screen.getByText('Dr. João Silva')).toBeInTheDocument();
    expect(screen.getByText('Direito Civil')).toBeInTheDocument();
    expect(screen.getByText('Direito de Família')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(12 avaliações)')).toBeInTheDocument();
  });

  it('should call onSelect when card is clicked', () => {
    const onSelect = jest.fn();
    render(<LawyerCard lawyer={mockLawyer} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onSelect).toHaveBeenCalledWith(mockLawyer);
  });

  it('should show contact button for authenticated users', () => {
    render(
      <LawyerCard 
        lawyer={mockLawyer} 
        isAuthenticated={true} 
      />
    );

    expect(screen.getByText('Entrar em Contato')).toBeInTheDocument();
  });
});
```

### Configuração de Testes

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

## Performance e Otimizações

### Estratégias de Cache

```typescript
// lib/cache/redis.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  
  if (cached) {
    return cached as T;
  }

  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}
```

### Otimização de Imagens

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function OptimizedImage({ src, alt, width, height, className }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={false}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
```

### Lazy Loading de Componentes

```typescript
// components/LazyComponents.tsx
import dynamic from 'next/dynamic';

export const LazyChart = dynamic(() => import('./Chart'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
  ssr: false,
});

export const LazyMap = dynamic(() => import('./LawyerMap'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded" />,
  ssr: false,
});
```

## Segurança

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

export async function withRateLimit(
  identifier: string,
  handler: () => Promise<Response>
): Promise<Response> {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      },
    });
  }

  return handler();
}
```

### Sanitização de Dados

```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000); // Limita tamanho
}
```

Este design fornece uma base sólida e escalável para a plataforma jurídica profissional, incorporando as melhores práticas de desenvolvimento moderno e garantindo performance, segurança e experiência do usuário excepcionais.