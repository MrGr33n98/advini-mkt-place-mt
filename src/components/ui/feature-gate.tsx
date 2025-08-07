"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock, 
  Crown, 
  TrendingUp, 
  AlertTriangle,
  Zap,
  ArrowRight
} from "lucide-react";
import { 
  PlanType, 
  FeatureGateProps, 
  useFeatureAccess, 
  FeatureUtils,
  planFeatures 
} from "@/lib/plan-features";
import { cn } from "@/lib/utils";

interface FeatureBlockedCardProps {
  feature: string;
  requiredPlan: PlanType;
  currentPlan: PlanType;
  onUpgrade?: () => void;
}

function FeatureBlockedCard({ 
  feature, 
  requiredPlan, 
  currentPlan, 
  onUpgrade 
}: FeatureBlockedCardProps) {
  const planNames = {
    basic: 'Basic',
    silver: 'Silver',
    gold: 'Gold'
  };

  return (
    <Card className="border-dashed border-2 border-muted-foreground/25">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">Feature Premium</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Esta funcionalidade está disponível no plano {planNames[requiredPlan]} ou superior.
        </p>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{planNames[currentPlan]}</Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            {planNames[requiredPlan]}
          </Badge>
        </div>
        {onUpgrade && (
          <Button onClick={onUpgrade} className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Fazer Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface UsageLimitCardProps {
  feature: string;
  current: number;
  limit: number;
  unit?: string;
  onUpgrade?: () => void;
}

function UsageLimitCard({ 
  feature, 
  current, 
  limit, 
  unit = "usos",
  onUpgrade 
}: UsageLimitCardProps) {
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = current >= limit;

  return (
    <Alert className={cn(
      "border-2",
      isAtLimit ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950" :
      isNearLimit ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950" :
      "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
    )}>
      <AlertTriangle className={cn(
        "h-4 w-4",
        isAtLimit ? "text-red-600" :
        isNearLimit ? "text-yellow-600" :
        "text-blue-600"
      )} />
      <AlertDescription className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">
              {isAtLimit ? "Limite atingido" : 
               isNearLimit ? "Próximo do limite" : 
               "Uso atual"}
            </span>
            <span className="text-sm">
              {current} / {limit} {unit}
            </span>
          </div>
          <Progress 
            value={percentage} 
            className={cn(
              "h-2",
              isAtLimit ? "bg-red-100 dark:bg-red-900" :
              isNearLimit ? "bg-yellow-100 dark:bg-yellow-900" :
              "bg-blue-100 dark:bg-blue-900"
            )}
          />
        </div>
        
        {isAtLimit && (
          <div className="text-sm">
            Você atingiu o limite do seu plano atual. Faça upgrade para continuar usando esta funcionalidade.
          </div>
        )}
        
        {isNearLimit && !isAtLimit && (
          <div className="text-sm">
            Você está próximo do limite. Considere fazer upgrade para evitar interrupções.
          </div>
        )}
        
        {onUpgrade && (isAtLimit || isNearLimit) && (
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="flex items-center gap-2"
            variant={isAtLimit ? "default" : "outline"}
          >
            <TrendingUp className="h-4 w-4" />
            {isAtLimit ? "Fazer Upgrade Agora" : "Ver Planos"}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function FeatureGate({
  feature,
  userPlan,
  currentUsage = 0,
  children,
  fallback,
  showUpgrade = true
}: FeatureGateProps) {
  const { canUseFeature, getFeatureLimit } = useFeatureAccess(userPlan);
  const limit = getFeatureLimit(feature);
  const requiredPlan = FeatureUtils.getRequiredPlanForFeature(feature);
  
  const handleUpgrade = () => {
    // Implementar navegação para página de upgrade
    console.log('Navigating to upgrade page...');
  };

  // Se a feature não está disponível no plano atual
  if (!canUseFeature(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showUpgrade && requiredPlan) {
      return (
        <FeatureBlockedCard
          feature={feature}
          requiredPlan={requiredPlan}
          currentPlan={userPlan}
          onUpgrade={handleUpgrade}
        />
      );
    }
    
    return null;
  }

  // Se há limite de uso e está próximo ou atingiu o limite
  if (typeof limit === 'number' && currentUsage !== undefined) {
    const isAtLimit = currentUsage >= limit;
    const isNearLimit = currentUsage >= limit * 0.8;
    
    if (isAtLimit) {
      if (fallback) {
        return <>{fallback}</>;
      }
      
      return (
        <UsageLimitCard
          feature={feature}
          current={currentUsage}
          limit={limit}
          onUpgrade={showUpgrade ? handleUpgrade : undefined}
        />
      );
    }
    
    // Mostrar aviso se próximo do limite
    if (isNearLimit) {
      return (
        <div className="space-y-4">
          <UsageLimitCard
            feature={feature}
            current={currentUsage}
            limit={limit}
            onUpgrade={showUpgrade ? handleUpgrade : undefined}
          />
          {children}
        </div>
      );
    }
  }

  // Feature disponível - renderizar normalmente
  return <>{children}</>;
}

// Hook para usar o FeatureGate de forma programática
export function useFeatureGate(feature: keyof typeof planFeatures.basic, userPlan: PlanType, currentUsage?: number) {
  const { canUseFeature, getFeatureLimit } = useFeatureAccess(userPlan);
  
  const isAvailable = canUseFeature(feature, currentUsage);
  const limit = getFeatureLimit(feature);
  const requiredPlan = FeatureUtils.getRequiredPlanForFeature(feature);
  const usageProgress = typeof limit === 'number' && currentUsage !== undefined 
    ? FeatureUtils.getUsageProgress(userPlan, feature, currentUsage)
    : 0;

  return {
    isAvailable,
    limit,
    requiredPlan,
    usageProgress,
    isNearLimit: usageProgress >= 80,
    isAtLimit: usageProgress >= 100,
  };
}

// Componente para mostrar status de uso de uma feature
interface FeatureUsageIndicatorProps {
  feature: keyof typeof planFeatures.basic;
  userPlan: PlanType;
  currentUsage: number;
  className?: string;
}

export function FeatureUsageIndicator({
  feature,
  userPlan,
  currentUsage,
  className
}: FeatureUsageIndicatorProps) {
  const { limit, usageProgress, isNearLimit, isAtLimit } = useFeatureGate(feature, userPlan, currentUsage);

  if (limit === 'unlimited') {
    return (
      <Badge variant="secondary" className={className}>
        <Zap className="h-3 w-3 mr-1" />
        Ilimitado
      </Badge>
    );
  }

  if (typeof limit === 'number') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "outline"}
          className="flex items-center gap-1"
        >
          {currentUsage} / {limit}
        </Badge>
        {(isNearLimit || isAtLimit) && (
          <AlertTriangle className={cn(
            "h-4 w-4",
            isAtLimit ? "text-red-500" : "text-yellow-500"
          )} />
        )}
      </div>
    );
  }

  return null;
}