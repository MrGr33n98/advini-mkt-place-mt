'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Send, FileText, Save, X, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Review, ReviewTemplate } from '@/types/review'

interface ReviewResponseProps {
  review: Review;
  onClose: () => void;
  onSubmit: (response: string, isPublic: boolean) => void;
}

// Templates de resposta mockados
const responseTemplates: ReviewTemplate[] = [
  {
    id: '1',
    name: 'Agradecimento Positivo',
    content: 'Muito obrigado(a) pela sua avaliação! Fico feliz em saber que pude ajudá-lo(a) da melhor forma. Estou sempre à disposição para futuras necessidades jurídicas.',
    category: 'positive',
    is_default: true
  },
  {
    id: '2',
    name: 'Resposta Neutra',
    content: 'Agradeço pelo seu feedback. Estou sempre buscando melhorar meus serviços e sua opinião é muito importante. Fico à disposição para qualquer esclarecimento.',
    category: 'neutral',
    is_default: false
  },
  {
    id: '3',
    name: 'Resposta a Crítica Construtiva',
    content: 'Agradeço pelo seu feedback. Levo todas as observações muito a sério e estou sempre buscando melhorar meus serviços. Gostaria de conversar pessoalmente para entender melhor sua experiência.',
    category: 'negative',
    is_default: false
  },
  {
    id: '4',
    name: 'Resposta Geral',
    content: 'Obrigado(a) por dedicar seu tempo para avaliar meus serviços. Seu feedback é muito valioso para mim.',
    category: 'general',
    is_default: false
  }
];

export function ReviewResponseComponent({ review, onClose, onSubmit }: ReviewResponseProps) {
  const [response, setResponse] = useState(review.lawyer_response?.message || '');
  const [isPublic, setIsPublic] = useState(review.lawyer_response?.is_public ?? true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = responseTemplates.find(t => t.id === templateId);
    if (template) {
      setResponse(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error('Por favor, escreva uma resposta');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(response, isPublic);
      toast.success('Resposta enviada com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar resposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTemplatesByCategory = (category: ReviewTemplate['category']) => {
    return responseTemplates.filter(t => t.category === category);
  };

  const suggestedCategory = (): ReviewTemplate['category'] => {
    if (review.rating >= 4) return 'positive';
    if (review.rating <= 2) return 'negative';
    return 'neutral';
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Responder Avaliação</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avaliação Original */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">{review.client_name}</h4>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < review.rating ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline">{review.case_type || 'Não especificado'}</Badge>
            <Badge variant="outline">{review.source}</Badge>
            {review.verification_status === 'verified' && (
              <Badge variant="default">Verificado</Badge>
            )}
          </div>
        </div>

        {/* Templates Sugeridos */}
        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Templates de Resposta</span>
          </Label>
          
          {/* Templates por Categoria */}
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-2 text-green-600">
                Sugerido para esta avaliação ({suggestedCategory()})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getTemplatesByCategory(suggestedCategory()).map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate === template.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTemplateSelect(template.id)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {template.content}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h5 className="text-sm font-medium mb-2">Outros Templates</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {responseTemplates
                  .filter(t => t.category !== suggestedCategory())
                  .map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTemplateSelect(template.id)}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {template.content}
                        </div>
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Campo de Resposta */}
        <div className="space-y-3">
          <Label htmlFor="response" className="text-base font-semibold">
            Sua Resposta
          </Label>
          <Textarea
            id="response"
            placeholder="Escreva sua resposta aqui..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{response.length} caracteres</span>
            <span>Máximo recomendado: 500 caracteres</span>
          </div>
        </div>

        {/* Configurações de Visibilidade */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Configurações</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="is_public" className="flex items-center space-x-2">
              {isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>Resposta pública (visível para outros usuários)</span>
            </Label>
          </div>
          {!isPublic && (
            <p className="text-sm text-muted-foreground ml-6">
              A resposta será enviada apenas para o cliente por email
            </p>
          )}
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !response.trim()}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Resposta
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}