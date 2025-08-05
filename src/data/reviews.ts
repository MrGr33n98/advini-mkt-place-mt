import { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "1",
    lawyerId: "1", // Dr. João da Silva
    clientName: "Pedro Santos",
    rating: 5,
    comment: "Excelente profissional! Me ajudou muito com meu caso de divórcio.",
    date: "2024-03-15",
    status: "approved",
    isPinned: true
  },
  {
    id: "2",
    lawyerId: "1",
    clientName: "Maria Oliveira",
    rating: 4,
    comment: "Muito atencioso e profissional.",
    date: "2024-03-10",
    status: "approved"
  },
  {
    id: "3",
    lawyerId: "2", // Dra. Maria Oliveira
    clientName: "João Paulo",
    rating: 5,
    comment: "Resolveu meu processo trabalhista com muita competência.",
    date: "2024-03-12",
    status: "approved",
    isPinned: true
  },
  {
    id: "4",
    lawyerId: "2",
    clientName: "Ana Clara",
    rating: 4,
    comment: "Ótimo atendimento e dedicação ao caso.",
    date: "2024-03-08",
    status: "pending"
  }
];