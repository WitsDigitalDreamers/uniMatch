import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  BookOpen,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import { 
  courses, 
  universities, 
  checkCourseEligibility, 
  calculateAPS 
} from '@/data/mockData';

const Courses = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [appliedCourses, setAppliedCourses] = useState<string[]>([]);
  const [showModules, setShowModules] = useState<string[]>([]);
  
  if (!student) return null;

  const aps = calculateAPS(student.marks);
  
  // Get unique faculties
  const faculties = [...new Set(courses.map(c => c.faculty))];
  
  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUniversity = selectedUniversity === 'all' || course.university_id === selectedUniversity;
    const matchesFaculty = selectedFaculty === 'all' || course.faculty === selectedFaculty;
    
    return matchesSearch && matchesUniversity && matchesFaculty;
  });

  // Categorize courses by eligibility
  const eligibleCourses = filteredCourses.filter(course => 
    checkCourseEligibility(student, course).eligible
  );
  
  const partiallyEligible = filteredCourses.filter(course => {
    const eligibility = checkCourseEligibility(student, course);
    return !eligibility.eligible && eligibility.missing.length <= 2;
  });
  
  const notEligible = filteredCourses.filter(course => {
    const eligibility = checkCourseEligibility(student, course);
    return !eligibility.eligible && eligibility.missing.length > 2;
  });

  const CourseCard = ({ course }: { course: typeof courses[0] }) => {
    const university = universities.find(u => u.university_id === course.university_id);
    const eligibility = checkCourseEligibility(student, course);
    const isApplied = appliedCourses.includes(course.course_id);
    const isModulesVisible = showModules.includes(course.course_id);
    
    let statusIcon;
    let statusColor;
    let statusText;
    
    if (eligibility.eligible) {
      statusIcon = <CheckCircle className="w-5 h-5" />;
      statusColor = "text-success";
      statusText = "Eligible";
    } else if (eligibility.missing.length <= 2) {
      statusIcon = <AlertCircle className="w-5 h-5" />;
      statusColor = "text-warning";
      statusText = "Partially Eligible";
    } else {
      statusIcon = <XCircle className="w-5 h-5" />;
      statusColor = "text-destructive";
      statusText = "Not Eligible";
    }

    const handleApply = () => {
      if (!isApplied) {
        setAppliedCourses(prev => [...prev, course.course_id]);
        toast({
          title: "Application Complete",
          description: `Your application for ${course.name} has been submitted successfully.`,
          variant: "default",
        });
      }
    };

    const toggleModules = () => {
      setShowModules(prev => 
        prev.includes(course.course_id) 
          ? prev.filter(id => id !== course.course_id)
          : [...prev, course.course_id]
      );
    };

    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {university?.name}
              </CardDescription>
            </div>
            <div className={`flex items-center gap-2 ${statusColor}`}>
              {statusIcon}
              <span className="text-sm font-medium">{statusText}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{course.faculty}</Badge>
            <Badge variant="outline">{university?.location}</Badge>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-1">Estimated Annual Cost</div>
            <div className="text-lg font-bold text-primary">R {course.estimated_cost.toLocaleString()}</div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Requirements:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>APS Score:</span>
                  <span className={aps >= (course.requirements.minimum_aps || 0) ? "text-success" : "text-destructive"}>
                    {course.requirements.minimum_aps}
                  </span>
                </div>
                {course.requirements.mathematics && (
                  <div className="flex justify-between">
                    <span>Mathematics:</span>
                    <span className={student.marks.mathematics >= course.requirements.mathematics ? "text-success" : "text-destructive"}>
                      {course.requirements.mathematics}%
                    </span>
                  </div>
                )}
                {course.requirements.english && (
                  <div className="flex justify-between">
                    <span>English:</span>
                    <span className={student.marks.english >= course.requirements.english ? "text-success" : "text-destructive"}>
                      {course.requirements.english}%
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {course.requirements.physical_sciences && (
                  <div className="flex justify-between">
                    <span>Physical Sciences:</span>
                    <span className={student.marks.physical_sciences >= course.requirements.physical_sciences ? "text-success" : "text-destructive"}>
                      {course.requirements.physical_sciences}%
                    </span>
                  </div>
                )}
                {course.requirements.life_sciences && (
                  <div className="flex justify-between">
                    <span>Life Sciences:</span>
                    <span className={student.marks.life_sciences >= course.requirements.life_sciences ? "text-success" : "text-destructive"}>
                      {course.requirements.life_sciences}%
                    </span>
                  </div>
                )}
                {course.requirements.accounting && (
                  <div className="flex justify-between">
                    <span>Accounting:</span>
                    <span className={student.marks.accounting >= course.requirements.accounting ? "text-success" : "text-destructive"}>
                      {course.requirements.accounting}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {!eligibility.eligible && eligibility.missing.length > 0 && (
              <div className="pt-2 border-t">
                <h5 className="text-xs font-medium text-destructive mb-1">Missing Requirements:</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {eligibility.missing.map((req, index) => (
                    <li key={index}>• {req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Collapsible open={isModulesVisible} onOpenChange={() => toggleModules()}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Modules
                </div>
                {isModulesVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h5 className="text-sm font-medium mb-2">Course Modules:</h5>
                <ul className="text-xs space-y-1">
                  {course.modules.map((module, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="pt-2">
            <Button 
              onClick={handleApply}
              variant={isApplied ? "secondary" : "default"}
              size="sm" 
              className="w-full"
              disabled={isApplied}
            >
              <Send className="w-4 h-4 mr-2" />
              {isApplied ? "Application Complete" : "Apply"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Course Explorer</h1>
        <p className="text-muted-foreground">
          Discover university courses based on your academic performance. Your APS score: <span className="font-semibold text-primary">{aps}</span>
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">University</label>
              <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map(uni => (
                    <SelectItem key={uni.university_id} value={uni.university_id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Faculty</label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty} value={faculty}>
                      {faculty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses by Eligibility */}
      <Tabs defaultValue="eligible" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="eligible" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Eligible ({eligibleCourses.length})
          </TabsTrigger>
          <TabsTrigger value="partial" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Partially Eligible ({partiallyEligible.length})
          </TabsTrigger>
          <TabsTrigger value="not-eligible" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Not Eligible ({notEligible.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="eligible" className="space-y-6">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Courses you fully qualify for</span>
          </div>
          {eligibleCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleCourses.map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses match your current search criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="partial" className="space-y-6">
          <div className="flex items-center gap-2 text-warning">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Courses you might qualify for with some improvements</span>
          </div>
          {partiallyEligible.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partiallyEligible.map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No partially eligible courses found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="not-eligible" className="space-y-6">
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Courses that require significant improvement</span>
          </div>
          {notEligible.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notEligible.map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No courses in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;