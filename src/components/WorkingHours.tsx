"use client";

import { WorkingHours as WorkingHoursType } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorkingHoursProps {
  workingHours: WorkingHoursType[];
}

export function WorkingHours({ workingHours }: WorkingHoursProps) {
  const getCurrentDayStatus = () => {
    const today = new Date();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDay = dayNames[today.getDay()];
    
    const todayHours = workingHours.find(wh => wh.day === currentDay);
    
    if (!todayHours || !todayHours.isOpen) {
      return { isOpen: false, message: "Fechado hoje" };
    }

    const now = today.getHours() * 60 + today.getMinutes();
    const [startHour, startMin] = todayHours.start.split(':').map(Number);
    const [endHour, endMin] = todayHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (now >= startTime && now <= endTime) {
      return { isOpen: true, message: `Aberto até ${todayHours.end}` };
    } else if (now < startTime) {
      return { isOpen: false, message: `Abre às ${todayHours.start}` };
    } else {
      return { isOpen: false, message: "Fechado" };
    }
  };

  const currentStatus = getCurrentDayStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários de Atendimento
          <Badge 
            variant={currentStatus.isOpen ? "default" : "secondary"}
            className={`ml-auto ${
              currentStatus.isOpen 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}
          >
            {currentStatus.isOpen ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {currentStatus.message}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {workingHours.map((hours, index) => (
            <div 
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="font-medium text-gray-700">
                {hours.day}
              </span>
              
              {hours.isOpen ? (
                <span className="text-gray-600">
                  {hours.start} - {hours.end}
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  Fechado
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Para garantir atendimento, recomendamos agendar uma consulta com antecedência.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}