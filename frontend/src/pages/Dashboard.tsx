import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  School, 
  TrendingUp, 
  Award,
  BookOpen,
  Mail
} from 'lucide-react';
import { 
  schools, 
  universities, 
  courses, 
  offers, 
  calculateAPS, 
  checkCourseEligibility 
} from '@/data/mockData';

const Dashboard = () => {
  const { student } = useAuth();
  
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
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>Your top 5 subject marks</CardDescription>
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
    </div>
  );
};

export default Dashboard;