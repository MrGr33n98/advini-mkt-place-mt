'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import { AppointmentFormData, AppointmentType } from '@/types/appointment';

const appointmentSchema = z.object({
  clientName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  clientCpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(14, 'CPF inválido'),
  appointmentType: z.string().min(1, 'Selecione o tipo de consulta'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  urgency: z.enum(['baixa', 'media', 'alta']),
  preferredContact: z.enum(['email', 'telefone', 'whatsapp']),
  hasDocuments: z.boolean(),
  documentsDescription: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  acceptPrivacy: z.boolean().refine(val => val === true, 'Você deve aceitar a política de privacidade')
});

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  loading?: boolean;
}

const appointmentTypes: AppointmentType[] = [
  { id: '1', name: 'Consulta Inicial', description: 'Primeira consulta para análise do caso', duration: 60, price: 200 },
  { id: '2', name: 'Acompanhamento', description: 'Consulta de acompanhamento de processo', duration: 45, price: 150 },
  { id: '3', name: 'Orientação Jurídica', description: 'Orientação sobre questões legais', duration: 30, price: 100 },
  { id: '4', name: 'Revisão de Documentos', description: 'Análise e revisão de contratos/documentos', duration: 60, price: 180 },
];

export function AppointmentForm({ onSubmit, loading = false }: AppointmentFormProps) {
  const [hasDocuments, setHasDocuments] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      urgency: 'media',
      preferredContact: 'email',
      hasDocuments: false,
      acceptTerms: false,
      acceptPrivacy: false
    }
  });

  const selectedType = watch('appointmentType');
  const urgency = watch('urgency');

  const handleFormSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados para Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome Completo *</Label>
                <Input
                  id="clientName"
                  {...register('clientName')}
                  placeholder="Seu nome completo"
                />
                {errors.clientName && (
                  <p className="text-sm text-destructive">{errors.clientName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCpf">CPF *</Label>
                <Input
                  id="clientCpf"
                  {...register('clientCpf')}
                  placeholder="000.000.000-00"
                  onChange={(e) => {
                    const formatted = formatCPF(e.target.value);
                    setValue('clientCpf', formatted);
                  }}
                />
                {errors.clientCpf && (
                  <p className="text-sm text-destructive">{errors.clientCpf.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...register('clientEmail')}
                  placeholder="seu@email.com"
                />
                {errors.clientEmail && (
                  <p className="text-sm text-destructive">{errors.clientEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone *</Label>
                <Input
                  id="clientPhone"
                  {...register('clientPhone')}
                  placeholder="(00) 00000-0000"
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    setValue('clientPhone', formatted);
                  }}
                />
                {errors.clientPhone && (
                  <p className="text-sm text-destructive">{errors.clientPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tipo de Consulta */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tipo de Consulta</h3>
            
            <div className="space-y-2">
              <Label>Selecione o tipo de consulta *</Label>
              <Select onValueChange={(value) => setValue('appointmentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o tipo de consulta" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{type.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {type.duration}min - R$ {type.price}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.appointmentType && (
                <p className="text-sm text-destructive">{errors.appointmentType.message}</p>
              )}
            </div>

            {selectedType && (
              <div className="p-4 bg-muted rounded-lg">
                {appointmentTypes.find(t => t.id === selectedType)?.description}
              </div>
            )}
          </div>

          {/* Descrição do Caso */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Descrição do Caso</h3>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descreva seu caso *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva brevemente sua situação jurídica..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Urgência do caso</Label>
              <RadioGroup
                value={urgency}
                onValueChange={(value: 'baixa' | 'media' | 'alta') => setValue('urgency', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="baixa" id="baixa" />
                  <Label htmlFor="baixa">Baixa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="media" id="media" />
                  <Label htmlFor="media">Média</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alta" id="alta" />
                  <Label htmlFor="alta">Alta</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Documentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documentos</h3>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasDocuments"
                checked={hasDocuments}
                onCheckedChange={(checked) => {
                  setHasDocuments(checked as boolean);
                  setValue('hasDocuments', checked as boolean);
                }}
              />
              <Label htmlFor="hasDocuments">Possuo documentos relacionados ao caso</Label>
            </div>

            {hasDocuments && (
              <div className="space-y-2">
                <Label htmlFor="documentsDescription">Descreva os documentos</Label>
                <Textarea
                  id="documentsDescription"
                  {...register('documentsDescription')}
                  placeholder="Liste os documentos que você possui..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Preferências de Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferências de Contato</h3>
            
            <div className="space-y-2">
              <Label>Como prefere ser contatado?</Label>
              <RadioGroup
                defaultValue="email"
                onValueChange={(value: 'email' | 'telefone' | 'whatsapp') => setValue('preferredContact', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telefone" id="telefone" />
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Termos e Condições */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Termos e Condições</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  {...register('acceptTerms')}
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-relaxed">
                  Aceito os <a href="/termos" className="text-primary hover:underline">termos de uso</a> e 
                  confirmo que as informações fornecidas são verdadeiras
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptPrivacy"
                  {...register('acceptPrivacy')}
                />
                <Label htmlFor="acceptPrivacy" className="text-sm leading-relaxed">
                  Aceito a <a href="/privacidade" className="text-primary hover:underline">política de privacidade</a> e 
                  autorizo o uso dos meus dados para fins de agendamento
                </Label>
              </div>
              {errors.acceptPrivacy && (
                <p className="text-sm text-destructive">{errors.acceptPrivacy.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}