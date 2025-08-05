export type SubscriptionTier = 'free' | 'pro';

export interface SubscriptionFeatures {
  customWhatsapp: boolean;
  customBanner: boolean;
  customLogo: boolean;
  reviewModeration: boolean;
  pinnedReviews: boolean;
  badges: boolean;
  analytics: boolean;
}

export interface Subscription {
  id: string;
  lawyerId: string;
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  startDate: string;
  endDate: string;
}