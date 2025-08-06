"use client";

import { Certification } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Building } from "lucide-react";
import Image from "next/image";

interface CertificationGalleryProps {
  certifications: Certification[];
}

export function CertificationGallery({ certifications }: CertificationGalleryProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certificações e Especializações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <div 
              key={cert.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Certificate Image */}
              {cert.image_url && (
                <div className="relative w-full h-32 mb-3 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              
              {/* Certificate Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {cert.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4" />
                  <span>{cert.institution}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <Badge variant="outline" className="text-xs">
                    {cert.year}
                  </Badge>
                </div>
                
                {cert.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">
              Qualificações Profissionais
            </span>
          </div>
          <p className="text-sm text-blue-700">
            {certifications.length} certificação{certifications.length > 1 ? 'ões' : ''} 
            {' '}e especialização{certifications.length > 1 ? 'ões' : ''} comprovam 
            a expertise e o compromisso com a excelência profissional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}