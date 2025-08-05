'use client';

import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, MapPin, Clock, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SingleLawyerMap from "@/components/SingleLawyerMap";

export default function ContatoPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica de envio do formulário
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Agendamento solicitado! Confirmaremos por email em breve.");
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-muted-foreground">
            Estamos aqui para ajudar. Entre em contato conosco ou agende uma consulta.
          </p>
        </div>

        <Tabs defaultValue="message" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="message">
              <Mail className="mr-2 h-4 w-4" />
              Mensagem
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Agendar
            </TabsTrigger>
            <TabsTrigger value="info">
              <MapPin className="mr-2 h-4 w-4" />
              Informações
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="message">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Envie uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Informações Gerais</SelectItem>
                          <SelectItem value="support">Suporte Técnico</SelectItem>
                          <SelectItem value="partnership">Parcerias</SelectItem>
                          <SelectItem value="billing">Faturamento</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea id="message" required rows={5} />
                    </div>
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                    <CardDescription>
                      Escolha a melhor forma de falar conosco
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href="mailto:contato@exemplo.com"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          contato@exemplo.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <a 
                          href="tel:+556599999999"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          (65) 9999-9999
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <a 
                          href="https://wa.me/556599999999"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          (65) 9999-9999
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Horário de Atendimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Segunda a Sexta</p>
                        <p>9h às 18h</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Sábado</p>
                        <p>9h às 13h</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-muted-foreground">Domingo</p>
                        <p>Fechado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Agende uma Consulta</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo para solicitar um agendamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSchedule} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-name">Nome</Label>
                      <Input id="schedule-name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schedule-email">Email</Label>
                      <Input id="schedule-email" type="email" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-phone">Telefone</Label>
                      <Input id="schedule-phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Especialidade</Label>
                      <Select>
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Selecione uma especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="civil">Direito Civil</SelectItem>
                          <SelectItem value="family">Direito de Família</SelectItem>
                          <SelectItem value="criminal">Direito Penal</SelectItem>
                          <SelectItem value="labor">Direito Trabalhista</SelectItem>
                          <SelectItem value="consumer">Direito do Consumidor</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferred-date">Data Preferencial</Label>
                      <Input id="preferred-date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferred-time">Horário Preferencial</Label>
                      <Select>
                        <SelectTrigger id="preferred-time">
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Manhã (9h - 12h)</SelectItem>
                          <SelectItem value="afternoon">Tarde (13h - 17h)</SelectItem>
                          <SelectItem value="evening">Final da Tarde (17h - 18h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule-message">Detalhes do Caso</Label>
                    <Textarea 
                      id="schedule-message" 
                      placeholder="Descreva brevemente seu caso para que possamos nos preparar para a consulta"
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-preference">Preferência de Contato</Label>
                    <Select>
                      <SelectTrigger id="contact-preference">
                        <SelectValue placeholder="Como prefere ser contatado?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Solicitar Agendamento
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="info">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Nosso Escritório</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-sm text-muted-foreground">
                          Av. Historiador Rubens de Mendonça, 1731<br />
                          Bosque da Saúde, Cuiabá - MT, 78050-000
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Horário de Funcionamento</p>
                        <p className="text-sm text-muted-foreground">
                          Segunda a Sexta: 9h às 18h<br />
                          Sábado: 9h às 13h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Informações Adicionais</p>
                        <p className="text-sm text-muted-foreground">
                          Estacionamento gratuito disponível<br />
                          Acessibilidade para cadeirantes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" asChild>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                          YouTube
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-[500px] rounded-lg overflow-hidden">
                <SingleLawyerMap latitude={-15.5989} longitude={-56.0949} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}