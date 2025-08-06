import { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "1",
    lawyer_id: "1", // Dr. João da Silva
    client_name: "Pedro Santos",
    rating: 5,
    comment: "Excelente profissional! Me ajudou muito com meu caso de divórcio.",
    created_at: "2024-03-15T10:00:00Z",
    status: "approved",
    is_pinned: true
  },
  {
    id: "2",
    lawyer_id: "1",
    client_name: "Maria Oliveira",
    rating: 4,
    comment: "Muito atencioso e profissional.",
    created_at: "2024-03-10T14:30:00Z",
    status: "approved"
  },
  {
    id: "3",
    lawyer_id: "2", // Dra. Maria Oliveira
    client_name: "João Paulo",
    rating: 5,
    comment: "Resolveu meu processo trabalhista com muita competência.",
    created_at: "2024-03-12T09:15:00Z",
    status: "approved",
    is_pinned: true
  },
  {
    id: "4",
    lawyer_id: "2",
    client_name: "Ana Clara",
    rating: 4,
    comment: "Ótimo atendimento e dedicação ao caso.",
    created_at: "2024-03-08T16:45:00Z",
    status: "pending"
  }
];