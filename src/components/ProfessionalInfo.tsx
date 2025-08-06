"use client";

import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GraduationCap, 
  Languages, 
  Calendar, 
  MapPin, 
  BookOpen,
  User
} from "lucide-react";

interface ProfessionalInfoProps {
  lawyer: Lawyer;
}

export function ProfessionalInfo({ lawyer }: ProfessionalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informações Profissionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bio */}
        {lawyer.bio && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Sobre o Profissional
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {lawyer.bio}
            </p>
          </div>
        )}

        <Separator />

        {/* Experience */}
        {lawyer.years_of_experience && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Experiência
            </h3>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {lawyer.years_of_experience} anos de experiência
            </Badge>
          </div>
        )}

        {/* Education */}
        {lawyer.education && lawyer.education.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Formação Acadêmica
            </h3>
            <div className="space-y-2">
              {lawyer.education.map((edu, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <span className="text-gray-700">{edu}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {lawyer.languages && lawyer.languages.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Idiomas
            </h3>
            <div className="flex flex-wrap gap-2">
              {lawyer.languages.map((language, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Office Address */}
        {lawyer.office_address && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço do Escritório
            </h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {lawyer.office_address}
            </p>
          </div>
        )}

        {/* Specialties Detail */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">
            Áreas de Especialização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lawyer.specialties.map((specialty, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-2 bg-blue-50 rounded-md"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-blue-700 font-medium">{specialty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OAB Info */}
        {lawyer.oab && (
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Registro OAB
                </h3>
                <p className="text-gray-600">
                  Advogado devidamente registrado
                </p>
              </div>
              <Badge variant="default" className="bg-green-600">
                {lawyer.oab}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}