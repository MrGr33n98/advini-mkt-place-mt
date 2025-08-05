import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Phone, Mail, Award } from "lucide-react";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          {lawyer.oab && (
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">OAB</p>
                <p className="text-sm text-muted-foreground">{lawyer.oab}</p>
              </div>
            </div>
          )}
          {lawyer.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{lawyer.phone}</p>
              </div>
            </div>
          )}
          {lawyer.email && (
            <div className="flex items-center gap-3 col-span-1 md:col-span-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{lawyer.email}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}