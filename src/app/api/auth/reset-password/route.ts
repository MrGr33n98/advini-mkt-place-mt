import { NextRequest, NextResponse } from 'next/server';
import { resetPasswordSchema } from '@/lib/auth-validation';
import { validatePasswordResetToken, markTokenAsUsed } from '@/lib/password-reset';
import { z } from 'zod';

// Função para hash da senha (em produção, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  // Em produção, você usaria bcrypt ou similar:
  // const bcrypt = require('bcrypt');
  // return await bcrypt.hash(password, 10);
  
  // Para demonstração, apenas retornamos a senha "hasheada" com um prefixo
  return `hashed_${password}`;
}

// Função para atualizar senha no banco de dados
async function updateUserPassword(email: string, hashedPassword: string): Promise<boolean> {
  // Aqui você implementaria a atualização real no banco de dados
  // Por exemplo:
  // const user = await db.user.update({
  //   where: { email },
  //   data: { password: hashedPassword }
  // });
  
  console.log(`
    🔐 Senha atualizada para o usuário: ${email}
    🔒 Nova senha (hash): ${hashedPassword}
  `);
  
  // Simular delay de atualização no banco
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = resetPasswordSchema.parse(body);
    const { token, password } = validatedData;

    // Validar token
    const tokenValidation = validatePasswordResetToken(token);
    
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { error: tokenValidation.error || 'Token inválido' },
        { status: 400 }
      );
    }

    const { email } = tokenValidation;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email não encontrado para este token' },
        { status: 400 }
      );
    }

    // Hash da nova senha
    const hashedPassword = await hashPassword(password);

    // Atualizar senha no banco de dados
    const passwordUpdated = await updateUserPassword(email, hashedPassword);
    
    if (!passwordUpdated) {
      return NextResponse.json(
        { error: 'Erro ao atualizar senha' },
        { status: 500 }
      );
    }

    // Marcar token como usado
    markTokenAsUsed(token);

    // Log de segurança
    console.log(`
      🔐 Senha redefinida com sucesso
      📧 Email: ${email}
      🕐 Data/Hora: ${new Date().toISOString()}
      🔑 Token usado: ${token.substring(0, 8)}...
    `);

    return NextResponse.json(
      { 
        message: 'Senha redefinida com sucesso',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Erro na API de redefinição de senha:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}