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
}

export interface School {
  school_id: string;
  name: string;
  province: string;
  type: string;
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
    type: "Public"
  },
  {
    school_id: "SCH002", 
    name: "Johannesburg College",
    province: "Gauteng",
    type: "Private"
  },
  {
    school_id: "SCH003",
    name: "Durban Technical High",
    province: "KwaZulu-Natal", 
    type: "Technical"
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
    points_required: 42
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
    points_required: 45
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
    points_required: 35
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
    points_required: 40
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
    points_required: 38
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
    points_required: 32
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