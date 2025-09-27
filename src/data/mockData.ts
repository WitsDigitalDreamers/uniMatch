export interface Student {
  id_number: string;
  username: string;
  password: string;
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

export interface School {
  school_id: string;
  name: string;
  province: string;
  type: string;
  is_partner: boolean;
}

export interface University {
  university_id: string;
  name: string;
  location: string;
  province: string;
}

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
}

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
}

export interface Bursary {
  bursary_id: string;
  name: string;
  provider: string;
  amount: number;
  eligibility: {
    minimum_household_income?: number;
    minimum_aps?: number;
    provinces?: string[];
    faculties?: string[];
    additional_criteria?: string[];
  };
  deadline: string;
}

// Mock Data
export const schools: School[] = [
  {
    school_id: "SCH001",
    name: "Cape Town High School",
    province: "Western Cape",
    type: "Public",
    is_partner: true
  },
  {
    school_id: "SCH002", 
    name: "Johannesburg College",
    province: "Gauteng",
    type: "Private",
    is_partner: true
  },
  {
    school_id: "SCH003",
    name: "Durban Technical High",
    province: "KwaZulu-Natal", 
    type: "Technical",
    is_partner: false
  },
  {
    school_id: "SCH004",
    name: "Pretoria Boys High School",
    province: "Gauteng",
    type: "Public",
    is_partner: true
  },
  {
    school_id: "SCH005",
    name: "St. Mary's School",
    province: "Western Cape",
    type: "Private",
    is_partner: false
  },
  {
    school_id: "SCH006",
    name: "Port Elizabeth High School",
    province: "Eastern Cape",
    type: "Public",
    is_partner: true
  },
  {
    school_id: "SCH007",
    name: "Bloemfontein Technical College",
    province: "Free State",
    type: "Technical",
    is_partner: false
  },
  {
    school_id: "SCH008",
    name: "Nelspruit Secondary School",
    province: "Mpumalanga",
    type: "Public",
    is_partner: true
  }
];

export const universities: University[] = [
  {
    university_id: "UCT001",
    name: "University of Cape Town",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "WITS001",
    name: "University of the Witwatersrand",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UKZN001",
    name: "University of KwaZulu-Natal",
    location: "Durban",
    province: "KwaZulu-Natal"
  }
];

