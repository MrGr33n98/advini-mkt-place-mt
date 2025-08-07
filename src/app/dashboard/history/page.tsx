"use client"

import { AppointmentHistory } from "@/components/dashboard/appointment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const handleExportData = () => {
    // Implementar exportação de dados
    console.log('Exportando dados do histórico...')
  }

  const handleViewDetails = (appointmentId: string) => {
    // Implementar visualização de detalhes
    console.log('Visualizando detalhes do agendamento:', appointmentId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Histórico de Agendamentos</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie o histórico completo de seus agendamentos
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Gerar PDF
          </Button>
        </div>
      </div>

      {/* Histórico de Agendamentos */}
      <AppointmentHistory 
        onViewDetails={handleViewDetails}
        onExportData={handleExportData}
      />
    </div>
  )
}