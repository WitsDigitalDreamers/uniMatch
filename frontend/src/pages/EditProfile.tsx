import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  TrendingUp, 

  Users, 
  FileText, 
  Upload,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { profileService, StudentProfile } from '@/services/profileService';
import { resumeService } from '@/services/resumeService';

interface ProfileData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string;
  contactNumber: string;
  email: string;
  homeAddress: {
    province: string;
    city: string;
    suburb: string;
    postalCode: string;
  };
  citizenship: string;

  // Education Information
  highSchoolName: string;
  highSchoolAddress: string;
  yearMatriculated: string;
  matricType: string;
  subjects: Array<{
    name: string;
    mark: number;
  }>;
  currentInstitution: string;
  studentNumber: string;
  qualificationName: string;
  yearOfStudy: string;

  // Academic Performance
  averagePercentage: number;
  apsScore: number;
  subjectsPassed: number;
  subjectsFailed: number;

  // Financial Information
  householdIncome: string;
  parentsOccupation: string;
  numberOfDependents: number;
  receivingOtherFunding: boolean;
  fundingSource: string;

  // Family/Guardian Information
  guardians: Array<{
    fullName: string;
    contactNumber: string;
    email: string;
    relationship: string;
    employmentStatus: string;
  }>;

  // Supporting Documents
  documents: {
    idCopy: File | null;
    matricResults: File | null;
    proofOfAddress: File | null;
    proofOfIncome: File | null;
    curriculumVitae: File | null;
  };
}

