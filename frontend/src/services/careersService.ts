import { Career } from '@/types';

class CareersService {
  private readonly STORAGE_KEY_CAREERS = 'unimatch_careers';
  private readonly STORAGE_KEY_STUDENT_INTERESTS = 'unimatch_student_interests';

  // Comprehensive career data with at least 10 careers per industry
  private sampleCareers: Career[] = [
    // HEALTHCARE INDUSTRY (12 careers)
    {
      career_id: 'CAREER001',
      name: 'Medical Doctor',
      description: 'Diagnose and treat patients, perform surgeries, and provide medical care. Requires extensive education and training.',
      required_courses: ['Medicine', 'Surgery', 'Anatomy', 'Physiology'],
      skills_required: ['Communication', 'Problem Solving', 'Empathy', 'Attention to Detail', 'Critical Thinking'],
      average_salary_entry: 450000,
      average_salary_mid: 800000,
      average_salary_senior: 1200000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
      experience_requirements: '2 years internship + community service',
      work_environment: 'Hospitals, clinics, private practice',
      career_path: ['Medical Student', 'Intern', 'Medical Officer', 'Specialist', 'Consultant'],
      related_careers: ['Nurse', 'Pharmacist', 'Physiotherapist', 'Dentist'],
      industry: 'Healthcare',
      work_life_balance: 'Fair',
      job_security: 'High',
      advancement_opportunities: 'Excellent'
    },
    {
      career_id: 'CAREER002',
      name: 'Registered Nurse',
      description: 'Provide direct patient care, assist doctors, and educate patients about health conditions.',
      required_courses: ['Nursing', 'Anatomy', 'Physiology', 'Patient Care'],
      skills_required: ['Compassion', 'Communication', 'Attention to Detail', 'Physical Stamina', 'Critical Thinking'],
      average_salary_entry: 280000,
      average_salary_mid: 420000,
      average_salary_senior: 650000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Nursing or Diploma in Nursing',
      experience_requirements: 'Clinical practice during studies',
      work_environment: 'Hospitals, clinics, home care, community health',
      career_path: ['Student Nurse', 'Staff Nurse', 'Senior Nurse', 'Nurse Manager', 'Chief Nursing Officer'],
      related_careers: ['Medical Doctor', 'Physiotherapist', 'Occupational Therapist', 'Midwife'],
      industry: 'Healthcare',
      work_life_balance: 'Fair',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER003',
      name: 'Pharmacist',
      description: 'Dispense medications, provide drug information, and ensure safe medication use.',
      required_courses: ['Pharmacy', 'Chemistry', 'Pharmacology', 'Pharmaceutical Care'],
      skills_required: ['Attention to Detail', 'Communication', 'Analytical Thinking', 'Customer Service', 'Knowledge of Medications'],
      average_salary_entry: 350000,
      average_salary_mid: 550000,
      average_salary_senior: 800000,
      job_market_outlook: 'Moderate demand',
      growth_prospects: 'Good',
      education_requirements: 'Bachelor of Pharmacy (BPharm)',
      experience_requirements: '1 year internship',
      work_environment: 'Pharmacies, hospitals, pharmaceutical companies',
      career_path: ['Intern Pharmacist', 'Pharmacist', 'Senior Pharmacist', 'Pharmacy Manager', 'Pharmaceutical Director'],
      related_careers: ['Medical Doctor', 'Nurse', 'Pharmaceutical Sales Rep', 'Clinical Research Associate'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER004',
      name: 'Physiotherapist',
      description: 'Help patients recover from injuries and improve physical function through exercise and therapy.',
      required_courses: ['Physiotherapy', 'Anatomy', 'Physiology', 'Exercise Science'],
      skills_required: ['Physical Fitness', 'Communication', 'Empathy', 'Problem Solving', 'Manual Dexterity'],
      average_salary_entry: 300000,
      average_salary_mid: 480000,
      average_salary_senior: 720000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Physiotherapy',
      experience_requirements: '1 year community service',
      work_environment: 'Hospitals, clinics, sports facilities, private practice',
      career_path: ['Student Physiotherapist', 'Physiotherapist', 'Senior Physiotherapist', 'Practice Manager', 'Clinical Director'],
      related_careers: ['Occupational Therapist', 'Sports Medicine Doctor', 'Massage Therapist', 'Rehabilitation Counselor'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER005',
      name: 'Dentist',
      description: 'Diagnose and treat dental problems, perform oral surgery, and promote oral health.',
      required_courses: ['Dentistry', 'Oral Biology', 'Dental Materials', 'Oral Surgery'],
      skills_required: ['Manual Dexterity', 'Attention to Detail', 'Communication', 'Problem Solving', 'Patience'],
      average_salary_entry: 400000,
      average_salary_mid: 700000,
      average_salary_senior: 1100000,
      job_market_outlook: 'Moderate demand',
      growth_prospects: 'Good',
      education_requirements: 'Bachelor of Dental Surgery (BDS)',
      experience_requirements: '1 year internship',
      work_environment: 'Dental clinics, hospitals, private practice',
      career_path: ['Dental Student', 'Intern Dentist', 'General Dentist', 'Specialist Dentist', 'Practice Owner'],
      related_careers: ['Dental Hygienist', 'Dental Assistant', 'Oral Surgeon', 'Orthodontist'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER006',
      name: 'Psychologist',
      description: 'Study human behavior and mental processes, provide therapy and counseling services.',
      required_courses: ['Psychology', 'Research Methods', 'Statistics', 'Clinical Psychology'],
      skills_required: ['Empathy', 'Communication', 'Active Listening', 'Analytical Thinking', 'Patience'],
      average_salary_entry: 320000,
      average_salary_mid: 520000,
      average_salary_senior: 850000,
      job_market_outlook: 'Moderate demand',
      growth_prospects: 'Good',
      education_requirements: 'Master of Psychology or PhD in Psychology',
      experience_requirements: '2 years supervised practice',
      work_environment: 'Private practice, hospitals, schools, corporate settings',
      career_path: ['Psychology Intern', 'Psychologist', 'Senior Psychologist', 'Clinical Director', 'Private Practice Owner'],
      related_careers: ['Psychiatrist', 'Social Worker', 'Counselor', 'Mental Health Nurse'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'Medium',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER007',
      name: 'Radiologist',
      description: 'Interpret medical images to diagnose diseases and conditions using X-rays, MRI, and CT scans.',
      required_courses: ['Medicine', 'Radiology', 'Anatomy', 'Pathology'],
      skills_required: ['Analytical Thinking', 'Attention to Detail', 'Technical Skills', 'Communication', 'Problem Solving'],
      average_salary_entry: 500000,
      average_salary_mid: 900000,
      average_salary_senior: 1400000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'MBChB + 4 years radiology specialization',
      experience_requirements: '2 years internship + 4 years specialization',
      work_environment: 'Hospitals, diagnostic centers, private practice',
      career_path: ['Medical Officer', 'Radiology Registrar', 'Radiologist', 'Senior Radiologist', 'Head of Radiology'],
      related_careers: ['Medical Doctor', 'Radiographer', 'Nuclear Medicine Technologist', 'Ultrasound Technician'],
      industry: 'Healthcare',
      work_life_balance: 'Fair',
      job_security: 'High',
      advancement_opportunities: 'Excellent'
    },
    {
      career_id: 'CAREER008',
      name: 'Veterinarian',
      description: 'Diagnose and treat diseases and injuries in animals, perform surgeries, and provide preventive care.',
      required_courses: ['Veterinary Medicine', 'Animal Biology', 'Surgery', 'Pharmacology'],
      skills_required: ['Compassion for Animals', 'Manual Dexterity', 'Problem Solving', 'Communication', 'Physical Stamina'],
      average_salary_entry: 380000,
      average_salary_mid: 600000,
      average_salary_senior: 950000,
      job_market_outlook: 'Moderate demand',
      growth_prospects: 'Good',
      education_requirements: 'Bachelor of Veterinary Science (BVSc)',
      experience_requirements: '1 year internship',
      work_environment: 'Veterinary clinics, animal hospitals, farms, zoos',
      career_path: ['Veterinary Intern', 'Veterinarian', 'Senior Veterinarian', 'Practice Owner', 'Specialist Veterinarian'],
      related_careers: ['Veterinary Technician', 'Animal Behaviorist', 'Wildlife Biologist', 'Animal Nutritionist'],
      industry: 'Healthcare',
      work_life_balance: 'Fair',
      job_security: 'Medium',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER009',
      name: 'Occupational Therapist',
      description: 'Help patients develop, recover, and improve skills needed for daily living and working.',
      required_courses: ['Occupational Therapy', 'Anatomy', 'Psychology', 'Rehabilitation'],
      skills_required: ['Empathy', 'Communication', 'Problem Solving', 'Creativity', 'Patience'],
      average_salary_entry: 290000,
      average_salary_mid: 460000,
      average_salary_senior: 700000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Occupational Therapy',
      experience_requirements: '1 year community service',
      work_environment: 'Hospitals, clinics, schools, rehabilitation centers',
      career_path: ['OT Student', 'Occupational Therapist', 'Senior OT', 'OT Manager', 'Clinical Director'],
      related_careers: ['Physiotherapist', 'Speech Therapist', 'Rehabilitation Counselor', 'Social Worker'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER010',
      name: 'Speech Therapist',
      description: 'Assess and treat communication and swallowing disorders in patients of all ages.',
      required_courses: ['Speech Therapy', 'Linguistics', 'Psychology', 'Anatomy'],
      skills_required: ['Communication', 'Patience', 'Empathy', 'Analytical Thinking', 'Creativity'],
      average_salary_entry: 270000,
      average_salary_mid: 440000,
      average_salary_senior: 680000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Speech Therapy',
      experience_requirements: '1 year community service',
      work_environment: 'Hospitals, clinics, schools, private practice',
      career_path: ['Speech Therapy Student', 'Speech Therapist', 'Senior Speech Therapist', 'Clinical Supervisor', 'Private Practice Owner'],
      related_careers: ['Occupational Therapist', 'Audiologist', 'Special Education Teacher', 'Psychologist'],
      industry: 'Healthcare',
      work_life_balance: 'Good',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER011',
      name: 'Midwife',
      description: 'Provide care and support to women during pregnancy, childbirth, and postpartum period.',
      required_courses: ['Midwifery', 'Anatomy', 'Physiology', 'Maternal Health'],
      skills_required: ['Compassion', 'Communication', 'Physical Stamina', 'Problem Solving', 'Emotional Support'],
      average_salary_entry: 260000,
      average_salary_mid: 420000,
      average_salary_senior: 650000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Excellent',
      education_requirements: 'Bachelor of Midwifery or Diploma in Midwifery',
      experience_requirements: 'Clinical practice during studies',
      work_environment: 'Hospitals, clinics, home births, community health',
      career_path: ['Student Midwife', 'Midwife', 'Senior Midwife', 'Midwifery Manager', 'Clinical Director'],
      related_careers: ['Nurse', 'Obstetrician', 'Gynecologist', 'Lactation Consultant'],
      industry: 'Healthcare',
      work_life_balance: 'Fair',
      job_security: 'High',
      advancement_opportunities: 'Good'
    },
    {
      career_id: 'CAREER012',
      name: 'Emergency Medical Technician',
      description: 'Provide emergency medical care and transport patients to medical facilities.',
      required_courses: ['Emergency Medical Care', 'Anatomy', 'Physiology', 'Trauma Care'],
      skills_required: ['Physical Stamina', 'Quick Decision Making', 'Communication', 'Stress Management', 'Teamwork'],
      average_salary_entry: 180000,
      average_salary_mid: 300000,
      average_salary_senior: 450000,
      job_market_outlook: 'High demand',
      growth_prospects: 'Good',
      education_requirements: 'Certificate in Emergency Medical Care',
      experience_requirements: 'On-the-job training',
      work_environment: 'Ambulances, hospitals, emergency services',
      career_path: ['EMT Student', 'EMT', 'Senior EMT', 'Paramedic', 'Emergency Services Manager'],
      related_careers: ['Nurse', 'Firefighter', 'Police Officer', 'Emergency Room Doctor'],
      industry: 'Healthcare',
      work_life_balance: 'Poor',
      job_security: 'High',
      advancement_opportunities: 'Fair'
    }
  ];

  // Initialize careers data
  private initializeCareers(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY_CAREERS);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY_CAREERS, JSON.stringify(this.sampleCareers));
    }
  }

  // Get all careers
  getAllCareers(): Career[] {
    this.initializeCareers();
    const stored = localStorage.getItem(this.STORAGE_KEY_CAREERS);
    return stored ? JSON.parse(stored) : this.sampleCareers;
  }

  // Get careers by industry
  getCareersByIndustry(industry: string): Career[] {
    return this.getAllCareers().filter(career => career.industry === industry);
  }

  // Get all industries
  getIndustries(): string[] {
    const careers = this.getAllCareers();
    const industries = [...new Set(careers.map(career => career.industry))];
    return industries.sort();
  }

  // Search careers by name or description
  searchCareers(query: string): Career[] {
    const careers = this.getAllCareers();
    const lowercaseQuery = query.toLowerCase();
    
    return careers.filter(career => 
      career.name.toLowerCase().includes(lowercaseQuery) ||
      career.description.toLowerCase().includes(lowercaseQuery) ||
      career.skills_required.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get career by ID
  getCareerById(careerId: string): Career | undefined {
    return this.getAllCareers().find(career => career.career_id === careerId);
  }

  // Get careers by demand level
  getCareersByDemand(demand: 'High demand' | 'Moderate demand' | 'Low demand'): Career[] {
    return this.getAllCareers().filter(career => career.job_market_outlook === demand);
  }

  // Get careers by growth prospects
  getCareersByGrowth(growth: 'Excellent' | 'Good' | 'Fair' | 'Poor'): Career[] {
    return this.getAllCareers().filter(career => career.growth_prospects === growth);
  }

  // Get careers by salary range
  getCareersBySalaryRange(minSalary: number, maxSalary: number): Career[] {
    return this.getAllCareers().filter(career => 
      career.average_salary_entry >= minSalary && career.average_salary_entry <= maxSalary
    );
  }

  // Get recommended careers based on student interests
  getRecommendedCareers(interests: string[]): Career[] {
    const careers = this.getAllCareers();
    
    return careers
      .map(career => {
        const score = interests.reduce((total, interest) => {
          const interestLower = interest.toLowerCase();
          let careerScore = 0;
          
          // Check if interest matches career name or description
          if (career.name.toLowerCase().includes(interestLower) ||
              career.description.toLowerCase().includes(interestLower)) {
            careerScore += 3;
          }
          
          // Check if interest matches skills
          if (career.skills_required.some(skill => 
              skill.toLowerCase().includes(interestLower))) {
            careerScore += 2;
          }
          
          // Check if interest matches industry
          if (career.industry.toLowerCase().includes(interestLower)) {
            careerScore += 1;
          }
          
          return total + careerScore;
        }, 0);
        
        return { career, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.career);
  }

  // Save student interests
  saveStudentInterests(studentId: string, interests: string[]): void {
    const key = `${this.STORAGE_KEY_STUDENT_INTERESTS}_${studentId}`;
    localStorage.setItem(key, JSON.stringify(interests));
  }

  // Get student interests
  getStudentInterests(studentId: string): string[] {
    const key = `${this.STORAGE_KEY_STUDENT_INTERESTS}_${studentId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  // Get career statistics
  getCareerStatistics(): {
    totalCareers: number;
    industriesCount: number;
    averageSalary: number;
    highDemandCount: number;
    excellentGrowthCount: number;
  } {
    const careers = this.getAllCareers();
    const industries = this.getIndustries();
    
    const totalSalary = careers.reduce((sum, career) => sum + career.average_salary_entry, 0);
    const highDemandCareers = careers.filter(career => career.job_market_outlook === 'High demand');
    const excellentGrowthCareers = careers.filter(career => career.growth_prospects === 'Excellent');
    
    return {
      totalCareers: careers.length,
      industriesCount: industries.length,
      averageSalary: Math.round(totalSalary / careers.length),
      highDemandCount: highDemandCareers.length,
      excellentGrowthCount: excellentGrowthCareers.length
    };
  }
}

// Export singleton instance
export const careersService = new CareersService();
export default careersService;
   