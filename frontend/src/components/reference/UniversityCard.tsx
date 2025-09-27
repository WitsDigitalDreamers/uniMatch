// Phase 3: Reference Data Integration - University Card Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building, Users } from 'lucide-react';
import type { University } from '@/types';

interface UniversityCardProps {
  university: University;
  onClick?: (university: University) => void;
  showDetails?: boolean;
  className?: string;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  onClick,
  showDetails = true,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(university);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {university.name}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {university.province}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{university.location}</span>
          </div>
          
          {showDetails && (
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>University</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>View Courses</span>
            </div>
            <div className="text-xs text-gray-400">
              Click to explore
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface UniversityGridProps {
  universities: University[];
  onUniversityClick?: (university: University) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export const UniversityGrid: React.FC<UniversityGridProps> = ({
  universities,
  onUniversityClick,
  loading = false,
  error = null,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 mb-2">Error loading universities</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (universities.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No universities found</div>
        <div className="text-sm text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {universities.map((university) => (
        <UniversityCard
          key={university.university_id}
          university={university}
          onClick={onUniversityClick}
        />
      ))}
    </div>
  );
};
