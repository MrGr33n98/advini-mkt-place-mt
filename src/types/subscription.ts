export interface Subscription {
  id: string;
  lawyer_id: string;
  tier: 'free' | 'pro';
  start_date: string;
  end_date?: string;
  features?: Record<string, any>;
}