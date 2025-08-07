import { NextRequest, NextResponse } from 'next/server';
import { validatePasswordResetToken } from '../forgot-password/route';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    const validation = validatePasswordResetToken(token);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error, isValid: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        isValid: true, 
        email: validation.email,
        message: 'Token válido' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro na validação de token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', isValid: false },
      { status: 500 }
    );
  }
}