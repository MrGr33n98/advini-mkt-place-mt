import Link from "next/link";
import { MadeWithDyad } from "./made-with-dyad";
import { Separator } from "./ui/separator";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 pt-12 pb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Encontre seu Advogado</h3>
            <p className="text-muted-foreground mb-4">
              Conectando pessoas a excelentes profissionais do direito em Cuiabá-MT.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-primary">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-muted-foreground hover:text-primary">
                  Planos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Para Advogados</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary">
                  Área do Advogado
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-primary">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link href="/planos" className="text-muted-foreground hover:text-primary">
                  Nossos Planos
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@exemplo.com" className="hover:text-primary">
                  contato@exemplo.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+556599999999" className="hover:text-primary">
                  (65) 9999-9999
                </a>
              </li>
              <li className="text-muted-foreground mt-2">
                <p>Av. Historiador Rubens de Mendonça, 1731</p>
                <p>Bosque da Saúde, Cuiabá - MT</p>
                <p>78050-000</p>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-4" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Encontre seu Advogado. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/termos" className="hover:text-primary">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-primary">
              Política de Privacidade
            </Link>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
}