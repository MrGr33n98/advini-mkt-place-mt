"use client"

import { useState } from "react"
import { format, addDays, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit,
  Coffee,
  Plane,
  Users,
  FileText,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

interface TimeBlock {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  startTime: string
  endTime: string
  type: "vacation" | "meeting" | "personal" | "break" | "other"
  isRecurring: boolean
  recurringDays?: number[] // 0-6 (domingo-sábado)
  color: string
}

interface TimeBlockingProps {
  timeBlocks?: TimeBlock[]
  onTimeBlockCreate?: (timeBlock: Omit<TimeBlock, "id">) => void
  onTimeBlockUpdate?: (id: string, timeBlock: Partial<TimeBlock>) => void
  onTimeBlockDelete?: (id: string) => void
}

const blockTypes = {
  vacation: { label: "Férias", icon: Plane, color: "bg-blue-100 text-blue-800" },
  meeting: { label: "Reunião", icon: Users, color: "bg-purple-100 text-purple-800" },
  personal: { label: "Pessoal", icon: Coffee, color: "bg-green-100 text-green-800" },
  break: { label: "Intervalo", icon: Coffee, color: "bg-orange-100 text-orange-800" },
  other: { label: "Outro", icon: FileText, color: "bg-gray-100 text-gray-800" }
}

const mockTimeBlocks: TimeBlock[] = [
  {
    id: "1",
    title: "Férias de Verão",
    description: "Viagem em família",
    startDate: new Date(2024, 0, 20),
    endDate: new Date(2024, 0, 30),
    startTime: "00:00",
    endTime: "23:59",
    type: "vacation",
    isRecurring: false,
    color: "#3b82f6"
  },
  {
    id: "2",
    title: "Almoço",
    description: "Intervalo para almoço",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    startTime: "12:00",
    endTime: "13:00",
    type: "break",
    isRecurring: true,
    recurringDays: [1, 2, 3, 4, 5], // Segunda a sexta
    color: "#f97316"
  },
  {
    id: "3",
    title: "Reunião Semanal",
    description: "Reunião de equipe",
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 11, 31),
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting",
    isRecurring: true,
    recurringDays: [1], // Segunda-feira
    color: "#8b5cf6"
  }
]

