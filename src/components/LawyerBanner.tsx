"use client";

import { Lawyer } from "@/types/lawyer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Phone, Mail, MessageCircle, Calendar, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LawyerBannerProps {
  lawyer: Lawyer;
}

export function LawyerBanner({ lawyer }: LawyerBannerProps) {
  const handleWhatsAppClick = () => {
    if (lawyer.whatsapp_url) {
      window.open(lawyer.whatsapp_url, '_blank');
    }
  };

  const handleCallClick = () => {
    if (lawyer.phone) {
      window.open(`tel:${lawyer.phone}`, '_self');
    }
  };

  const handleEmailClick = () => {
    if (lawyer.email) {
      window.open(`mailto:${lawyer.email}`, '_self');
    }
  };

  return (
    <div className="relative">
      {/* Banner Background */}
      <div 
        className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden"
        style={{
          backgroundImage: lawyer.banner_url ? `url(${lawyer.banner_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Plan Badge */}
        {lawyer.plan && (
          <div className="absolute top-4 right-4">
            <Badge 
              variant={lawyer.plan === 'gold' ? 'default' : lawyer.plan === 'silver' ? 'secondary' : 'outline'}
              className={`
                ${lawyer.plan === 'gold' ? 'bg-yellow-500 text-yellow-900' : ''}
                ${lawyer.plan === 'silver' ? 'bg-gray-300 text-gray-800' : ''}
                ${lawyer.plan === 'basic' ? 'bg-blue-100 text-blue-800' : ''}
                font-semibold px-3 py-1
              `}
            >
              {lawyer.plan.toUpperCase()}
            </Badge>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <Card className="mx-4 -mt-20 relative z-10 p-6 bg-white shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
              <AvatarImage 
                src={lawyer.profile_image_url || lawyer.logo_url} 
                alt={lawyer.name}
              />
              <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-600">
                {lawyer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            {/* Rating */}
            {lawyer.average_rating && (
              <div className="flex items-center gap-1 mt-3">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{lawyer.average_rating}</span>
                <span className="text-gray-500">({lawyer.total_reviews} avaliações)</span>
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {lawyer.name}
                </h1>
                
                {/* OAB */}
                {lawyer.oab && (
                  <p className="text-gray-600 font-medium mb-3">OAB: {lawyer.oab}</p>
                )}

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {lawyer.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                {/* Experience and Location */}
                <div className="space-y-2 text-sm text-gray-600">
                  {lawyer.years_of_experience && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{lawyer.years_of_experience} anos de experiência</span>
                    </div>
                  )}
                  
                  {lawyer.office_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{lawyer.office_address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button 
                  onClick={handleWhatsAppClick}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!lawyer.whatsapp_url}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleCallClick}
                  disabled={!lawyer.phone}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleEmailClick}
                  disabled={!lawyer.email}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  E-mail
                </Button>
                
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                {lawyer.consultation_fee && (
                  <div>
                    <span className="text-gray-600">Consulta: </span>
                    <span className="font-semibold text-green-600">
                      R$ {lawyer.consultation_fee}
                    </span>
                  </div>
                )}
                
                {lawyer.hourly_rate && (
                  <div>
                    <span className="text-gray-600">Hora: </span>
                    <span className="font-semibold text-green-600">
                      R$ {lawyer.hourly_rate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}