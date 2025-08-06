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
}