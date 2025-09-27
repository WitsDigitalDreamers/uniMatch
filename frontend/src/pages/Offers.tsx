import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { offersService, Offer } from '@/services/offersService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, XCircle, AlertCircle, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Offers = () => {
  const { student } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student) {
      loadOffers();
    }
  }, [student]);

  const loadOffers = () => {
    if (!student) return;
    
    const studentOffers = offersService.getOffers(student.id_number);
    setOffers(studentOffers);
    setLoading(false);
  };

  const handleAcceptOffer = (offerId: string) => {
    if (!student) return;
    
    const success = offersService.updateOfferStatus(student.id_number, offerId, 'Accepted');
    if (success) {
      toast({
        title: "Offer Accepted",
        description: "You have successfully accepted this offer!",
      });
      loadOffers(); // Reload offers
    } else {
      toast({
        title: "Error",
        description: "Failed to accept offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeclineOffer = (offerId: string) => {
    if (!student) return;
    
    const success = offersService.updateOfferStatus(student.id_number, offerId, 'Declined');
    if (success) {
      toast({
        title: "Offer Declined",
        description: "You have declined this offer.",
      });
      loadOffers(); // Reload offers
    } else {
      toast({
        title: "Error",
        description: "Failed to decline offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getOfferStatusIcon = (status: Offer['offer_status']) => {
    switch (status) {
      case 'Active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Declined':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Expired':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOfferStatusColor = (status: Offer['offer_status']) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800';
      case 'Accepted':
        return 'bg-green-100 text-green-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      case 'Expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferTypeColor = (type: Offer['offer_type']) => {
    switch (type) {
      case 'Unconditional':
        return 'bg-green-100 text-green-800';
      case 'Conditional':
        return 'bg-yellow-100 text-yellow-800';
      case 'Waitlist':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your offers...</p>
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
            Please log in to view your offers.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your University Offers</h1>
          <p className="mt-2 text-gray-600">
            Manage your university offers and make important decisions about your future.
          </p>
        </div>

        {offers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't received any university offers yet. Apply to courses to start receiving offers!
              </p>
              <Button asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => (
              <Card key={offer.offer_id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{offer.course_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {offer.university_name}, {offer.university_location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getOfferStatusIcon(offer.offer_status)}
                      <Badge className={getOfferStatusColor(offer.offer_status)}>
                        {offer.offer_status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getOfferTypeColor(offer.offer_type)}>
                        {offer.offer_type} Offer
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Expires: {new Date(offer.expiry_date).toLocaleDateString()}
                      </div>
                    </div>

                    {Object.keys(offer.offer_conditions).length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Offer Conditions:</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {Object.entries(offer.offer_conditions).map(([key, value]) => (
                            <li key={key} className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value.toString()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <p>Acceptance Deadline: {new Date(offer.acceptance_deadline).toLocaleDateString()}</p>
                        <p>Received: {new Date(offer.created_at).toLocaleDateString()}</p>
                      </div>
                      {offer.offer_status === 'Active' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineOffer(offer.offer_id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Decline
                          </Button>
                          <Button
                            onClick={() => handleAcceptOffer(offer.offer_id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept Offer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;