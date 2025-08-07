'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Download,
  Share2,
  MessageCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';

interface AppointmentConfirmationProps {
  appointment: Appointment;
  onNewAppointment: () => void;
  onDownloadConfirmation: () => void;
}

export function AppointmentConfirmation({ 
  appointment, 
  onNewAppointment,
  onDownloadConfirmation 
}: AppointmentConfirmationProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    
    const shareData = {
      title: 'Agendamento Confirmado',
      text: `Consulta agendada para ${format(appointment.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores que não suportam Web Share API
        await navigator.clipboard.writeText(
          `Agendamento confirmado!\nData: ${format(appointment.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}\nAdvogado: ${appointment.lawyerName}`
        );
        alert('Informações copiadas para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setSharing(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'alta': return 'Alta Urgência';
      case 'media': return 'Urgência Média';
      case 'baixa': return 'Baixa Urgência';
      default: return urgency;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header de Sucesso */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Agendamento Confirmado!</h1>
              <p className="text-green-700 mt-2">
                Sua consulta foi agendada com sucesso. Você receberá uma confirmação por email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data e Hora */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">
                  {format(appointment.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(appointment.date, "HH:mm", { locale: ptBR })} - Duração: {appointment.duration} minutos
                </p>
              </div>
            </div>
            <Badge variant={getUrgencyColor(appointment.urgency)}>
              {getUrgencyLabel(appointment.urgency)}
            </Badge>
          </div>

          <Separator />

          {/* Informações do Advogado */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Advogado
            </h3>
            <div className="pl-6 space-y-2">
              <p className="font-medium">{appointment.lawyerName}</p>
            </div>
          </div>

          <Separator />

          {/* Tipo de Consulta */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tipo de Consulta
            </h3>
            <div className="pl-6 space-y-2">
              <p className="font-medium">{appointment.type}</p>
              <p className="text-sm text-muted-foreground">Valor: R$ {appointment.price}</p>
            </div>
          </div>

          <Separator />

          {/* Dados do Cliente */}
          <div className="space-y-3">
            <h3 className="font-semibold">Seus Dados</h3>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.clientEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.clientPhone}</span>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold">Observações</h3>
                <div className="pl-6">
                  <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Confirmação por Email</p>
                <p className="text-sm text-muted-foreground">
                  Você receberá um email de confirmação com todos os detalhes em até 5 minutos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Lembrete Automático</p>
                <p className="text-sm text-muted-foreground">
                  Enviaremos um lembrete 24 horas antes da consulta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Preparação</p>
                <p className="text-sm text-muted-foreground">
                  Organize seus documentos e prepare suas dúvidas para a consulta.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onDownloadConfirmation} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Baixar Confirmação
        </Button>
        
        <Button onClick={handleShare} variant="outline" className="flex-1" disabled={sharing}>
          <Share2 className="mr-2 h-4 w-4" />
          {sharing ? 'Compartilhando...' : 'Compartilhar'}
        </Button>
        
        <Button 
          onClick={() => window.open(`https://wa.me/5565999999999?text=Olá! Gostaria de confirmar meu agendamento para ${format(appointment.date, "dd/MM/yyyy 'às' HH:mm")}.`, '_blank')}
          variant="outline" 
          className="flex-1"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>
        
        <Button onClick={onNewAppointment} className="flex-1">
          <Calendar className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {/* Informações Importantes */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-amber-800">Informações Importantes</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Chegue 10 minutos antes do horário agendado</li>
              <li>• Traga um documento de identificação válido</li>
              <li>• Para cancelamentos, entre em contato com até 24h de antecedência</li>
              <li>• Em caso de atraso, a consulta pode ser remarcada</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}