import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BookOpen, 
  Star,
  CheckCircle,
  AlertCircle,
  Target,
  Lightbulb,
  Search
} from 'lucide-react';
import { 
  careers, 
  courses, 
  universities, 
  getCareersForCourse
} from '@/data/mockData';

const CareerPlanning = () => {
  const { student } = useAuth();
  const [courseInput, setCourseInput] = useState('');
  const [searchResults, setSearchResults] = useState<typeof courses>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  if (!student) return null;

  const selectedCourseData = selectedCourse ? courses.find(c => c.course_id === selectedCourse) : null;
  const careersForCourse = selectedCourse ? getCareersForCourse(selectedCourse) : [];

  const handleCourseSearch = (value: string) => {
    setCourseInput(value);
    if (value.length > 0) {
      const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(value.toLowerCase()) ||
        course.faculty.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'limited': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutlookIcon = (outlook: string) => {
    switch (outlook) {
      case 'excellent': return <TrendingUp className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'moderate': return <AlertCircle className="w-4 h-4" />;
      case 'limited': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Career Planning</h1>
          <p className="text-muted-foreground">
            Enter a course to discover career paths you can follow
          </p>
        </div>
      </div>

      {/* Course Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search for a Course</CardTitle>
          <CardDescription>
            Enter the name of a course to see career opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Computer Science, Medicine, Engineering..."
                value={courseInput}
                onChange={(e) => handleCourseSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select a course:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {searchResults.map((course) => {
                    const university = universities.find(u => u.university_id === course.university_id);
                    return (
                      <Card 
                        key={course.course_id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCourse === course.course_id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedCourse(course.course_id);
                          setCourseInput(course.name);
                          setSearchResults([]);
                        }}
                      >
                        <CardContent className="p-3">
                          <h4 className="font-medium text-sm">{course.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {university?.name} • {course.faculty}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              APS: {course.minimum_aps}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.duration} years
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Careers for Selected Course */}
      {selectedCourseData && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">
              Career Paths for {selectedCourseData.name}
            </h2>
          </div>

          {careersForCourse.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careersForCourse.map((career) => (
                <Card key={career.career_id} className="transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{career.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {career.category}
                        </CardDescription>
                      </div>
                      <Badge className={getOutlookColor(career.job_market_outlook)}>
                        <div className="flex items-center gap-1">
                          {getOutlookIcon(career.job_market_outlook)}
                          {career.job_market_outlook}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {career.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Entry Level Salary:</span>
                        <span className="font-medium">{formatSalary(career.average_salary.entry_level)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Growth Rate:</span>
                        <span className="font-medium text-green-600">+{career.growth_rate}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {career.skills_required.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {career.skills_required.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{career.skills_required.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(career.learn_more_url, '_blank')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Career Paths Found</h3>
                <p className="text-muted-foreground">
                  No specific career paths are mapped to this course yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tips */}
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Career Planning Tips:</strong> Consider your interests, skills, and long-term goals when choosing a career path. 
          Research job market trends and speak with professionals in your field of interest. 
          Remember that many careers offer multiple entry paths and opportunities for growth.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CareerPlanning;
