// Student Interface
export interface Student {
  id_number: string;
  username: string;
  password?: string; // Optional since it's not used in the database
  school_id: string;
  first_name: string;
  last_name: string;
  email: string;
  marks: {
    mathematics: number;
    english: number;
    physical_sciences: number;
    life_sciences: number;
    accounting: number;
    economics: number;
    geography: number;
    history: number;
  };
  preferred_residences?: string[]; // Array of residence IDs
  quiz_answers?: {
    study_habits: number; // 1-5 scale
    cleanliness: number; // 1-5 scale
    social_level: number; // 1-5 scale
    sleep_schedule: number; // 1-3 scale (early, normal, late)
    music_tolerance: number; // 1-5 scale
    party_frequency: number; // 1-5 scale
    smoking_preference: number; // 1-3 scale (non-smoker, occasional, regular)
    pet_preference: number; // 1-3 scale (no pets, okay with pets, want pets)
    hobbies: string[]; // Array of hobby strings
    interests: string[]; // Array of interest strings
  };
}

// School Interface
export interface School {
  school_id: string;
  name: string;
  province: string;
  type: string;
  is_partner: boolean;
}

// University Interface
export interface University {
  university_id: string;
  name: string;
  location: string;
  province: string;
}

// Course Interface
export interface Course {
  course_id: string;
  university_id: string;
  name: string;
  faculty: string;
  requirements: {
    minimum_aps?: number;
    mathematics?: number;
    english?: number;
    physical_sciences?: number;
    life_sciences?: number;
    accounting?: number;
    economics?: number;
    additional_requirements?: string[];
  };
  points_required: number;
  estimated_cost: number;
  modules: string[];
  available_residences?: string[]; // Array of residence IDs
  universities?: {
    name: string;
    location: string;
    province: string;
  };
}

// Offer Interface
export interface Offer {
  offer_id: string;
  student_id: string;
  university_id: string;
  course_id: string;
  status: 'pending' | 'accepted' | 'declined';
  offer_date: string;
  deadline: string;
  conditional?: boolean;
  conditions?: string[];
}

// Bursary Interface
export interface Bursary {
  bursary_id: string;
  name: string;
  provider: string;
  eligibility: {
    minimum_household_income?: number;
    minimum_aps?: number;
    provinces?: string[];
    faculties?: string[];
    additional_criteria?: string[];
  };
  deadline: string;
}

// Residence Interface
export interface Residence {
  residence_id: string;
  name: string;
  university_id: string;
  location: string;
  gender: 'male' | 'female' | 'mixed';
  price_per_month: number;
  estimated_annual_cost: number;
  capacity: number;
  amenities: string[];
  distance_from_campus: string;
  contact_info: {
    phone: string;
    email: string;
  };
  universities?: {
    name: string;
    location: string;
    province: string;
  };
}

// Career Interface
export interface Career {
  career_id: string;
  name: string;
  description: string;
  required_courses: string[];
  skills_required: string[];
  average_salary_entry: number;
  average_salary_mid: number;
  average_salary_senior: number;
  job_market_outlook: 'High demand' | 'Moderate demand' | 'Low demand';
  growth_prospects: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  education_requirements: string;
  experience_requirements: string;
  work_environment: string;
  career_path: string[];
  related_careers: string[];
  industry: string;
  work_life_balance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  job_security: 'High' | 'Medium' | 'Low';
  advancement_opportunities: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}