const EditProfile = () => {
  const { student, refreshStudent } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idNumber: '',
    gender: '',
    contactNumber: '',
    email: '',
    homeAddress: {
      province: '',
      city: '',
      suburb: '',
      postalCode: ''
    },
    citizenship: '',
    highSchoolName: '',
    highSchoolAddress: '',
    yearMatriculated: '',
    matricType: '',
    subjects: [],
    currentInstitution: '',
    studentNumber: '',
    qualificationName: '',
    yearOfStudy: '',
    averagePercentage: 0,
    apsScore: 0,
    subjectsPassed: 0,
    subjectsFailed: 0,
    householdIncome: '',
    parentsOccupation: '',
    numberOfDependents: 0,
    receivingOtherFunding: false,
    fundingSource: '',
    guardians: [],
    documents: {
      idCopy: null,
      matricResults: null,
      proofOfAddress: null,
      proofOfIncome: null,
      curriculumVitae: null
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  // Load existing student data and profile
  useEffect(() => {
    const loadProfile = async () => {
      if (student) {
        // Load basic student data
        setProfileData(prev => ({
          ...prev,
          firstName: student.first_name || '',
          lastName: student.last_name || '',
          email: student.email || '',
          idNumber: student.id_number || '',
          subjects: Object.entries(student.marks || {}).map(([name, mark]) => ({
            name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            mark: mark
          }))
        }));

        // Load detailed profile from database
        const profile = await profileService.getProfile(student.id_number);
        if (profile) {
          setProfileData(prev => ({
            ...prev,
            dateOfBirth: profile.date_of_birth || '',
            gender: profile.gender || '',
            contactNumber: profile.contact_number || '',
            citizenship: profile.citizenship || '',
            homeAddress: profile.home_address ? {
              province: profile.home_address.province || '',
              city: profile.home_address.city || '',
              suburb: profile.home_address.suburb || '',
              postalCode: profile.home_address.postal_code || ''
            } : {
              province: '',
              city: '',
              suburb: '',
              postalCode: ''
            },
            highSchoolName: profile.high_school_name || '',
            highSchoolAddress: profile.high_school_address || '',
            yearMatriculated: profile.year_matriculated?.toString() || '',
            matricType: profile.matric_type || '',
            currentInstitution: profile.current_institution || '',
            studentNumber: profile.student_number || '',
            qualificationName: profile.qualification_name || '',
            yearOfStudy: profile.year_of_study || '',
            averagePercentage: profile.average_percentage || 0,
            apsScore: profile.aps_score || 0,
            subjectsPassed: profile.subjects_passed || 0,
            subjectsFailed: profile.subjects_failed || 0,
            subjects: profile.subjects || [],
            householdIncome: profile.household_income || '',
            parentsOccupation: profile.parents_occupation || '',
            numberOfDependents: profile.number_of_dependents || 0,
            receivingOtherFunding: profile.receiving_other_funding || false,
            fundingSource: profile.funding_source || '',
            guardians: profile.guardians ? profile.guardians.map(g => ({
              fullName: g.full_name || '',
              contactNumber: g.contact_number || '',
              email: g.email || '',
              relationship: g.relationship || '',
              employmentStatus: g.employment_status || ''
            })) : [],
            documents: {
              idCopy: profile.documents?.id_copy ? new File([], 'id_copy.pdf') : null,
              matricResults: profile.documents?.matric_results ? new File([], 'matric_results.pdf') : null,
              proofOfAddress: profile.documents?.proof_of_address ? new File([], 'proof_of_address.pdf') : null,
              proofOfIncome: profile.documents?.proof_of_income ? new File([], 'proof_of_income.pdf') : null,
              curriculumVitae: profile.documents?.curriculum_vitae ? new File([], 'curriculum_vitae.pdf') : null,
            }
          }));
        }
      }
    };

    loadProfile();
  }, [student]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => {
        const parentValue = prev[parent as keyof ProfileData] as Record<string, any>;
        return {
          ...prev,
          [parent]: {
            ...(parentValue || {}),
            [child]: value
          }
        };
      });
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubjectChange = (index: number, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => 
        i === index ? { ...subject, [field]: value } : subject
      )
    }));
  };

  const addSubject = () => {
    setProfileData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', mark: 0 }]
    }));
  };

  const removeSubject = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const addGuardian = () => {
    setProfileData(prev => ({
      ...prev,
      guardians: [...prev.guardians, {
        fullName: '',
        contactNumber: '',
        email: '',
        relationship: '',
        employmentStatus: ''
      }]
    }));
  };

  const removeGuardian = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      guardians: prev.guardians.filter((_, i) => i !== index)
    }));
  };

  const handleGuardianChange = (index: number, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      guardians: prev.guardians.map((guardian, i) => 
        i === index ? { ...guardian, [field]: value } : guardian
      )
    }));
  };

  const handleFileUpload = (documentType: keyof ProfileData['documents'], file: File) => {
    setProfileData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const handleGenerateResume = async () => {
    if (!student) return;
    
    setIsGeneratingResume(true);
    
    try {
      // Convert ProfileData to StudentProfile format
      const studentProfile: StudentProfile = {
        student_id: student.id_number,
        contact_number: profileData.contactNumber,
        date_of_birth: profileData.dateOfBirth,
        gender: profileData.gender,
        citizenship: profileData.citizenship,
        home_address: {
          province: profileData.homeAddress.province,
          city: profileData.homeAddress.city,
          suburb: profileData.homeAddress.suburb,
          postal_code: profileData.homeAddress.postalCode
        },
        high_school_name: profileData.highSchoolName,
        high_school_address: profileData.highSchoolAddress,
        year_matriculated: parseInt(profileData.yearMatriculated),
        matric_type: profileData.matricType,
        current_institution: profileData.currentInstitution,
        student_number: profileData.studentNumber,
        qualification_name: profileData.qualificationName,
        year_of_study: profileData.yearOfStudy,
        average_percentage: profileData.averagePercentage,
        aps_score: profileData.apsScore,
        subjects_passed: profileData.subjectsPassed,
        subjects_failed: profileData.subjectsFailed,
        subjects: profileData.subjects,
        household_income: profileData.householdIncome,
        parents_occupation: profileData.parentsOccupation,
        number_of_dependents: profileData.numberOfDependents,
        receiving_other_funding: profileData.receivingOtherFunding,
        funding_source: profileData.fundingSource,
        guardians: profileData.guardians.map(g => ({
          full_name: g.fullName,
          contact_number: g.contactNumber,
          email: g.email,
          relationship: g.relationship,
          employment_status: g.employmentStatus
        }))
      };

      // Generate resume using AI
      const resumeHtml = await resumeService.generateResume(studentProfile, student.id_number, {
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email
      });
      
      // Download the resume
      const filename = `${profileData.firstName}_${profileData.lastName}_Resume.html`;
      resumeService.downloadResume(resumeHtml, filename);
      
      toast({
        title: "Resume Generated Successfully",
        description: "Your personalized resume has been downloaded.",
      });
      
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Resume Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const calculateAPS = () => {
    const aps = profileService.calculateAPS(profileData.subjects);
    const averagePercentage = profileService.calculateAveragePercentage(profileData.subjects);
    const { passed, failed } = profileService.countSubjects(profileData.subjects);
    
    setProfileData(prev => ({
      ...prev,
      apsScore: aps,
      averagePercentage: averagePercentage,
      subjectsPassed: passed,
      subjectsFailed: failed
    }));
  };

  const handleSave = async () => {
    if (!student) return;
    
    setIsLoading(true);
    
    try {
      // Upload documents if any
      const documentUrls: Record<string, string> = {};
      
      for (const [key, file] of Object.entries(profileData.documents)) {
        if (file) {
          const url = await profileService.uploadDocument(file, key);
          if (url) {
            documentUrls[key] = url;
          }
        }
      }

      // Prepare profile data for database
      const profileToSave: StudentProfile = {
        student_id: student.id_number,
        date_of_birth: profileData.dateOfBirth || undefined,
        gender: profileData.gender || undefined,
        contact_number: profileData.contactNumber || undefined,
        citizenship: profileData.citizenship || undefined,
        home_address: profileData.homeAddress.province ? {
          province: profileData.homeAddress.province,
          city: profileData.homeAddress.city,
          suburb: profileData.homeAddress.suburb,
          postal_code: profileData.homeAddress.postalCode
        } : undefined,
        high_school_name: profileData.highSchoolName || undefined,
        high_school_address: profileData.highSchoolAddress || undefined,
        year_matriculated: profileData.yearMatriculated ? parseInt(profileData.yearMatriculated) : undefined,
        matric_type: profileData.matricType || undefined,
        current_institution: profileData.currentInstitution || undefined,
        student_number: profileData.studentNumber || undefined,
        qualification_name: profileData.qualificationName || undefined,
        year_of_study: profileData.yearOfStudy || undefined,
        average_percentage: profileData.averagePercentage || undefined,
        aps_score: profileData.apsScore || undefined,
        subjects_passed: profileData.subjectsPassed || undefined,
        subjects_failed: profileData.subjectsFailed || undefined,
        subjects: profileData.subjects.length > 0 ? profileData.subjects : undefined,
        household_income: profileData.householdIncome || undefined,
        parents_occupation: profileData.parentsOccupation || undefined,
        number_of_dependents: profileData.numberOfDependents || undefined,
        receiving_other_funding: profileData.receivingOtherFunding || undefined,
        funding_source: profileData.fundingSource || undefined,
        guardians: profileData.guardians.length > 0 ? profileData.guardians.map(g => ({
          full_name: g.fullName,
          contact_number: g.contactNumber,
          email: g.email,
          relationship: g.relationship,
          employment_status: g.employmentStatus
        })) as Array<{
          full_name: string;
          contact_number: string;
          email: string;
          relationship: string;
          employment_status: string;
        }> : undefined,
        documents: Object.keys(documentUrls).length > 0 ? documentUrls : undefined
      };

      // Save profile to database
      const profileSuccess = await profileService.saveProfile(profileToSave);
      
      if (!profileSuccess) {
        throw new Error('Failed to save profile');
      }

      // Convert subjects array to marks object for students table
      const marksObject: Record<string, number> = {};
      profileData.subjects.forEach(subject => {
        // Convert subject name to the format used in students table
        const subjectKey = subject.name.toLowerCase().replace(/\s+/g, '_');
        marksObject[subjectKey] = subject.mark;
      });

      // Update student marks in students table
      const marksSuccess = await profileService.updateStudentMarks(student.id_number, marksObject);
      
      if (!marksSuccess) {
        console.warn('Failed to update student marks in students table');
      }

      // Update student basic info in students table
      const studentInfoSuccess = await profileService.updateStudentInfo(student.id_number, {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      });

      if (!studentInfoSuccess) {
        console.warn('Failed to update student info in students table');
      }

      // Refresh student data to reflect changes
      await refreshStudent();

      // Show success message
      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile and student information have been saved and are ready for applications.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const provinces = [
    'Western Cape', 'Gauteng', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
    'Mpumalanga', 'Limpopo', 'North West', 'Northern Cape'
  ];

  const matricTypes = ['NSC', 'IEB', 'Cambridge', 'Other'];
  const incomeBrackets = [
    'Under R350,000', 'R350,000 - R500,000', 'R500,000 - R750,000',
    'R750,000 - R1,000,000', 'R1,000,000 - R1,500,000', 'Over R1,500,000'
  ];

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to edit your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
           
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          </div>
          <p className="text-gray-600">
            Complete your profile with all the information needed for university and bursary applications.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Basic personal details required for all applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number / Passport *</Label>
                    <Input
                      id="idNumber"
                      value={profileData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="citizenship">Citizenship *</Label>
                    <Select value={profileData.citizenship} onValueChange={(value) => handleInputChange('citizenship', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select citizenship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="south-african">South African</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={profileData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Home Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select value={profileData.homeAddress.province} onValueChange={(value) => handleInputChange('homeAddress.province', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map(province => (
                            <SelectItem key={province} value={province}>{province}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={profileData.homeAddress.city}
                        onChange={(e) => handleInputChange('homeAddress.city', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suburb">Suburb *</Label>
                      <Input
                        id="suburb"
                        value={profileData.homeAddress.suburb}
                        onChange={(e) => handleInputChange('homeAddress.suburb', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={profileData.homeAddress.postalCode}
                        onChange={(e) => handleInputChange('homeAddress.postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Information */}
          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education Information
                </CardTitle>
                <CardDescription>
                  Your educational background and current studies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">High School Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="highSchoolName">High School Name *</Label>
                      <Input
                        id="highSchoolName"
                        value={profileData.highSchoolName}
                        onChange={(e) => handleInputChange('highSchoolName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearMatriculated">Year Matriculated *</Label>
                      <Input
                        id="yearMatriculated"
                        type="number"
                        value={profileData.yearMatriculated}
                        onChange={(e) => handleInputChange('yearMatriculated', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="highSchoolAddress">High School Address</Label>
                    <Textarea
                      id="highSchoolAddress"
                      value={profileData.highSchoolAddress}
                      onChange={(e) => handleInputChange('highSchoolAddress', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matricType">Matric Certificate Type *</Label>
                    <Select value={profileData.matricType} onValueChange={(value) => handleInputChange('matricType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select certificate type" />
                      </SelectTrigger>
                      <SelectContent>
                        {matricTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Studies (if applicable)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentInstitution">Current Institution</Label>
                      <Input
                        id="currentInstitution"
                        value={profileData.currentInstitution}
                        onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentNumber">Student Number</Label>
                      <Input
                        id="studentNumber"
                        value={profileData.studentNumber}
                        onChange={(e) => handleInputChange('studentNumber', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="qualificationName">Qualification Name</Label>
                      <Input
                        id="qualificationName"
                        value={profileData.qualificationName}
                        onChange={(e) => handleInputChange('qualificationName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year of Study</Label>
                      <Select value={profileData.yearOfStudy} onValueChange={(value) => handleInputChange('yearOfStudy', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                          <SelectItem value="honours">Honours</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Performance */}
          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Academic Performance
                </CardTitle>
                <CardDescription>
                  Your academic results and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Subject Results</h3>
                    <Button onClick={addSubject} variant="outline" size="sm">
                      Add Subject
                    </Button>
                  </div>
                  
                  {profileData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Input
                          placeholder="Subject name"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Mark"
                          value={subject.mark}
                          onChange={(e) => handleSubjectChange(index, 'mark', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <Button onClick={calculateAPS} className="w-full">
                    Calculate APS Score
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">APS Score</div>
                    <div className="text-2xl font-bold text-blue-900">{profileData.apsScore}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Average %</div>
                    <div className="text-2xl font-bold text-green-900">{profileData.averagePercentage.toFixed(1)}%</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Subjects Passed</div>
                    <div className="text-2xl font-bold text-purple-900">{profileData.subjectsPassed}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Information */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                 
                  Financial Information
                </CardTitle>
                <CardDescription>
                  Financial details required for bursary applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Household Financial Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="householdIncome">Household Income Bracket *</Label>
                    <Select value={profileData.householdIncome} onValueChange={(value) => handleInputChange('householdIncome', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income bracket" />
                      </SelectTrigger>
                      <SelectContent>
                        {incomeBrackets.map(bracket => (
                          <SelectItem key={bracket} value={bracket}>{bracket}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentsOccupation">Parents'/Guardians' Occupation(s) *</Label>
                    <Textarea
                      id="parentsOccupation"
                      value={profileData.parentsOccupation}
                      onChange={(e) => handleInputChange('parentsOccupation', e.target.value)}
                      placeholder="Describe the occupation(s) of your parents or guardians"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="numberOfDependents">Number of Dependents in Household *</Label>
                    <Input
                      id="numberOfDependents"
                      type="number"
                      value={profileData.numberOfDependents}
                      onChange={(e) => handleInputChange('numberOfDependents', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="receivingOtherFunding"
                        checked={profileData.receivingOtherFunding}
                        onCheckedChange={(checked) => handleInputChange('receivingOtherFunding', checked)}
                      />
                      <Label htmlFor="receivingOtherFunding">Currently receiving other funding</Label>
                    </div>
                    
                    {profileData.receivingOtherFunding && (
                      <div className="space-y-2">
                        <Label htmlFor="fundingSource">Source of Funding</Label>
                        <Input
                          id="fundingSource"
                          value={profileData.fundingSource}
                          onChange={(e) => handleInputChange('fundingSource', e.target.value)}
                          placeholder="e.g., NSFAS, StudyTrust, other bursary"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                    <Button onClick={addGuardian} variant="outline" size="sm">
                      Add Guardian
                    </Button>
                  </div>
                  
                  {profileData.guardians.map((guardian, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Guardian {index + 1}</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeGuardian(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            value={guardian.fullName}
                            onChange={(e) => handleGuardianChange(index, 'fullName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Number *</Label>
                          <Input
                            value={guardian.contactNumber}
                            onChange={(e) => handleGuardianChange(index, 'contactNumber', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={guardian.email}
                            onChange={(e) => handleGuardianChange(index, 'email', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Select value={guardian.relationship} onValueChange={(value) => handleGuardianChange(index, 'relationship', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Employment Status *</Label>
                        <Select value={guardian.employmentStatus} onValueChange={(value) => handleGuardianChange(index, 'employmentStatus', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Employed</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="self-employed">Self-employed</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="deceased">Deceased</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supporting Documents */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Supporting Documents
                </CardTitle>
                <CardDescription>
                  Upload required documents for your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Certified ID Copy *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {profileData.documents.idCopy ? profileData.documents.idCopy.name : 'Click to upload ID copy'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('idCopy', e.target.files[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Matric Results / Latest Transcript *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {profileData.documents.matricResults ? profileData.documents.matricResults.name : 'Click to upload results'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('matricResults', e.target.files[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Proof of Address *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {profileData.documents.proofOfAddress ? profileData.documents.proofOfAddress.name : 'Click to upload proof of address'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('proofOfAddress', e.target.files[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Proof of Income *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {profileData.documents.proofOfIncome ? profileData.documents.proofOfIncome.name : 'Click to upload proof of income'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('proofOfIncome', e.target.files[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Curriculum Vitae (Optional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {profileData.documents.curriculumVitae ? profileData.documents.curriculumVitae.name : 'Click to upload CV'}
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('curriculumVitae', e.target.files[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Generation Section */}
                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">AI Resume Generator</h3>
                        <p className="text-sm text-muted-foreground">
                          Generate a personalized resume using your profile information and interests
                        </p>
                      </div>
                      <Button
                        onClick={handleGenerateResume}
                        disabled={isGeneratingResume || !profileData.firstName || !profileData.lastName}
                        className="flex items-center gap-2"
                      >
                        {isGeneratingResume ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Generate Resume
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">What's included in your AI-generated resume:</p>
                          <ul className="list-disc list-inside space-y-1 text-blue-700">
                            <li>Personal information and contact details</li>
                            <li>Academic achievements and performance</li>
                            <li>Subject marks and APS score</li>
                            <li>Career interests and goals</li>
                            <li>Skills based on your profile</li>
                            <li>Professional formatting and structure</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> All documents must be certified copies. Ensure files are clear and legible. 
                    Maximum file size: 10MB per document.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
