import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  AlertTriangle,
  CalendarDays,
  Building,
  BookOpen
} from 'lucide-react';
import { 
  offers as initialOffers, 
  courses, 
  universities, 
  Offer
} from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const Offers = () => {
  const { student } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  
  if (!student) return null;

  useEffect(() => {
    // Load offers from localStorage or use initial data
    const savedOffers = localStorage.getItem('student_offers');
    if (savedOffers) {
      setOffers(JSON.parse(savedOffers));
    } else {
      const studentOffers = initialOffers.filter(o => o.student_id === student.id_number);
      setOffers(studentOffers);
      localStorage.setItem('student_offers', JSON.stringify(studentOffers));
    }
  }, [student.id_number]);

  const updateOfferStatus = (offerId: string, status: 'accepted' | 'declined') => {
    const updatedOffers = offers.map(offer => 
      offer.offer_id === offerId ? { ...offer, status } : offer
    );
    
    setOffers(updatedOffers);
    localStorage.setItem('student_offers', JSON.stringify(updatedOffers));
    
    const offer = offers.find(o => o.offer_id === offerId);
    const course = courses.find(c => c.course_id === offer?.course_id);
    const university = universities.find(u => u.university_id === offer?.university_id);
    
    toast({
      title: status === 'accepted' ? 'Offer Accepted!' : 'Offer Declined',
      description: `You have ${status} the offer for ${course?.name} at ${university?.name}.`,
      variant: status === 'accepted' ? 'default' : 'destructive',
    });
  };

  const getOffersByStatus = (status: Offer['status']) => 
    offers.filter(offer => offer.status === status);

  const pendingOffers = getOffersByStatus('pending');
  const acceptedOffers = getOffersByStatus('accepted');
  const declinedOffers = getOffersByStatus('declined');

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const OfferCard = ({ offer }: { offer: Offer }) => {
    const course = courses.find(c => c.course_id === offer.course_id);
    const university = universities.find(u => u.university_id === offer.university_id);
    const daysLeft = getDaysUntilDeadline(offer.deadline);
    
    let statusBadge;
    let statusIcon;
    
    switch (offer.status) {
      case 'pending':
        statusBadge = <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
        statusIcon = <Clock className="w-5 h-5 text-warning" />;
        break;
      case 'accepted':
        statusBadge = <Badge className="bg-success/10 text-success border-success/20">Accepted</Badge>;
        statusIcon = <CheckCircle className="w-5 h-5 text-success" />;
        break;
      case 'declined':
        statusBadge = <Badge variant="destructive" className="bg-destructive/10">Declined</Badge>;
        statusIcon = <XCircle className="w-5 h-5 text-destructive" />;
        break;
    }

    const isUrgent = daysLeft <= 3 && offer.status === 'pending';
    const isExpired = daysLeft < 0 && offer.status === 'pending';

    return (
      <Card className={`${isUrgent ? 'border-warning' : ''} ${isExpired ? 'border-destructive' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg leading-tight">{course?.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {university?.name}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {statusIcon}
              {statusBadge}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Faculty:</span>
              <p className="font-medium">{course?.faculty}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Location:</span>
              <p className="font-medium">{university?.location}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Offer Date:</span>
              <p className="font-medium">{new Date(offer.offer_date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>
              <p className={`font-medium ${isUrgent ? 'text-warning' : isExpired ? 'text-destructive' : ''}`}>
                {new Date(offer.deadline).toLocaleDateString()}
                {offer.status === 'pending' && (
                  <span className="block text-xs">
                    ({isExpired ? 'Expired' : `${daysLeft} days left`})
                  </span>
                )}
              </p>
            </div>
          </div>

          {offer.conditional && offer.conditions && (
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Conditional Offer</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {offer.conditions.map((condition, index) => (
                  <li key={index}>• {condition}</li>
                ))}
              </ul>
            </div>
          )}

          {offer.status === 'pending' && !isExpired && (
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={() => updateOfferStatus(offer.offer_id, 'accepted')}
                className="flex-1 bg-success hover:bg-success/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button 
                variant="destructive"
                onClick={() => updateOfferStatus(offer.offer_id, 'declined')}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">My Offers</h1>
        <p className="text-muted-foreground">
          Manage your university course offers. Review details and respond before deadlines.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingOffers.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOffers.filter(o => getDaysUntilDeadline(o.deadline) <= 3).length} urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Offers</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{acceptedOffers.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offers.length}</div>
            <p className="text-xs text-muted-foreground">
              All time offers received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alerts */}
      {pendingOffers.some(o => getDaysUntilDeadline(o.deadline) <= 3) && (
        <Alert className="border-warning bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            You have {pendingOffers.filter(o => getDaysUntilDeadline(o.deadline) <= 3).length} offer(s) 
            with deadlines approaching in the next 3 days. Please review and respond promptly.
          </AlertDescription>
        </Alert>
      )}

      {offers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Offers Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't received any university offers yet. Keep checking back!
            </p>
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Explore Courses
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Offers */}
      {pendingOffers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-semibold">Pending Offers ({pendingOffers.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingOffers.map(offer => (
              <OfferCard key={offer.offer_id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted Offers */}
      {acceptedOffers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <h2 className="text-xl font-semibold">Accepted Offers ({acceptedOffers.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {acceptedOffers.map(offer => (
              <OfferCard key={offer.offer_id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {/* Declined Offers */}
      {declinedOffers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-muted-foreground">Declined Offers ({declinedOffers.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {declinedOffers.map(offer => (
              <OfferCard key={offer.offer_id} offer={offer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;