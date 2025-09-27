// Mock data for migration - JavaScript version
export const schools = [
  {
    school_id: "SCH001",
    name: "St. John's College",
    province: "Gauteng",
    type: "Private",
    is_partner: true,
    contact_email: "info@stjohns.co.za",
    contact_phone: "+27 11 123 4567",
    address: "St. John's College, Houghton, Johannesburg",
    website: "https://www.stjohns.co.za"
  },
  {
    school_id: "SCH002", 
    name: "Hilton College",
    province: "KwaZulu-Natal",
    type: "Private",
    is_partner: true,
    contact_email: "info@hiltoncollege.com",
    contact_phone: "+27 33 383 0000",
    address: "Hilton College, Hilton, KwaZulu-Natal",
    website: "https://www.hiltoncollege.com"
  },
  {
    school_id: "SCH003",
    name: "Bishops Diocesan College",
    province: "Western Cape", 
    type: "Private",
    is_partner: true,
    contact_email: "info@bishops.org.za",
    contact_phone: "+27 21 686 2020",
    address: "Bishops Diocesan College, Rondebosch, Cape Town",
    website: "https://www.bishops.org.za"
  },
  {
    school_id: "SCH004",
    name: "St. Mary's DSG",
    province: "Gauteng",
    type: "Private", 
    is_partner: true,
    contact_email: "info@stmarys.co.za",
    contact_phone: "+27 11 477 6700",
    address: "St. Mary's DSG, Waverley, Johannesburg",
    website: "https://www.stmarys.co.za"
  },
  {
    school_id: "SCH005",
    name: "Pretoria Boys High School",
    province: "Gauteng",
    type: "Public",
    is_partner: false,
    contact_email: "info@pbhs.co.za",
    contact_phone: "+27 12 420 1000",
    address: "Pretoria Boys High School, Brooklyn, Pretoria",
    website: "https://www.pbhs.co.za"
  },
  {
    school_id: "SCH006",
    name: "Rondebosch Boys' High School",
    province: "Western Cape",
    type: "Public",
    is_partner: false,
    contact_email: "info@rondebosch.co.za",
    contact_phone: "+27 21 686 2020",
    address: "Rondebosch Boys' High School, Rondebosch, Cape Town",
    website: "https://www.rondebosch.co.za"
  },
  {
    school_id: "SCH007",
    name: "Herschel Girls School",
    province: "Western Cape",
    type: "Private",
    is_partner: true,
    contact_email: "info@herschel.org.za",
    contact_phone: "+27 21 686 2020",
    address: "Herschel Girls School, Claremont, Cape Town",
    website: "https://www.herschel.org.za"
  },
  {
    school_id: "SCH008",
    name: "St. Andrew's College",
    province: "Eastern Cape",
    type: "Private",
    is_partner: true,
    contact_email: "info@st-andrews.co.za",
    contact_phone: "+27 46 603 3300",
    address: "St. Andrew's College, Grahamstown, Eastern Cape",
    website: "https://www.st-andrews.co.za"
  }
];

export const universities = [
  {
    university_id: "UNI001",
    name: "University of Cape Town",
    location: "Cape Town",
    province: "Western Cape",
    university_type: "Public",
    established_year: 1829,
    website: "https://www.uct.ac.za",
    contact_email: "info@uct.ac.za",
    contact_phone: "+27 21 650 9111",
    address: "University of Cape Town, Rondebosch, Cape Town",
    accreditation_status: "Accredited"
  },
  {
    university_id: "UNI002",
    name: "University of the Witwatersrand",
    location: "Johannesburg",
    province: "Gauteng", 
    type: "Public",
    ranking: 2,
    established_year: 1896,
    website: "https://www.wits.ac.za",
    contact_info: {
      phone: "+27 11 717 1000",
      email: "info@wits.ac.za"
    },
    facilities: ["Library", "Sports Complex", "Student Center", "Research Labs"],
    admission_requirements: {
      minimum_aps: 40,
      english_requirement: 60,
      mathematics_requirement: 60
    }
  },
  {
    university_id: "UNI003",
    name: "Stellenbosch University",
    location: "Stellenbosch",
    province: "Western Cape",
    type: "Public",
    ranking: 3,
    established_year: 1918,
    website: "https://www.sun.ac.za",
    contact_info: {
      phone: "+27 21 808 9111",
      email: "info@sun.ac.za"
    },
    facilities: ["Library", "Sports Complex", "Student Center", "Research Labs"],
    admission_requirements: {
      minimum_aps: 38,
      english_requirement: 60,
      mathematics_requirement: 60
    }
  },
  {
    university_id: "UNI004",
    name: "University of Pretoria",
    location: "Pretoria",
    province: "Gauteng",
    type: "Public",
    ranking: 4,
    established_year: 1908,
    website: "https://www.up.ac.za",
    contact_info: {
      phone: "+27 12 420 3111",
      email: "info@up.ac.za"
    },
    facilities: ["Library", "Sports Complex", "Student Center", "Research Labs"],
    admission_requirements: {
      minimum_aps: 36,
      english_requirement: 60,
      mathematics_requirement: 60
    }
  },
  {
    university_id: "UNI005",
    name: "University of KwaZulu-Natal",
    location: "Durban",
    province: "KwaZulu-Natal",
    type: "Public",
    ranking: 5,
    established_year: 2004,
    website: "https://www.ukzn.ac.za",
    contact_info: {
      phone: "+27 31 260 1111",
      email: "info@ukzn.ac.za"
    },
    facilities: ["Library", "Sports Complex", "Student Center", "Research Labs"],
    admission_requirements: {
      minimum_aps: 34,
      english_requirement: 60,
      mathematics_requirement: 60
    }
  }
];