export const courses: Course[] = [
  // UCT Courses
  {
    course_id: "UCT_ENG001",
    university_id: "UCT001",
    name: "Bachelor of Science in Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 42,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 42,
    estimated_cost: 78500,
    modules: ["Engineering Mathematics 1", "Physics for Engineers", "Chemistry for Engineers", "Engineering Design", "Computer Programming", "Engineering Graphics"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  {
    course_id: "UCT_MED001",
    university_id: "UCT001", 
    name: "Bachelor of Medicine (MBChB)",
    faculty: "Health Sciences",
    requirements: {
      minimum_aps: 45,
      mathematics: 70,
      english: 70,
      physical_sciences: 70,
      life_sciences: 70
    },
    points_required: 45,
    estimated_cost: 125000,
    modules: ["Human Anatomy", "Human Physiology", "Biochemistry", "Medical Ethics", "Pathology", "Pharmacology", "Clinical Skills"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  {
    course_id: "UCT_COM001",
    university_id: "UCT001",
    name: "Bachelor of Commerce",
    faculty: "Commerce",
    requirements: {
      minimum_aps: 35,
      mathematics: 65,
      english: 60,
      accounting: 60
    },
    points_required: 35,
    estimated_cost: 65000,
    modules: ["Financial Accounting", "Management Accounting", "Economics", "Business Statistics", "Business Law", "Marketing Management"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  // Wits Courses
  {
    course_id: "WITS_CS001",
    university_id: "WITS001",
    name: "Bachelor of Science in Computer Science",
    faculty: "Science",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 65
    },
    points_required: 40,
    estimated_cost: 72000,
    modules: ["Programming Fundamentals", "Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Computer Networks", "Machine Learning"],
    available_residences: ["WITS_RES001", "WITS_RES002", "WITS_RES003"]
  },
  {
    course_id: "WITS_LAW001",
    university_id: "WITS001",
    name: "Bachelor of Laws (LLB)",
    faculty: "Law",
    requirements: {
      minimum_aps: 38,
      english: 70,
      mathematics: 50
    },
    points_required: 38,
    estimated_cost: 58000,
    modules: ["Constitutional Law", "Criminal Law", "Contract Law", "Property Law", "Administrative Law", "Commercial Law", "Legal Research"],
    available_residences: ["WITS_RES001", "WITS_RES002", "WITS_RES003"]
  },
  // UKZN Courses
  {
    course_id: "UKZN_AGRI001",
    university_id: "UKZN001",
    name: "Bachelor of Agricultural Sciences",
    faculty: "Agriculture",
    requirements: {
      minimum_aps: 32,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 32,
    estimated_cost: 45000,
    modules: ["Plant Science", "Animal Science", "Soil Science", "Agricultural Economics", "Farm Management", "Crop Production", "Agricultural Technology"],
    available_residences: ["UKZN_RES001", "UKZN_RES002", "UKZN_RES003"]
  }
];

export const students: Student[] = [
  {
    id_number: "0123456789",
    username: "thabo.molefe",
    password: "password123",
    school_id: "SCH001",
    first_name: "Thabo",
    last_name: "Molefe",
    email: "thabo.molefe@email.com",
    marks: {
      mathematics: 85,
      english: 75,
      physical_sciences: 80,
      life_sciences: 78,
      accounting: 82,
      economics: 70,
      geography: 65,
      history: 60
    }
  },
  {
    id_number: "9876543210",
    username: "sarah.johnson",
    password: "password456",
    school_id: "SCH002",
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.johnson@email.com",
    marks: {
      mathematics: 72,
      english: 85,
      physical_sciences: 68,
      life_sciences: 90,
      accounting: 75,
      economics: 80,
      geography: 88,
      history: 92
    }
  },
  {
    id_number: "1234567890",
    username: "aisha.patel",
    password: "password789",
    school_id: "SCH003",
    first_name: "Aisha",
    last_name: "Patel",
    email: "aisha.patel@email.com",
    marks: {
      mathematics: 65,
      english: 70,
      physical_sciences: 72,
      life_sciences: 68,
      accounting: 78,
      economics: 75,
      geography: 70,
      history: 65
    }
  },
  {
    id_number: "5555555555",
    username: "mike.van.der.merwe",
    password: "password999",
    school_id: "SCH001",
    first_name: "Mike",
    last_name: "van der Merwe",
    email: "mike.vandermerwe@email.com",
    marks: {
      mathematics: 95,
      english: 88,
      physical_sciences: 92,
      life_sciences: 85,
      accounting: 70,
      economics: 75,
      geography: 80,
      history: 70
    }
  },
  {
    id_number: "7777777777",
    username: "fatima.ndlovu",
    password: "password111",
    school_id: "SCH002",
    first_name: "Fatima",
    last_name: "Ndlovu", 
    email: "fatima.ndlovu@email.com",
    marks: {
      mathematics: 58,
      english: 68,
      physical_sciences: 55,
      life_sciences: 75,
      accounting: 85,
      economics: 88,
      geography: 82,
      history: 90
    }
  }
];

export const bursaries: Bursary[] = [
  {
    bursary_id: "BURS001",
    name: "National Student Financial Aid Scheme (NSFAS)",
    provider: "Department of Higher Education",
    amount: 80000,
    eligibility: {
      minimum_household_income: 350000,
      minimum_aps: 30,
      additional_criteria: ["South African citizen", "First-time university student"]
    },
    deadline: "2024-11-30"
  },
  {
    bursary_id: "BURS002", 
    name: "Sasol Engineering Bursary",
    provider: "Sasol Ltd",
    amount: 120000,
    eligibility: {
      minimum_aps: 40,
      faculties: ["Engineering"],
      additional_criteria: ["Commit to work for Sasol after graduation", "South African citizen"]
    },
    deadline: "2024-09-30"
  },
  {
    bursary_id: "BURS003",
    name: "Allan Gray Orbis Foundation Fellowship",
    provider: "Allan Gray Orbis Foundation", 
    amount: 150000,
    eligibility: {
      minimum_aps: 35,
      additional_criteria: ["Leadership potential", "Entrepreneurial spirit", "Academic excellence"]
    },
    deadline: "2024-10-15"
  }
];

export const residences: Residence[] = [
  // UCT Residences
  {
    residence_id: "UCT_RES001",
    name: "Smuts Hall",
    university_id: "UCT001",
    location: "Upper Campus, Rondebosch",
    gender: "mixed",
    price_per_month: 4500,
    estimated_annual_cost: 54000,
    capacity: 400,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 650 3000",
      email: "smuts.hall@uct.ac.za"
    }
  },
  {
    residence_id: "UCT_RES002",
    name: "Fuller Hall",
    university_id: "UCT001",
    location: "Lower Campus, Rondebosch",
    gender: "female",
    price_per_month: 4200,
    estimated_annual_cost: 50400,
    capacity: 200,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Gym"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 650 3100",
      email: "fuller.hall@uct.ac.za"
    }
  },
  {
    residence_id: "UCT_RES003",
    name: "Tugwell Hall",
    university_id: "UCT001",
    location: "Upper Campus, Rondebosch",
    gender: "male",
    price_per_month: 4800,
    estimated_annual_cost: 57600,
    capacity: 300,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Sports facilities"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 650 3200",
      email: "tugwell.hall@uct.ac.za"
    }
  },
  // Wits Residences
  {
    residence_id: "WITS_RES001",
    name: "Barnato Hall",
    university_id: "WITS001",
    location: "East Campus, Braamfontein",
    gender: "mixed",
    price_per_month: 3800,
    estimated_annual_cost: 45600,
    capacity: 350,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 11 717 1000",
      email: "barnato.hall@wits.ac.za"
    }
  },
  {
    residence_id: "WITS_RES002",
    name: "David Webster Hall",
    university_id: "WITS001",
    location: "West Campus, Braamfontein",
    gender: "female",
    price_per_month: 3600,
    estimated_annual_cost: 43200,
    capacity: 250,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Library access"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 11 717 1100",
      email: "david.webster@wits.ac.za"
    }
  },
  {
    residence_id: "WITS_RES003",
    name: "Girton Hall",
    university_id: "WITS001",
    location: "Central Campus, Braamfontein",
    gender: "mixed",
    price_per_month: 4000,
    estimated_annual_cost: 48000,
    capacity: 180,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Gym", "Swimming pool"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 11 717 1200",
      email: "girton.hall@wits.ac.za"
    }
  },
  // UKZN Residences
  {
    residence_id: "UKZN_RES001",
    name: "Howard College Residence",
    university_id: "UKZN001",
    location: "Howard College Campus, Durban",
    gender: "mixed",
    price_per_month: 3200,
    estimated_annual_cost: 38400,
    capacity: 500,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 31 260 1111",
      email: "howard.residence@ukzn.ac.za"
    }
  },
  {
    residence_id: "UKZN_RES002",
    name: "Westville Residence",
    university_id: "UKZN001",
    location: "Westville Campus, Durban",
    gender: "female",
    price_per_month: 3000,
    estimated_annual_cost: 36000,
    capacity: 300,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Gym"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 31 260 2222",
      email: "westville.residence@ukzn.ac.za"
    }
  },
  {
    residence_id: "UKZN_RES003",
    name: "Pietermaritzburg Residence",
    university_id: "UKZN001",
    location: "Pietermaritzburg Campus",
    gender: "mixed",
    price_per_month: 2800,
    estimated_annual_cost: 33600,
    capacity: 400,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 33 260 3333",
      email: "pmb.residence@ukzn.ac.za"
    }
  }
];

