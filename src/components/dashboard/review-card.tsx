'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Star, 
  MoreVertical, 
  MessageSquare, 
  Pin, 
  PinOff, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Flag, 
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ThumbsUp,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { Review } from '@/types/review'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ReviewCardProps {
  review: Review;
  onAction: (reviewId: string, action: string, data?: any) => void;
  onRespond: (review: Review) => void;
  showClientInfo?: boolean;
}

export function ReviewCard({ review, onAction, onRespond, showClientInfo = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hidden': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Review['status']) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      case 'pending': return 'Pendente';
      case 'hidden': return 'Oculta';
      default: return 'Desconhecido';
    }
  };

  const getSourceColor = (source: Review['source']) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'google': return 'bg-red-100 text-red-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'manual': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationIcon = (status?: Review['verification_status']) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const handleAction = (action: string, data?: any) => {
    onAction(review.id, action, data);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      review.is_pinned ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
    } ${
      review.is_featured ? 'ring-2 ring-yellow-200 bg-yellow-50/30' : ''
    }`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg">{review.client_name}</h3>
              {getVerificationIcon(review.verification_status)}
              {review.is_pinned && <Pin className="h-4 w-4 text-blue-600" />}
              {review.is_featured && <Award className="h-4 w-4 text-yellow-600" />}
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {review.rating}/5
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getStatusColor(review.status)}>
                {getStatusText(review.status)}
              </Badge>
              <Badge variant="outline" className={getSourceColor(review.source)}>
                {review.source}
              </Badge>
              {review.case_type && (
                <Badge variant="outline">{review.case_type}</Badge>
              )}
              {review.service_type && (
                <Badge variant="outline">{review.service_type}</Badge>
              )}
              {review.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onRespond(review)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Responder
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {review.status === 'pending' && (
                <>
                  <DropdownMenuItem onClick={() => handleAction('approve')}>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Aprovar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction('reject')}>
                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                    Rejeitar
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuItem onClick={() => handleAction(review.is_pinned ? 'unpin' : 'pin')}>
                {review.is_pinned ? (
                  <PinOff className="h-4 w-4 mr-2" />
                ) : (
                  <Pin className="h-4 w-4 mr-2" />
                )}
                {review.is_pinned ? 'Desafixar' : 'Fixar'}
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleAction(review.is_featured ? 'unfeature' : 'feature')}>
                <Award className="h-4 w-4 mr-2" />
                {review.is_featured ? 'Remover Destaque' : 'Destacar'}
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => handleAction(review.status === 'hidden' ? 'show' : 'hide')}>
                {review.status === 'hidden' ? (
                  <Eye className="h-4 w-4 mr-2" />
                ) : (
                  <EyeOff className="h-4 w-4 mr-2" />
                )}
                {review.status === 'hidden' ? 'Mostrar' : 'Ocultar'}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => handleAction('report')}>
                <Flag className="h-4 w-4 mr-2 text-orange-600" />
                Reportar
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => handleAction('delete')}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {isExpanded || review.comment.length <= 200 
              ? review.comment 
              : `${review.comment.substring(0, 200)}...`
            }
          </p>
          {review.comment.length > 200 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto text-blue-600"
            >
              {isExpanded ? 'Ver menos' : 'Ver mais'}
            </Button>
          )}
        </div>

        {/* Client Info (if enabled) */}
        {showClientInfo && (review.client_email || review.client_phone) && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Informações de Contato</h4>
            <div className="space-y-1 text-sm">
              {review.client_email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{review.client_email}</span>
                </div>
              )}
              {review.client_phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{review.client_phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lawyer Response */}
        {review.lawyer_response && (
          <div className="mb-4">
            <Separator className="mb-3" />
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-blue-900">Sua Resposta</h4>
                <div className="flex items-center space-x-2">
                  {review.lawyer_response.is_public ? (
                    <Badge variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Pública
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Privada
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                {review.lawyer_response.message}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Respondido em {formatDate(review.lawyer_response.created_at)}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(review.created_at)}</span>
            </div>
            {review.helpful_votes && review.helpful_votes > 0 && (
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{review.helpful_votes} úteis</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!review.lawyer_response && review.status === 'approved' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRespond(review)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Responder
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}