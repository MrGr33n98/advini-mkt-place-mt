// Simulação de banco de dados de tokens
const passwordResetTokens = new Map<string, {
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
}>();

// Função para gerar token seguro
export function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Função para simular envio de email
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
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

// Função para armazenar token
export function storePasswordResetToken(token: string, email: string): void {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  
  passwordResetTokens.set(token, {
    email,
    token,
    expiresAt,
    used: false,
  });
}