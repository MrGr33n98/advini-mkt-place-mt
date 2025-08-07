"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Phone, Mail, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Lawyer } from "@/types/lawyer";

interface ContactFormProps {
  lawyer: Lawyer;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  urgency: "low" | "medium" | "high";
  preferredContact: "email" | "phone" | "whatsapp";
  acceptTerms: boolean;
}

export function ContactForm({ lawyer }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    urgency: "medium",
    preferredContact: "email",
    acceptTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
      const contactData = {
        ...formData,
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        timestamp: new Date().toISOString(),
        source: "contact_form"
      };

      // Salvar no localStorage como simulação
      const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]");
      existingLeads.push({
        id: Date.now(),
        ...contactData,
        status: "new"
      });
      localStorage.setItem("leads", JSON.stringify(existingLeads));

      toast.success("Mensagem enviada com sucesso! O advogado entrará em contato em breve.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        urgency: "medium",
        preferredContact: "email",
        acceptTerms: false,
      });

    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Entrar em Contato com {lawyer.name}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assunto e Urgência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Assunto da sua consulta"
                required
              />
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
                  <SelectItem value="low">Baixa - Posso aguardar alguns dias</SelectItem>
                  <SelectItem value="medium">Média - Gostaria de resposta em 24h</SelectItem>
                  <SelectItem value="high">Alta - Preciso de resposta urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Descreva seu caso ou dúvida jurídica..."
              rows={5}
              required
            />
          </div>

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
              e{" "}
              <a href="/privacidade" className="text-primary hover:underline">
                política de privacidade
              </a>
              . Autorizo o contato para esclarecimentos sobre minha solicitação.
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
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}