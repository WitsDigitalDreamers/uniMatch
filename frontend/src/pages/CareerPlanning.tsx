import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { careersService } from '@/services/careersService';
import { Career, Course } from '@/types';
import { courses, universities, checkCourseEligibility } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
  CheckCircle
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
  
  // New features state
  const [comparisonCareers, setComparisonCareers] = useState<Career[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCareerForProgression, setSelectedCareerForProgression] = useState<Career | null>(null);
  const [showProgression, setShowProgression] = useState(false);
  const [selectedCareerForSkills, setSelectedCareerForSkills] = useState<Career | null>(null);
  const [showSkillGap, setShowSkillGap] = useState(false);

  // Chatbot state
  const navigate = useNavigate();

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

  // Comparison Tool handlers
  const handleAddToComparison = (career: Career) => {
    if (comparisonCareers.length < 3 && !comparisonCareers.find(c => c.career_id === career.career_id)) {
      setComparisonCareers(prev => [...prev, career]);
      toast({
        title: "Added to Comparison",
        description: `${career.name} has been added to your comparison list.`,
      });
    } else if (comparisonCareers.length >= 3) {
      toast({
        title: "Comparison Full",
        description: "You can compare up to 3 careers at once. Remove one to add another.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromComparison = (careerId: string) => {
    setComparisonCareers(prev => prev.filter(c => c.career_id !== careerId));
  };

  const handleClearComparison = () => {
    setComparisonCareers([]);
  };

  // Progression Flowchart handlers
  const handleViewProgression = (career: Career) => {
    setSelectedCareerForProgression(career);
    setShowProgression(true);
  };

  // Skill Gap Analysis handlers
  const handleViewSkillGap = (career: Career) => {
    setSelectedCareerForSkills(career);
    setShowSkillGap(true);
  };

  const handleOpenChat = (career: Career) => {
    navigate(`/chat?careerId=${encodeURIComponent(career.career_id)}`);
  };

  const generateChatResponse = (question: string, career: Career): string => {
    const q = question.toLowerCase();
    const parts: string[] = [];

    // Basics
    parts.push(`${career.name}: ${career.description}`);

    // Requirements and courses
    const requiredCourseIds = career.required_courses || [];
    const altCourseIds = career.alternative_courses || [];
    const relatedCourses = courses.filter(c => requiredCourseIds.includes(c.course_id) || altCourseIds.includes(c.course_id));

    if (q.includes('require') || q.includes('subject') || q.includes('aps') || q.includes('eligib')) {
      const reqSummaries = relatedCourses.slice(0, 3).map(c => {
        const reqs: string[] = [];
        if (c.requirements.minimum_aps) reqs.push(`APS ≥ ${c.requirements.minimum_aps}`);
        (['mathematics','english','physical_sciences','life_sciences','accounting','economics'] as const).forEach(sub => {
          const r = c.requirements[sub as keyof typeof c.requirements] as number | undefined;
          if (typeof r === 'number') reqs.push(`${sub.replace('_',' ')} ≥ ${r}%`);
        });
        return `- ${c.name}: ${reqs.join(', ') || 'See prospectus'}`;
      });
      parts.push('Typical entry requirements (examples):');
      parts.push(...reqSummaries);
      if (student) {
        const eligibility = relatedCourses.map(c => {
          const e = checkCourseEligibility(student, c);
          return `• ${c.name}: ${e.eligible ? 'Eligible' : `Not yet (missing: ${e.missing.slice(0,2).join('; ') || 'requirements'})`}`;
        }).slice(0, 3);
        parts.push('Your current fit:');
        parts.push(...eligibility);
      }
    }

    // Universities
    if (q.includes('university') || q.includes('where') || q.includes('offer')) {
      const uniNames = Array.from(new Set(relatedCourses.map(c => universities.find(u => u.university_id === c.university_id)?.name).filter(Boolean))).slice(0, 5);
      if (uniNames.length) parts.push(`Universities offering relevant programs: ${uniNames.join(', ')}.`);
    }

    // Salary / outlook
    if (q.includes('salary') || q.includes('pay') || q.includes('money')) {
      const entry = career.average_salary?.entry_level || career.average_salary_entry;
      const mid = career.average_salary?.mid_level || career.average_salary_mid;
      const senior = career.average_salary?.senior_level || career.average_salary_senior;
      const salaryParts = [entry && `Entry ~ R${entry.toLocaleString()}`, mid && `Mid ~ R${mid.toLocaleString()}`, senior && `Senior ~ R${senior.toLocaleString()}`].filter(Boolean) as string[];
      if (salaryParts.length) parts.push(`Typical salaries: ${salaryParts.join(' | ')}`);
    }
    if (q.includes('outlook') || q.includes('demand') || q.includes('growth')) {
      parts.push(`Job outlook: ${career.job_market_outlook}${career.growth_rate ? `, growth rate ~ ${career.growth_rate}%` : ''}.`);
    }

    // Skills
    if (q.includes('skill') || q.includes('need to learn')) {
      const skills = (career.skills_required || []).slice(0, 6);
      if (skills.length) parts.push(`Key skills: ${skills.join(', ')}.`);
    }

    // Fallback
    if (parts.length <= 1) {
      parts.push('Ask about requirements, APS, universities, salary, outlook, or skills.');
    }
    return parts.join('\n');
  };

  const sendMessage = () => {};

  const getSkillGapAnalysis = (career: Career) => {
    if (!student) return { missingSkills: [], existingSkills: [], recommendations: [] };

    const studentSkills = Object.keys(student.marks || {});
    const careerSkills = career.skills_required;
    
    const existingSkills = careerSkills.filter(skill => 
      studentSkills.some(studentSkill => 
        studentSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(studentSkill.toLowerCase())
      )
    );
    
    const missingSkills = careerSkills.filter(skill => 
      !existingSkills.includes(skill)
    );

    const recommendations = missingSkills.map(skill => {
      const skillRecommendations = {
        'Programming': 'Take computer science courses and practice coding',
        'Mathematics': 'Focus on advanced mathematics and statistics',
        'Communication': 'Join debate clubs and public speaking groups',
        'Problem Solving': 'Practice with logic puzzles and case studies',
        'Teamwork': 'Join group projects and team sports',
        'Leadership': 'Take on leadership roles in school clubs',
        'Critical Thinking': 'Study philosophy and analytical subjects',
        'Creativity': 'Engage in arts, design, and creative writing',
        'Technical Skills': 'Learn relevant software and tools',
        'Research': 'Conduct independent research projects'
      };
      
      return {
        skill,
        recommendation: skillRecommendations[skill as keyof typeof skillRecommendations] || 'Focus on developing this skill through practice and study'
      };
    });

    return { existingSkills, missingSkills, recommendations };
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
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Careers</TabsTrigger>
            </TabsList>
            
            {comparisonCareers.length > 0 && (
              <Button 
                onClick={() => setShowComparison(true)}
                className="ml-4"
                variant="outline"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Compare ({comparisonCareers.length})
              </Button>
            )}
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard 
                  key={career.career_id} 
                  career={career} 
                  onSimilarCareers={handleSimilarCareers} 
                  onViewPathway={handleViewPathway}
                  onAddToComparison={handleAddToComparison}
                  onViewProgression={handleViewProgression}
                  onViewSkillGap={handleViewSkillGap}
                  onOpenChat={handleOpenChat}
                />
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
                    <CareerCard 
                  key={career.career_id} 
                  career={career} 
                  onSimilarCareers={handleSimilarCareers} 
                  onViewPathway={handleViewPathway}
                  onAddToComparison={handleAddToComparison}
                  onViewProgression={handleViewProgression}
                  onViewSkillGap={handleViewSkillGap}
                  onOpenChat={handleOpenChat}
                />
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
                <CareerCard 
                  key={career.career_id} 
                  career={career} 
                  onSimilarCareers={handleSimilarCareers} 
                  onViewPathway={handleViewPathway}
                  onAddToComparison={handleAddToComparison}
                  onViewProgression={handleViewProgression}
                  onViewSkillGap={handleViewSkillGap}
                  onOpenChat={handleOpenChat}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-demand" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard 
                  key={career.career_id} 
                  career={career} 
                  onSimilarCareers={handleSimilarCareers} 
                  onViewPathway={handleViewPathway}
                  onAddToComparison={handleAddToComparison}
                  onViewProgression={handleViewProgression}
                  onViewSkillGap={handleViewSkillGap}
                  onOpenChat={handleOpenChat}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high-salary" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCareers.map((career) => (
                <CareerCard 
                  key={career.career_id} 
                  career={career} 
                  onSimilarCareers={handleSimilarCareers} 
                  onViewPathway={handleViewPathway}
                  onAddToComparison={handleAddToComparison}
                  onViewProgression={handleViewProgression}
                  onViewSkillGap={handleViewSkillGap}
                  onOpenChat={handleOpenChat}
                />
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

      {/* Comparison Tool Modal */}
      {showComparison && (
        <ComparisonTool 
          careers={comparisonCareers}
          onRemove={handleRemoveFromComparison}
          onClear={handleClearComparison}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Progression Flowchart Modal */}
      {showProgression && selectedCareerForProgression && (
        <ProgressionFlowchart 
          career={selectedCareerForProgression}
          onClose={() => setShowProgression(false)}
        />
      )}

      {/* Skill Gap Analysis Modal */}
      {showSkillGap && selectedCareerForSkills && (
        <SkillGapAnalysis 
          career={selectedCareerForSkills}
          onClose={() => setShowSkillGap(false)}
          getSkillGapAnalysis={getSkillGapAnalysis}
        />
      )}

      {/* Chat moved to dedicated page at /chat */}
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
const CareerCard = ({ career, onSimilarCareers, onViewPathway, onAddToComparison, onViewProgression, onViewSkillGap, onOpenChat }: { 
  career: Career; 
  onSimilarCareers?: (careerId: string) => void; 
  onViewPathway?: (careerId: string) => void;
  onAddToComparison?: (career: Career) => void;
  onViewProgression?: (career: Career) => void;
  onViewSkillGap?: (career: Career) => void;
  onOpenChat?: (career: Career) => void;
}) => {
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
                onClick={() => onOpenChat ? onOpenChat(career) : window.open(career.learn_more_url, '_blank')}
              >
                Learn More
              </Button>
       
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {onAddToComparison && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onAddToComparison(career)}
                >
                  Compare
                </Button>
              )}
              {onViewProgression && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onViewProgression(career)}
                >
                  Progression
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {onViewSkillGap && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewSkillGap(career)}
                >
                  Skill Gap
                </Button>
              )}
           
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Comparison Tool Component
const ComparisonTool = ({ careers, onRemove, onClear, onClose }: {
  careers: Career[];
  onRemove: (careerId: string) => void;
  onClear: () => void;
  onClose: () => void;
}) => {
  if (careers.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Career Comparison</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClear}>
                Clear All
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Career</th>
                  <th className="text-left p-4 font-semibold">Industry</th>
                  <th className="text-left p-4 font-semibold">Salary (Entry)</th>
                  <th className="text-left p-4 font-semibold">Growth Rate</th>
                  <th className="text-left p-4 font-semibold">Job Outlook</th>
                  <th className="text-left p-4 font-semibold">Skills Required</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career) => (
                  <tr key={career.career_id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{career.name}</div>
                        <div className="text-sm text-gray-600">{career.description}</div>
                      </div>
                    </td>
                    <td className="p-4">{career.category}</td>
                    <td className="p-4">
                      R{career.average_salary?.entry_level?.toLocaleString() || career.average_salary_entry?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="p-4">{career.growth_rate}%</td>
                    <td className="p-4">
                      <Badge className={
                        career.job_market_outlook === 'High demand' ? 'bg-green-100 text-green-800' :
                        career.job_market_outlook === 'Moderate demand' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {career.job_market_outlook}
                      </Badge>
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onRemove(career.career_id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progression Flowchart Component
const ProgressionFlowchart = ({ career, onClose }: { career: Career; onClose: () => void }) => {
  const progressionSteps = [
    {
      level: "Entry Level (0-2 years)",
      title: "Junior/Associate",
      description: "Learning the basics and gaining foundational experience",
      skills: career.skills_required.slice(0, 3),
      salary: career.average_salary?.entry_level || career.average_salary_entry || 0,
      responsibilities: [
        "Complete assigned tasks and projects",
        "Learn company processes and tools",
        "Seek mentorship and guidance",
        "Build professional network"
      ]
    },
    {
      level: "Mid Level (3-7 years)",
      title: "Professional/Specialist",
      description: "Taking on more responsibility and developing expertise",
      skills: career.skills_required.slice(0, 5),
      salary: career.average_salary?.mid_level || career.average_salary_mid || 0,
      responsibilities: [
        "Lead small projects or teams",
        "Mentor junior colleagues",
        "Develop specialized knowledge",
        "Contribute to strategic decisions"
      ]
    },
    {
      level: "Senior Level (8+ years)",
      title: "Senior Professional/Manager",
      description: "Leading teams and making strategic decisions",
      skills: career.skills_required,
      salary: career.average_salary?.senior_level || career.average_salary_senior || 0,
      responsibilities: [
        "Lead large projects and teams",
        "Make strategic business decisions",
        "Mentor and develop others",
        "Drive innovation and change"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{career.name} Career Progression</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="space-y-8">
            {progressionSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                          <p className="text-blue-600 font-medium">{step.level}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            R{step.salary.toLocaleString()}/year
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Key Responsibilities</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {step.responsibilities.map((responsibility, respIndex) => (
                              <li key={respIndex} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {responsibility}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < progressionSteps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skill Gap Analysis Component
const SkillGapAnalysis = ({ career, onClose, getSkillGapAnalysis }: { 
  career: Career; 
  onClose: () => void;
  getSkillGapAnalysis: (career: Career) => { existingSkills: string[]; missingSkills: string[]; recommendations: Array<{skill: string; recommendation: string}> };
}) => {
  const { existingSkills, missingSkills, recommendations } = getSkillGapAnalysis(career);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Skill Gap Analysis - {career.name}</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Skills Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Skills You Have ({existingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {existingSkills.length > 0 ? (
                    existingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-green-600 text-sm">No matching skills found</p>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Skills to Develop ({missingSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill, index) => (
                    <Badge key={index} className="bg-red-100 text-red-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Development Recommendations */}
            {recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Development Recommendations
                </h3>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
                      <h4 className="font-medium text-blue-900 mb-2">{rec.skill}</h4>
                      <p className="text-blue-700 text-sm">{rec.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Progress Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Overall Readiness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(existingSkills.length / career.skills_required.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((existingSkills.length / career.skills_required.length) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  You have {existingSkills.length} out of {career.skills_required.length} required skills.
                  {missingSkills.length > 0 && (
                    <span> Focus on developing the {missingSkills.length} missing skills to improve your readiness for this career.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPlanning;
