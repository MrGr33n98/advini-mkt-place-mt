'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { TimeSlot, LawyerAvailability } from '@/types/appointment';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCalendarProps {
  lawyerId: string;
  onDateTimeSelect: (date: Date, timeSlot: TimeSlot) => void;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
}

// Mock data para disponibilidade do advogado
const mockAvailability: LawyerAvailability[] = [
  {
    lawyerId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlots: [
      { id: '1', time: '09:00', available: true, duration: 60 },
      { id: '2', time: '10:00', available: false, duration: 60 },
      { id: '3', time: '11:00', available: true, duration: 60 },
      { id: '4', time: '14:00', available: true, duration: 60 },
      { id: '5', time: '15:00', available: true, duration: 60 },
      { id: '6', time: '16:00', available: false, duration: 60 },
    ],
    appointmentTypes: []
  },
  {
    lawyerId: '',
    date: addDays(new Date(), 1).toISOString().split('T')[0],
    timeSlots: [
      { id: '7', time: '09:00', available: true, duration: 60 },
      { id: '8', time: '10:00', available: true, duration: 60 },
      { id: '9', time: '11:00', available: false, duration: 60 },
      { id: '10', time: '14:00', available: true, duration: 60 },
      { id: '11', time: '15:00', available: true, duration: 60 },
      { id: '12', time: '16:00', available: true, duration: 60 },
    ],
    appointmentTypes: []
  },
  {
    lawyerId: '',
    date: addDays(new Date(), 2).toISOString().split('T')[0],
    timeSlots: [
      { id: '13', time: '09:00', available: false, duration: 60 },
      { id: '14', time: '10:00', available: true, duration: 60 },
      { id: '15', time: '11:00', available: true, duration: 60 },
      { id: '16', time: '14:00', available: false, duration: 60 },
      { id: '17', time: '15:00', available: true, duration: 60 },
      { id: '18', time: '16:00', available: true, duration: 60 },
    ],
    appointmentTypes: []
  }
];

export function AppointmentCalendar({ 
  lawyerId, 
  onDateTimeSelect, 
  selectedDate, 
  selectedTimeSlot 
}: AppointmentCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Simular carregamento de horários disponíveis
  useEffect(() => {
    if (date) {
      setLoading(true);
      // Simular delay de API
      setTimeout(() => {
        const dateString = date.toISOString().split('T')[0];
        const dayAvailability = mockAvailability.find(avail => 
          avail.date === dateString
        );
        setAvailableSlots(dayAvailability?.timeSlots || []);
        setLoading(false);
      }, 500);
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && isAfter(selectedDate, startOfDay(new Date()))) {
      setDate(selectedDate);
    }
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (date && timeSlot.available) {
      onDateTimeSelect(date, timeSlot);
    }
  };

  const isDateDisabled = (date: Date) => {
    return !isAfter(date, startOfDay(new Date()));
  };

  const getAvailableSlotsCount = (checkDate: Date) => {
    const dateString = checkDate.toISOString().split('T')[0];
    const dayAvailability = mockAvailability.find(avail => 
      avail.date === dateString
    );
    return dayAvailability?.timeSlots.filter(slot => slot.available).length || 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Selecione uma Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            locale={ptBR}
            className="rounded-md border"
            modifiers={{
              hasSlots: (date) => getAvailableSlotsCount(date) > 0
            }}
            modifiersStyles={{
              hasSlots: { 
                backgroundColor: 'hsl(var(--primary))', 
                color: 'hsl(var(--primary-foreground))',
                fontWeight: 'bold'
              }
            }}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            <p>• Datas em destaque possuem horários disponíveis</p>
            <p>• Selecione uma data para ver os horários</p>
          </div>
        </CardContent>
      </Card>

      {/* Horários Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle>
            {date ? (
              <>Horários para {format(date, "dd 'de' MMMM", { locale: ptBR })}</>
            ) : (
              'Selecione uma data'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!date ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione uma data no calendário para ver os horários disponíveis</p>
            </div>
          ) : loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p>Nenhum horário disponível para esta data</p>
              <p className="text-sm">Tente selecionar outra data</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={
                    selectedTimeSlot?.time === slot.time ? "default" : 
                    slot.available ? "outline" : "secondary"
                  }
                  disabled={!slot.available}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className="h-12 flex items-center justify-between"
                >
                  <span>{slot.time}</span>
                  {slot.available ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              ))}
            </div>
          )}
          
          {availableSlots.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duração da consulta:</span>
                <Badge variant="secondary">60 minutos</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}