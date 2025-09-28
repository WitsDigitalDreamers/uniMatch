import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  GraduationCap, 
  School, 
  TrendingUp, 
  Award,
  BookOpen,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  schools, 
  universities, 
  courses, 
  offers, 
  calculateAPS, 
  checkCourseEligibility 
} from '@/data/mockData';
import { offersService, Application } from '@/services/offersService';

const Dashboard = () => {
  const { student } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [reportsOpen, setReportsOpen] = useState(false);
  
  useEffect(() => {
    const loadApplications = async () => {
      if (student) {
        try {
          const studentApplications = await offersService.getApplications(student.id_number);
          setApplications(studentApplications);
        } catch (error) {
          console.error('Error loading applications:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadApplications();
  }, [student]);
  
  if (!student) return null;

  const studentSchool = schools.find(s => s.school_id === student.school_id);
  const aps = calculateAPS(student.marks);
  
  // Get student's offers
  const studentOffers = offers.filter(o => o.student_id === student.id_number);
  const pendingOffers = studentOffers.filter(o => o.status === 'pending');
  
  // Calculate qualification stats
  const eligibleCourses = courses.filter(course => 
    checkCourseEligibility(student, course).eligible
  );
  
  const partiallyEligible = courses.filter(course => {
    const eligibility = checkCourseEligibility(student, course);
    return !eligibility.eligible && eligibility.missing.length <= 2;
  });

  // Top subjects
  const sortedMarks = Object.entries(student.marks)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Live Reports: lightweight types and mock data
  type AssessmentStatus = 'completed' | 'upcoming';
  type AssessmentType = 'Test' | 'Assignment';
  interface Assessment {
    id: string;
    name: string;
    type: AssessmentType;
    date: string; // ISO or readable date
    weight: number; // percentage weight
    status: AssessmentStatus;
    score?: number; // only when completed
  }
  interface SubjectReport {
    subjectKey: keyof typeof student.marks;
    subjectLabel: string;
    assessments: Assessment[];
  }

  const subjectReports: SubjectReport[] = [
    {
      subjectKey: 'mathematics',
      subjectLabel: 'Mathematics',
      assessments: [
        { id: 'm1', name: 'Algebra Test', type: 'Test', date: '2025-08-28', weight: 20, status: 'completed', score: 78 },
        { id: 'm2', name: 'Calculus Assignment', type: 'Assignment', date: '2025-09-10', weight: 10, status: 'completed', score: 85 },
        { id: 'm3', name: 'Trigonometry Test', type: 'Test', date: '2025-10-05', weight: 25, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'english',
      subjectLabel: 'English',
      assessments: [
        { id: 'e1', name: 'Comprehension Test', type: 'Test', date: '2025-08-20', weight: 15, status: 'completed', score: 72 },
        { id: 'e2', name: 'Essay Assignment', type: 'Assignment', date: '2025-09-18', weight: 15, status: 'completed', score: 80 },
        { id: 'e3', name: 'Literature Test', type: 'Test', date: '2025-10-12', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'physical_sciences',
      subjectLabel: 'Physical Sciences',
      assessments: [
        { id: 'ps1', name: 'Mechanics Test', type: 'Test', date: '2025-08-25', weight: 20, status: 'completed', score: 81 },
        { id: 'ps2', name: 'Chemistry Lab Report', type: 'Assignment', date: '2025-09-22', weight: 10, status: 'completed', score: 76 },
        { id: 'ps3', name: 'Waves & Optics Test', type: 'Test', date: '2025-10-08', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'life_sciences',
      subjectLabel: 'Life Sciences',
      assessments: [
        { id: 'ls1', name: 'Cell Biology Test', type: 'Test', date: '2025-08-18', weight: 15, status: 'completed', score: 79 },
        { id: 'ls2', name: 'Genetics Assignment', type: 'Assignment', date: '2025-09-14', weight: 15, status: 'completed', score: 82 },
        { id: 'ls3', name: 'Human Systems Test', type: 'Test', date: '2025-10-15', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'accounting',
      subjectLabel: 'Accounting',
      assessments: [
        { id: 'acc1', name: 'Financial Statements Test', type: 'Test', date: '2025-08-22', weight: 20, status: 'completed', score: 74 },
        { id: 'acc2', name: 'Cash Flow Assignment', type: 'Assignment', date: '2025-09-19', weight: 10, status: 'completed', score: 86 },
        { id: 'acc3', name: 'Cost Accounting Test', type: 'Test', date: '2025-10-10', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'economics',
      subjectLabel: 'Economics',
      assessments: [
        { id: 'eco1', name: 'Microeconomics Test', type: 'Test', date: '2025-08-30', weight: 20, status: 'completed', score: 71 },
        { id: 'eco2', name: 'Market Analysis Assignment', type: 'Assignment', date: '2025-09-25', weight: 10, status: 'completed', score: 83 },
        { id: 'eco3', name: 'Macroeconomics Test', type: 'Test', date: '2025-10-20', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'geography',
      subjectLabel: 'Geography',
      assessments: [
        { id: 'geo1', name: 'Climatology Test', type: 'Test', date: '2025-08-17', weight: 15, status: 'completed', score: 68 },
        { id: 'geo2', name: 'GIS Assignment', type: 'Assignment', date: '2025-09-12', weight: 10, status: 'completed', score: 77 },
        { id: 'geo3', name: 'Geomorphology Test', type: 'Test', date: '2025-10-07', weight: 20, status: 'upcoming' }
      ]
    },
    {
      subjectKey: 'history',
      subjectLabel: 'History',
      assessments: [
        { id: 'his1', name: 'Source Analysis Test', type: 'Test', date: '2025-08-26', weight: 15, status: 'completed', score: 73 },
        { id: 'his2', name: 'Essay Assignment', type: 'Assignment', date: '2025-09-21', weight: 15, status: 'completed', score: 88 },
        { id: 'his3', name: 'Modern Africa Test', type: 'Test', date: '2025-10-18', weight: 20, status: 'upcoming' }
      ]
    }
  ];

  // Application statistics
  const acceptedApplications = applications.filter(app => app.application_status === 'Accepted');
  const pendingApplications = applications.filter(app => 
    app.application_status === 'Pending' || app.application_status === 'Under Review'
  );
  const waitlistedApplications = applications.filter(app => app.application_status === 'Waitlisted');

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {student.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your university application journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AP Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{aps}</div>
            <p className="text-xs text-muted-foreground">
              Out of 49 possible points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligible Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{eligibleCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses you fully qualify for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingOffers.length}</div>
            <p className="text-xs text-muted-foreground">
              Offers awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Matches</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{partiallyEligible.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses you might qualify for
            </p>
          </CardContent>
        </Card>
      </div>

    

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Full Name:</span>
                <p className="font-medium">{student.first_name} {student.last_name}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">ID Number:</span>
                <p className="font-medium">{student.id_number}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email:</span>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Username:</span>
                <p className="font-medium">{student.username}</p>
              </div>
            </div>
            
            {studentSchool && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <School className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">School Information</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium">{studentSchool.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {studentSchool.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{studentSchool.province}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Your top 5 subject marks</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setReportsOpen(true)}>Live Reports</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedMarks.map(([subject, mark]) => (
              <div key={subject} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{subject.replace('_', ' ')}</span>
                  <span className="font-bold">{mark}%</span>
                </div>
                <Progress 
                  value={mark} 
                  className="h-2"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary">APS Score</span>
                <span className="text-2xl font-bold text-primary">{aps}</span>
              </div>
              <Progress value={(aps / 49) * 100} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Based on your top 7 subjects
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      {isMobile ? (
        <Drawer open={reportsOpen} onOpenChange={setReportsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Live Reports</DrawerTitle>
              <DrawerDescription>Current marks from tests and assignments, plus upcoming assessments.</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-8">
              {subjectReports.map((report) => (
                <div key={report.subjectKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{report.subjectLabel}</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.assessments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell>{a.type}</TableCell>
                          <TableCell>
                            {a.status === 'completed' ? (
                              <Badge variant="outline" className="gap-1"><CheckCircle className="w-3 h-3 text-success" />Completed</Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3 text-warning" />Upcoming</Badge>
                            )}
                          </TableCell>
                          <TableCell>{a.status === 'completed' ? `${a.score}%` : '-'}</TableCell>
                          <TableCell>{a.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={reportsOpen} onOpenChange={setReportsOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Live Reports</DialogTitle>
              <DialogDescription>Current marks from tests and assignments, plus upcoming assessments.</DialogDescription>
            </DialogHeader>
            <div className="space-y-8 max-h-[65vh] overflow-y-auto">
              {subjectReports.map((report) => (
                <div key={report.subjectKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{report.subjectLabel}</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.assessments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell>{a.type}</TableCell>
                          <TableCell>
                            {a.status === 'completed' ? (
                              <Badge variant="outline" className="gap-1"><CheckCircle className="w-3 h-3 text-success" />Completed</Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3 text-warning" />Upcoming</Badge>
                            )}
                          </TableCell>
                          <TableCell>{a.status === 'completed' ? `${a.score}%` : '-'}</TableCell>
                          <TableCell>{a.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;