'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Configurações</h1>
      <p className="text-muted-foreground mb-8">
        Gerencie as informações da sua conta, preferências e segurança.
      </p>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>Atualize seu email e informações de contato.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="joao.silva@email.com" />
              </div>
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Para sua segurança, recomendamos o uso de uma senha forte.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button type="submit">Alterar Senha</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>Escolha como você deseja ser notificado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-review-notification">Novas Avaliações</Label>
                <p className="text-sm text-muted-foreground">Receber um email quando um cliente deixar uma nova avaliação.</p>
              </div>
              <Switch id="new-review-notification" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-appointment-notification">Novos Agendamentos</Label>
                <p className="text-sm text-muted-foreground">Receber um email para cada novo agendamento solicitado.</p>
              </div>
              <Switch id="new-appointment-notification" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter-notification">Newsletter da Plataforma</Label>
                <p className="text-sm text-muted-foreground">Receber dicas de marketing e novidades da plataforma.</p>
              </div>
              <Switch id="newsletter-notification" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis. Tenha cuidado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Excluir Minha Conta</Button>
            <p className="text-sm text-muted-foreground mt-2">
              Ao excluir sua conta, todos os seus dados, incluindo perfil, avaliações e agendamentos, serão permanentemente removidos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}