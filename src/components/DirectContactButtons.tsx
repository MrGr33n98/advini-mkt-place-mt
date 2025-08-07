"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Copy, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Lawyer } from "@/types/lawyer";

interface DirectContactButtonsProps {
  lawyer: Lawyer;
  variant?: "default" | "compact" | "expanded";
  showAvailability?: boolean;
}

export function DirectContactButtons({ 
  lawyer, 
  variant = "default",
  showAvailability = true 
}: DirectContactButtonsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleWhatsAppClick = () => {
    if (lawyer.whatsapp_url || lawyer.phone) {
      const url = lawyer.whatsapp_url || `https://wa.me/${lawyer.phone?.replace(/\D/g, '')}`;
      window.open(url, '_blank');
      
      // Track lead
      trackLead('whatsapp_click');
      toast.success("Redirecionando para WhatsApp...");
    } else {
      toast.error("WhatsApp não disponível para este advogado.");
    }
  };

  const handleCallClick = () => {
    if (lawyer.phone) {
      window.open(`tel:${lawyer.phone}`, '_self');
      trackLead('phone_call');
      toast.success("Iniciando chamada...");
    } else {
      toast.error("Telefone não disponível para este advogado.");
    }
  };

  const handleEmailClick = () => {
    if (lawyer.email) {
      const subject = encodeURIComponent(`Consulta Jurídica - ${lawyer.name}`);
      const body = encodeURIComponent(`Olá ${lawyer.name},\n\nGostaria de agendar uma consulta jurídica.\n\nAguardo seu contato.\n\nAtenciosamente.`);
      window.open(`mailto:${lawyer.email}?subject=${subject}&body=${body}`, '_self');
      trackLead('email_click');
      toast.success("Abrindo cliente de e-mail...");
    } else {
      toast.error("E-mail não disponível para este advogado.");
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(type);
      toast.success(`${type} copiado para a área de transferência!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("Erro ao copiar. Tente novamente.");
    }
  };

  const trackLead = (action: string) => {
    const leadData = {
      id: Date.now(),
      lawyerId: lawyer.id,
      lawyerName: lawyer.name,
      action,
      timestamp: new Date().toISOString(),
      source: "direct_contact",
      status: "contacted"
    };

    const existingLeads = JSON.parse(localStorage.getItem("leads") || "[]");
    existingLeads.push(leadData);
    localStorage.setItem("leads", JSON.stringify(existingLeads));
  };

  const getAvailabilityStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Assumindo horário comercial: Segunda a Sexta, 8h às 18h
    const isBusinessDay = currentDay >= 1 && currentDay <= 5;
    const isBusinessHour = currentHour >= 8 && currentHour < 18;
    
    if (isBusinessDay && isBusinessHour) {
      return { status: "online", message: "Disponível agora" };
    } else if (isBusinessDay) {
      return { status: "away", message: "Fora do horário comercial" };
    } else {
      return { status: "offline", message: "Indisponível (fim de semana)" };
    }
  };

  const availability = getAvailabilityStatus();

  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleWhatsAppClick}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={!lawyer.whatsapp_url && !lawyer.phone}
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleCallClick}
          disabled={!lawyer.phone}
        >
          <Phone className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleEmailClick}
          disabled={!lawyer.email}
        >
          <Mail className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  if (variant === "expanded") {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {showAvailability && (
              <div className="flex items-center gap-2 mb-4">
                {availability.status === "online" && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {availability.status === "away" && (
                  <Clock className="w-4 h-4 text-yellow-500" />
                )}
                {availability.status === "offline" && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  {availability.message}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {/* WhatsApp */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      {lawyer.phone || "Não disponível"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {lawyer.phone && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(lawyer.phone!, "Telefone")}
                    >
                      {copiedField === "Telefone" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={!lawyer.whatsapp_url && !lawyer.phone}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">
                      {lawyer.phone || "Não disponível"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {lawyer.phone && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(lawyer.phone!, "Telefone")}
                    >
                      {copiedField === "Telefone" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCallClick}
                    disabled={!lawyer.phone}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      {lawyer.email || "Não disponível"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {lawyer.email && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(lawyer.email!, "E-mail")}
                    >
                      {copiedField === "E-mail" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEmailClick}
                    disabled={!lawyer.email}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Horário de Atendimento */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Horário de Atendimento</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Segunda a Sexta: 8h às 18h
              </p>
              <p className="text-sm text-muted-foreground">
                Sábado: 8h às 12h (apenas emergências)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      {showAvailability && (
        <div className="flex items-center gap-2 mb-2">
          {availability.status === "online" && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              {availability.message}
            </Badge>
          )}
          {availability.status === "away" && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              <Clock className="w-3 h-3 mr-1" />
              {availability.message}
            </Badge>
          )}
          {availability.status === "offline" && (
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              {availability.message}
            </Badge>
          )}
        </div>
      )}

      <Button 
        onClick={handleWhatsAppClick}
        className="bg-green-600 hover:bg-green-700 text-white"
        disabled={!lawyer.whatsapp_url && !lawyer.phone}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleCallClick}
        disabled={!lawyer.phone}
      >
        <Phone className="w-4 h-4 mr-2" />
        Ligar
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleEmailClick}
        disabled={!lawyer.email}
      >
        <Mail className="w-4 h-4 mr-2" />
        E-mail
      </Button>
      
      <Button variant="outline">
        <Calendar className="w-4 h-4 mr-2" />
        Agendar
      </Button>
    </div>
  );
}