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
  Heart,
  ArrowRight,
  ChevronRight
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
  const [selectedCareerForPathway, setSelectedCareerForPathway] = useState<Career | null>(null);

  // Get courses that have corresponding careers
  const getCoursesWithCareers = (): Course[] => {
    const careerCourseIds = new Set<string>();
    
    careers.forEach(career => {
      career.required_courses.forEach(courseId => careerCourseIds.add(courseId));
      career.alternative_courses?.forEach(courseId => careerCourseIds.add(courseId));
    });
    
    return courses.filter(course => careerCourseIds.has(course.course_id));
  };

  // Find similar careers based on skills, industry, and course requirements
  const getSimilarCareers = (targetCareer: Career): Career[] => {
    return careers
      .filter(career => career.career_id !== targetCareer.career_id)
      .map(career => {
        let similarityScore = 0;
        
        // Check industry similarity
        if (career.category === targetCareer.category) {
          similarityScore += 3;
        }
        
        // Check skills similarity
        const commonSkills = career.skills_required.filter(skill => 
          targetCareer.skills_required.includes(skill)
        );
        similarityScore += commonSkills.length;
        
        // Check course requirements similarity
        const commonCourses = career.required_courses.filter(courseId =>
          targetCareer.required_courses.includes(courseId) ||
          targetCareer.alternative_courses?.includes(courseId)
        );
        similarityScore += commonCourses.length;
        
        // Check alternative courses
        if (career.alternative_courses) {
          const commonAltCourses = career.alternative_courses.filter(courseId =>
            targetCareer.required_courses.includes(courseId) ||
            targetCareer.alternative_courses?.includes(courseId)
          );
          similarityScore += commonAltCourses.length * 0.5;
        }
        
        return { career, score: similarityScore };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.career);
  };

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
      const course = getCoursesWithCareers().find(c => c.course_id === courseId);
      if (course) {
        // Find careers that have this course in their required or alternative courses
        const relatedCareers = careers.filter(career => 
          career.required_courses.includes(courseId) ||
          career.alternative_courses?.includes(courseId)
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

  const handleSimilarCareers = (careerId: string) => {
    const targetCareer = careers.find(c => c.career_id === careerId);
    if (targetCareer) {
      const similarCareers = getSimilarCareers(targetCareer);
      setFilteredCareers(similarCareers);
      setSelectedTab('all');
      toast({
        title: "Similar Careers",
        description: `Showing ${similarCareers.length} careers similar to ${targetCareer.name}`,
      });
    }
  };

  const handleViewPathway = (careerId: string) => {
    const career = careers.find(c => c.career_id === careerId);
    if (career) {
      setSelectedCareerForPathway(career);
    }
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
                  {getCoursesWithCareers().map(course => (
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
                    {getCoursesWithCareers().find(c => c.course_id === selectedCourse)?.name} - 
                    {getCoursesWithCareers().find(c => c.course_id === selectedCourse)?.faculty}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {courseCareers.length} career(s) available for this course
                  </p>
                </div>
              )}
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
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} onSimilarCareers={handleSimilarCareers} onViewPathway={handleViewPathway} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="course-based" className="mt-6">
            {selectedCourse && selectedCourse !== 'all' ? (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Careers for {getCoursesWithCareers().find(c => c.course_id === selectedCourse)?.name}
                  </h3>
                  <p className="text-blue-800 text-sm">
                    {courseCareers.length} career(s) available for this course
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCareers.map((career) => (
                    <CareerCard key={career.career_id} career={career} onSimilarCareers={handleSimilarCareers} onViewPathway={handleViewPathway} />
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
                <CareerCard key={career.career_id} career={career} onSimilarCareers={handleSimilarCareers} onViewPathway={handleViewPathway} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-demand" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} onSimilarCareers={handleSimilarCareers} onViewPathway={handleViewPathway} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-salary" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard key={career.career_id} career={career} onSimilarCareers={handleSimilarCareers} onViewPathway={handleViewPathway} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Career Pathway Modal */}
      {selectedCareerForPathway && (
        <CareerPathway 
          career={selectedCareerForPathway} 
          onClose={() => setSelectedCareerForPathway(null)} 
        />
      )}
    </div>
  );
};

// Career Pathway Component
const CareerPathway = ({ career, onClose }: { career: Career; onClose: () => void }) => {
  const pathwaySteps = [
    {
      level: "Entry Level",
      title: "Junior/Entry Position",
      duration: "0-2 years",
      salary: career.average_salary?.entry_level || career.average_salary_entry || 0,
      description: "Starting position, learning the basics",
      skills: career.skills_required.slice(0, 3)
    },
    {
      level: "Mid Level", 
      title: "Mid-Level Professional",
      duration: "3-7 years",
      salary: career.average_salary?.mid_level || career.average_salary_mid || 0,
      description: "Gaining expertise and taking on more responsibility",
      skills: career.skills_required.slice(0, 4)
    },
    {
      level: "Senior Level",
      title: "Senior Professional/Manager",
      duration: "8+ years", 
      salary: career.average_salary?.senior_level || career.average_salary_senior || 0,
      description: "Leading teams and making strategic decisions",
      skills: career.skills_required
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{career.name} Career Pathway</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="space-y-6">
            {pathwaySteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <Badge variant="outline">{step.level}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{step.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                      
                          <span>R{step.salary.toLocaleString()}/year</span>
                        </div>
                      </div>
                 
                    </div>
                  </div>
                </div>
                {index < pathwaySteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Career Card Component
const CareerCard = ({ career, onSimilarCareers, onViewPathway }: { career: Career; onSimilarCareers?: (careerId: string) => void; onViewPathway?: (careerId: string) => void }) => {
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
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <Badge className={getGrowthColor(career.growth_prospects)}>
                {career.growth_prospects}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>{career.work_life_balance}</span>
            </div>
        
          </div>


          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(career.learn_more_url, '_blank')}
              >
                Learn More
              </Button>
              {onViewPathway && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewPathway(career.career_id)}
                >
                  View Pathway
                </Button>
              )}
            </div>
            {onSimilarCareers && (
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => onSimilarCareers(career.career_id)}
              >
                Similar Careers
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerPlanning;
