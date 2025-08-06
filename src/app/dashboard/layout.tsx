'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { MadeWithDyad } from '@/components/made-with-dyad';

// Dados mockados para o usuário
const mockUser = {
  name: "Dr. João da Silva",
  email: "joao.silva@email.com",
  plan: "Pro"
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    toast.success('Logout realizado com sucesso!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={mockUser} onLogout={handleLogout} />
      
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex items-center justify-end gap-4 h-16 bg-background border-b px-4">
          <ThemeToggle />
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
        
        <footer className="border-t py-4 px-4 sm:px-6 md:px-8">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
}