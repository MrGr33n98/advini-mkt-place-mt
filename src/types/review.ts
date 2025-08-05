export interface Review {
  id: string;
  lawyer_id: string;
  client_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  is_pinned?: boolean;
  created_at: string;
}