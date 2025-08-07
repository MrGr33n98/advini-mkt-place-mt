import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/auth-validation';
import { z } from 'zod';

// Simulação de banco de dados de tokens
const passwordResetTokens = new Map<string, {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}>();

// Função para gerar token seguro
function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Função para simular envio de email
async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  // Aqui você implementaria o envio real do email
  // Por exemplo, usando SendGrid, Nodemailer, etc.
  
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/redefinir-senha?token=${token}`;
  
  console.log(`
    📧 Email de recuperação de senha enviado para: ${email}
    🔗 Link de recuperação: ${resetLink}
    ⏰ Expira em: 1 hora
  `);
  
  // Simular delay de envio de email
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

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
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Armazenar token (em produção, use um banco de dados)
    passwordResetTokens.set(token, {
      email,
      token,
      expiresAt,
      used: false,
    });

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

// Função auxiliar para validar token (usada pela API de reset)
export function validatePasswordResetToken(token: string): {
  isValid: boolean;
  email?: string;
  error?: string;
} {
  const tokenData = passwordResetTokens.get(token);
  
  if (!tokenData) {
    return { isValid: false, error: 'Token inválido' };
  }
  
  if (tokenData.used) {
    return { isValid: false, error: 'Token já utilizado' };
  }
  
  if (new Date() > tokenData.expiresAt) {
    return { isValid: false, error: 'Token expirado' };
  }
  
  return { isValid: true, email: tokenData.email };
}

// Função auxiliar para marcar token como usado
export function markTokenAsUsed(token: string): void {
  const tokenData = passwordResetTokens.get(token);
  if (tokenData) {
    tokenData.used = true;
    passwordResetTokens.set(token, tokenData);
  }
}