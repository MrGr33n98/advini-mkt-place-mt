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
  email: string;
  created_at: string;
  updated_at: string;
  posts_count: number;
  comments_count: number;
  posts?: Partial<RailsPost>[];
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
  getAll: (page = 1, perPage = 10) => 
    railsApi.get(`/users?page=${page}&per_page=${perPage}`),
  
  getById: (id: number) => 
    railsApi.get(`/users/${id}`),
  
  create: (user: { email: string; password: string; password_confirmation: string }) => 
    railsApi.post('/users', { user }),
  
  update: (id: number, user: Partial<{ email: string; password: string }>) => 
    railsApi.patch(`/users/${id}`, { user }),
  
  delete: (id: number) => 
    railsApi.delete(`/users/${id}`),
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