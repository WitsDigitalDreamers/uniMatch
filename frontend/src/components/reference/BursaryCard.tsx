// Phase 3: Reference Data Integration - Bursary Card Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building, DollarSign, Users, Clock } from 'lucide-react';
import type { Bursary } from '@/types';

interface BursaryCardProps {
  bursary: Bursary;
  onClick?: (bursary: Bursary) => void;
  showDetails?: boolean;
  className?: string;
}

export const BursaryCard: React.FC<BursaryCardProps> = ({
  bursary,
  onClick,
  showDetails = true,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(bursary);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  };

  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate < today;
  };

  const getDeadlineStatus = (deadline: string) => {
    if (isDeadlinePassed(deadline)) {
      return { status: 'expired', color: 'bg-red-100 text-red-800' };
    }
    if (isDeadlineApproaching(deadline)) {
      return { status: 'approaching', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'active', color: 'bg-green-100 text-green-800' };
  };

  const deadlineStatus = getDeadlineStatus(bursary.deadline);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {bursary.name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`ml-2 flex-shrink-0 ${deadlineStatus.color}`}
          >
            {deadlineStatus.status === 'expired' ? 'Expired' : 
             deadlineStatus.status === 'approaching' ? 'Due Soon' : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Building className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{bursary.provider}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Deadline: {formatDate(bursary.deadline)}</span>
          </div>
          
          {showDetails && bursary.eligibility && (
            <div className="space-y-2">
              {bursary.eligibility.minimum_aps && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Min APS: {bursary.eligibility.minimum_aps}</span>
                </div>
              )}
              
              {bursary.eligibility.minimum_household_income && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Max Income: R{bursary.eligibility.minimum_household_income.toLocaleString()}</span>
                </div>
              )}
              
              {bursary.eligibility.faculties && bursary.eligibility.faculties.length > 0 && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Eligible Faculties:</div>
                  <div className="flex flex-wrap gap-1">
                    {bursary.eligibility.faculties.slice(0, 3).map((faculty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {faculty}
                      </Badge>
                    ))}
                    {bursary.eligibility.faculties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{bursary.eligibility.faculties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {bursary.eligibility.additional_criteria && bursary.eligibility.additional_criteria.length > 0 && (
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-1">Requirements:</div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {bursary.eligibility.additional_criteria.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>View Details</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              disabled={isDeadlinePassed(bursary.deadline)}
            >
              {isDeadlinePassed(bursary.deadline) ? 'Expired' : 'Apply Now'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface BursaryGridProps {
  bursaries: Bursary[];
  onBursaryClick?: (bursary: Bursary) => void;
  loading?: boolean;
  error?: string | null;
  showDetails?: boolean;
  className?: string;
}

export const BursaryGrid: React.FC<BursaryGridProps> = ({
  bursaries,
  onBursaryClick,
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
        <div className="text-red-600 mb-2">Error loading bursaries</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (bursaries.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No bursaries found</div>
        <div className="text-sm text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {bursaries.map((bursary) => (
        <BursaryCard
          key={bursary.bursary_id}
          bursary={bursary}
          onClick={onBursaryClick}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};
