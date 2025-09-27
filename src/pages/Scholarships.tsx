import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Award,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Users,
  Info
} from 'lucide-react';
import { 
  bursaries,
  schools,
  calculateAPS,
  courses
} from '@/data/mockData';

const Scholarships = () => {
  const { student } = useAuth();
  
  if (!student) return null;

  const aps = calculateAPS(student.marks);
  const studentSchool = schools.find(s => s.school_id === student.school_id);
  
  // Check eligibility for each bursary
  const checkBursaryEligibility = (bursary: typeof bursaries[0]) => {
    const reasons: string[] = [];
    let eligible = true;

    // Check APS requirement
    if (bursary.eligibility.minimum_aps && aps < bursary.eligibility.minimum_aps) {
      eligible = false;
      reasons.push(`Need APS score of ${bursary.eligibility.minimum_aps} (you have ${aps})`);
    }

    // Check province requirement
    if (bursary.eligibility.provinces && studentSchool) {
      if (!bursary.eligibility.provinces.includes(studentSchool.province)) {
        eligible = false;
        reasons.push(`Only available in: ${bursary.eligibility.provinces.join(', ')}`);
      }
    }

    // Check faculty requirement
    if (bursary.eligibility.faculties) {
      const eligibleCourses = courses.filter(course => {
        return bursary.eligibility.faculties!.includes(course.faculty);
      });
      
      if (eligibleCourses.length === 0) {
        eligible = false;
        reasons.push(`Only for faculties: ${bursary.eligibility.faculties.join(', ')}`);
      }
    }

    return { eligible, reasons };
  };

  // Categorize bursaries
  const eligibleBursaries = bursaries.filter(b => checkBursaryEligibility(b).eligible);
  const partiallyEligible = bursaries.filter(b => {
    const eligibility = checkBursaryEligibility(b);
    return !eligibility.eligible && eligibility.reasons.length <= 2;
  });
  const notEligible = bursaries.filter(b => {
    const eligibility = checkBursaryEligibility(b);
    return !eligibility.eligible && eligibility.reasons.length > 2;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const BursaryCard = ({ bursary }: { bursary: typeof bursaries[0] }) => {
    const eligibility = checkBursaryEligibility(bursary);
    const daysLeft = getDaysUntilDeadline(bursary.deadline);
    const isUrgent = daysLeft <= 14 && daysLeft >= 0;
    const isExpired = daysLeft < 0;
    
    let statusIcon;
    let statusColor;
    let statusText;
    
    if (eligibility.eligible) {
      statusIcon = <CheckCircle className="w-5 h-5" />;
      statusColor = "text-success";
      statusText = "Eligible";
    } else if (eligibility.reasons.length <= 2) {
      statusIcon = <AlertCircle className="w-5 h-5" />;
      statusColor = "text-warning";
      statusText = "Partially Eligible";
    } else {
      statusIcon = <XCircle className="w-5 h-5" />;
      statusColor = "text-destructive";
      statusText = "Not Eligible";
    }

    return (
      <Card className={`h-full ${isUrgent && eligibility.eligible ? 'border-warning' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight">{bursary.name}</CardTitle>
              <CardDescription>{bursary.provider}</CardDescription>
            </div>
            <div className={`flex items-center gap-2 ${statusColor}`}>
              {statusIcon}
              <span className="text-sm font-medium">{statusText}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold text-success">
                {formatAmount(bursary.amount)}
              </span>
            </div>
            <Badge variant={isExpired ? "destructive" : isUrgent ? "secondary" : "outline"}>
              <Calendar className="w-3 h-3 mr-1" />
              {isExpired ? 'Expired' : `${daysLeft} days left`}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Eligibility Requirements
              </h4>
              <div className="space-y-2 text-sm">
                {bursary.eligibility.minimum_aps && (
                  <div className="flex justify-between">
                    <span>Minimum APS:</span>
                    <span className={aps >= bursary.eligibility.minimum_aps ? "text-success" : "text-destructive"}>
                      {bursary.eligibility.minimum_aps}
                    </span>
                  </div>
                )}
                
                {bursary.eligibility.minimum_household_income && (
                  <div className="flex justify-between">
                    <span>Max Household Income:</span>
                    <span>{formatAmount(bursary.eligibility.minimum_household_income)}</span>
                  </div>
                )}

                {bursary.eligibility.provinces && (
                  <div>
                    <span className="text-muted-foreground">Provinces:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bursary.eligibility.provinces.map(province => (
                        <Badge 
                          key={province} 
                          variant={studentSchool?.province === province ? "default" : "outline"}
                          className="text-xs"
                        >
                          {province}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {bursary.eligibility.faculties && (
                  <div>
                    <span className="text-muted-foreground">Eligible Faculties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {bursary.eligibility.faculties.map(faculty => (
                        <Badge key={faculty} variant="outline" className="text-xs">
                          {faculty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {bursary.eligibility.additional_criteria && (
              <div>
                <h5 className="font-medium text-sm mb-1">Additional Criteria:</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {bursary.eligibility.additional_criteria.map((criteria, index) => (
                    <li key={index}>• {criteria}</li>
                  ))}
                </ul>
              </div>
            )}

            {!eligibility.eligible && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h5 className="text-sm font-medium text-destructive mb-1">Why you're not eligible:</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {eligibility.reasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <Button 
                className="w-full" 
                variant={eligibility.eligible ? "default" : "outline"}
                disabled={isExpired}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {isExpired ? 'Application Closed' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Scholarships & Bursaries</h1>
        <p className="text-muted-foreground">
          Find financial aid opportunities for your university studies. Your APS: <span className="font-semibold text-primary">{aps}</span>
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Bursaries</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bursaries.length}</div>
            <p className="text-xs text-muted-foreground">
              Total opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">You're Eligible For</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{eligibleBursaries.length}</div>
            <p className="text-xs text-muted-foreground">
              {eligibleBursaries.reduce((total, b) => total + b.amount, 0) > 0 && 
                `Worth ${formatAmount(eligibleBursaries.reduce((total, b) => total + b.amount, 0))}`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Matches</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{partiallyEligible.length}</div>
            <p className="text-xs text-muted-foreground">
              May qualify with improvements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Deadlines Alert */}
      {eligibleBursaries.some(b => getDaysUntilDeadline(b.deadline) <= 14 && getDaysUntilDeadline(b.deadline) >= 0) && (
        <Alert className="border-warning bg-warning/5">
          <Calendar className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            {eligibleBursaries.filter(b => getDaysUntilDeadline(b.deadline) <= 14 && getDaysUntilDeadline(b.deadline) >= 0).length} bursary 
            application(s) have deadlines within the next 2 weeks. Apply soon!
          </AlertDescription>
        </Alert>
      )}

      {/* Eligible Bursaries */}
      {eligibleBursaries.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-success" />
            <h2 className="text-2xl font-semibold">Eligible Bursaries ({eligibleBursaries.length})</h2>
          </div>
          <p className="text-muted-foreground">
            These bursaries match your current qualifications. Apply as soon as possible!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleBursaries.map(bursary => (
              <BursaryCard key={bursary.bursary_id} bursary={bursary} />
            ))}
          </div>
        </div>
      )}

      {/* Partially Eligible */}
      {partiallyEligible.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-warning" />
            <h2 className="text-2xl font-semibold">Potential Matches ({partiallyEligible.length})</h2>
          </div>
          <p className="text-muted-foreground">
            You might qualify for these bursaries with some improvements or additional requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partiallyEligible.map(bursary => (
              <BursaryCard key={bursary.bursary_id} bursary={bursary} />
            ))}
          </div>
        </div>
      )}

      {/* Not Eligible (if user wants to see all) */}
      {notEligible.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <XCircle className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-2xl font-semibold text-muted-foreground">Other Bursaries ({notEligible.length})</h2>
          </div>
          <p className="text-muted-foreground">
            These bursaries have requirements you don't currently meet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notEligible.map(bursary => (
              <BursaryCard key={bursary.bursary_id} bursary={bursary} />
            ))}
          </div>
        </div>
      )}

      {/* No bursaries message */}
      {bursaries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Bursaries Available</h3>
            <p className="text-muted-foreground">
              Check back later for new scholarship and bursary opportunities.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Scholarships;