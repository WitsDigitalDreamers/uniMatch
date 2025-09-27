// Phase 3: Reference Data Integration - Course Card Component

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, MapPin, DollarSign, Star, Clock } from 'lucide-react';
import type { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onClick?: (course: Course) => void;
  showDetails?: boolean;
  showUniversity?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClick,
  showDetails = true,
  showUniversity = true,
  className = ''
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(course);
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

  const getFacultyColor = (faculty: string) => {
    const colors: Record<string, string> = {
      'Engineering': 'bg-blue-100 text-blue-800',
      'Health Sciences': 'bg-red-100 text-red-800',
      'Commerce': 'bg-green-100 text-green-800',
      'Science': 'bg-purple-100 text-purple-800',
      'Law': 'bg-yellow-100 text-yellow-800',
      'Humanities': 'bg-pink-100 text-pink-800',
      'Agriculture': 'bg-orange-100 text-orange-800',
      'Technology': 'bg-indigo-100 text-indigo-800',
    };
    return colors[faculty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${className}`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
            {course.name}
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={`ml-2 flex-shrink-0 ${getFacultyColor(course.faculty)}`}
          >
            {course.faculty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showUniversity && course.universities && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {course.universities.name} - {course.universities.location}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 mr-2" />
              <span>APS: {course.points_required}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCost(course.estimated_cost)}</span>
            </div>
          </div>
          
          {showDetails && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{course.modules.length} modules</span>
              </div>
              
              {course.modules.length > 0 && (
                <div className="text-xs text-gray-500">
                  <div className="font-medium mb-1">Key modules:</div>
                  <div className="line-clamp-2">
                    {course.modules.slice(0, 3).join(', ')}
                    {course.modules.length > 3 && '...'}
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
            <Button variant="outline" size="sm" className="text-xs">
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CourseGridProps {
  courses: Course[];
  onCourseClick?: (course: Course) => void;
  loading?: boolean;
  error?: string | null;
  showUniversity?: boolean;
  className?: string;
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  onCourseClick,
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
        <div className="text-red-600 mb-2">Error loading courses</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <div className="text-gray-600 mb-2">No courses found</div>
        <div className="text-sm text-gray-500">Try adjusting your search criteria</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {courses.map((course) => (
        <CourseCard
          key={course.course_id}
          course={course}
          onClick={onCourseClick}
          showUniversity={showUniversity}
        />
      ))}
    </div>
  );
};
