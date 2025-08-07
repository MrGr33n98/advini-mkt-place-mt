"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Plus, Trash2, Edit } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TimeBlock {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  type: 'vacation' | 'break' | 'meeting' | 'personal' | 'other'
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly'
}

const timeBlockTypes = [
  { value: 'vacation', label: 'Férias', color: 'bg-blue-100 text-blue-800' },
  { value: 'break', label: 'Pausa', color: 'bg-green-100 text-green-800' },
  { value: 'meeting', label: 'Reunião', color: 'bg-purple-100 text-purple-800' },
  { value: 'personal', label: 'Pessoal', color: 'bg-orange-100 text-orange-800' },
  { value: 'other', label: 'Outro', color: 'bg-gray-100 text-gray-800' }
]

const recurringOptions = [
  { value: 'none', label: 'Não repetir' },
  { value: 'daily', label: 'Diariamente' },
  { value: 'weekly', label: 'Semanalmente' },
  { value: 'monthly', label: 'Mensalmente' }
]

export function TimeBlocks() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
    {
      id: '1',
      title: 'Férias de Verão',
      description: 'Férias anuais',
      startDate: new Date(2024, 11, 20),
      endDate: new Date(2025, 0, 5),
      startTime: '00:00',
      endTime: '23:59',
      type: 'vacation',
      recurring: 'none'
    },
    {
      id: '2',
      title: 'Almoço',
      description: 'Pausa para almoço',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '12:00',
      endTime: '13:00',
      type: 'break',
      recurring: 'daily'
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'break' as TimeBlock['type'],
    recurring: 'none' as TimeBlock['recurring']
  })

  const handleSubmit = () => {
    const newBlock: TimeBlock = {
      id: editingBlock?.id || Date.now().toString(),
      ...formData
    }

    if (editingBlock) {
      setTimeBlocks(prev => prev.map(block => 
        block.id === editingBlock.id ? newBlock : block
      ))
    } else {
      setTimeBlocks(prev => [...prev, newBlock])
    }

    resetForm()
  }

  const handleEdit = (block: TimeBlock) => {
    setEditingBlock(block)
    setFormData({
      title: block.title,
      description: block.description || '',
      startDate: block.startDate,
      endDate: block.endDate,
      startTime: block.startTime,
      endTime: block.endTime,
      type: block.type,
      recurring: block.recurring || 'none'
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setTimeBlocks(prev => prev.filter(block => block.id !== id))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'break',
      recurring: 'none'
    })
    setEditingBlock(null)
    setIsDialogOpen(false)
  }

  const getTypeConfig = (type: TimeBlock['type']) => {
    return timeBlockTypes.find(t => t.value === type) || timeBlockTypes[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Bloqueios de Tempo</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie períodos indisponíveis em sua agenda
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBlock(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Bloqueio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingBlock ? 'Editar Bloqueio' : 'Novo Bloqueio de Tempo'}
              </DialogTitle>
              <DialogDescription>
                Configure um período de indisponibilidade em sua agenda
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Férias, Reunião, Pausa..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes adicionais..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TimeBlock['type']) => 
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeBlockTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? (
                          format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Selecionar data"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? (
                          format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          "Selecionar data"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Hora de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endTime">Hora de Fim</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Recorrência</Label>
                <Select
                  value={formData.recurring}
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, recurring: value as TimeBlock['recurring'] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingBlock ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {timeBlocks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhum bloqueio de tempo configurado
              </p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Crie bloqueios para períodos indisponíveis
              </p>
            </CardContent>
          </Card>
        ) : (
          timeBlocks.map((block) => {
            const typeConfig = getTypeConfig(block.type)
            return (
              <Card key={block.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{block.title}</h4>
                        <Badge className={typeConfig.color}>
                          {typeConfig.label}
                        </Badge>
                        {block.recurring !== 'none' && (
                          <Badge variant="outline">
                            {recurringOptions.find(r => r.value === block.recurring)?.label}
                          </Badge>
                        )}
                      </div>
                      {block.description && (
                        <p className="text-sm text-muted-foreground">
                          {block.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {format(block.startDate, "dd/MM/yyyy", { locale: ptBR })}
                          {block.startDate.getTime() !== block.endDate.getTime() && (
                            <span> - {format(block.endDate, "dd/MM/yyyy", { locale: ptBR })}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {block.startTime} - {block.endTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(block)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(block.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}