export const offers: Offer[] = [
  {
    offer_id: "OFF001",
    student_id: "0123456789",
    university_id: "UCT001", 
    course_id: "UCT_ENG001",
    status: 'pending',
    offer_date: "2024-01-15",
    deadline: "2024-02-15",
    conditional: false
  },
  {
    offer_id: "OFF002",
    student_id: "0123456789",
    university_id: "WITS001",
    course_id: "WITS_CS001", 
    status: 'pending',
    offer_date: "2024-01-18",
    deadline: "2024-02-18",
    conditional: true,
    conditions: ["Maintain 80%+ average in final exams"]
  },
  {
    offer_id: "OFF003",
    student_id: "9876543210",
    university_id: "UCT001",
    course_id: "UCT_MED001",
    status: 'pending', 
    offer_date: "2024-01-20",
    deadline: "2024-02-20",
    conditional: false
  },
  {
    offer_id: "OFF004",
    student_id: "1234567890",
    university_id: "UKZN001",
    course_id: "UKZN_AGRI001",
    status: 'pending',
    offer_date: "2024-01-22",
    deadline: "2024-02-22",
    conditional: false
  }
];

// Helper functions for qualification matching
export const calculateAPS = (marks: Student['marks']): number => {
  const subjects = Object.values(marks);
  const topSeven = subjects.sort((a, b) => b - a).slice(0, 7);
  return topSeven.reduce((total, mark) => {
    if (mark >= 80) return total + 7;
    if (mark >= 70) return total + 6; 
    if (mark >= 60) return total + 5;
    if (mark >= 50) return total + 4;
    if (mark >= 40) return total + 3;
    if (mark >= 30) return total + 2;
    return total + 1;
  }, 0);
};

