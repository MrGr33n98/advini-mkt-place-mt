export interface Lawyer {
  id: string;
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
  whatsappUrl?: string;
  bannerUrl?: string;
  logoUrl?: string;
  subscription?: {
    tier: 'free' | 'pro';
    expiresAt: string;
  };
  averageRating?: number;
  totalReviews?: number;
  badges?: string[];
}