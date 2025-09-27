import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { offersService, Application } from '@/services/offersService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Calendar,
  GraduationCap,
  Building,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Applications = () => {
  const { student } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Application | null>(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectingOffer, setRejectingOffer] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  useEffect(() => {
    if (student) {
      loadApplications();
    }
  }, [student]);

  const loadApplications = async () => {
    if (!student) return;
    
    setLoading(true);
    try {
      const studentApplications = await offersService.getApplications(student.id_number);
      setApplications(studentApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
    toast({
      title: "Applications Refreshed",
      description: "Your applications have been updated.",
    });
  };

  const handleViewOfferDetails = (application: Application) => {
    setSelectedOffer(application);
    setShowOfferDialog(true);
  };

  const handleContactUniversity = (application: Application) => {
    // Open university contact information
    const universityEmail = `admissions@${application.university_name.toLowerCase().replace(/\s+/g, '')}.ac.za`;
    const subject = `Application Status Inquiry - ${application.course_name}`;
    const body = `Dear Admissions Office,\n\nI am writing to inquire about the status of my application for ${application.course_name} (Application ID: ${application.application_id}).\n\nI submitted my application on ${formatDate(application.application_date)} and it is currently showing as "Waitlisted".\n\nCould you please provide an update on my application status?\n\nThank you for your time.\n\nBest regards,\n${student?.first_name} ${student?.last_name}`;
    
    const mailtoLink = `mailto:${universityEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    toast({
      title: "Opening Email Client",
      description: `Preparing email to ${application.university_name}...`,
    });
  };

  const handleAppealDecision = (application: Application) => {
    // Show appeal information or redirect to appeal form
    toast({
      title: "Appeal Process",
      description: `To appeal the decision for ${application.course_name}, please contact ${application.university_name} directly.`,
    });
    
    // Open university contact for appeals
    const universityEmail = `appeals@${application.university_name.toLowerCase().replace(/\s+/g, '')}.ac.za`;
    const subject = `Appeal Request - ${application.course_name}`;
    const body = `Dear Appeals Committee,\n\nI would like to appeal the decision regarding my application for ${application.course_name} (Application ID: ${application.application_id}).\n\nI believe there may have been an error in the evaluation process and would like to request a review of my application.\n\nPlease let me know what additional information or documentation you may need.\n\nThank you for your consideration.\n\nBest regards,\n${student?.first_name} ${student?.last_name}`;
    
    const mailtoLink = `mailto:${universityEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowApplicationDialog(true);
  };

  const handleContactAllUniversities = () => {
    // Get unique universities from applications
    const universities = [...new Set(applications.map(app => app.university_name))];
    
    if (universities.length === 0) {
      toast({
        title: "No Applications",
        description: "You don't have any applications to contact universities about.",
        variant: "destructive",
      });
      return;
    }

    const emailList = universities.map(uni => 
      `admissions@${uni.toLowerCase().replace(/\s+/g, '')}.ac.za`
    ).join(', ');

    const subject = `Application Status Inquiry - ${student?.first_name} ${student?.last_name}`;
    const body = `Dear Admissions Offices,\n\nI am writing to inquire about the status of my applications submitted through UniMatch.\n\nStudent Details:\n• Name: ${student?.first_name} ${student?.last_name}\n• ID Number: ${student?.id_number}\n• Email: ${student?.email}\n\nI have submitted applications to the following universities:\n${universities.map(uni => `• ${uni}`).join('\n')}\n\nCould you please provide an update on my application status?\n\nThank you for your time.\n\nBest regards,\n${student?.first_name} ${student?.last_name}`;

    const mailtoLink = `mailto:${emailList}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);

    toast({
      title: "Opening Email Client",
      description: `Preparing email to ${universities.length} universit${universities.length === 1 ? 'y' : 'ies'}...`,
    });
  };

  const handleGetSupport = () => {
    const supportEmail = 'support@unimatch.co.za';
    const subject = `Technical Support Request - Application System`;
    const body = `Dear UniMatch Support Team,\n\nI am experiencing technical issues with the application system.\n\nStudent Details:\n• Name: ${student?.first_name} ${student?.last_name}\n• ID Number: ${student?.id_number}\n• Email: ${student?.email}\n\nIssue Description:\nPlease describe the technical issue you are experiencing:\n\n\nSteps to Reproduce:\n1. \n2. \n3. \n\nExpected Behavior:\n\n\nActual Behavior:\n\n\nAdditional Information:\n\n\nThank you for your assistance.\n\nBest regards,\n${student?.first_name} ${student?.last_name}`;

    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);

    toast({
      title: "Opening Support Email",
      description: "Preparing support request email...",
    });
  };

  const handleRejectOffer = (application: Application) => {
    setSelectedOffer(application);
    setShowRejectDialog(true);
  };

  const confirmRejectOffer = async () => {
    if (!selectedOffer || !student) return;

    setRejectingOffer(true);
    try {
      // Update application status to rejected
      const success = await offersService.updateApplicationStatus(
        student.id_number, 
        selectedOffer.application_id, 
        'Rejected'
      );

      if (success) {
        toast({
          title: "Offer Rejected",
          description: `You have successfully rejected the offer for ${selectedOffer.course_name}.`,
        });
        
        // Refresh applications
        await loadApplications();
        
        // Close dialogs
        setShowRejectDialog(false);
        setShowOfferDialog(false);
        setSelectedOffer(null);
      } else {
        throw new Error('Failed to reject offer');
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      toast({
        title: "Error",
        description: "Failed to reject offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRejectingOffer(false);
    }
  };

  const handleAcceptOffer = (application: Application) => {
    // Generate university website URL
    const universityWebsite = `https://www.${application.university_name.toLowerCase().replace(/\s+/g, '')}.ac.za`;
    
    toast({
      title: "Redirecting to University Website",
      description: `Opening ${application.university_name} website to accept your offer...`,
    });
    
    // Open university website in new tab
    window.open(universityWebsite, '_blank');
  };

  const getStatusIcon = (status: Application['application_status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'Under Review':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Waitlisted':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Application['application_status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Waitlisted':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDescription = (status: Application['application_status']) => {
    switch (status) {
      case 'Pending':
        return 'Your application is being processed by the university.';
      case 'Under Review':
        return 'Your application is currently being reviewed by the admissions committee.';
      case 'Accepted':
        return 'Congratulations! Your application has been accepted.';
      case 'Rejected':
        return 'Unfortunately, your application was not successful this time.';
      case 'Waitlisted':
        return 'Your application is on the waiting list. You may be contacted if a spot becomes available.';
      default:
        return 'Status unknown.';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysSinceApplication = (dateString: string) => {
    const applicationDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - applicationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your applications.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-2">
                Track the status of all your university applications
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Applications Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => app.application_status === 'Accepted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => 
                      app.application_status === 'Pending' || 
                      app.application_status === 'Under Review'
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Waitlisted</p>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => app.application_status === 'Waitlisted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't submitted any university applications yet. Start by browsing available courses!
              </p>
              <Button onClick={() => window.location.href = '/courses'}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.application_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {application.course_name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {application.university_name}
                      </CardDescription>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {application.university_location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.application_status)}
                      <Badge className={getStatusColor(application.application_status)}>
                        {application.application_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Status Description */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {getStatusDescription(application.application_status)}
                      </p>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {formatDate(application.application_date)}</span>
                        <span className="text-gray-400">
                          ({getDaysSinceApplication(application.application_date)} days ago)
                        </span>
                      </div>
                      
                      {application.decision_date && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Decision: {formatDate(application.decision_date)}</span>
                        </div>
                      )}
                    </div>


                    {/* Notes */}
                    {application.notes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Note:</strong> {application.notes}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                      {application.application_status === 'Accepted' && (
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleViewOfferDetails(application)}
                        >
                          View Offer Details
                        </Button>
                      )}
                      
                      {application.application_status === 'Waitlisted' && (
                        <Button 
                          variant="outline" 
                          className="text-orange-600 border-orange-300"
                          onClick={() => handleContactUniversity(application)}
                        >
                          Contact University
                        </Button>
                      )}
                      
                      {application.application_status === 'Rejected' && (
                        <Button 
                          variant="outline" 
                          className="text-red-600 border-red-300"
                          onClick={() => handleAppealDecision(application)}
                        >
                          Appeal Decision
                        </Button>
                      )}
                      
                      {application.application_status !== 'Accepted' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleViewApplication(application)}
                        >
                          View Application
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Application Status Questions</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you have questions about your application status, contact the university directly.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleContactAllUniversities()}
                >
                  Contact Universities
                </Button>
              </div>
              <div>
                <h4 className="font-medium mb-2">Technical Support</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Having trouble with the application system? We're here to help.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGetSupport()}
                >
                  Get Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offer Details Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Offer Details - {selectedOffer?.course_name}
            </DialogTitle>
            <DialogDescription>
              Congratulations! You have received an offer from {selectedOffer?.university_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-6">
              {/* Offer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Course Details</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Course:</strong> {selectedOffer.course_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>University:</strong> {selectedOffer.university_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {selectedOffer.university_location}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Application Details</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Applied:</strong> {formatDate(selectedOffer.application_date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Decision:</strong> {formatDate(selectedOffer.decision_date || '')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> 
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      {selectedOffer.application_status}
                    </Badge>
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Important:</strong> To accept this offer, you must visit the university's official website 
                  and complete their acceptance process. UniMatch cannot process offer acceptances directly.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => handleAcceptOffer(selectedOffer)}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer (Go to University Website)
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => handleRejectOffer(selectedOffer)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Offer
                </Button>
              </div>

              {/* Additional Information */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Application ID: {selectedOffer.application_id}</p>
                {selectedOffer.notes && (
                  <p><strong>Notes:</strong> {selectedOffer.notes}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Offer Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Reject Offer
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to reject the offer for <strong>{selectedOffer?.course_name}</strong> 
                from <strong>{selectedOffer?.university_name}</strong>?
              </p>
              <p className="text-sm text-red-600 font-medium">
                This action cannot be undone. You will need to reapply if you change your mind later.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejectingOffer}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRejectOffer}
              disabled={rejectingOffer}
              className="bg-red-600 hover:bg-red-700"
            >
              {rejectingOffer ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Yes, Reject Offer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Application Details Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Application Details - {selectedApplication?.course_name}
            </DialogTitle>
            <DialogDescription>
              Detailed information about your application to {selectedApplication?.university_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Course Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Course:</strong> {selectedApplication.course_name}</p>
                      <p><strong>University:</strong> {selectedApplication.university_name}</p>
                      <p><strong>Location:</strong> {selectedApplication.university_location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Application Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Applied:</strong> {formatDate(selectedApplication.application_date)}</p>
                      {selectedApplication.decision_date && (
                        <p><strong>Decision Date:</strong> {formatDate(selectedApplication.decision_date)}</p>
                      )}
                      <p><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedApplication.application_status)}`}>
                          {selectedApplication.application_status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Application Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Application ID:</strong> {selectedApplication.application_id}</p>
                      <p><strong>Student ID:</strong> {selectedApplication.student_id}</p>
                      <p><strong>University ID:</strong> {selectedApplication.university_id}</p>
                      <p><strong>Course ID:</strong> {selectedApplication.course_id}</p>
                    </div>
                  </div>
                  
                  {selectedApplication.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{selectedApplication.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status-specific Information */}
              {selectedApplication.application_status === 'Pending' && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <strong>Application Under Review:</strong> Your application is currently being reviewed by the university. 
                    You will be notified once a decision has been made.
                  </AlertDescription>
                </Alert>
              )}

              {selectedApplication.application_status === 'Under Review' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Detailed Review in Progress:</strong> Your application is undergoing a comprehensive review process. 
                    This may take additional time as the university carefully evaluates all aspects of your application.
                  </AlertDescription>
                </Alert>
              )}

              {selectedApplication.application_status === 'Waitlisted' && (
                <Alert className="bg-orange-50 border-orange-200">
                  <Hourglass className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Waitlisted:</strong> You are currently on the waiting list. If a spot becomes available, 
                    you will be contacted. Consider having backup options ready.
                  </AlertDescription>
                </Alert>
              )}

              {selectedApplication.application_status === 'Rejected' && (
                <Alert className="bg-red-50 border-red-200">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Application Not Successful:</strong> Unfortunately, your application was not accepted. 
                    Consider exploring other courses or improving your qualifications for future applications.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationDialog(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                
                {selectedApplication.application_status === 'Waitlisted' && (
                  <Button 
                    onClick={() => handleContactUniversity(selectedApplication)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Contact University
                  </Button>
                )}
                
                {selectedApplication.application_status === 'Rejected' && (
                  <Button 
                    onClick={() => handleAppealDecision(selectedApplication)}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Appeal Decision
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
