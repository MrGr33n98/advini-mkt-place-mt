export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: number; // em minutos
}

export interface AppointmentType {
  id: string;
  name: string;
  duration: number; // em minutos
  price?: number;
  description?: string;
}

export interface LawyerAvailability {
  lawyerId: string;
  date: string;
  timeSlots: TimeSlot[];
  appointmentTypes: AppointmentType[];
}

export interface ClientAppointmentRequest {
  lawyerId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  timeSlotId: string;
  appointmentTypeId: string;
  location: 'office' | 'online' | 'phone';
  notes?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Appointment {
  id: string;
  lawyerId: string;
  lawyerName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  location: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  urgency: 'low' | 'medium' | 'high';
  price?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCpf: string;
  appointmentType: string;
  description: string;
  urgency: 'baixa' | 'media' | 'alta';
  preferredContact: 'email' | 'telefone' | 'whatsapp';
  hasDocuments: boolean;
  documentsDescription?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}