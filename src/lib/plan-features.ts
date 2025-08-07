export type PlanType = 'basic' | 'silver' | 'gold';

export interface PlanFeatures {
  // Comunicação
  chatMessages: number | 'unlimited';
  whatsappIntegration: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  
  // Agendamento
  monthlyAppointments: number | 'unlimited';
  calendarIntegration: boolean;
  automaticReminders: boolean;
  reschedulingOptions: boolean;
  
  // Analytics
  basicAnalytics: boolean;
  advancedAnalytics: boolean;
  customReports: boolean;
  competitorAnalysis: boolean;
  
  // Marketing
  profileOptimization: boolean;
  seoTools: boolean;
  socialMediaIntegration: boolean;
  leadTracking: boolean;
  
  // Customização
  customBranding: boolean;
  customDomain: boolean;
  advancedCustomization: boolean;
  
  // Suporte
  supportHours: string;
  responseTime: string;
  dedicatedManager: boolean;
  
  // Limites
  storageLimit: string;
  bandwidthLimit: string;
  apiCalls: number | 'unlimited';
}

export const planFeatures: Record<PlanType, PlanFeatures> = {
  basic: {
    // Comunicação
    chatMessages: 100,
    whatsappIntegration: false,
    emailSupport: true,
    prioritySupport: false,
    
    // Agendamento
    monthlyAppointments: 20,
    calendarIntegration: false,
    automaticReminders: false,
    reschedulingOptions: false,
    
    // Analytics
    basicAnalytics: true,
    advancedAnalytics: false,
    customReports: false,
    competitorAnalysis: false,
    
    // Marketing
    profileOptimization: true,
    seoTools: false,
    socialMediaIntegration: false,
    leadTracking: false,
    
    // Customização
    customBranding: false,
    customDomain: false,
    advancedCustomization: false,
    
    // Suporte
    supportHours: 'Business hours',
    responseTime: '48h',
    dedicatedManager: false,
    
    // Limites
    storageLimit: '1GB',
    bandwidthLimit: '10GB',
    apiCalls: 1000,
  },
  
  silver: {
    // Comunicação
    chatMessages: 500,
    whatsappIntegration: true,
    emailSupport: true,
    prioritySupport: false,
    
    // Agendamento
    monthlyAppointments: 100,
    calendarIntegration: true,
    automaticReminders: true,
    reschedulingOptions: true,
    
    // Analytics
    basicAnalytics: true,
    advancedAnalytics: true,
    customReports: false,
    competitorAnalysis: false,
    
    // Marketing
    profileOptimization: true,
    seoTools: true,
    socialMediaIntegration: true,
    leadTracking: true,
    
    // Customização
    customBranding: true,
    customDomain: false,
    advancedCustomization: false,
    
    // Suporte
    supportHours: 'Extended hours',
    responseTime: '24h',
    dedicatedManager: false,
    
    // Limites
    storageLimit: '10GB',
    bandwidthLimit: '100GB',
    apiCalls: 10000,
  },
  
  gold: {
    // Comunicação
    chatMessages: 'unlimited',
    whatsappIntegration: true,
    emailSupport: true,
    prioritySupport: true,
    
    // Agendamento
    monthlyAppointments: 'unlimited',
    calendarIntegration: true,
    automaticReminders: true,
    reschedulingOptions: true,
    
    // Analytics
    basicAnalytics: true,
    advancedAnalytics: true,
    customReports: true,
    competitorAnalysis: true,
    
    // Marketing
    profileOptimization: true,
    seoTools: true,
    socialMediaIntegration: true,
    leadTracking: true,
    
    // Customização
    customBranding: true,
    customDomain: true,
    advancedCustomization: true,
    
    // Suporte
    supportHours: '24/7',
    responseTime: '2h',
    dedicatedManager: true,
    
    // Limites
    storageLimit: 'Unlimited',
    bandwidthLimit: 'Unlimited',
    apiCalls: 'unlimited',
  },
};

// Hook para verificar se uma feature está disponível
export function useFeatureAccess(userPlan: PlanType) {
  const features = planFeatures[userPlan];
  
  const hasFeature = (featureName: keyof PlanFeatures): boolean => {
    const feature = features[featureName];
    if (typeof feature === 'boolean') {
      return feature;
    }
    return feature !== 0 && feature !== '';
  };
  
  const getFeatureLimit = (featureName: keyof PlanFeatures): number | string => {
    return features[featureName];
  };
  
  const canUseFeature = (featureName: keyof PlanFeatures, currentUsage?: number): boolean => {
    const limit = features[featureName];
    
    if (limit === 'unlimited' || limit === true) {
      return true;
    }
    
    if (typeof limit === 'number' && currentUsage !== undefined) {
      return currentUsage < limit;
    }
    
    return Boolean(limit);
  };
  
  return {
    features,
    hasFeature,
    getFeatureLimit,
    canUseFeature,
  };
}

// Componente para bloquear features
export interface FeatureGateProps {
  feature: keyof PlanFeatures;
  userPlan: PlanType;
  currentUsage?: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

// Utilitários para verificação de features
export const FeatureUtils = {
  // Verifica se o usuário pode enviar mais mensagens
  canSendMessage: (userPlan: PlanType, currentMessages: number): boolean => {
    const limit = planFeatures[userPlan].chatMessages;
    return limit === 'unlimited' || currentMessages < (limit as number);
  },
  
  // Verifica se o usuário pode agendar mais consultas
  canScheduleAppointment: (userPlan: PlanType, currentAppointments: number): boolean => {
    const limit = planFeatures[userPlan].monthlyAppointments;
    return limit === 'unlimited' || currentAppointments < (limit as number);
  },
  
  // Verifica se o usuário pode fazer mais chamadas de API
  canMakeApiCall: (userPlan: PlanType, currentCalls: number): boolean => {
    const limit = planFeatures[userPlan].apiCalls;
    return limit === 'unlimited' || currentCalls < (limit as number);
  },
  
  // Retorna a próxima tier que tem a feature
  getRequiredPlanForFeature: (feature: keyof PlanFeatures): PlanType | null => {
    const plans: PlanType[] = ['basic', 'silver', 'gold'];
    
    for (const plan of plans) {
      const featureValue = planFeatures[plan][feature];
      if (featureValue === true || featureValue === 'unlimited' || (typeof featureValue === 'number' && featureValue > 0)) {
        return plan;
      }
    }
    
    return null;
  },
  
  // Calcula o progresso de uso de uma feature
  getUsageProgress: (userPlan: PlanType, feature: keyof PlanFeatures, currentUsage: number): number => {
    const limit = planFeatures[userPlan][feature];
    
    if (limit === 'unlimited' || limit === true) {
      return 0; // Sem limite
    }
    
    if (typeof limit === 'number') {
      return Math.min((currentUsage / limit) * 100, 100);
    }
    
    return 100; // Feature não disponível
  },
};