export interface Review {
  id: string;
  lawyer_id?: string;
  office_id?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  is_pinned?: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at?: string;
  lawyer_response?: {
    message: string;
    created_at: string;
    is_public: boolean;
  };
  helpful_votes?: number;
  reported_count?: number;
  case_type?: string;
  service_type?: string;
  tags?: string[];
  source: 'website' | 'google' | 'facebook' | 'manual';
  verification_status?: 'verified' | 'unverified' | 'suspicious';
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  pending_reviews: number;
  approved_reviews: number;
  rejected_reviews: number;
  hidden_reviews: number;
  this_month: number;
  last_month: number;
  growth_percentage: number;
  response_rate: number;
  average_response_time: number;
}

export interface ReviewFilters {
  status?: 'all' | 'pending' | 'approved' | 'rejected' | 'hidden';
  rating?: number;
  source?: 'all' | 'website' | 'google' | 'facebook' | 'manual';
  date_range?: {
    start: string;
    end: string;
  };
  search?: string;
  case_type?: string;
  service_type?: string;
  is_pinned?: boolean;
  is_featured?: boolean;
  has_response?: boolean;
  verification_status?: 'all' | 'verified' | 'unverified' | 'suspicious';
}

export interface ReviewTemplate {
  id: string;
  name: string;
  content: string;
  category: 'positive' | 'neutral' | 'negative' | 'general';
  is_default: boolean;
}