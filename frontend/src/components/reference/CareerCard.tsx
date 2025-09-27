// Phase 3: Reference Data Integration - Career Card Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, TrendingUp, DollarSign, Users, ExternalLink } from 'lucide-react';
import type { Career } from '@/types';

interface CareerCardProps {
  career: Career;
  onClick?: (career: Career) => void;
  showDetails?: boolean;
  className?: string;
}

export const CareerCard: React.FC<CareerCardProps> = ({
  career,
  onClick,
  showDetails = true,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(career);
    }
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getOutlookColor = (outlook: string) => {
    const colors: Record<string, string> = {
      'excellent': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'moderate': 'bg-yellow-100 text-yellow-800',
      'limited': 'bg-red-100 text-red-800',
    };
    return colors[outlook] || 'bg-gray-100 text-gray-800';
  };

  const getGrowthColor = (growth: number) => {
    if (growth >= 20) return 'text-green-600';
    if (growth >= 10) return 'text-blue-600';
    if (growth >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {career.name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`ml-2 flex-shrink-0 ${getOutlookColor(career.job_market_outlook)}`}
          >
            {career.job_market_outlook}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{career.category}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            <div className="line-clamp-2">{career.description}</div>
          </div>
          
          {showDetails && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Entry: {formatSalary(career.average_salary.entry_level)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span className={getGrowthColor(career.growth_rate)}>
                    +{career.growth_rate}%
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-1">Salary Range:</div>
                <div className="text-xs text-gray-500">
                  Entry: {formatSalary(career.average_salary.entry_level)} • 
                  Mid: {formatSalary(career.average_salary.mid_level)} • 
                  Senior: {formatSalary(career.average_salary.senior_level)}
                </div>
              </div>
              
              {career.skills_required && career.skills_required.length > 0 && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Key Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {career.skills_required.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {career.skills_required.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{career.skills_required.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>View Details</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Learn More
              </Button>
              {career.learn_more_url && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(career.learn_more_url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CareerGridProps {
  careers: Career[];
  onCareerClick?: (career: Career) => void;
  loading?: boolean;
  error?: string | null;
  showDetails?: boolean;
  className?: string;
}

export const CareerGrid: React.FC<CareerGridProps> = ({
  careers,
  onCareerClick,
  loading = false,
  error = null,
  showDetails = true,
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
        <div className="text-red-600 mb-2">Error loading careers</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (careers.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No careers found</div>
        <div className="text-sm text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {careers.map((career) => (
        <CareerCard
          key={career.career_id}
          career={career}
          onClick={onCareerClick}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};
