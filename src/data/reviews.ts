import { Review } from "@/types/review";

export const reviews: Review[] = [
  {
    id: "1",
    lawyer_id: "1", // Dr. João da Silva
    client_name: "Pedro Santos",
    rating: 5,
    comment: "Excelente profissional! Me ajudou muito com meu caso de divórcio. Muito atencioso e sempre disponível para esclarecer dúvidas.",
    created_at: "2024-03-15T10:00:00Z",
    status: "approved",
    is_pinned: true,
    case_type: "Direito de Família",
    helpful_votes: 12,
    source: "website",
    lawyer_response: {
      message: "Muito obrigado pelo feedback, Pedro! Foi um prazer ajudá-lo neste momento importante. Desejo muito sucesso em sua nova fase!",
      created_at: "2024-03-16T09:30:00Z"
    }
  },
  {
    id: "2",
    lawyer_id: "1",
    client_name: "Maria Oliveira",
    rating: 4,
    comment: "Muito atencioso e profissional. Resolveu meu caso de forma eficiente.",
    created_at: "2024-03-10T14:30:00Z",
    status: "approved",
    case_type: "Direito Civil",
    helpful_votes: 8,
    source: "google"
  },
  {
    id: "3",
    lawyer_id: "2", // Dra. Maria Oliveira
    client_name: "João Paulo",
    rating: 5,
    comment: "Resolveu meu processo trabalhista com muita competência. Recomendo a todos!",
    created_at: "2024-03-12T09:15:00Z",
    status: "approved",
    is_pinned: true,
    case_type: "Direito Trabalhista",
    helpful_votes: 15,
    source: "website",
    lawyer_response: {
      message: "Fico muito feliz em ter ajudado você, João Paulo! Casos trabalhistas exigem dedicação e estou satisfeita com o resultado alcançado.",
      created_at: "2024-03-13T11:20:00Z"
    }
  },
  {
    id: "4",
    lawyer_id: "2",
    client_name: "Ana Clara",
    rating: 4,
    comment: "Ótimo atendimento e dedicação ao caso. Muito profissional.",
    created_at: "2024-03-08T16:45:00Z",
    status: "approved",
    case_type: "Direito Empresarial",
    helpful_votes: 6,
    source: "facebook"
  },
  {
    id: "5",
    lawyer_id: "2",
    client_name: "Carlos Silva",
    rating: 5,
    comment: "Excelente advogada! Conseguiu resolver meu problema de forma rápida e eficaz. Muito comunicativa e sempre me manteve informado sobre o andamento do processo.",
    created_at: "2024-02-28T11:20:00Z",
    status: "approved",
    case_type: "Direito do Consumidor",
    helpful_votes: 9,
    source: "google"
  },
  {
    id: "6",
    lawyer_id: "2",
    client_name: "Fernanda Costa",
    rating: 3,
    comment: "Bom atendimento, mas o processo demorou mais do que esperado.",
    created_at: "2024-02-20T13:15:00Z",
    status: "approved",
    case_type: "Direito Civil",
    helpful_votes: 3,
    source: "manual",
    lawyer_response: {
      message: "Obrigada pelo feedback, Fernanda. Entendo sua preocupação com o tempo. Alguns processos realmente demandam mais tempo devido à complexidade, mas sempre me esforço para ser transparente sobre os prazos.",
      created_at: "2024-02-21T10:45:00Z"
    }
  },
  {
    id: "7",
    lawyer_id: "1",
    client_name: "Roberto Lima",
    rating: 5,
    comment: "Profissional excepcional! Me orientou muito bem em meu caso de inventário.",
    created_at: "2024-02-15T16:30:00Z",
    status: "approved",
    case_type: "Direito de Família",
    helpful_votes: 7,
    source: "website"
  },
  {
    id: "8",
    lawyer_id: "1",
    client_name: "Juliana Mendes",
    rating: 4,
    comment: "Muito competente e prestativo. Recomendo!",
    created_at: "2024-02-10T09:45:00Z",
    status: "approved",
    case_type: "Direito Civil",
    helpful_votes: 5,
    source: "google"
  }
];