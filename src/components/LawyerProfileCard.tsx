import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Phone, Mail, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LawyerProfileCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-full p-3">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">{lawyer.name}</CardTitle>
            <CardDescription>Advogado(a)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Especialidades
          </h3>
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((spec) => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
        
        {lawyer.bio && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Biografia</h3>
            <p className="text-muted-foreground">{lawyer.bio}</p>
          </div>
        )}

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lawyer.oab && (
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">OAB</p>
                  <p className="text-sm text-muted-foreground">{lawyer.oab}</p>
                </div>
              </div>
            )}
            {lawyer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <a 
                    href={`tel:${lawyer.phone.replace(/\D/g, '')}`} 
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {lawyer.phone}
                  </a>
                </div>
              </div>
            )}
            {lawyer.email && (
              <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a 
                    href={`mailto:${lawyer.email}`} 
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    {lawyer.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}