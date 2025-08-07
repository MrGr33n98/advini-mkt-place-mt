'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeBlocks } from "./time-blocks"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Plus, Trash2, Calendar, Save } from 'lucide-react'
import { toast } from 'sonner'

interface WorkingHours {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface TimeBlock {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  type: 'blocked' | 'unavailable';
}

const defaultWorkingHours: WorkingHours[] = [
  { day: 'Segunda-feira', isOpen: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  { day: 'Terça-feira', isOpen: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  { day: 'Quarta-feira', isOpen: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  { day: 'Quinta-feira', isOpen: true, startTime: '09:00', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },
  { day: 'Sexta-feira', isOpen: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
  { day: 'Sábado', isOpen: false, startTime: '09:00', endTime: '12:00' },
  { day: 'Domingo', isOpen: false, startTime: '09:00', endTime: '12:00' },
];

const timeOptions = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export function AvailabilitySettings() {
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(defaultWorkingHours);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      date: new Date(2024, 11, 25), // 25 de dezembro
      startTime: '00:00',
      endTime: '23:59',
      reason: 'Natal - Feriado',
      type: 'unavailable'
    },
    {
      id: '2',
      date: new Date(2024, 11, 31), // 31 de dezembro
      startTime: '14:00',
      endTime: '18:00',
      reason: 'Reunião de fim de ano',
      type: 'blocked'
    }
  ]);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [newBlock, setNewBlock] = useState({
    startTime: '09:00',
    endTime: '10:00',
    reason: '',
    type: 'blocked' as 'blocked' | 'unavailable'
  });

  const handleWorkingHoursChange = (index: number, field: keyof WorkingHours, value: string | boolean) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const handleSaveWorkingHours = () => {
    toast.success("Horários de trabalho salvos com sucesso!");
  };

  const handleAddTimeBlock = () => {
    if (!selectedDate || !newBlock.reason.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const block: TimeBlock = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      reason: newBlock.reason,
      type: newBlock.type
    };

    setTimeBlocks([...timeBlocks, block]);
    setIsAddingBlock(false);
    setSelectedDate(undefined);
    setNewBlock({
      startTime: '09:00',
      endTime: '10:00',
      reason: '',
      type: 'blocked'
    });
    toast.success("Bloqueio de tempo adicionado com sucesso!");
  };

  const handleRemoveTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
    toast.success("Bloqueio de tempo removido com sucesso!");
  };

  const getBlockTypeColor = (type: 'blocked' | 'unavailable') => {
    return type === 'blocked' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  };

  const getBlockTypeText = (type: 'blocked' | 'unavailable') => {
    return type === 'blocked' ? 'Bloqueado' : 'Indisponível';
  };

  return (
    <Tabs defaultValue="working-hours" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="working-hours">Horários de Funcionamento</TabsTrigger>
        <TabsTrigger value="time-blocks">Bloqueios de Tempo</TabsTrigger>
      </TabsList>

      <TabsContent value="working-hours">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Trabalho
            </CardTitle>
            <CardDescription>
              Configure seus horários de atendimento para cada dia da semana.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {workingHours.map((hours, index) => (
              <div key={hours.day} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={hours.isOpen}
                      onCheckedChange={(checked) => handleWorkingHoursChange(index, 'isOpen', checked)}
                    />
                    <Label className="font-medium">{hours.day}</Label>
                  </div>
                  {hours.isOpen && (
                    <Badge variant="outline" className="text-green-600">
                      Disponível
                    </Badge>
                  )}
                </div>
                
                {hours.isOpen && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 ml-8">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Início</Label>
                      <Select
                        value={hours.startTime}
                        onValueChange={(value) => handleWorkingHoursChange(index, 'startTime', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Fim</Label>
                      <Select
                        value={hours.endTime}
                        onValueChange={(value) => handleWorkingHoursChange(index, 'endTime', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Pausa (Início)</Label>
                      <Select
                        value={hours.breakStart || ''}
                        onValueChange={(value) => handleWorkingHoursChange(index, 'breakStart', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Pausa (Fim)</Label>
                      <Select
                        value={hours.breakEnd || ''}
                        onValueChange={(value) => handleWorkingHoursChange(index, 'breakEnd', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Opcional" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {index < workingHours.length - 1 && <Separator />}
              </div>
            ))}
            
            <div className="pt-4">
              <Button onClick={handleSaveWorkingHours}>
                Salvar Horários de Trabalho
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="time-blocks">
        <TimeBlocks />
      </TabsContent>
    </Tabs>
  );
}