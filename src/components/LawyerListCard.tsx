import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, User, Briefcase } from "lucide-react";

export default function LawyerListCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg">{lawyer.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Briefcase className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {lawyer.specialties.map((spec) => (
              <Badge key={spec} variant="secondary">{spec}</Badge>
            ))}
          </div>
        </div>
        <Button asChild className="w-full">
          <Link href={`/advogados/${lawyer.slug}`}>
            Ver Perfil
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}