export const courses = [
  {
    course_id: "COURSE001",
    university_id: "UNI001",
    name: "Bachelor of Medicine and Bachelor of Surgery",
    faculty: "Health Sciences",
    requirements: {
      minimum_aps: 42,
      mathematics: 70,
      english: 70,
      physical_sciences: 70,
      life_sciences: 70,
      additional_requirements: ["NBT Test", "Interview"]
    },
    points_required: 42,
    estimated_cost: 85000,
    modules: ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Clinical Medicine"],
    available_residences: ["RES001", "RES002"]
  },
  {
    course_id: "COURSE002",
    university_id: "UNI001",
    name: "Bachelor of Engineering in Civil Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 70,
      additional_requirements: []
    },
    points_required: 40,
    estimated_cost: 75000,
    modules: ["Mathematics", "Physics", "Engineering Design", "Structural Analysis"],
    available_residences: ["RES001", "RES003"]
  },
  {
    course_id: "COURSE003",
    university_id: "UNI002",
    name: "Bachelor of Commerce in Accounting",
    faculty: "Commerce",
    requirements: {
      minimum_aps: 38,
      mathematics: 60,
      english: 60,
      additional_requirements: []
    },
    points_required: 38,
    estimated_cost: 65000,
    modules: ["Financial Accounting", "Management Accounting", "Taxation", "Auditing"],
    available_residences: ["RES004", "RES005"]
  }
];

export const bursaries = [
  {
    bursary_id: "BURS001",
    name: "NSFAS Bursary",
    provider: "National Student Financial Aid Scheme",
    amount: 50000,
    deadline: "2024-11-30",
    requirements: {
      household_income: 350000,
      academic_merit: 60,
      nationality: "South African"
    },
    eligibility: {
      income_threshold: 350000,
      academic_requirements: "60% average",
      citizenship: "South African"
    },
    application_process: "Online application through NSFAS portal",
    contact_info: {
      phone: "0860 067 327",
      email: "info@nsfas.org.za"
    }
  },
  {
    bursary_id: "BURS002",
    name: "SASOL Bursary",
    provider: "SASOL Limited",
    amount: 80000,
    deadline: "2024-10-15",
    requirements: {
      household_income: 500000,
      academic_merit: 70,
      field_of_study: "Engineering"
    },
    eligibility: {
      income_threshold: 500000,
      academic_requirements: "70% average",
      field_restrictions: ["Engineering", "Science"]
    },
    application_process: "Online application through SASOL website",
    contact_info: {
      phone: "+27 11 441 3111",
      email: "bursaries@sasol.com"
    }
  }
];

export const residences = [
  {
    residence_id: "RES001",
    name: "Smuts Hall",
    university_id: "UNI001",
    location: "Upper Campus",
    gender: "male",
    price_per_month: 3500,
    estimated_annual_cost: 42000,
    capacity: 200,
    amenities: ["WiFi", "Laundry", "Study Room", "Gym"],
    distance_from_campus: "On Campus",
    contact_info: {
      phone: "+27 21 650 9111",
      email: "smuts@uct.ac.za"
    }
  },
  {
    residence_id: "RES002",
    name: "Fuller Hall",
    university_id: "UNI001",
    location: "Upper Campus",
    gender: "female",
    price_per_month: 3500,
    estimated_annual_cost: 42000,
    capacity: 180,
    amenities: ["WiFi", "Laundry", "Study Room", "Gym"],
    distance_from_campus: "On Campus",
    contact_info: {
      phone: "+27 21 650 9111",
      email: "fuller@uct.ac.za"
    }
  }
];

export const careers = [
  {
    career_id: "CAREER001",
    name: "Medical Doctor",
    description: "Diagnose and treat patients, perform surgeries, and provide medical care",
    required_courses: ["COURSE001"],
    alternative_courses: [],
    skills_required: ["Communication", "Problem Solving", "Empathy", "Attention to Detail"],
    average_salary: {
      entry_level: 450000,
      mid_level: 800000,
      senior_level: 1200000
    },
    job_market_outlook: "High demand",
    growth_prospects: "Excellent"
  },
  {
    career_id: "CAREER002",
    name: "Civil Engineer",
    description: "Design and oversee construction of infrastructure projects",
    required_courses: ["COURSE002"],
    alternative_courses: [],
    skills_required: ["Mathematics", "Problem Solving", "Project Management", "Technical Drawing"],
    average_salary: {
      entry_level: 350000,
      mid_level: 600000,
      senior_level: 900000
    },
    job_market_outlook: "Moderate demand",
    growth_prospects: "Good"
  }
];
