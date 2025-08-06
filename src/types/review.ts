export interface Review {
  id: string;
  lawyer_id?: string;
  office_id?: string;
  client_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  is_pinned?: boolean;
  created_at: string;
  lawyer_response?: {
    message: string;
    created_at: string;
  };
  helpful_votes?: number;
  case_type?: string;
}