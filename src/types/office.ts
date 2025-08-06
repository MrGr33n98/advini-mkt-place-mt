import { Lawyer } from './lawyer';
import { Review } from './review';

export interface Office {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  banner_url?: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  plan_tier: 'basic' | 'silver' | 'gold';
  is_sponsored: boolean;
  specialties: string[];
  lawyers: Pick<Lawyer, 'id' | 'name' | 'slug' | 'oab' | 'specialties'>[];
  reviews: Review[];
  rating?: number;
  business_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}