export type PlanType = 'basic' | 'silver' | 'gold';

export interface Lawyer {
  id: string;
  user_id?: string;
  name: string;
  specialties: string[];
  latitude: number;
  longitude: number;
  slug: string;
  bio?: string;
  oab?: string;
  phone?: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
  whatsapp_url?: string;
  banner_url?: string;
  logo_url?: string;
  average_rating?: number;
  total_reviews?: number;
  badges?: string[];
  hourly_rate?: number; // Valor por hora em R$
  consultation_fee?: number; // Taxa de consulta em R$
  plan: PlanType; // Plano do advogado (Basic, Silver, Gold)
  is_featured?: boolean; // Se o advogado está em destaque
  plan_expires_at?: string; // Data de expiração do plano
}