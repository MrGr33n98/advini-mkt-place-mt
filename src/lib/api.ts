// API Configuration and Client for Rails Backend Integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Types for API responses
export interface Lawyer {
  id: number;
  name: string;
  email: string;
  phone: string;
  bio: string;
  experience_years: number;
  active: boolean;
  specializations: Specialization[];
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  lawyer: {
    id: number;
    name: string;
    email: string;
  } | null;
  user: {
    id: number;
    email: string;
  } | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_type: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  lawyer: {
    id: number;
    name: string;
  } | null;
  user: {
    id: number;
    email: string;
  } | null;
  rating: number;
  comment: string;
  client_name: string;
  client_email: string;
  created_at: string;
  updated_at: string;
}

export interface Specialization {
  id: number;
  name: string;
  description: string;
  lawyers_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface ApiResponse<T> {
  data?: T;
  pagination?: PaginationInfo;
  errors?: Record<string, string[]>;
  error?: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Lawyers API
  async getLawyers(params?: {
    search?: string;
    specialization?: string;
    active?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<{ lawyers: Lawyer[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.specialization) searchParams.append('specialization', params.specialization);
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = `/lawyers${query ? `?${query}` : ''}`;
    
    return this.request<{ lawyers: Lawyer[]; pagination: PaginationInfo }>(endpoint);
  }

  async getLawyer(id: number): Promise<{ lawyer: Lawyer }> {
    return this.request<{ lawyer: Lawyer }>(`/lawyers/${id}`);
  }

  async createLawyer(lawyer: Partial<Lawyer>): Promise<{ lawyer: Lawyer }> {
    return this.request<{ lawyer: Lawyer }>('/lawyers', {
      method: 'POST',
      body: JSON.stringify({ lawyer }),
    });
  }

  async updateLawyer(id: number, lawyer: Partial<Lawyer>): Promise<{ lawyer: Lawyer }> {
    return this.request<{ lawyer: Lawyer }>(`/lawyers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ lawyer }),
    });
  }

  async deleteLawyer(id: number): Promise<void> {
    return this.request<void>(`/lawyers/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments API
  async getAppointments(params?: {
    lawyer_id?: number;
    user_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ appointments: Appointment[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    
    if (params?.lawyer_id) searchParams.append('lawyer_id', params.lawyer_id.toString());
    if (params?.user_id) searchParams.append('user_id', params.user_id.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = `/appointments${query ? `?${query}` : ''}`;
    
    return this.request<{ appointments: Appointment[]; pagination: PaginationInfo }>(endpoint);
  }

  async getAppointment(id: number): Promise<{ appointment: Appointment }> {
    return this.request<{ appointment: Appointment }>(`/appointments/${id}`);
  }

  async createAppointment(appointment: Partial<Appointment>): Promise<{ appointment: Appointment }> {
    return this.request<{ appointment: Appointment }>('/appointments', {
      method: 'POST',
      body: JSON.stringify({ appointment }),
    });
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<{ appointment: Appointment }> {
    return this.request<{ appointment: Appointment }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ appointment }),
    });
  }

  async deleteAppointment(id: number): Promise<void> {
    return this.request<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailableSlots(lawyer_id: number, date: string): Promise<{ available_slots: string[] }> {
    const searchParams = new URLSearchParams({
      lawyer_id: lawyer_id.toString(),
      date,
    });
    
    return this.request<{ available_slots: string[] }>(`/appointments/available_slots?${searchParams}`);
  }

  // Reviews API
  async getReviews(params?: {
    lawyer_id?: number;
    user_id?: number;
    min_rating?: number;
    max_rating?: number;
    page?: number;
    per_page?: number;
  }): Promise<{ reviews: Review[]; pagination: PaginationInfo }> {
    const searchParams = new URLSearchParams();
    
    if (params?.lawyer_id) searchParams.append('lawyer_id', params.lawyer_id.toString());
    if (params?.user_id) searchParams.append('user_id', params.user_id.toString());
    if (params?.min_rating) searchParams.append('min_rating', params.min_rating.toString());
    if (params?.max_rating) searchParams.append('max_rating', params.max_rating.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());

    const query = searchParams.toString();
    const endpoint = `/reviews${query ? `?${query}` : ''}`;
    
    return this.request<{ reviews: Review[]; pagination: PaginationInfo }>(endpoint);
  }

  async getReview(id: number): Promise<{ review: Review }> {
    return this.request<{ review: Review }>(`/reviews/${id}`);
  }

  async createReview(review: Partial<Review>): Promise<{ review: Review }> {
    return this.request<{ review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ review }),
    });
  }

  async updateReview(id: number, review: Partial<Review>): Promise<{ review: Review }> {
    return this.request<{ review: Review }>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ review }),
    });
  }

  async deleteReview(id: number): Promise<void> {
    return this.request<void>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async getReviewStats(lawyer_id?: number): Promise<{
    stats: {
      total_reviews: number;
      average_rating: number;
      rating_distribution: Record<string, number>;
    }
  }> {
    const searchParams = new URLSearchParams();
    if (lawyer_id) searchParams.append('lawyer_id', lawyer_id.toString());
    
    const query = searchParams.toString();
    const endpoint = `/reviews/stats${query ? `?${query}` : ''}`;
    
    return this.request<{
      stats: {
        total_reviews: number;
        average_rating: number;
        rating_distribution: Record<string, number>;
      }
    }>(endpoint);
  }

  // Specializations API
  async getSpecializations(params?: {
    search?: string;
  }): Promise<{ specializations: Specialization[] }> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);

    const query = searchParams.toString();
    const endpoint = `/specializations${query ? `?${query}` : ''}`;
    
    return this.request<{ specializations: Specialization[] }>(endpoint);
  }

  async getSpecialization(id: number): Promise<{ specialization: Specialization }> {
    return this.request<{ specialization: Specialization }>(`/specializations/${id}`);
  }

  async createSpecialization(specialization: Partial<Specialization>): Promise<{ specialization: Specialization }> {
    return this.request<{ specialization: Specialization }>('/specializations', {
      method: 'POST',
      body: JSON.stringify({ specialization }),
    });
  }

  async updateSpecialization(id: number, specialization: Partial<Specialization>): Promise<{ specialization: Specialization }> {
    return this.request<{ specialization: Specialization }>(`/specializations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ specialization }),
    });
  }

  async deleteSpecialization(id: number): Promise<void> {
    return this.request<void>(`/specializations/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const lawyersApi = {
  getAll: (params?: Parameters<typeof apiClient.getLawyers>[0]) => apiClient.getLawyers(params),
  getById: (id: number) => apiClient.getLawyer(id),
  create: (lawyer: Partial<Lawyer>) => apiClient.createLawyer(lawyer),
  update: (id: number, lawyer: Partial<Lawyer>) => apiClient.updateLawyer(id, lawyer),
  delete: (id: number) => apiClient.deleteLawyer(id),
};

export const appointmentsApi = {
  getAll: (params?: Parameters<typeof apiClient.getAppointments>[0]) => apiClient.getAppointments(params),
  getById: (id: number) => apiClient.getAppointment(id),
  create: (appointment: Partial<Appointment>) => apiClient.createAppointment(appointment),
  update: (id: number, appointment: Partial<Appointment>) => apiClient.updateAppointment(id, appointment),
  delete: (id: number) => apiClient.deleteAppointment(id),
  getAvailableSlots: (lawyer_id: number, date: string) => apiClient.getAvailableSlots(lawyer_id, date),
};

export const reviewsApi = {
  getAll: (params?: Parameters<typeof apiClient.getReviews>[0]) => apiClient.getReviews(params),
  getById: (id: number) => apiClient.getReview(id),
  create: (review: Partial<Review>) => apiClient.createReview(review),
  update: (id: number, review: Partial<Review>) => apiClient.updateReview(id, review),
  delete: (id: number) => apiClient.deleteReview(id),
  getStats: (lawyer_id?: number) => apiClient.getReviewStats(lawyer_id),
};

export const specializationsApi = {
  getAll: (params?: Parameters<typeof apiClient.getSpecializations>[0]) => apiClient.getSpecializations(params),
  getById: (id: number) => apiClient.getSpecialization(id),
  create: (specialization: Partial<Specialization>) => apiClient.createSpecialization(specialization),
  update: (id: number, specialization: Partial<Specialization>) => apiClient.updateSpecialization(id, specialization),
  delete: (id: number) => apiClient.deleteSpecialization(id),
};

export default apiClient;