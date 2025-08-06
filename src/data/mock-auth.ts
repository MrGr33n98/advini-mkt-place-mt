import { User } from "next-auth"

export const mockUser: User = {
  id: "mock-user-id",
  name: "Usuário Teste",
  email: "teste@exemplo.com",
  image: "https://images.unsplash.com/photo-placeholder",
  oab: "123456",
  specialties: ["Direito Civil", "Direito do Trabalho"],
  address: "Rua Exemplo, 123",
  city: "São Paulo",
  state: "SP",
  phone: "(11) 99999-9999"
}

export const mockSession = {
  user: mockUser,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}