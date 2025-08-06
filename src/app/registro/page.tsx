'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = async (provider: string) => {
    setLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de Escritório</CardTitle>
          <CardDescription>Crie sua conta para começar a usar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Botões de login social */}
            <div className="grid gap-4">
              <Button
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
              <Button
                onClick={() => handleSocialLogin("linkedin")}
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                  />
                </svg>
                Continuar com LinkedIn
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            {/* Informações do escritório */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome do Escritório</Label>
                <Input id="name" placeholder="Digite o nome do escritório" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="oab">Número da OAB</Label>
                <Input id="oab" placeholder="Digite o número da OAB" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Digite seu email" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="Digite seu telefone" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="specialties">Áreas de Atuação</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione as áreas de atuação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil">Direito Civil</SelectItem>
                    <SelectItem value="criminal">Direito Criminal</SelectItem>
                    <SelectItem value="trabalho">Direito do Trabalho</SelectItem>
                    <SelectItem value="tributario">Direito Tributário</SelectItem>
                    <SelectItem value="empresarial">Direito Empresarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Digite o endereço do escritório" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="Digite a cidade" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="state">Estado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    {/* Adicionar outros estados */}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  Concordo com os{" "}
                  <a href="/termos" className="text-primary hover:underline">
                    termos de uso
                  </a>{" "}
                  e{" "}
                  <a href="/privacidade" className="text-primary hover:underline">
                    política de privacidade
                  </a>
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Criar Conta
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}