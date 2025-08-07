import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/auth-validation';
import { z } from 'zod';
import { 
  generateSecureToken, 
  sendPasswordResetEmail, 
  storePasswordResetToken 
} from '@/lib/password-reset';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Verificar se o email existe no sistema
    // Aqui você verificaria no seu banco de dados real
    const userExists = true; // Simulação - sempre retorna true para demonstração
    
    if (!userExists) {
      // Por segurança, não revelamos se o email existe ou não
      return NextResponse.json(
        { message: 'Se o email estiver cadastrado, você receberá um link de recuperação.' },
        { status: 200 }
      );
    }

    // Gerar token de recuperação
    const token = generateSecureToken();

    // Armazenar token (em produção, use um banco de dados)
    storePasswordResetToken(token, email);

    // Enviar email de recuperação
    const emailSent = await sendPasswordResetEmail(email, token);
    
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Erro ao enviar email de recuperação.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email de recuperação enviado com sucesso.' },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro na API de recuperação de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}