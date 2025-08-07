'use client';

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu as NavigationMenuRoot,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  LogIn, 
  Menu, 
  Scale, 
  Users, 
  Building2, 
  Info, 
  CreditCard, 
  Phone,
  UserPlus,
  UserCheck,
  Search,
  Star,
  MapPin,
  ChevronDown,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navigationItems = [
  {
    title: "Advogados",
    href: "/advogados",
    description: "Encontre advogados especializados",
    icon: Users,
    badge: "Popular",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
  },
  {
    title: "Escritórios",
    href: "/escritorios",
    description: "Escritórios de advocacia",
    icon: Building2
  },
  {
    title: "Sobre Nós",
    href: "/sobre",
    description: "Conheça nossa missão",
    icon: Info
  },
  {
    title: "Planos",
    href: "/planos",
    description: "Planos para advogados",
    icon: CreditCard,
    badge: "Novo",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
  },
  {
    title: "Contato",
    href: "/contato",
    description: "Entre em contato conosco",
    icon: Phone
  }
];

export function NavigationMenu() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Melhor detecção de página ativa
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Função para fechar menu mobile com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b shadow-lg" 
          : "bg-background border-b border-border/40"
      )}
      role="banner"
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Elemento Principal da Hierarquia Visual */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-1 -m-1"
          aria-label="JurisConnect - Página inicial"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl group-hover:scale-105 group-active:scale-95 transition-all duration-200 ease-out shadow-md group-hover:shadow-lg">
            <Scale className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent leading-tight">
              JurisConnect
            </div>
            <div className="text-xs text-muted-foreground/80 -mt-0.5 font-medium">
              Cuiabá-MT
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - Agrupamento Semântico */}
        <nav className="hidden lg:flex items-center" role="navigation" aria-label="Navegação principal">
          <NavigationMenuRoot>
            <NavigationMenuList className="flex items-center space-x-2">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-out",
                        "hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm hover:scale-[1.02]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                        "active:scale-95 active:bg-accent",
                        isActive(item.href) 
                          ? "bg-primary/10 text-primary border-b-2 border-primary" 
                          : "text-foreground/80 hover:text-foreground"
                      )}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                    >
                      <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                      {item.title}
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "ml-2 text-xs font-semibold px-2 py-0.5",
                            item.badgeColor || "bg-secondary text-secondary-foreground"
                          )}
                          aria-label={item.badge === 'Popular' ? 'Seção popular' : 'Nova seção'}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenuRoot>
        </nav>

        {/* Right Side Actions - Hierarquia de CTAs */}
        <div className="flex items-center space-x-3">
          {/* Search Button - Ação Secundária */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex h-9 w-9 p-0 hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Buscar advogados e escritórios"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* Theme Toggle - Ação Secundária */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Desktop Auth Buttons - Hierarquia Clara */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* CTA Terciário */}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sm font-medium hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Acessar área do advogado"
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Área do Advogado
            </Button>
            
            {/* CTA Secundário */}
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm font-medium border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Fazer login"
            >
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Entrar
            </Button>
            
            {/* CTA Primário */}
            <Button 
              size="sm"
              className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Criar conta gratuita"
            >
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Cadastrar-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden h-9 w-9 p-0 hover:bg-accent/80 hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Abrir menu de navegação"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[320px] sm:w-[400px] overflow-y-auto"
              id="mobile-menu"
              aria-labelledby="mobile-menu-title"
            >
              <SheetHeader className="border-b pb-4">
                <SheetTitle 
                  id="mobile-menu-title"
                  className="flex items-center space-x-3 text-left"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-lg">
                    <Scale className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-bold text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                      JurisConnect
                    </div>
                    <div className="text-xs text-muted-foreground/80 -mt-0.5">
                      Cuiabá-MT
                    </div>
                  </div>
                </SheetTitle>
                <SheetDescription className="text-left text-sm">
                  Encontre os melhores advogados e escritórios especializados
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Mobile Navigation Links */}
                <nav role="navigation" aria-label="Menu de navegação mobile">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    Navegação
                  </h3>
                  <div className="space-y-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ease-out",
                          "hover:bg-accent/80 hover:text-accent-foreground hover:scale-[1.02] hover:shadow-sm",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          "active:scale-95 active:bg-accent",
                          isActive(item.href) 
                            ? "bg-primary/10 text-primary border-l-4 border-primary" 
                            : "text-foreground/80"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs text-muted-foreground/70">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs font-semibold px-2 py-0.5",
                              item.badgeColor || "bg-secondary text-secondary-foreground"
                            )}
                            aria-label={item.badge === 'Popular' ? 'Seção popular' : 'Nova seção'}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile Stats */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    Estatísticas da Plataforma
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                      <div className="text-2xl font-bold text-primary">1.2k+</div>
                      <div className="text-xs text-muted-foreground font-medium">Advogados Ativos</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10">
                      <div className="text-2xl font-bold text-secondary">300+</div>
                      <div className="text-xs text-muted-foreground font-medium">Escritórios</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Ações Rápidas
                  </h3>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 hover:bg-accent/80 hover:scale-[1.02] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Buscar advogados e escritórios"
                  >
                    <Search className="mr-3 h-5 w-5" aria-hidden="true" />
                    <div className="text-left">
                      <div className="font-medium">Buscar</div>
                      <div className="text-xs text-muted-foreground">Advogados e escritórios</div>
                    </div>
                  </Button>

                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 hover:bg-accent/80 hover:scale-[1.02] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Acessar área do advogado"
                  >
                    <UserCheck className="mr-3 h-5 w-5" aria-hidden="true" />
                    <div className="text-left">
                      <div className="font-medium">Área do Advogado</div>
                      <div className="text-xs text-muted-foreground">Painel profissional</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 hover:bg-accent/80 hover:scale-[1.02] active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Fazer login"
                  >
                    <LogIn className="mr-3 h-5 w-5" aria-hidden="true" />
                    <div className="text-left">
                      <div className="font-medium">Entrar</div>
                      <div className="text-xs text-muted-foreground">Acesse sua conta</div>
                    </div>
                  </Button>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Criar conta gratuita"
                  >
                    <UserPlus className="mr-3 h-5 w-5" aria-hidden="true" />
                    <div className="text-left">
                      <div className="font-semibold">Cadastrar-se</div>
                      <div className="text-xs opacity-90">Grátis para começar</div>
                    </div>
                  </Button>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm">
                      <div className="font-medium">Tema</div>
                      <div className="text-xs text-muted-foreground">Claro/Escuro</div>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}