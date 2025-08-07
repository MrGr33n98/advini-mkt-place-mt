"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Star, 
  Users, 
  Zap,
  Gift,
  History,
  CheckCircle,
  Lock,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  included: boolean;
  premium?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  popular?: boolean;
  features: PlanFeature[];
  color: string;
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    period: "Grátis",
    features: [
      { name: "Perfil básico", included: true },
      { name: "5 agendamentos/mês", included: true },
      { name: "Suporte por email", included: true },
      { name: "Analytics básico", included: false },
      { name: "Chat ilimitado", included: false, premium: true },
      { name: "SEO avançado", included: false, premium: true }
    ],
    color: "gray"
  },
  {
    id: "silver",
    name: "Silver",
    price: 79.90,
    originalPrice: 99.90,
    period: "mês",
    features: [
      { name: "Perfil completo", included: true },
      { name: "50 agendamentos/mês", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Analytics avançado", included: true },
      { name: "Chat ilimitado", included: false, premium: true },
      { name: "SEO avançado", included: false, premium: true }
    ],
    color: "blue"
  },
  {
    id: "gold",
    name: "Gold",
    price: 159.90,
    originalPrice: 199.90,
    period: "mês",
    popular: true,
    features: [
      { name: "Perfil premium", included: true },
      { name: "Agendamentos ilimitados", included: true },
      { name: "Suporte 24/7", included: true },
      { name: "Analytics completo", included: true },
      { name: "Chat ilimitado", included: true },
      { name: "SEO avançado", included: true }
    ],
    color: "yellow"
  }
];

const paymentHistory = [
  {
    id: "1",
    date: "2024-01-15",
    amount: 159.90,
    plan: "Gold",
    status: "paid",
    method: "Cartão ****1234"
  },
  {
    id: "2",
    date: "2023-12-15",
    amount: 159.90,
    plan: "Gold",
    status: "paid",
    method: "Cartão ****1234"
  },
  {
    id: "3",
    date: "2023-11-15",
    amount: 159.90,
    plan: "Gold",
    status: "paid",
    method: "Cartão ****1234"
  }
];

export function PlanManagement() {
  const [currentPlan] = useState("gold");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "save20") {
      setAppliedCoupon("SAVE20 - 20% de desconto aplicado!");
      setCouponCode("");
    } else {
      setAppliedCoupon("Cupom inválido");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Gestão de Plano
        </CardTitle>
        <CardDescription>
          Gerencie sua assinatura e explore recursos premium
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="current">Plano Atual</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="coupons">Cupons</TabsTrigger>
          </TabsList>

          {/* Plano Atual */}
          <TabsContent value="current" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    Plano Gold
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Renovação automática em 15 de Fevereiro
                  </p>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Ativo
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">∞</div>
                  <div className="text-sm text-muted-foreground">Agendamentos</div>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">24/7</div>
                  <div className="text-sm text-muted-foreground">Suporte</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uso de agendamentos este mês</span>
                  <span>47 de ∞</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Alterar Pagamento
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Pausar Assinatura
              </Button>
            </div>
          </TabsContent>

          {/* Upgrade */}
          <TabsContent value="upgrade" className="space-y-4">
            <div className="space-y-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    plan.id === currentPlan 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50",
                    plan.popular && "ring-2 ring-yellow-500 ring-offset-2"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.popular && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {plan.id === currentPlan && (
                        <Badge variant="secondary">Atual</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {plan.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(plan.originalPrice)}
                          </span>
                        )}
                        <span className="text-lg font-bold">
                          {plan.price === 0 ? "Grátis" : formatCurrency(plan.price)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {plan.period !== "Grátis" && `/${plan.period}`}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={cn(
                          feature.included ? "text-foreground" : "text-muted-foreground",
                          feature.premium && !feature.included && "text-yellow-600"
                        )}>
                          {feature.name}
                          {feature.premium && !feature.included && " (Premium)"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.id !== currentPlan && (
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      {plan.price === 0 ? "Fazer Downgrade" : "Fazer Upgrade"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">Plano {payment.plan}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(payment.date)} • {payment.method}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(payment.amount)}</div>
                    <Badge variant="secondary" className="text-xs">
                      Pago
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">
              <History className="h-4 w-4 mr-2" />
              Ver Histórico Completo
            </Button>
          </TabsContent>

          {/* Cupons */}
          <TabsContent value="coupons" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Cupons de Desconto</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Aplique cupons para obter descontos em sua assinatura
              </p>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="coupon">Código do Cupom</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="coupon"
                      placeholder="Digite o código do cupom"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode}>
                      Aplicar
                    </Button>
                  </div>
                </div>
                
                {appliedCoupon && (
                  <div className={cn(
                    "p-3 rounded-lg text-sm",
                    appliedCoupon.includes("inválido") 
                      ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  )}>
                    {appliedCoupon}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Cupons Disponíveis</h4>
              <div className="space-y-2">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SAVE20</div>
                      <div className="text-sm text-muted-foreground">20% de desconto no primeiro mês</div>
                    </div>
                    <Badge variant="outline">Disponível</Badge>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg opacity-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">ANNUAL50</div>
                      <div className="text-sm text-muted-foreground">50% de desconto no plano anual</div>
                    </div>
                    <Badge variant="secondary">Usado</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}