export const checkCourseEligibility = (student: Student, course: Course): { eligible: boolean; missing: string[] } => {
  const missing: string[] = [];
  const aps = calculateAPS(student.marks);
  
  if (course.requirements.minimum_aps && aps < course.requirements.minimum_aps) {
    missing.push(`APS score (need ${course.requirements.minimum_aps}, have ${aps})`);
  }

  Object.entries(course.requirements).forEach(([subject, required]) => {
    if (subject !== 'minimum_aps' && subject !== 'additional_requirements' && typeof required === 'number') {
      const studentMark = student.marks[subject as keyof Student['marks']];
      if (studentMark < required) {
        missing.push(`${subject} (need ${required}%, have ${studentMark}%)`);
      }
    }
  });

  return {
    eligible: missing.length === 0,
    missing
  };
};

// Room Matching Algorithm
export const calculateCompatibilityScore = (student1: Student, student2: Student): number => {
  if (!student1.quiz_answers || !student2.quiz_answers) {
    return 0;
  }

  const answers1 = student1.quiz_answers;
  const answers2 = student2.quiz_answers;

  let score = 0;
  let totalWeight = 0;

  // Lifestyle compatibility (weighted)
  const lifestyleFactors = [
    { field: 'study_habits', weight: 2 },
    { field: 'cleanliness', weight: 3 },
    { field: 'social_level', weight: 2 },
    { field: 'sleep_schedule', weight: 3 },
    { field: 'music_tolerance', weight: 1 },
    { field: 'party_frequency', weight: 2 },
    { field: 'smoking_preference', weight: 3 },
    { field: 'pet_preference', weight: 1 }
  ];

  lifestyleFactors.forEach(({ field, weight }) => {
    const value1 = answers1[field as keyof typeof answers1] as number;
    const value2 = answers2[field as keyof typeof answers2] as number;
    
    if (value1 && value2) {
      const difference = Math.abs(value1 - value2);
      const maxDifference = field === 'sleep_schedule' || field === 'smoking_preference' || field === 'pet_preference' ? 2 : 4;
      const compatibility = 1 - (difference / maxDifference);
      score += compatibility * weight;
      totalWeight += weight;
    }
  });

  // Hobbies and interests compatibility
  const hobbyScore = calculateArrayCompatibility(answers1.hobbies, answers2.hobbies);
  const interestScore = calculateArrayCompatibility(answers1.interests, answers2.interests);
  
  score += hobbyScore * 1.5;
  score += interestScore * 1.5;
  totalWeight += 3;

  return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
};

const calculateArrayCompatibility = (arr1: string[], arr2: string[]): number => {
  if (arr1.length === 0 && arr2.length === 0) return 1;
  if (arr1.length === 0 || arr2.length === 0) return 0;
  
  const intersection = arr1.filter(item => arr2.includes(item));
  const union = [...new Set([...arr1, ...arr2])];
  
  return intersection.length / union.length;
};

export const findBestRoommate = (student: Student, allStudents: Student[]): { student: Student; score: number } | null => {
  const otherStudents = allStudents.filter(s => s.id_number !== student.id_number);
  if (otherStudents.length === 0) return null;

  let bestMatch = null;
  let bestScore = 0;

  otherStudents.forEach(otherStudent => {
    const score = calculateCompatibilityScore(student, otherStudent);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = otherStudent;
    }
  });

  return bestMatch ? { student: bestMatch, score: bestScore } : null;
};

export const findRoomGroup = (students: Student[], roomSize: number = 2): Student[][] => {
  const groups: Student[][] = [];
  const used = new Set<string>();

  students.forEach(student => {
    if (used.has(student.id_number)) return;

    const group = [student];
    used.add(student.id_number);

    // Find compatible students for this group
    while (group.length < roomSize) {
      let bestMatch = null;
      let bestScore = 0;

      students.forEach(otherStudent => {
        if (used.has(otherStudent.id_number)) return;

        // Calculate average compatibility with current group
        const avgCompatibility = group.reduce((sum, groupMember) => {
          return sum + calculateCompatibilityScore(otherStudent, groupMember);
        }, 0) / group.length;

        if (avgCompatibility > bestScore) {
          bestScore = avgCompatibility;
          bestMatch = otherStudent;
        }
      });

      if (bestMatch) {
        group.push(bestMatch);
        used.add(bestMatch.id_number);
      } else {
        break; // No more compatible students
      }
    }

    groups.push(group);
  });

  return groups;
};