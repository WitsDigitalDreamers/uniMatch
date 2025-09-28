import { useState ,useEffect} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  Music, 
  Home, 
  Heart, 
  Coffee, 
  Moon, 
  Sun,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { quizService, QuizAnswers } from '@/services/quizService';

const RoomMatching = () => {
  const { student } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({
    social_level: 0,
    sleep_schedule: 0,
    music_tolerance: 0,
    party_frequency: 0,
    smoking_preference: 0,
    hobbies: [] as string[],
    interests: [] as string[]
  });

  const quizSteps = [
  
    {
      title: "Social Level",
      description: "How social are you?",
      icon: <Users className="w-5 h-5" />,
      options: [
        { value: 1, label: "Very introverted, prefer alone time" },
        { value: 2, label: "Somewhat introverted" },
        { value: 3, label: "Balanced, enjoy both" },
        { value: 4, label: "Somewhat extroverted" },
        { value: 5, label: "Very extroverted, love socializing" }
      ]
    },
    {
      title: "Sleep Schedule",
      description: "When do you typically sleep?",
      icon: <Moon className="w-5 h-5" />,
      options: [
        { value: 1, label: "Early bird (9-10 PM)" },
        { value: 2, label: "Normal (10-11 PM)" },
        { value: 3, label: "Night owl (11 PM+)" }
      ]
    },
    {
      title: "Music Tolerance",
      description: "How do you feel about music in shared spaces?",
      icon: <Music className="w-5 h-5" />,
      options: [
        { value: 1, label: "Prefer silence" },
        { value: 2, label: "Very quiet music only" },
        { value: 3, label: "Moderate volume" },
        { value: 4, label: "Loud music is fine" },
        { value: 5, label: "Love loud music" }
      ]
    },
    {
      title: "Party Frequency",
      description: "How often do you party or go out?",
      icon: <Heart className="w-5 h-5" />,
      options: [
        { value: 1, label: "Never, prefer quiet nights" },
        { value: 2, label: "Rarely, special occasions" },
        { value: 3, label: "Occasionally, weekends" },
        { value: 4, label: "Often, multiple times a week" },
        { value: 5, label: "Very often, almost daily" }
      ]
    },
    {
      title: "Smoking Preference",
      description: "What's your stance on smoking?",
      icon: <AlertCircle className="w-5 h-5" />,
      options: [
        { value: 1, label: "Non-smoker, prefer smoke-free" },
        { value: 2, label: "Occasional smoker" },
        { value: 3, label: "Regular smoker" }
      ]
    }
  ];

  const hobbyOptions = [
    "Gaming", "Sports", "Reading", "Music", "Art", "Photography", "Cooking", "Fitness",
    "Travel", "Movies", "Dancing", "Writing", "Gardening", "Crafting", "Technology",
    "Fashion", "Volunteering", "Languages", "Board Games", "Outdoor Activities"
  ];

  const interestOptions = [
    "Science", "Technology", "Business", "Arts", "Sports", "Politics", "Environment",
    "Health", "Education", "Entertainment", "Fashion", "Food", "Travel", "History",
    "Philosophy", "Psychology", "Economics", "Literature", "Music", "Film"
  ];

  // Load existing quiz data on component mount
  useEffect(() => {
    const loadQuizData = async () => {
      if (!student) {
        setIsLoadingQuiz(false);
        return;
      }

      try {
        const existingQuiz = await quizService.getQuizAnswers(student.id_number);
        if (existingQuiz) {
          setQuizAnswers({
            social_level: existingQuiz.social_level,
            sleep_schedule: existingQuiz.sleep_schedule,
            music_tolerance: existingQuiz.music_tolerance,
            party_frequency: existingQuiz.party_frequency,
            smoking_preference: existingQuiz.smoking_preference,
            hobbies: existingQuiz.hobbies || [],
            interests: existingQuiz.interests || []
          });
          setQuizSubmitted(true);
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
        toast({
          title: "Error Loading Quiz",
          description: "Failed to load your previous quiz answers. You can start fresh.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingQuiz(false);
      }
    };

    loadQuizData();
  }, [student]);

  const handleAnswerChange = (field: string, value: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHobbyChange = (hobby: string, checked: boolean) => {
    setQuizAnswers(prev => ({
      ...prev,
      hobbies: checked 
        ? [...prev.hobbies, hobby]
        : prev.hobbies.filter(h => h !== hobby)
    }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setQuizAnswers(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length + 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    if (!student) return;
    
    setIsLoading(true);
    
    try {
      // Save quiz answers to database
      await quizService.saveQuizAnswers(student.id_number, {
        social_level: quizAnswers.social_level,
        sleep_schedule: quizAnswers.sleep_schedule,
        music_tolerance: quizAnswers.music_tolerance,
        party_frequency: quizAnswers.party_frequency,
        smoking_preference: quizAnswers.smoking_preference,
        hobbies: quizAnswers.hobbies,
        interests: quizAnswers.interests
      });
      
      setShowConfirmation(true);
      
      toast({
        title: "Quiz Saved Successfully",
        description: "Your lifestyle preferences have been saved to your profile.",
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast({
        title: "Error Saving Quiz",
        description: "Failed to save your quiz answers. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const acceptSubmission = async () => {
    setIsLoading(true);
    
    try {
      // Quiz is already saved in submitQuiz, just mark as submitted
      setQuizSubmitted(true);
      setShowConfirmation(false);
      
      toast({
        title: "Quiz Submitted Successfully",
        description: "Your lifestyle preferences have been saved and will be used for roommate matching.",
      });
    } catch (error) {
      console.error('Error finalizing quiz submission:', error);
      toast({
        title: "Error",
        description: "There was an issue finalizing your quiz submission.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const declineSubmission = () => {
    setShowConfirmation(false);
    toast({
      title: "Submission Cancelled",
      description: "Your quiz answers have not been submitted. You can complete the quiz again anytime.",
    });
  };

  const isCurrentStepComplete = () => {
    if (currentStep < quizSteps.length) {
      // For quiz steps, check the specific field for this step
      const stepField = quizSteps[currentStep].title.toLowerCase().replace(/\s+/g, '_') as keyof typeof quizAnswers;
      const value = quizAnswers[stepField];
      
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    } else if (currentStep === quizSteps.length) {
      // Hobbies step - always complete (optional)
      return true;
    } else if (currentStep === quizSteps.length + 1) {
      // Interests step - always complete (optional)
      return true;
    }
    return false;
  };

  const isQuizComplete = () => {
    // Check if all required quiz steps are completed
    return quizSteps.every((step, index) => {
      const stepField = step.title.toLowerCase().replace(/\s+/g, '_') as keyof typeof quizAnswers;
      const value = quizAnswers[stepField];
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    });
  };

  if (!student) return null;

  // Show loading state while fetching existing quiz data
  if (isLoadingQuiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your quiz data...</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / (quizSteps.length + 2)) * 100; // +2 for hobbies and interests

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Room Matching</h1>
        <p className="text-muted-foreground">
          Complete this lifestyle quiz to find your perfect roommate match
        </p>
      </div>

      {/* Progress - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {quizSteps.length + 2}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Quiz Steps - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && currentStep < quizSteps.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quizSteps[currentStep].icon}
              {quizSteps[currentStep].title}
            </CardTitle>
            <CardDescription>
              {quizSteps[currentStep].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={quizAnswers[Object.keys(quizAnswers)[currentStep] as keyof typeof quizAnswers]?.toString()}
              onValueChange={(value) => handleAnswerChange(Object.keys(quizAnswers)[currentStep], parseInt(value))}
              className="space-y-3"
            >
              {quizSteps[currentStep].options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Hobbies Step - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && currentStep === quizSteps.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Hobbies
            </CardTitle>
            <CardDescription>
              Select your hobbies (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {hobbyOptions.map((hobby) => (
                <div key={hobby} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hobby-${hobby}`}
                    checked={quizAnswers.hobbies.includes(hobby)}
                    onCheckedChange={(checked) => handleHobbyChange(hobby, checked as boolean)}
                  />
                  <Label htmlFor={`hobby-${hobby}`} className="text-sm cursor-pointer">
                    {hobby}
                  </Label>
                </div>
              ))}
            </div>
            {quizAnswers.hobbies.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Selected Hobbies:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {quizAnswers.hobbies.map((hobby) => (
                    <Badge key={hobby} variant="secondary">
                      {hobby}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Interests Step - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && currentStep === quizSteps.length + 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Interests
            </CardTitle>
            <CardDescription>
              Select your interests (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={quizAnswers.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={`interest-${interest}`} className="text-sm cursor-pointer">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            {quizAnswers.interests.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium">Selected Interests:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {quizAnswers.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < quizSteps.length + 1 ? (
            <Button
              onClick={nextStep}
              disabled={!isCurrentStepComplete()}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={submitQuiz}
              disabled={!isQuizComplete() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Confirmation Screen */}
      {showConfirmation && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-6 h-6" />
              Confirm Submission
            </CardTitle>
            <CardDescription>
              Please review your information before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Your lifestyle preferences and quiz answers will be sent to all universities where you have applied for residence. This information will be used to match you with compatible roommates.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Your Preferences Summary:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Social Level:</span> {quizSteps[0].options.find(opt => opt.value === quizAnswers.social_level)?.label}
                </div>
                <div>
                  <span className="font-medium">Sleep Schedule:</span> {quizSteps[1].options.find(opt => opt.value === quizAnswers.sleep_schedule)?.label}
                </div>
                <div>
                  <span className="font-medium">Music Tolerance:</span> {quizSteps[2].options.find(opt => opt.value === quizAnswers.music_tolerance)?.label}
                </div>
                <div>
                  <span className="font-medium">Party Frequency:</span> {quizSteps[3].options.find(opt => opt.value === quizAnswers.party_frequency)?.label}
                </div>
                <div>
                  <span className="font-medium">Smoking Preference:</span> {quizSteps[4].options.find(opt => opt.value === quizAnswers.smoking_preference)?.label}
                </div>
  
              </div>
              
              {quizAnswers.hobbies.length > 0 && (
                <div>
                  <span className="font-medium">Hobbies:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {quizAnswers.hobbies.map((hobby) => (
                      <Badge key={hobby} variant="secondary">{hobby}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {quizAnswers.interests.length > 0 && (
                <div>
                  <span className="font-medium">Interests:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {quizAnswers.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={acceptSubmission}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending to Universities...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept & Send to Universities
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={declineSubmission}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Screen */}
      {quizSubmitted && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-6 h-6" />
              Quiz Submitted Successfully!
            </CardTitle>
            <CardDescription>
              Your lifestyle preferences have been sent to all universities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-green-600">
              <p>✅ Your quiz answers have been submitted</p>
              <p>✅ Data sent to all universities where you applied for residence</p>
              <p>✅ Universities will use this information for roommate matching</p>
              <p>✅ You'll be notified when compatible roommates are found</p>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setQuizSubmitted(false);
                  setShowConfirmation(false);
                  setCurrentStep(0);
                  setQuizAnswers({
                   
                    social_level: 0,
                    sleep_schedule: 0,
                    music_tolerance: 0,
                    party_frequency: 0,
                    smoking_preference: 0,
               
                    hobbies: [],
                    interests: []
                  });
                }}
                variant="outline"
              >
                Take Quiz Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Alert - Only show when not in confirmation or success state */}
      {!showConfirmation && !quizSubmitted && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your answers will be used to match you with compatible roommates. You can update your preferences anytime.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RoomMatching;
