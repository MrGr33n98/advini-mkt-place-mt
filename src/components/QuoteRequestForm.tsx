"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calculator, FileText, DollarSign, Send, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Lawyer } from "@/types/lawyer";

interface QuoteRequestFormProps {
  lawyer: Lawyer;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  legalArea: string;
  caseType: string;
  caseDescription: string;
  urgency: "low" | "medium" | "high";
  budget: string;
  serviceType: "consultation" | "representation" | "document" | "other";
  hasDocuments: boolean;
  preferredContact: "email" | "phone" | "whatsapp";
  acceptTerms: boolean;
}

const legalAreas = [
  "Direito Civil",
  "Direito de Família",
  "Direito Trabalhista",
  "Direito Penal",
  "Direito Empresarial",
  "Direito do Consumidor",
  "Direito Imobiliário",
  "Direito Previdenciário",
  "Direito Tributário",
  "Outro"
];

const caseTypes = {
  "Direito Civil": ["Contratos", "Responsabilidade Civil", "Danos Morais", "Cobrança"],
  "Direito de Família": ["Divórcio", "Pensão Alimentícia", "Guarda", "Inventário"],
  "Direito Trabalhista": ["Rescisão", "Horas Extras", "Assédio", "FGTS"],
  "Direito Penal": ["Defesa Criminal", "Habeas Corpus", "Inquérito", "Recurso"],
  "Direito Empresarial": ["Constituição", "Contratos", "Recuperação", "Dissolução"],
  "Direito do Consumidor": ["Produto Defeituoso", "Serviço Inadequado", "Cobrança Indevida"],
  "Direito Imobiliário": ["Compra e Venda", "Locação", "Usucapião", "Regularização"],
  "Direito Previdenciário": ["Aposentadoria", "Auxílio", "Revisão", "BPC"],
  "Direito Tributário": ["Sonegação", "Parcelamento", "Restituição", "Planejamento"]
};

export function QuoteRequestForm({ lawyer }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: "",
    email: "",
    phone: "",
    legalArea: "",
    caseType: "",
    caseDescription: "",
    urgency: "medium",
    budget: "",
    serviceType: "consultation",
    hasDocuments: false,
    preferredContact: "email",
    acceptTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof QuoteFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLegalAreaChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      legalArea: value,
      caseType: "" // Reset case type when area changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast.error("Você deve aceitar os termos para continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria feita a integração com o backend
      const quoteData = {
        ...formData,
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        timestamp: new Date().toISOString(),
        source: "quote_request",
        estimatedValue: calculateEstimatedValue()
      };

      // Salvar no localStorage como simulação
      const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]");
      existingLeads.push({
        id: Date.now(),
        ...quoteData,
        status: "quote_requested"
      });
      localStorage.setItem("leads", JSON.stringify(existingLeads));

      toast.success("Solicitação de orçamento enviada! O advogado entrará em contato com uma proposta personalizada.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        legalArea: "",
        caseType: "",
        caseDescription: "",
        urgency: "medium",
        budget: "",
        serviceType: "consultation",
        hasDocuments: false,
        preferredContact: "email",
        acceptTerms: false,
      });

    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedValue = () => {
    // Lógica simples para estimar valor baseado no tipo de serviço
    const baseValues = {
      consultation: lawyer.consultation_fee || 200,
      representation: (lawyer.hourly_rate || 300) * 10,
      document: (lawyer.hourly_rate || 300) * 2,
      other: lawyer.hourly_rate || 300
    };
    
    return baseValues[formData.serviceType];
  };

  const availableCaseTypes = formData.legalArea ? 
    caseTypes[formData.legalArea as keyof typeof caseTypes] || [] : [];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Solicitar Orçamento - {lawyer.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone/WhatsApp *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="(65) 99999-9999"
              required
            />
          </div>

          {/* Área Jurídica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legalArea">Área Jurídica *</Label>
              <Select
                value={formData.legalArea}
                onValueChange={handleLegalAreaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  {legalAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseType">Tipo de Caso</Label>
              <Select
                value={formData.caseType}
                onValueChange={(value) => handleInputChange("caseType", value)}
                disabled={!formData.legalArea}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {availableCaseTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div className="space-y-3">
            <Label>Tipo de Serviço Desejado *</Label>
            <RadioGroup
              value={formData.serviceType}
              onValueChange={(value) => handleInputChange("serviceType", value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consultation" id="consultation" />
                <Label htmlFor="consultation">Consulta Jurídica</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="representation" id="representation" />
                <Label htmlFor="representation">Representação Legal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="document" id="document" />
                <Label htmlFor="document">Elaboração de Documentos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Outro</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Descrição do Caso */}
          <div className="space-y-2">
            <Label htmlFor="caseDescription">Descrição do Caso *</Label>
            <Textarea
              id="caseDescription"
              value={formData.caseDescription}
              onChange={(e) => handleInputChange("caseDescription", e.target.value)}
              placeholder="Descreva detalhadamente seu caso, incluindo datas importantes, valores envolvidos e documentos disponíveis..."
              rows={5}
              required
            />
          </div>

          {/* Orçamento e Urgência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento Disponível</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => handleInputChange("budget", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Faixa de orçamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up-to-500">Até R$ 500</SelectItem>
                  <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                  <SelectItem value="1000-2500">R$ 1.000 - R$ 2.500</SelectItem>
                  <SelectItem value="2500-5000">R$ 2.500 - R$ 5.000</SelectItem>
                  <SelectItem value="5000-plus">Acima de R$ 5.000</SelectItem>
                  <SelectItem value="to-discuss">A discutir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgência</Label>
              <Select
                value={formData.urgency}
                onValueChange={(value) => handleInputChange("urgency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa - Posso aguardar</SelectItem>
                  <SelectItem value="medium">Média - Algumas semanas</SelectItem>
                  <SelectItem value="high">Alta - Preciso urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documentos */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="hasDocuments"
              checked={formData.hasDocuments}
              onCheckedChange={(checked) => handleInputChange("hasDocuments", checked as boolean)}
            />
            <Label htmlFor="hasDocuments" className="text-sm">
              Possuo documentos relacionados ao caso que podem ser enviados
            </Label>
          </div>

          {/* Forma de Contato */}
          <div className="space-y-2">
            <Label htmlFor="preferredContact">Forma Preferida de Contato</Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) => handleInputChange("preferredContact", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="phone">Telefone</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valor Estimado */}
          {formData.serviceType && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Valor Estimado</span>
              </div>
              <p className="text-blue-700">
                Baseado no tipo de serviço selecionado: <strong>R$ {calculateEstimatedValue()}</strong>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                * Este é apenas um valor estimado. O orçamento final será personalizado conforme seu caso.
              </p>
            </div>
          )}

          {/* Termos */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed">
              Aceito os{" "}
              <a href="/termos" className="text-primary hover:underline">
                termos de uso
              </a>{" "}
              e autorizo o contato para apresentação de orçamento personalizado.
            </Label>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !formData.acceptTerms}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando Solicitação...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Solicitar Orçamento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}