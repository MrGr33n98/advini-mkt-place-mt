"use client";

import { Achievement } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Shield, Award, Medal, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AchievementsListProps {
  achievements: Achievement[];
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  shield: Shield,
  award: Award,
  medal: Medal,
  target: Target,
};

export function AchievementsList({ achievements }: AchievementsListProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Conquistas e Reconhecimentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Award;
            
            return (
              <div 
                key={achievement.id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {achievement.title}
                    </h3>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {formatDate(achievement.date)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {achievement.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-900">
              Histórico de Excelência
            </span>
          </div>
          <p className="text-sm text-yellow-700">
            {achievements.length} reconhecimento{achievements.length > 1 ? 's' : ''} 
            {' '}que demonstram a qualidade e o comprometimento profissional.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}