export function TimeBlocking({ 
  timeBlocks = mockTimeBlocks,
  onTimeBlockCreate,
  onTimeBlockUpdate,
  onTimeBlockDelete
}: TimeBlockingProps) {
  const [blocks, setBlocks] = useState<TimeBlock[]>(timeBlocks)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    type: "other" as TimeBlock["type"],
    isRecurring: false,
    recurringDays: [] as number[]
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      type: "other",
      isRecurring: false,
      recurringDays: []
    })
  }

  const handleCreateBlock = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive"
      })
      return
    }

    const newBlock: TimeBlock = {
      id: Date.now().toString(),
      ...formData,
      color: blockTypes[formData.type].color
    }

    setBlocks([...blocks, newBlock])
    onTimeBlockCreate?.(newBlock)
    setIsCreateDialogOpen(false)
    resetForm()
    
    toast({
      title: "Sucesso",
      description: "Bloqueio de horário criado com sucesso"
    })
  }

  const handleUpdateBlock = () => {
    if (!editingBlock || !formData.title.trim()) return

    const updatedBlock = {
      ...editingBlock,
      ...formData,
      color: blockTypes[formData.type].color
    }

    setBlocks(blocks.map(block => 
      block.id === editingBlock.id ? updatedBlock : block
    ))
    onTimeBlockUpdate?.(editingBlock.id, updatedBlock)
    setEditingBlock(null)
    resetForm()
    
    toast({
      title: "Sucesso",
      description: "Bloqueio de horário atualizado com sucesso"
    })
  }

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
    onTimeBlockDelete?.(blockId)
    
    toast({
      title: "Sucesso",
      description: "Bloqueio de horário removido com sucesso"
    })
  }

  const startEdit = (block: TimeBlock) => {
    setEditingBlock(block)
    setFormData({
      title: block.title,
      description: block.description || "",
      startDate: block.startDate,
      endDate: block.endDate,
      startTime: block.startTime,
      endTime: block.endTime,
      type: block.type,
      isRecurring: block.isRecurring,
      recurringDays: block.recurringDays || []
    })
  }

  const getBlocksForDate = (date: Date) => {
    return blocks.filter(block => {
      if (block.isRecurring && block.recurringDays) {
        const dayOfWeek = date.getDay()
        return block.recurringDays.includes(dayOfWeek) &&
               date >= block.startDate && date <= block.endDate
      } else {
        return date >= block.startDate && date <= block.endDate
      }
    })
  }

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bloqueio de Horários</h2>
          <p className="text-muted-foreground">
            Gerencie períodos indisponíveis em sua agenda
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Bloqueio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Bloqueio de Horário</DialogTitle>
              <DialogDescription>
                Defina um período em que você não estará disponível para agendamentos
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Férias, Reunião, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: TimeBlock["type"]) => 
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(blockTypes).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Horário de Fim</Label>
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => setFormData({ ...formData, endTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isRecurring: checked })
                    }
                  />
                  <Label htmlFor="recurring">Repetir semanalmente</Label>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label>Dias da semana</Label>
                    <div className="flex gap-2">
                      {dayNames.map((day, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant={formData.recurringDays.includes(index) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newDays = formData.recurringDays.includes(index)
                              ? formData.recurringDays.filter(d => d !== index)
                              : [...formData.recurringDays, index]
                            setFormData({ ...formData, recurringDays: newDays })
                          }}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateBlock}>
                Criar Bloqueio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => {
                  const dayBlocks = getBlocksForDate(date)
                  return (
                    <div className="relative w-full h-full">
                      <span>{date.getDate()}</span>
                      {dayBlocks.length > 0 && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        </div>
                      )}
                    </div>
                  )
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Bloqueios para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getBlocksForDate(selectedDate).map((block) => {
                const TypeIcon = blockTypes[block.type].icon
                
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${blockTypes[block.type].color}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{block.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {block.startTime} - {block.endTime}
                          {block.isRecurring && " (Recorrente)"}
                        </p>
                        {block.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {block.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(block)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {getBlocksForDate(selectedDate).length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum bloqueio</h3>
                  <p className="text-muted-foreground">
                    Não há bloqueios de horário para esta data.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBlock} onOpenChange={() => setEditingBlock(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Bloqueio de Horário</DialogTitle>
            <DialogDescription>
              Modifique as informações do bloqueio de horário
            </DialogDescription>
          </DialogHeader>
          
          {/* Same form content as create dialog */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Férias, Reunião, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: TimeBlock["type"]) => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(blockTypes).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(formData.startDate, "dd/MM/yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data de Fim</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(formData.endDate, "dd/MM/yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startTime">Horário de Início</Label>
                <Select
                  value={formData.startTime}
                  onValueChange={(value) => setFormData({ ...formData, startTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endTime">Horário de Fim</Label>
                <Select
                  value={formData.endTime}
                  onValueChange={(value) => setFormData({ ...formData, endTime: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isRecurring: checked })
                  }
                />
                <Label htmlFor="edit-recurring">Repetir semanalmente</Label>
              </div>

              {formData.isRecurring && (
                <div className="space-y-2">
                  <Label>Dias da semana</Label>
                  <div className="flex gap-2">
                    {dayNames.map((day, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant={formData.recurringDays.includes(index) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newDays = formData.recurringDays.includes(index)
                            ? formData.recurringDays.filter(d => d !== index)
                            : [...formData.recurringDays, index]
                          setFormData({ ...formData, recurringDays: newDays })
                        }}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBlock(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateBlock}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}