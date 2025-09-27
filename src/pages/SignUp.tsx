import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, GraduationCap, Users, BookOpen, Award, ArrowLeft, Check, ChevronsUpDown, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { schools } from '@/data/mockData';
import { cn } from '@/lib/utils';

const SignUp = () => {
  const [formData, setFormData] = useState({
    idNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    schoolId: '',
    marks: {
      mathematics: '',
      english: '',
      physical_sciences: '',
      life_sciences: '',
      accounting: '',
      economics: '',
      geography: '',
      history: ''
    }
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [schoolSearchOpen, setSchoolSearchOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjectMarks, setSubjectMarks] = useState<Record<string, string>>({});
  const [customSchoolData, setCustomSchoolData] = useState({
    name: '',
    province: '',
    type: 'Public'
  });
  const { signup, isAuthenticated } = useAuth();

  // Get selected school info
  const selectedSchool = schools.find(school => school.school_id === formData.schoolId);
  const isCustomSchool = formData.schoolId === 'CUSTOM';
  const showAcademicMarks = isCustomSchool || (selectedSchool && !selectedSchool.is_partner);

  // Available subjects
  const availableSubjects = [
    'Mathematics', 'English', 'Physical Sciences', 'Life Sciences', 
    'Accounting', 'Economics', 'Geography', 'History', 'Business Studies',
    'Computer Applications Technology', 'Engineering Graphics and Design',
    'Visual Arts', 'Music', 'Drama', 'Tourism', 'Hospitality Studies'
  ];

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('marks.')) {
      const markField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        marks: {
          ...prev.marks,
          [markField]: value
        }
      }));
    } else if (field.startsWith('customSchool.')) {
      const customField = field.split('.')[1];
      setCustomSchoolData(prev => ({
        ...prev,
        [customField]: value
      }));
    } else if (field.startsWith('subjectMarks.')) {
      const subjectField = field.split('.')[1];
      setSubjectMarks(prev => ({
        ...prev,
        [subjectField]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSubject = (subject: string) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects(prev => [...prev, subject]);
      setSubjectMarks(prev => ({ ...prev, [subject]: '' }));
    }
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects(prev => prev.filter(s => s !== subject));
    setSubjectMarks(prev => {
      const newMarks = { ...prev };
      delete newMarks[subject];
      return newMarks;
    });
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.idNumber.trim() || !formData.username.trim() || !formData.password.trim() || 
        !formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.schoolId) {
      setError('Please fill in all required fields');
      return false;
    }

    // Check custom school fields if custom school is selected
    if (isCustomSchool && (!customSchoolData.name.trim() || !customSchoolData.province.trim())) {
      setError('Please fill in your school name and province');
      return false;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Check ID number format (10 digits)
    if (!/^\d{10}$/.test(formData.idNumber)) {
      setError('ID number must be exactly 10 digits');
      return false;
    }

    // Check marks are valid numbers
    const marks = Object.values(formData.marks);
    for (const mark of marks) {
      if (mark && (isNaN(Number(mark)) || Number(mark) < 0 || Number(mark) > 100)) {
        setError('All marks must be numbers between 0 and 100');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Combine core marks and additional subject marks
      const allMarks = {
        mathematics: Number(formData.marks.mathematics) || 0,
        english: Number(formData.marks.english) || 0,
        physical_sciences: Number(formData.marks.physical_sciences) || 0,
        life_sciences: Number(formData.marks.life_sciences) || 0,
        accounting: Number(formData.marks.accounting) || 0,
        economics: Number(formData.marks.economics) || 0,
        geography: Number(formData.marks.geography) || 0,
        history: Number(formData.marks.history) || 0,
        // Add additional subjects
        ...Object.fromEntries(
          Object.entries(subjectMarks).map(([subject, mark]) => [
            subject.toLowerCase().replace(/\s+/g, '_'),
            Number(mark) || 0
          ])
        )
      };

      const success = await signup({
        id_number: formData.idNumber,
        username: formData.username,
        password: formData.password,
        school_id: formData.schoolId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        marks: allMarks
      });

      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to UniMatch! Your account has been created.",
        });
      } else {
        setError('Registration failed. ID number or username may already be in use.');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="text-white space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <GraduationCap className="w-12 h-12" />
              <h1 className="text-4xl font-bold">UniMatch</h1>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              Start Your University Journey
            </h2>
            <p className="text-xl text-white/80 max-w-lg">
              Create your account to discover courses, manage applications, and find scholarships tailored to your academic profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-white/70">Universities</div>
            </div>
            <div className="space-y-2">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">6+</div>
              <div className="text-sm text-white/70">Courses</div>
            </div>
            <div className="space-y-2">
              <Award className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-white/70">Scholarships</div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Link to="/login" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              </div>
              <CardDescription>
                Fill in your details to get started with UniMatch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolId">School *</Label>
                    <Popover open={schoolSearchOpen} onOpenChange={setSchoolSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={schoolSearchOpen}
                          className="w-full justify-between"
                        >
                          {formData.schoolId === 'CUSTOM'
                            ? "My school is not listed"
                            : formData.schoolId
                            ? schools.find((school) => school.school_id === formData.schoolId)?.name
                            : "Select your school..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search schools..." />
                          <CommandList>
                            <CommandEmpty>No school found.</CommandEmpty>
                            <CommandGroup>
                              {schools.map((school) => (
                                <CommandItem
                                  key={school.school_id}
                                  value={`${school.name} ${school.province} ${school.type}`}
                                  onSelect={() => {
                                    handleInputChange('schoolId', school.school_id);
                                    setSchoolSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.schoolId === school.school_id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{school.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      {school.province} • {school.type}
                                      {school.is_partner && (
                                        <span className="ml-2 text-green-600 font-medium">• Partner School</span>
                                      )}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                              <CommandItem
                                value="My school is not listed"
                                onSelect={() => {
                                  handleInputChange('schoolId', 'CUSTOM');
                                  setSchoolSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.schoolId === 'CUSTOM' ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium text-primary">My school is not listed</span>
                                  <span className="text-sm text-muted-foreground">
                                    Enter your school details below
                                  </span>
                                </div>
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    
                    {selectedSchool && (
                      <div className="text-sm text-muted-foreground">
                        {selectedSchool.is_partner ? (
                          <span className="text-green-600">✓ Partner school - Academic records will be automatically retrieved</span>
                        ) : (
                          <span className="text-orange-600">⚠ Non-partner school - Please enter your academic marks manually</span>
                        )}
                      </div>
                    )}
                    
                    {isCustomSchool && (
                      <div className="text-sm text-orange-600">
                        ⚠ Custom school - Please enter your academic marks manually
                      </div>
                    )}
                  </div>

                  {/* Custom School Input Form */}
                  {isCustomSchool && (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium text-foreground">School Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customSchoolName">School Name *</Label>
                          <Input
                            id="customSchoolName"
                            type="text"
                            placeholder="Enter your school name"
                            value={customSchoolData.name}
                            onChange={(e) => handleInputChange('customSchool.name', e.target.value)}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customSchoolProvince">Province *</Label>
                          <Select 
                            value={customSchoolData.province} 
                            onValueChange={(value) => handleInputChange('customSchool.province', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Western Cape">Western Cape</SelectItem>
                              <SelectItem value="Gauteng">Gauteng</SelectItem>
                              <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                              <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                              <SelectItem value="Free State">Free State</SelectItem>
                              <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                              <SelectItem value="Limpopo">Limpopo</SelectItem>
                              <SelectItem value="North West">North West</SelectItem>
                              <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customSchoolType">School Type</Label>
                        <Select 
                          value={customSchoolData.type} 
                          onValueChange={(value) => handleInputChange('customSchool.type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select school type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="International">International</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter your 10-digit ID number"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                      disabled={isLoading}
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Marks - Only show for non-partner schools */}
                {showAcademicMarks && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Academic Marks</h3>
                    <p className="text-sm text-muted-foreground">
                      Since your school is not a partner, please enter your marks manually to get personalized course recommendations
                    </p>
                    
                 

                    {/* Additional Subjects */}
                    <div className="space-y-4">
                     
                      <p className="text-sm text-muted-foreground">
                        Select and add marks for all the subjects you're taking
                      </p>
                      
                      <div className="space-y-2">
                        <Label>Add Subject</Label>
                        <Select onValueChange={addSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject to add..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubjects
                              .filter(subject => !selectedSubjects.includes(subject))
                              .map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedSubjects.length > 0 && (
                        <div className="space-y-3">
                          <Label>Selected Subjects</Label>
                          {selectedSubjects.map((subject) => (
                            <div key={subject} className="flex items-center gap-3 p-3 border rounded-lg">
                              <div className="flex-1">
                                <Label htmlFor={`subject-${subject}`} className="font-medium">
                                  {subject}
                                </Label>
                                <Input
                                  id={`subject-${subject}`}
                                  type="number"
                                  placeholder="0-100"
                                  min="0"
                                  max="100"
                                  value={subjectMarks[subject] || ''}
                                  onChange={(e) => handleInputChange(`subjectMarks.${subject}`, e.target.value)}
                                  disabled={isLoading}
                                  className="mt-1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSubject(subject)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-primary hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
