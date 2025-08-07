"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Users, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ROIData {
  averageClientValue: number;
  currentClients: number;
  expectedGrowth: number;
  conversionRate: number;
}

interface ROIResults {
  monthlyROI: number;
  yearlyROI: number;
  newClientsPerMonth: number;
  additionalRevenue: number;
  paybackPeriod: number;
  profitMargin: number;
}

export function ROICalculator() {
  const [data, setData] = useState<ROIData>({
    averageClientValue: 2500,
    currentClients: 10,
    expectedGrowth: 30,
    conversionRate: 15
  });

  const [results, setResults] = useState<ROIResults>({
    monthlyROI: 0,
    yearlyROI: 0,
    newClientsPerMonth: 0,
    additionalRevenue: 0,
    paybackPeriod: 0,
    profitMargin: 0
  });

  const [selectedPlan, setSelectedPlan] = useState<'silver' | 'gold'>('gold');

  const plans = {
    silver: { name: 'Silver', price: 79.90, multiplier: 1 },
    gold: { name: 'Gold', price: 159.90, multiplier: 1.8 }
  };

  useEffect(() => {
    calculateROI();
  }, [data.averageClientValue, data.currentClients, data.conversionRate, selectedPlan]);

  const calculateROI = () => {
    const plan = plans[selectedPlan];
    const monthlyInvestment = plan.price;
    
    // Cálculo baseado em dados reais do mercado jurídico
    const baseLeadsPerMonth = 20 * plan.multiplier;
    const conversionRate = data.conversionRate / 100;
    const newClientsPerMonth = baseLeadsPerMonth * conversionRate;
    const additionalRevenue = newClientsPerMonth * data.averageClientValue;
    
    const monthlyROI = ((additionalRevenue - monthlyInvestment) / monthlyInvestment) * 100;
    const yearlyROI = monthlyROI * 12;
    const paybackPeriod = monthlyInvestment / (additionalRevenue - monthlyInvestment);
    const profitMargin = ((additionalRevenue - monthlyInvestment) / additionalRevenue) * 100;

    setResults({
      monthlyROI,
      yearlyROI,
      newClientsPerMonth,
      additionalRevenue,
      paybackPeriod: Math.max(0.1, paybackPeriod),
      profitMargin
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Calculadora de ROI</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Descubra quanto você pode ganhar investindo em sua presença digital
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Configurações do Cálculo
            </CardTitle>
            <CardDescription>
              Ajuste os valores conforme seu perfil profissional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Plano */}
            <div className="space-y-3">
              <Label>Plano Escolhido</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(plans).map(([key, plan]) => (
                  <Button
                    key={key}
                    variant={selectedPlan === key ? "default" : "outline"}
                    onClick={() => setSelectedPlan(key as 'silver' | 'gold')}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <span className="font-semibold">{plan.name}</span>
                    <span className="text-sm">{formatCurrency(plan.price)}/mês</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Valor Médio por Cliente */}
            <div className="space-y-3">
              <Label>Valor Médio por Cliente</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={data.averageClientValue}
                  onChange={(e) => setData(prev => ({ 
                    ...prev, 
                    averageClientValue: Number(e.target.value) 
                  }))}
                  placeholder="Ex: 2500"
                />
                <div className="text-sm text-muted-foreground">
                  Valor médio que você cobra por caso/cliente
                </div>
              </div>
            </div>

            {/* Taxa de Conversão */}
            <div className="space-y-3">
              <Label>Taxa de Conversão Esperada: {formatPercentage(data.conversionRate)}</Label>
              <Slider
                value={[data.conversionRate]}
                onValueChange={(value) => setData(prev => ({ 
                  ...prev, 
                  conversionRate: value[0] 
                }))}
                max={50}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                Porcentagem de leads que se tornam clientes
              </div>
            </div>

            {/* Clientes Atuais */}
            <div className="space-y-3">
              <Label>Clientes Atuais por Mês</Label>
              <Input
                type="number"
                value={data.currentClients}
                onChange={(e) => setData(prev => ({ 
                  ...prev, 
                  currentClients: Number(e.target.value) 
                }))}
                placeholder="Ex: 10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Projeção de Resultados
            </CardTitle>
            <CardDescription>
              Baseado no plano {plans[selectedPlan].name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ROI Mensal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPercentage(results.monthlyROI)}
                </div>
                <div className="text-sm text-muted-foreground">ROI Mensal</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPercentage(results.yearlyROI)}
                </div>
                <div className="text-sm text-muted-foreground">ROI Anual</div>
              </div>
            </div>

            {/* Métricas Principais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Novos clientes/mês</span>
                </div>
                <Badge variant="secondary">
                  {results.newClientsPerMonth.toFixed(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="text-sm">Receita adicional/mês</span>
                </div>
                <Badge variant="secondary">
                  {formatCurrency(results.additionalRevenue)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">Tempo para retorno</span>
                </div>
                <Badge variant="secondary">
                  {results.paybackPeriod.toFixed(1)} dias
                </Badge>
              </div>
            </div>

            {/* Resumo Anual */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h4 className="font-semibold mb-2">Projeção Anual</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Investimento total:</span>
                  <span className="font-medium">{formatCurrency(plans[selectedPlan].price * 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Receita adicional:</span>
                  <span className="font-medium">{formatCurrency(results.additionalRevenue * 12)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Lucro líquido:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency((results.additionalRevenue - plans[selectedPlan].price) * 12)}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <Button className="w-full" size="lg">
              Começar com o Plano {plans[selectedPlan].name}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            * Os cálculos são baseados em médias do mercado jurídico e podem variar conforme 
            sua área de atuação, região e estratégia de marketing. Resultados passados não 
            garantem resultados futuros.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}