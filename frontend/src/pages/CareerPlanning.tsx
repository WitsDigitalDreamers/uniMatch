import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { careersService } from '@/services/careersService';
import { Career, Course } from '@/types';
import { courses } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Star,
  Briefcase,
  GraduationCap,
  Target,
  BarChart3,
  Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CareerPlanning = () => {
  const { student } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);
  const [filteredCareers, setFilteredCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedOutlook, setSelectedOutlook] = useState('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [studentInterests, setStudentInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseCareers, setCourseCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadCareers();
    if (student) {
      loadStudentInterests();
    }
  }, [student]);

  const loadCareers = () => {
    const allCareers = careersService.getAllCareers();
    setCareers(allCareers);
    setFilteredCareers(allCareers);
    setLoading(false);
  };

  const loadStudentInterests = () => {
    if (!student) return;
    const interests = careersService.getStudentInterests(student.id_number);
    setStudentInterests(interests);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let results = careers;
    
    if (query.trim()) {
      results = careersService.searchCareers(query);
    }
    
    // Apply additional filters
    results = applyFilters(results);
    setFilteredCareers(results);
  };

  const applyFilters = (careersList: Career[]) => {
    let filtered = careersList;
    
    if (selectedIndustry !== 'all') {
      filtered = careersService.getCareersByIndustry(selectedIndustry);
    }
    
    if (selectedOutlook !== 'all') {
      filtered = filtered.filter(career => career.job_market_outlook === selectedOutlook);
    }
    
    return filtered;
  };

  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
    let results = careers;
    
    if (searchQuery.trim()) {
      results = careersService.searchCareers(searchQuery);
    }
    
    if (industry !== 'all') {
      results = careersService.getCareersByIndustry(industry);
    }
    
    if (selectedOutlook !== 'all') {
      results = results.filter(career => career.job_market_outlook === selectedOutlook);
    }
    
    setFilteredCareers(results);
  };

  const handleOutlookChange = (outlook: string) => {
    setSelectedOutlook(outlook);
    let results = careers;
    
    if (searchQuery.trim()) {
      results = careersService.searchCareers(searchQuery);
    }
    
    if (selectedIndustry !== 'all') {
      results = careersService.getCareersByIndustry(selectedIndustry);
    }
    
    if (outlook !== 'all') {
      results = results.filter(career => career.job_market_outlook === outlook);
    }
    
    setFilteredCareers(results);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    let results = careers;
    
    if (tab === 'recommended' && student) {
      results = careersService.getRecommendedCareers(studentInterests);
    } else if (tab === 'high-demand') {
      results = careersService.getCareersByDemand('High demand');
    } else if (tab === 'high-salary') {
      results = careersService.getCareersBySalaryRange(400000, 2000000);
    } else if (tab === 'course-based') {
      results = courseCareers;
    }
    
    setFilteredCareers(results);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    if (courseId && courseId !== 'all') {
      const course = courses.find(c => c.course_id === courseId);
      if (course) {
        // Find careers that match this course
        const relatedCareers = careers.filter(career => 
          career.required_courses.some(requiredCourse => 
            requiredCourse.toLowerCase().includes(course.faculty.toLowerCase()) ||
            course.name.toLowerCase().includes(requiredCourse.toLowerCase())
          ) ||
          career.required_courses.some(requiredCourse => 
            course.name.toLowerCase().includes(requiredCourse.toLowerCase())
          )
        );
        setCourseCareers(relatedCareers);
        setFilteredCareers(relatedCareers);
        setSelectedTab('course-based');
      }
    } else {
      setCourseCareers([]);
      setFilteredCareers(careers);
      setSelectedTab('all');
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !studentInterests.includes(newInterest.trim())) {
      const updatedInterests = [...studentInterests, newInterest.trim()];
      setStudentInterests(updatedInterests);
      if (student) {
        careersService.saveStudentInterests(student.id_number, updatedInterests);
      }
      setNewInterest('');
      toast({
        title: "Interest Added",
        description: "Your interest has been added to your profile.",
      });
    }
  };

  const removeInterest = (interest: string) => {
    const updatedInterests = studentInterests.filter(i => i !== interest);
    setStudentInterests(updatedInterests);
    if (student) {
      careersService.saveStudentInterests(student.id_number, updatedInterests);
    }
    toast({
      title: "Interest Removed",
      description: "Interest has been removed from your profile.",
    });
  };

  const getOutlookColor = (outlook: Career['job_market_outlook']) => {
    switch (outlook) {
      case 'High demand':
        return 'bg-green-100 text-green-800';
      case 'Moderate demand':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low demand':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthColor = (growth: Career['growth_prospects']) => {
    switch (growth) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading careers...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <GraduationCap className="h-4 w-4" />
          <AlertDescription>
            Please log in to access career planning.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Career Planning</h1>
          <p className="mt-2 text-gray-600">
            Explore different career paths and find the perfect match for your skills and interests.
          </p>
        </div>

        {/* Course Selection Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Select Your Desired Course
            </CardTitle>
            <CardDescription>
              Choose a course you want to study to see related career opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a course to explore careers..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.course_id} value={course.course_id}>
                      {course.name} - {course.faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedCourse && selectedCourse !== 'all' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Selected Course:</h4>
                  <p className="text-blue-800">
                    {courses.find(c => c.course_id === selectedCourse)?.name} - 
                    {courses.find(c => c.course_id === selectedCourse)?.faculty}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {courseCareers.length} career(s) available for this course
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Student Interests Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Your Interests
            </CardTitle>
            <CardDescription>
              Add your interests to get personalized career recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add an interest (e.g., technology, medicine, art)"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button onClick={addInterest}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {studentInterests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                  {interest} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search careers..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {careersService.getIndustries().map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedOutlook} onValueChange={handleOutlookChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Outlook" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outlooks</SelectItem>
                  <SelectItem value="High demand">High Demand</SelectItem>
                  <SelectItem value="Moderate demand">Moderate Demand</SelectItem>
                  <SelectItem value="Low demand">Low Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Career Tabs */}
        <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Careers</TabsTrigger>
            <TabsTrigger value="course-based">Course-Based</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="high-demand">High Demand</TabsTrigger>
            <TabsTrigger value="high-salary">High Salary</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="course-based" className="mt-6">
            {selectedCourse && selectedCourse !== 'all' ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Careers for {courses.find(c => c.course_id === selectedCourse)?.name}
                  </h3>
                  <p className="text-blue-800 text-sm">
                    {courseCareers.length} career(s) available for this course
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCareers.map((career) => (
                    <CareerCard key={career.career_id} career={career} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">Choose a course above to see related career opportunities.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-demand" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-salary" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Career Card Component
const CareerCard = ({ career }: { career: Career }) => {
  const getOutlookColor = (outlook: Career['job_market_outlook']) => {
    switch (outlook) {
      case 'High demand':
        return 'bg-green-100 text-green-800';
      case 'Moderate demand':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low demand':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthColor = (growth: Career['growth_prospects']) => {
    switch (growth) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{career.name}</CardTitle>
            <CardDescription className="mt-1">{career.industry}</CardDescription>
          </div>
          <Badge className={getOutlookColor(career.job_market_outlook)}>
            {career.job_market_outlook}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 line-clamp-3">{career.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span>R{career.average_salary?.entry_level?.toLocaleString() || career.average_salary_entry?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <Badge className={getGrowthColor(career.growth_prospects)}>
                {career.growth_prospects}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>{career.work_life_balance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-600" />
              <span>{career.job_security}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Key Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {career.skills_required.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {career.skills_required.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{career.skills_required.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPlanning;
