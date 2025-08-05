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
}