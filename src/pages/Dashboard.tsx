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
          Welcome back, {student.first_name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your university application journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">APS Score</CardTitle>
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

      {/* Quick Actions */}
      {(eligibleCourses.length > 0 || pendingOffers.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Things you might want to do next</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eligibleCourses.length > 0 && (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-success/5 border-success/20">
                  <BookOpen className="w-8 h-8 text-success" />
                  <div>
                    <h4 className="font-medium">Explore {eligibleCourses.length} Eligible Courses</h4>
                    <p className="text-sm text-muted-foreground">View courses you qualify for</p>
                  </div>
                </div>
              )}
              
              {pendingOffers.length > 0 && (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-warning/5 border-warning/20">
                  <Mail className="w-8 h-8 text-warning" />
                  <div>
                    <h4 className="font-medium">{pendingOffers.length} Pending Offers</h4>
                    <p className="text-sm text-muted-foreground">Review and respond to offers</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-info/5 border-info/20">
                <Award className="w-8 h-8 text-info" />
                <div>
                  <h4 className="font-medium">Check Scholarships</h4>
                  <p className="text-sm text-muted-foreground">Find financial aid opportunities</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;