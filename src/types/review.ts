export interface Review {
  id: string;
  lawyerId: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isPinned?: boolean;
}