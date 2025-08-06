'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Início', href: '/' },
  { label: 'Escritórios', href: '/escritorios' },
  { label: 'Advogados', href: '/advogados' },
  { label: 'Sobre Nós', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className={className}>
      <button
        className="p-2 rounded-md hover:bg-gray-100 transition-colors md:hidden"
        onClick={toggleDrawer}
        aria-label="Menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white border-b shadow-lg animate-in slide-in-from-top duration-300 z-50">
          <nav className="container mx-auto flex flex-col space-y-1 p-4">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-gray-50"
                onClick={toggleDrawer}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="outline" className="w-full justify-start" onClick={toggleDrawer}>
                Entrar
              </Button>
              <Button className="w-full justify-start bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary" onClick={toggleDrawer}>
                Cadastrar-se
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}