// Phase 3: Reference Data Integration - Residence Card Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, DollarSign, Wifi, Car, Dumbbell, Phone, Mail } from 'lucide-react';
import type { Residence } from '@/types';

interface ResidenceCardProps {
  residence: Residence;
  onClick?: (residence: Residence) => void;
  showDetails?: boolean;
  showUniversity?: boolean;
  className?: string;
}

export const ResidenceCard: React.FC<ResidenceCardProps> = ({
  residence,
  onClick,
  showDetails = true,
  showUniversity = true,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(residence);
    }
  };

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cost);
  };

  const getGenderColor = (gender: string) => {
    const colors: Record<string, string> = {
      'male': 'bg-blue-100 text-blue-800',
      'female': 'bg-pink-100 text-pink-800',
      'mixed': 'bg-purple-100 text-purple-800',
    };
    return colors[gender] || 'bg-gray-100 text-gray-800';
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-4 w-4" />;
    }
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) {
      return <Dumbbell className="h-4 w-4" />;
    }
    if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return <Car className="h-4 w-4" />;
    }
    return <Users className="h-4 w-4" />;
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {residence.name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`ml-2 flex-shrink-0 ${getGenderColor(residence.gender)}`}
          >
            {residence.gender}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showUniversity && residence.universities && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {residence.universities.name} - {residence.location}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCost(residence.price_per_month)}/month</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{residence.capacity} students</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Distance: {residence.distance_from_campus}</div>
            <div className="text-xs text-gray-500">
              Annual cost: {formatCost(residence.estimated_annual_cost)}
            </div>
          </div>
          
          {showDetails && residence.amenities && residence.amenities.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-2">Amenities:</div>
                <div className="flex flex-wrap gap-2">
                  {residence.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </div>
                  ))}
                  {residence.amenities.length > 4 && (
                    <div className="text-xs text-gray-500">
                      +{residence.amenities.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {residence.contact_info && (
            <div className="space-y-1 pt-2 border-t">
              <div className="flex items-center text-xs text-gray-500">
                <Phone className="h-3 w-3 mr-1" />
                <span>{residence.contact_info.phone}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Mail className="h-3 w-3 mr-1" />
                <span className="truncate">{residence.contact_info.email}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-500">
              Available
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ResidenceGridProps {
  residences: Residence[];
  onResidenceClick?: (residence: Residence) => void;
  loading?: boolean;
  error?: string | null;
  showUniversity?: boolean;
  className?: string;
}

export const ResidenceGrid: React.FC<ResidenceGridProps> = ({
  residences,
  onResidenceClick,
  loading = false,
  error = null,
  showUniversity = true,
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
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
        <div className="text-red-600 mb-2">Error loading residences</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (residences.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No residences found</div>
        <div className="text-sm text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {residences.map((residence) => (
        <ResidenceCard
          key={residence.residence_id}
          residence={residence}
          onClick={onResidenceClick}
          showUniversity={showUniversity}
        />
      ))}
    </div>
  );
};
