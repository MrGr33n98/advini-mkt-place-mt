export interface LawFirm {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  founded_year?: number;
  lawyers_count: number;
  average_rating: number;
  total_reviews: number;
  plan: 'basic' | 'silver' | 'gold';
  is_featured: boolean;
  plan_expires_at: string;
  cnpj: string;
  oab_registration?: string;
  services: string[];
  office_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
}