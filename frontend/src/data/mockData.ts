// Import types
import type { 
  Student, 
  School, 
  University, 
  Course, 
  Offer, 
  Bursary, 
  Residence, 
  Career 
} from '@/types';

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
  // Western Cape
  {
    university_id: "UCT001",
    name: "University of Cape Town",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "SU001",
    name: "Stellenbosch University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UWC001",
    name: "University of the Western Cape",
    location: "Bellville",
    province: "Western Cape"
  },
  {
    university_id: "CPUT001",
    name: "Cape Peninsula University of Technology",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UWC002",
    name: "University of the Western Cape",
    location: "Cape Town",
    province: "Western Cape"
  },
  
  // Gauteng
  {
    university_id: "WITS001",
    name: "University of the Witwatersrand",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UP001",
    name: "University of Pretoria",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UJ001",
    name: "University of Johannesburg",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNISA001",
    name: "University of South Africa",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "TUT001",
    name: "Tshwane University of Technology",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "VUT001",
    name: "Vaal University of Technology",
    location: "Vanderbijlpark",
    province: "Gauteng"
  },
  
  // KwaZulu-Natal
  {
    university_id: "UKZN001",
    name: "University of KwaZulu-Natal",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "DUT001",
    name: "Durban University of Technology",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "MUT001",
    name: "Mangosuthu University of Technology",
    location: "Umlazi",
    province: "KwaZulu-Natal"
  },
  
  // Eastern Cape
  {
    university_id: "RU001",
    name: "Rhodes University",
    location: "Grahamstown",
    province: "Eastern Cape"
  },
  {
    university_id: "NMMU001",
    name: "Nelson Mandela University",
    location: "Port Elizabeth",
    province: "Eastern Cape"
  },
  {
    university_id: "UFH001",
    name: "University of Fort Hare",
    location: "Alice",
    province: "Eastern Cape"
  },
  {
    university_id: "WSU001",
    name: "Walter Sisulu University",
    location: "Mthatha",
    province: "Eastern Cape"
  },
  
  // Free State
  {
    university_id: "UFS001",
    name: "University of the Free State",
    location: "Bloemfontein",
    province: "Free State"
  },
  {
    university_id: "CUT001",
    name: "Central University of Technology",
    location: "Bloemfontein",
    province: "Free State"
  },
  
  // Limpopo
  {
    university_id: "UL001",
    name: "University of Limpopo",
    location: "Polokwane",
    province: "Limpopo"
  },
  {
    university_id: "VUT002",
    name: "Venda University of Technology",
    location: "Thohoyandou",
    province: "Limpopo"
  },
  
  // Mpumalanga
  {
    university_id: "UMP001",
    name: "University of Mpumalanga",
    location: "Mbombela",
    province: "Mpumalanga"
  },
  
  // North West
  {
    university_id: "NWU001",
    name: "North-West University",
    location: "Potchefstroom",
    province: "North West"
  },
  {
    university_id: "VUT003",
    name: "Vaal University of Technology",
    location: "Klerksdorp",
    province: "North West"
  },
  
  // Northern Cape
  {
    university_id: "SPU001",
    name: "Sol Plaatje University",
    location: "Kimberley",
    province: "Northern Cape"
  },
  
  // Additional Universities
  {
    university_id: "UNIV001",
    name: "University of Technology and Innovation",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV002",
    name: "South African Institute of Technology",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV003",
    name: "African Leadership University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV004",
    name: "Innovation University of South Africa",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV005",
    name: "Digital University of Africa",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV006",
    name: "Sustainable Development University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UNIV007",
    name: "Creative Arts University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV008",
    name: "Health Sciences University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV009",
    name: "Engineering Excellence University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV010",
    name: "Business Leadership University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV011",
    name: "Environmental Studies University",
    location: "Grahamstown",
    province: "Eastern Cape"
  },
  {
    university_id: "UNIV012",
    name: "Agricultural Sciences University",
    location: "Bloemfontein",
    province: "Free State"
  },
  {
    university_id: "UNIV013",
    name: "Marine Sciences University",
    location: "Port Elizabeth",
    province: "Eastern Cape"
  },
  {
    university_id: "UNIV014",
    name: "Mining Technology University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV015",
    name: "Tourism and Hospitality University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV016",
    name: "Sports Science University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV017",
    name: "Media and Communication University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV018",
    name: "Renewable Energy University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UNIV019",
    name: "Data Science University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV020",
    name: "Cybersecurity University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV021",
    name: "Artificial Intelligence University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV022",
    name: "Blockchain Technology University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV023",
    name: "Quantum Computing University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UNIV024",
    name: "Robotics University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV025",
    name: "Biotechnology University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV026",
    name: "Nanotechnology University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV027",
    name: "Space Science University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV028",
    name: "Climate Change University",
    location: "Grahamstown",
    province: "Eastern Cape"
  },
  {
    university_id: "UNIV029",
    name: "Water Management University",
    location: "Bloemfontein",
    province: "Free State"
  },
  {
    university_id: "UNIV030",
    name: "Urban Planning University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV031",
    name: "Transportation University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV032",
    name: "Logistics University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV033",
    name: "Supply Chain University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV034",
    name: "International Relations University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV035",
    name: "Public Policy University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV036",
    name: "Social Work University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV037",
    name: "Psychology University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UNIV038",
    name: "Education University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV039",
    name: "Early Childhood University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV040",
    name: "Special Education University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV041",
    name: "Music and Arts University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV042",
    name: "Performing Arts University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV043",
    name: "Visual Arts University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV044",
    name: "Fashion Design University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV045",
    name: "Architecture University",
    location: "Cape Town",
    province: "Western Cape"
  },
  {
    university_id: "UNIV046",
    name: "Interior Design University",
    location: "Johannesburg",
    province: "Gauteng"
  },
  {
    university_id: "UNIV047",
    name: "Landscape Architecture University",
    location: "Stellenbosch",
    province: "Western Cape"
  },
  {
    university_id: "UNIV048",
    name: "Urban Design University",
    location: "Pretoria",
    province: "Gauteng"
  },
  {
    university_id: "UNIV049",
    name: "Construction Management University",
    location: "Durban",
    province: "KwaZulu-Natal"
  },
  {
    university_id: "UNIV050",
    name: "Project Management University",
    location: "Cape Town",
    province: "Western Cape"
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
  {
    course_id: "UCT_ARCH001",
    university_id: "UCT001",
    name: "Bachelor of Architecture",
    faculty: "Architecture",
    requirements: {
      minimum_aps: 40,
      mathematics: 65,
      english: 60,
      physical_sciences: 60
    },
    points_required: 40,
    estimated_cost: 85000,
    modules: ["Architectural Design", "Building Technology", "History of Architecture", "Environmental Design", "Urban Planning", "Construction Management"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  {
    course_id: "UCT_LAW001",
    university_id: "UCT001",
    name: "Bachelor of Laws (LLB)",
    faculty: "Law",
    requirements: {
      minimum_aps: 38,
      english: 70,
      mathematics: 50
    },
    points_required: 38,
    estimated_cost: 68000,
    modules: ["Constitutional Law", "Criminal Law", "Contract Law", "Property Law", "Administrative Law", "Commercial Law", "Legal Research"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  {
    course_id: "UCT_PSYCH001",
    university_id: "UCT001",
    name: "Bachelor of Psychology",
    faculty: "Humanities",
    requirements: {
      minimum_aps: 36,
      english: 65,
      mathematics: 50,
      life_sciences: 60
    },
    points_required: 36,
    estimated_cost: 62000,
    modules: ["Introduction to Psychology", "Research Methods", "Cognitive Psychology", "Social Psychology", "Abnormal Psychology", "Developmental Psychology"],
    available_residences: ["UCT_RES001", "UCT_RES002", "UCT_RES003"]
  },
  
  // Stellenbosch University Courses
  {
    course_id: "SU_ENG001",
    university_id: "SU001",
    name: "Bachelor of Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 40,
    estimated_cost: 75000,
    modules: ["Engineering Mathematics", "Physics", "Chemistry", "Engineering Design", "Materials Science", "Thermodynamics"],
    available_residences: ["SU_RES001", "SU_RES002", "SU_RES003"]
  },
  {
    course_id: "SU_AGRIC001",
    university_id: "SU001",
    name: "Bachelor of Agricultural Sciences",
    faculty: "Agriculture",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 34,
    estimated_cost: 48000,
    modules: ["Crop Science", "Animal Science", "Soil Science", "Agricultural Economics", "Farm Management", "Agricultural Technology"],
    available_residences: ["SU_RES001", "SU_RES002", "SU_RES003"]
  },
  {
    course_id: "SU_VITICULTURE001",
    university_id: "SU001",
    name: "Bachelor of Viticulture and Oenology",
    faculty: "Agriculture",
    requirements: {
      minimum_aps: 32,
      mathematics: 60,
      english: 60,
      life_sciences: 60
    },
    points_required: 32,
    estimated_cost: 52000,
    modules: ["Viticulture", "Oenology", "Wine Chemistry", "Wine Marketing", "Wine Production", "Quality Control"],
    available_residences: ["SU_RES001", "SU_RES002", "SU_RES003"]
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
  {
    course_id: "WITS_MINING001",
    university_id: "WITS001",
    name: "Bachelor of Science in Mining Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 42,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 42,
    estimated_cost: 80000,
    modules: ["Mining Methods", "Rock Mechanics", "Mine Planning", "Mine Safety", "Mineral Processing", "Mine Economics"],
    available_residences: ["WITS_RES001", "WITS_RES002", "WITS_RES003"]
  },
  {
    course_id: "WITS_MED001",
    university_id: "WITS001",
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
    estimated_cost: 120000,
    modules: ["Human Anatomy", "Human Physiology", "Biochemistry", "Medical Ethics", "Pathology", "Pharmacology", "Clinical Skills"],
    available_residences: ["WITS_RES001", "WITS_RES002", "WITS_RES003"]
  },
  
  // University of Pretoria Courses
  {
    course_id: "UP_VET001",
    university_id: "UP001",
    name: "Bachelor of Veterinary Science",
    faculty: "Veterinary Science",
    requirements: {
      minimum_aps: 44,
      mathematics: 70,
      english: 70,
      physical_sciences: 70,
      life_sciences: 70
    },
    points_required: 44,
    estimated_cost: 110000,
    modules: ["Animal Anatomy", "Animal Physiology", "Veterinary Pathology", "Clinical Skills", "Animal Nutrition", "Veterinary Surgery"],
    available_residences: ["UP_RES001", "UP_RES002", "UP_RES003"]
  },
  {
    course_id: "UP_ENG001",
    university_id: "UP001",
    name: "Bachelor of Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 40,
    estimated_cost: 78000,
    modules: ["Engineering Mathematics", "Physics", "Chemistry", "Engineering Design", "Materials Science", "Thermodynamics"],
    available_residences: ["UP_RES001", "UP_RES002", "UP_RES003"]
  },
  {
    course_id: "UP_AGRIC001",
    university_id: "UP001",
    name: "Bachelor of Agricultural Sciences",
    faculty: "Agriculture",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 34,
    estimated_cost: 46000,
    modules: ["Crop Science", "Animal Science", "Soil Science", "Agricultural Economics", "Farm Management", "Agricultural Technology"],
    available_residences: ["UP_RES001", "UP_RES002", "UP_RES003"]
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
  },
  {
    course_id: "UKZN_MED001",
    university_id: "UKZN001",
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
    estimated_cost: 115000,
    modules: ["Human Anatomy", "Human Physiology", "Biochemistry", "Medical Ethics", "Pathology", "Pharmacology", "Clinical Skills"],
    available_residences: ["UKZN_RES001", "UKZN_RES002", "UKZN_RES003"]
  },
  {
    course_id: "UKZN_ENG001",
    university_id: "UKZN001",
    name: "Bachelor of Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 40,
    estimated_cost: 72000,
    modules: ["Engineering Mathematics", "Physics", "Chemistry", "Engineering Design", "Materials Science", "Thermodynamics"],
    available_residences: ["UKZN_RES001", "UKZN_RES002", "UKZN_RES003"]
  },
  
  // University of Johannesburg Courses
  {
    course_id: "UJ_ENG001",
    university_id: "UJ001",
    name: "Bachelor of Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 38,
      mathematics: 65,
      english: 60,
      physical_sciences: 65
    },
    points_required: 38,
    estimated_cost: 68000,
    modules: ["Engineering Mathematics", "Physics", "Chemistry", "Engineering Design", "Materials Science", "Thermodynamics"],
    available_residences: ["UJ_RES001", "UJ_RES002", "UJ_RES003"]
  },
  {
    course_id: "UJ_BUS001",
    university_id: "UJ001",
    name: "Bachelor of Business Administration",
    faculty: "Business",
    requirements: {
      minimum_aps: 32,
      mathematics: 60,
      english: 60
    },
    points_required: 32,
    estimated_cost: 55000,
    modules: ["Business Management", "Marketing", "Finance", "Human Resources", "Operations Management", "Strategic Management"],
    available_residences: ["UJ_RES001", "UJ_RES002", "UJ_RES003"]
  },
  {
    course_id: "UJ_IT001",
    university_id: "UJ001",
    name: "Bachelor of Information Technology",
    faculty: "Information Technology",
    requirements: {
      minimum_aps: 36,
      mathematics: 65,
      english: 60
    },
    points_required: 36,
    estimated_cost: 62000,
    modules: ["Programming", "Database Systems", "Web Development", "Network Administration", "System Analysis", "Project Management"],
    available_residences: ["UJ_RES001", "UJ_RES002", "UJ_RES003"]
  },
  
  // Tshwane University of Technology Courses
  {
    course_id: "TUT_ENG001",
    university_id: "TUT001",
    name: "Bachelor of Technology in Engineering",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 36,
      mathematics: 65,
      english: 60,
      physical_sciences: 65
    },
    points_required: 36,
    estimated_cost: 58000,
    modules: ["Engineering Mathematics", "Physics", "Chemistry", "Engineering Design", "Materials Science", "Thermodynamics"],
    available_residences: ["TUT_RES001", "TUT_RES002", "TUT_RES003"]
  },
  {
    course_id: "TUT_IT001",
    university_id: "TUT001",
    name: "Bachelor of Technology in Information Technology",
    faculty: "Information Technology",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60
    },
    points_required: 34,
    estimated_cost: 52000,
    modules: ["Programming", "Database Systems", "Web Development", "Network Administration", "System Analysis", "Project Management"],
    available_residences: ["TUT_RES001", "TUT_RES002", "TUT_RES003"]
  },
  {
    course_id: "TUT_BUS001",
    university_id: "TUT001",
    name: "Bachelor of Technology in Business Management",
    faculty: "Business",
    requirements: {
      minimum_aps: 30,
      mathematics: 50,
      english: 60
    },
    points_required: 30,
    estimated_cost: 48000,
    modules: ["Business Management", "Marketing", "Finance", "Human Resources", "Operations Management", "Strategic Management"],
    available_residences: ["TUT_RES001", "TUT_RES002", "TUT_RES003"]
  },
  
  // Additional Courses for Various Universities
  {
    course_id: "UNIV001_CS001",
    university_id: "UNIV001",
    name: "Bachelor of Computer Science",
    faculty: "Computer Science",
    requirements: {
      minimum_aps: 38,
      mathematics: 65,
      english: 60
    },
    points_required: 38,
    estimated_cost: 65000,
    modules: ["Programming", "Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Computer Networks"],
    available_residences: ["UNIV001_RES001", "UNIV001_RES002"]
  },
  {
    course_id: "UNIV002_AI001",
    university_id: "UNIV002",
    name: "Bachelor of Artificial Intelligence",
    faculty: "Artificial Intelligence",
    requirements: {
      minimum_aps: 42,
      mathematics: 70,
      english: 60,
      physical_sciences: 65
    },
    points_required: 42,
    estimated_cost: 75000,
    modules: ["Machine Learning", "Neural Networks", "Natural Language Processing", "Computer Vision", "Robotics", "Data Science"],
    available_residences: ["UNIV002_RES001", "UNIV002_RES002"]
  },
  {
    course_id: "UNIV003_LEAD001",
    university_id: "UNIV003",
    name: "Bachelor of Leadership Studies",
    faculty: "Leadership",
    requirements: {
      minimum_aps: 34,
      english: 65,
      mathematics: 50
    },
    points_required: 34,
    estimated_cost: 58000,
    modules: ["Leadership Theory", "Organizational Behavior", "Strategic Management", "Communication", "Ethics", "Change Management"],
    available_residences: ["UNIV003_RES001", "UNIV003_RES002"]
  },
  {
    course_id: "UNIV004_INNOV001",
    university_id: "UNIV004",
    name: "Bachelor of Innovation Management",
    faculty: "Innovation",
    requirements: {
      minimum_aps: 36,
      mathematics: 60,
      english: 65
    },
    points_required: 36,
    estimated_cost: 62000,
    modules: ["Innovation Theory", "Product Development", "Entrepreneurship", "Technology Management", "Market Research", "Intellectual Property"],
    available_residences: ["UNIV004_RES001", "UNIV004_RES002"]
  },
  {
    course_id: "UNIV005_DIGITAL001",
    university_id: "UNIV005",
    name: "Bachelor of Digital Marketing",
    faculty: "Digital Marketing",
    requirements: {
      minimum_aps: 32,
      mathematics: 50,
      english: 65
    },
    points_required: 32,
    estimated_cost: 55000,
    modules: ["Digital Marketing Strategy", "Social Media Marketing", "Search Engine Optimization", "Content Marketing", "Analytics", "E-commerce"],
    available_residences: ["UNIV005_RES001", "UNIV005_RES002"]
  },
  {
    course_id: "UNIV006_SUSTAIN001",
    university_id: "UNIV006",
    name: "Bachelor of Sustainable Development",
    faculty: "Sustainable Development",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60,
      life_sciences: 60
    },
    points_required: 34,
    estimated_cost: 58000,
    modules: ["Environmental Science", "Sustainable Development", "Climate Change", "Renewable Energy", "Environmental Policy", "Green Technology"],
    available_residences: ["UNIV006_RES001", "UNIV006_RES002"]
  },
  {
    course_id: "UNIV007_ARTS001",
    university_id: "UNIV007",
    name: "Bachelor of Fine Arts",
    faculty: "Fine Arts",
    requirements: {
      minimum_aps: 30,
      english: 60
    },
    points_required: 30,
    estimated_cost: 48000,
    modules: ["Drawing", "Painting", "Sculpture", "Digital Art", "Art History", "Portfolio Development"],
    available_residences: ["UNIV007_RES001", "UNIV007_RES002"]
  },
  {
    course_id: "UNIV008_HEALTH001",
    university_id: "UNIV008",
    name: "Bachelor of Health Sciences",
    faculty: "Health Sciences",
    requirements: {
      minimum_aps: 38,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 38,
    estimated_cost: 65000,
    modules: ["Human Anatomy", "Human Physiology", "Pathology", "Pharmacology", "Public Health", "Health Policy"],
    available_residences: ["UNIV008_RES001", "UNIV008_RES002"]
  },
  {
    course_id: "UNIV009_ENG001",
    university_id: "UNIV009",
    name: "Bachelor of Engineering Excellence",
    faculty: "Engineering",
    requirements: {
      minimum_aps: 44,
      mathematics: 75,
      english: 65,
      physical_sciences: 75
    },
    points_required: 44,
    estimated_cost: 85000,
    modules: ["Advanced Engineering Mathematics", "Advanced Physics", "Engineering Design", "Materials Science", "Thermodynamics", "Project Management"],
    available_residences: ["UNIV009_RES001", "UNIV009_RES002"]
  },
  {
    course_id: "UNIV010_BUS001",
    university_id: "UNIV010",
    name: "Bachelor of Business Leadership",
    faculty: "Business",
    requirements: {
      minimum_aps: 36,
      mathematics: 60,
      english: 65
    },
    points_required: 36,
    estimated_cost: 62000,
    modules: ["Leadership Theory", "Strategic Management", "Financial Management", "Marketing", "Human Resources", "Entrepreneurship"],
    available_residences: ["UNIV010_RES001", "UNIV010_RES002"]
  },
  
  // Continue with more courses for different universities and faculties...
  {
    course_id: "UNIV011_ENV001",
    university_id: "UNIV011",
    name: "Bachelor of Environmental Studies",
    faculty: "Environmental Studies",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 34,
    estimated_cost: 58000,
    modules: ["Environmental Science", "Ecology", "Conservation", "Environmental Policy", "Climate Change", "Sustainability"],
    available_residences: ["UNIV011_RES001", "UNIV011_RES002"]
  },
  {
    course_id: "UNIV012_AGRI001",
    university_id: "UNIV012",
    name: "Bachelor of Agricultural Sciences",
    faculty: "Agriculture",
    requirements: {
      minimum_aps: 32,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 32,
    estimated_cost: 52000,
    modules: ["Crop Science", "Animal Science", "Soil Science", "Agricultural Economics", "Farm Management", "Agricultural Technology"],
    available_residences: ["UNIV012_RES001", "UNIV012_RES002"]
  },
  {
    course_id: "UNIV013_MARINE001",
    university_id: "UNIV013",
    name: "Bachelor of Marine Sciences",
    faculty: "Marine Sciences",
    requirements: {
      minimum_aps: 36,
      mathematics: 65,
      english: 60,
      life_sciences: 65,
      physical_sciences: 60
    },
    points_required: 36,
    estimated_cost: 68000,
    modules: ["Marine Biology", "Oceanography", "Marine Ecology", "Fisheries Science", "Marine Conservation", "Marine Technology"],
    available_residences: ["UNIV013_RES001", "UNIV013_RES002"]
  },
  {
    course_id: "UNIV014_MINING001",
    university_id: "UNIV014",
    name: "Bachelor of Mining Technology",
    faculty: "Mining",
    requirements: {
      minimum_aps: 38,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 38,
    estimated_cost: 72000,
    modules: ["Mining Methods", "Rock Mechanics", "Mine Planning", "Mine Safety", "Mineral Processing", "Mine Economics"],
    available_residences: ["UNIV014_RES001", "UNIV014_RES002"]
  },
  {
    course_id: "UNIV015_TOURISM001",
    university_id: "UNIV015",
    name: "Bachelor of Tourism and Hospitality",
    faculty: "Tourism",
    requirements: {
      minimum_aps: 30,
      mathematics: 50,
      english: 65
    },
    points_required: 30,
    estimated_cost: 48000,
    modules: ["Tourism Management", "Hospitality Management", "Event Management", "Tourism Marketing", "Cultural Tourism", "Sustainable Tourism"],
    available_residences: ["UNIV015_RES001", "UNIV015_RES002"]
  },
  {
    course_id: "UNIV016_SPORTS001",
    university_id: "UNIV016",
    name: "Bachelor of Sports Science",
    faculty: "Sports Science",
    requirements: {
      minimum_aps: 32,
      mathematics: 60,
      english: 60,
      life_sciences: 65
    },
    points_required: 32,
    estimated_cost: 55000,
    modules: ["Exercise Physiology", "Sports Psychology", "Biomechanics", "Sports Nutrition", "Sports Management", "Athletic Training"],
    available_residences: ["UNIV016_RES001", "UNIV016_RES002"]
  },
  {
    course_id: "UNIV017_MEDIA001",
    university_id: "UNIV017",
    name: "Bachelor of Media and Communication",
    faculty: "Media",
    requirements: {
      minimum_aps: 32,
      mathematics: 50,
      english: 70
    },
    points_required: 32,
    estimated_cost: 52000,
    modules: ["Media Theory", "Journalism", "Public Relations", "Digital Media", "Media Production", "Media Ethics"],
    available_residences: ["UNIV017_RES001", "UNIV017_RES002"]
  },
  {
    course_id: "UNIV018_ENERGY001",
    university_id: "UNIV018",
    name: "Bachelor of Renewable Energy",
    faculty: "Renewable Energy",
    requirements: {
      minimum_aps: 38,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 38,
    estimated_cost: 72000,
    modules: ["Solar Energy", "Wind Energy", "Hydroelectric Power", "Energy Storage", "Energy Policy", "Sustainable Energy"],
    available_residences: ["UNIV018_RES001", "UNIV018_RES002"]
  },
  {
    course_id: "UNIV019_DATA001",
    university_id: "UNIV019",
    name: "Bachelor of Data Science",
    faculty: "Data Science",
    requirements: {
      minimum_aps: 40,
      mathematics: 75,
      english: 60,
      physical_sciences: 65
    },
    points_required: 40,
    estimated_cost: 75000,
    modules: ["Statistics", "Machine Learning", "Data Visualization", "Big Data", "Database Systems", "Data Mining"],
    available_residences: ["UNIV019_RES001", "UNIV019_RES002"]
  },
  {
    course_id: "UNIV020_CYBER001",
    university_id: "UNIV020",
    name: "Bachelor of Cybersecurity",
    faculty: "Cybersecurity",
    requirements: {
      minimum_aps: 38,
      mathematics: 70,
      english: 60
    },
    points_required: 38,
    estimated_cost: 68000,
    modules: ["Network Security", "Cryptography", "Ethical Hacking", "Digital Forensics", "Risk Management", "Security Policy"],
    available_residences: ["UNIV020_RES001", "UNIV020_RES002"]
  },
  
  // Add more courses to reach 200+ total
  {
    course_id: "UNIV021_AI001",
    university_id: "UNIV021",
    name: "Bachelor of Artificial Intelligence",
    faculty: "Artificial Intelligence",
    requirements: {
      minimum_aps: 42,
      mathematics: 75,
      english: 60,
      physical_sciences: 70
    },
    points_required: 42,
    estimated_cost: 80000,
    modules: ["Machine Learning", "Neural Networks", "Natural Language Processing", "Computer Vision", "Robotics", "Deep Learning"],
    available_residences: ["UNIV021_RES001", "UNIV021_RES002"]
  },
  {
    course_id: "UNIV022_BLOCKCHAIN001",
    university_id: "UNIV022",
    name: "Bachelor of Blockchain Technology",
    faculty: "Blockchain",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60
    },
    points_required: 40,
    estimated_cost: 75000,
    modules: ["Blockchain Fundamentals", "Cryptocurrency", "Smart Contracts", "Distributed Systems", "Cryptography", "Decentralized Applications"],
    available_residences: ["UNIV022_RES001", "UNIV022_RES002"]
  },
  {
    course_id: "UNIV023_QUANTUM001",
    university_id: "UNIV023",
    name: "Bachelor of Quantum Computing",
    faculty: "Quantum Computing",
    requirements: {
      minimum_aps: 44,
      mathematics: 80,
      english: 60,
      physical_sciences: 75
    },
    points_required: 44,
    estimated_cost: 85000,
    modules: ["Quantum Mechanics", "Quantum Algorithms", "Quantum Information", "Quantum Cryptography", "Quantum Hardware", "Quantum Software"],
    available_residences: ["UNIV023_RES001", "UNIV023_RES002"]
  },
  {
    course_id: "UNIV024_ROBOTICS001",
    university_id: "UNIV024",
    name: "Bachelor of Robotics",
    faculty: "Robotics",
    requirements: {
      minimum_aps: 40,
      mathematics: 70,
      english: 60,
      physical_sciences: 70
    },
    points_required: 40,
    estimated_cost: 78000,
    modules: ["Robotics Fundamentals", "Control Systems", "Artificial Intelligence", "Machine Vision", "Robot Programming", "Human-Robot Interaction"],
    available_residences: ["UNIV024_RES001", "UNIV024_RES002"]
  },
  {
    course_id: "UNIV025_BIOTECH001",
    university_id: "UNIV025",
    name: "Bachelor of Biotechnology",
    faculty: "Biotechnology",
    requirements: {
      minimum_aps: 38,
      mathematics: 65,
      english: 60,
      life_sciences: 70,
      physical_sciences: 65
    },
    points_required: 38,
    estimated_cost: 70000,
    modules: ["Molecular Biology", "Genetics", "Biochemistry", "Bioinformatics", "Biotechnology Applications", "Biotech Ethics"],
    available_residences: ["UNIV025_RES001", "UNIV025_RES002"]
  },
  {
    course_id: "UNIV026_NANO001",
    university_id: "UNIV026",
    name: "Bachelor of Nanotechnology",
    faculty: "Nanotechnology",
    requirements: {
      minimum_aps: 42,
      mathematics: 75,
      english: 60,
      physical_sciences: 75,
      life_sciences: 65
    },
    points_required: 42,
    estimated_cost: 82000,
    modules: ["Nanomaterials", "Nanophysics", "Nanochemistry", "Nanobiotechnology", "Nanofabrication", "Nanocharacterization"],
    available_residences: ["UNIV026_RES001", "UNIV026_RES002"]
  },
  {
    course_id: "UNIV027_SPACE001",
    university_id: "UNIV027",
    name: "Bachelor of Space Science",
    faculty: "Space Science",
    requirements: {
      minimum_aps: 44,
      mathematics: 80,
      english: 60,
      physical_sciences: 80
    },
    points_required: 44,
    estimated_cost: 90000,
    modules: ["Astrophysics", "Planetary Science", "Space Technology", "Satellite Systems", "Space Mission Design", "Space Policy"],
    available_residences: ["UNIV027_RES001", "UNIV027_RES002"]
  },
  {
    course_id: "UNIV028_CLIMATE001",
    university_id: "UNIV028",
    name: "Bachelor of Climate Change Studies",
    faculty: "Climate Change",
    requirements: {
      minimum_aps: 36,
      mathematics: 65,
      english: 60,
      life_sciences: 65,
      physical_sciences: 65
    },
    points_required: 36,
    estimated_cost: 65000,
    modules: ["Climate Science", "Climate Modeling", "Climate Policy", "Adaptation Strategies", "Mitigation Technologies", "Climate Communication"],
    available_residences: ["UNIV028_RES001", "UNIV028_RES002"]
  },
  {
    course_id: "UNIV029_WATER001",
    university_id: "UNIV029",
    name: "Bachelor of Water Management",
    faculty: "Water Management",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 60,
      life_sciences: 60,
      physical_sciences: 60
    },
    points_required: 34,
    estimated_cost: 58000,
    modules: ["Hydrology", "Water Quality", "Water Treatment", "Water Policy", "Water Conservation", "Water Economics"],
    available_residences: ["UNIV029_RES001", "UNIV029_RES002"]
  },
  {
    course_id: "UNIV030_URBAN001",
    university_id: "UNIV030",
    name: "Bachelor of Urban Planning",
    faculty: "Urban Planning",
    requirements: {
      minimum_aps: 34,
      mathematics: 60,
      english: 65
    },
    points_required: 34,
    estimated_cost: 58000,
    modules: ["Urban Design", "Land Use Planning", "Transportation Planning", "Environmental Planning", "Urban Policy", "Community Development"],
    available_residences: ["UNIV030_RES001", "UNIV030_RES002"]
  }
];

export const students: Student[] = [
  {
    id_number: "0123456789",
    username: "thabo.molefe",
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
  },
  // Additional students with diverse backgrounds
  {
    id_number: "1111111111",
    username: "john.smith",
    school_id: "SCH001",
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@email.com",
    marks: {
      mathematics: 88,
      english: 82,
      physical_sciences: 85,
      life_sciences: 80,
      accounting: 75,
      economics: 78,
      geography: 70,
      history: 72
    }
  },
  {
    id_number: "2222222222",
    username: "mary.wilson",
    school_id: "SCH002",
    first_name: "Mary",
    last_name: "Wilson",
    email: "mary.wilson@email.com",
    marks: {
      mathematics: 75,
      english: 90,
      physical_sciences: 70,
      life_sciences: 85,
      accounting: 80,
      economics: 85,
      geography: 88,
      history: 92
    }
  },
  {
    id_number: "3333333333",
    username: "david.brown",
    school_id: "SCH003",
    first_name: "David",
    last_name: "Brown",
    email: "david.brown@email.com",
    marks: {
      mathematics: 92,
      english: 78,
      physical_sciences: 88,
      life_sciences: 82,
      accounting: 70,
      economics: 75,
      geography: 80,
      history: 75
    }
  },
  {
    id_number: "4444444444",
    username: "lisa.davis",
    school_id: "SCH004",
    first_name: "Lisa",
    last_name: "Davis",
    email: "lisa.davis@email.com",
    marks: {
      mathematics: 80,
      english: 85,
      physical_sciences: 75,
      life_sciences: 88,
      accounting: 82,
      economics: 80,
      geography: 85,
      history: 88
    }
  },
  {
    id_number: "6666666666",
    username: "james.miller",
    school_id: "SCH005",
    first_name: "James",
    last_name: "Miller",
    email: "james.miller@email.com",
    marks: {
      mathematics: 85,
      english: 80,
      physical_sciences: 82,
      life_sciences: 78,
      accounting: 75,
      economics: 78,
      geography: 80,
      history: 75
    }
  }
];

export const bursaries: Bursary[] = [
  {
    bursary_id: "BURS001",
    name: "National Student Financial Aid Scheme (NSFAS)",
    provider: "Department of Higher Education",
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
    eligibility: {
      minimum_aps: 35,
      additional_criteria: ["Leadership potential", "Entrepreneurial spirit", "Academic excellence"]
    },
    deadline: "2024-10-15"
  },
  {
    bursary_id: "BURS004",
    name: "Anglo American Bursary",
    provider: "Anglo American",
    eligibility: {
      minimum_aps: 38,
      faculties: ["Engineering", "Mining", "Geology"],
      additional_criteria: ["South African citizen", "Commit to work for Anglo American"]
    },
    deadline: "2024-08-31"
  },
  {
    bursary_id: "BURS005",
    name: "Standard Bank Bursary",
    provider: "Standard Bank",
    eligibility: {
      minimum_aps: 36,
      faculties: ["Commerce", "Business", "Economics"],
      additional_criteria: ["South African citizen", "Financial need"]
    },
    deadline: "2024-09-15"
  },
  {
    bursary_id: "BURS006",
    name: "Eskom Bursary",
    provider: "Eskom",
    eligibility: {
      minimum_aps: 40,
      faculties: ["Engineering", "Science"],
      additional_criteria: ["South African citizen", "Commit to work for Eskom"]
    },
    deadline: "2024-08-30"
  },
  {
    bursary_id: "BURS007",
    name: "Transnet Bursary",
    provider: "Transnet",
    eligibility: {
      minimum_aps: 38,
      faculties: ["Engineering", "Logistics", "Transportation"],
      additional_criteria: ["South African citizen", "Commit to work for Transnet"]
    },
    deadline: "2024-09-30"
  },
  {
    bursary_id: "BURS008",
    name: "MTN Bursary",
    provider: "MTN",
    eligibility: {
      minimum_aps: 35,
      faculties: ["Information Technology", "Computer Science", "Engineering"],
      additional_criteria: ["South African citizen", "Commit to work for MTN"]
    },
    deadline: "2024-10-31"
  },
  {
    bursary_id: "BURS009",
    name: "Vodacom Bursary",
    provider: "Vodacom",
    eligibility: {
      minimum_aps: 36,
      faculties: ["Information Technology", "Computer Science", "Engineering"],
      additional_criteria: ["South African citizen", "Commit to work for Vodacom"]
    },
    deadline: "2024-10-15"
  },
  {
    bursary_id: "BURS010",
    name: "Discovery Bursary",
    provider: "Discovery",
    eligibility: {
      minimum_aps: 37,
      faculties: ["Health Sciences", "Medicine", "Actuarial Science"],
      additional_criteria: ["South African citizen", "Commit to work for Discovery"]
    },
    deadline: "2024-09-30"
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
  },
  // Additional residences for various universities
  {
    residence_id: "SU_RES001",
    name: "Stellenbosch University Residence A",
    university_id: "SU001",
    location: "Stellenbosch Campus",
    gender: "mixed",
    price_per_month: 3500,
    estimated_annual_cost: 42000,
    capacity: 300,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 808 1000",
      email: "residence@sun.ac.za"
    }
  },
  {
    residence_id: "SU_RES002",
    name: "Stellenbosch University Residence B",
    university_id: "SU001",
    location: "Stellenbosch Campus",
    gender: "female",
    price_per_month: 3300,
    estimated_annual_cost: 39600,
    capacity: 250,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Gym"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 808 1100",
      email: "residence2@sun.ac.za"
    }
  },
  {
    residence_id: "SU_RES003",
    name: "Stellenbosch University Residence C",
    university_id: "SU001",
    location: "Stellenbosch Campus",
    gender: "male",
    price_per_month: 3400,
    estimated_annual_cost: 40800,
    capacity: 200,
    amenities: ["Dining hall", "Study rooms", "Laundry facilities", "WiFi", "24/7 security", "Sports facilities"],
    distance_from_campus: "On campus",
    contact_info: {
      phone: "+27 21 808 1200",
      email: "residence3@sun.ac.za"
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
  },
  {
    offer_id: "OFF005",
    student_id: "5555555555",
    university_id: "SU001",
    course_id: "SU_ENG001",
    status: 'accepted',
    offer_date: "2024-01-10",
    deadline: "2024-02-10",
    conditional: false
  },
  {
    offer_id: "OFF006",
    student_id: "7777777777",
    university_id: "UP001",
    course_id: "UP_VET001",
    status: 'declined',
    offer_date: "2024-01-12",
    deadline: "2024-02-12",
    conditional: true,
    conditions: ["Complete additional biology course"]
  },
  {
    offer_id: "OFF007",
    student_id: "1111111111",
    university_id: "UJ001",
    course_id: "UJ_ENG001",
    status: 'pending',
    offer_date: "2024-01-25",
    deadline: "2024-02-25",
    conditional: false
  },
  {
    offer_id: "OFF008",
    student_id: "2222222222",
    university_id: "TUT001",
    course_id: "TUT_IT001",
    status: 'accepted',
    offer_date: "2024-01-08",
    deadline: "2024-02-08",
    conditional: false
  },
  {
    offer_id: "OFF009",
    student_id: "3333333333",
    university_id: "UNIV001",
    course_id: "UNIV001_CS001",
    status: 'pending',
    offer_date: "2024-01-30",
    deadline: "2024-02-28",
    conditional: true,
    conditions: ["Submit portfolio of programming projects"]
  },
  {
    offer_id: "OFF010",
    student_id: "4444444444",
    university_id: "UNIV002",
    course_id: "UNIV002_AI001",
    status: 'accepted',
    offer_date: "2024-01-05",
    deadline: "2024-02-05",
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
    missing.push(`AP score (need ${course.requirements.minimum_aps}, have ${aps})`);
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

// Enhanced qualification algorithm
export interface QualificationResult {
  course: Course;
  university: University;
  eligible: boolean;
  apsScore: number;
  requiredAPS: number;
  missingRequirements: string[];
  improvementSuggestions: string[];
  confidenceLevel: 'high' | 'medium' | 'low';
  priority: number;
}

export interface StudentQualificationReport {
  student: Student;
  apsScore: number;
  eligibleCourses: QualificationResult[];
  improvementCourses: QualificationResult[];
  topRecommendations: QualificationResult[];
  summary: {
    totalEligible: number;
    totalImprovement: number;
    averageConfidence: number;
    bestMatch: QualificationResult | null;
  };
}

export const generateStudentQualificationReport = (student: Student): StudentQualificationReport => {
  const apsScore = calculateAPS(student.marks);
  
  const allResults: QualificationResult[] = courses.map(course => {
    const university = universities.find(u => u.university_id === course.university_id);
    if (!university) return null;

    const eligibility = checkCourseEligibility(student, course);
    const requiredAPS = course.requirements.minimum_aps || 0;
    
    // Calculate confidence level based on how close the student is to requirements
    let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
    let priority = 0;
    
    if (eligibility.eligible) {
      confidenceLevel = 'high';
      priority = 100 - (requiredAPS - apsScore); // Higher priority for courses with lower requirements
    } else {
      const apsGap = requiredAPS - apsScore;
      const subjectGaps = eligibility.missing.length;
      
      if (apsGap <= 5 && subjectGaps <= 2) {
        confidenceLevel = 'medium';
        priority = 70 - (apsGap * 2) - (subjectGaps * 5);
      } else {
        confidenceLevel = 'low';
        priority = 30 - (apsGap * 3) - (subjectGaps * 10);
      }
    }
    
    // Generate improvement suggestions
    const improvementSuggestions: string[] = [];
    
    if (apsScore < requiredAPS) {
      const apsNeeded = requiredAPS - apsScore;
      improvementSuggestions.push(`Improve overall APS by ${apsNeeded} points`);
    }
    
    eligibility.missing.forEach(missing => {
      if (missing.includes('mathematics')) {
        improvementSuggestions.push('Focus on improving Mathematics marks');
      } else if (missing.includes('english')) {
        improvementSuggestions.push('Work on English language skills');
      } else if (missing.includes('physical_sciences')) {
        improvementSuggestions.push('Strengthen Physical Sciences understanding');
      } else if (missing.includes('life_sciences')) {
        improvementSuggestions.push('Improve Life Sciences knowledge');
      } else if (missing.includes('accounting')) {
        improvementSuggestions.push('Enhance Accounting skills');
      } else if (missing.includes('economics')) {
        improvementSuggestions.push('Develop Economics understanding');
      }
    });
    
    // Add general improvement suggestions
    if (confidenceLevel === 'low') {
      improvementSuggestions.push('Consider foundation year or bridging courses');
      improvementSuggestions.push('Focus on core subjects for this field');
    }
    
    return {
      course,
      university,
      eligible: eligibility.eligible,
      apsScore,
      requiredAPS,
      missingRequirements: eligibility.missing,
      improvementSuggestions,
      confidenceLevel,
      priority: Math.max(0, priority)
    };
  }).filter((result): result is QualificationResult => result !== null);
  
  // Separate eligible and improvement courses
  const eligibleCourses = allResults
    .filter(result => result.eligible)
    .sort((a, b) => b.priority - a.priority);
    
  const improvementCourses = allResults
    .filter(result => !result.eligible)
    .sort((a, b) => b.priority - a.priority);
  
  // Get top recommendations (mix of eligible and high-priority improvement courses)
  const topRecommendations = [
    ...eligibleCourses.slice(0, 5),
    ...improvementCourses.filter(c => c.confidenceLevel === 'medium').slice(0, 3)
  ].sort((a, b) => b.priority - a.priority);
  
  // Calculate summary statistics
  const averageConfidence = allResults.reduce((sum, result) => {
    const confidenceValue = result.confidenceLevel === 'high' ? 3 : result.confidenceLevel === 'medium' ? 2 : 1;
    return sum + confidenceValue;
  }, 0) / allResults.length;
  
  return {
    student,
    apsScore,
    eligibleCourses,
    improvementCourses,
    topRecommendations,
    summary: {
      totalEligible: eligibleCourses.length,
      totalImprovement: improvementCourses.length,
      averageConfidence,
      bestMatch: eligibleCourses[0] || improvementCourses[0] || null
    }
  };
};

// Function to get courses by faculty
export const getCoursesByFaculty = (faculty: string): Course[] => {
  return courses.filter(course => course.faculty.toLowerCase().includes(faculty.toLowerCase()));
};

// Function to get courses by university
export const getCoursesByUniversity = (universityId: string): Course[] => {
  return courses.filter(course => course.university_id === universityId);
};

// Function to get courses within APS range
export const getCoursesWithinAPSRange = (minAPS: number, maxAPS: number): Course[] => {
  return courses.filter(course => {
    const requiredAPS = course.requirements.minimum_aps || 0;
    return requiredAPS >= minAPS && requiredAPS <= maxAPS;
  });
};

// Function to get improvement suggestions for a specific course
export const getCourseImprovementPlan = (student: Student, course: Course): {
  course: Course;
  currentAPS: number;
  requiredAPS: number;
  apsGap: number;
  subjectImprovements: Array<{
    subject: string;
    currentMark: number;
    requiredMark: number;
    improvementNeeded: number;
    suggestions: string[];
  }>;
  overallPlan: string[];
} => {
  const currentAPS = calculateAPS(student.marks);
  const requiredAPS = course.requirements.minimum_aps || 0;
  const apsGap = requiredAPS - currentAPS;
  
  const subjectImprovements = Object.entries(course.requirements)
    .filter(([key, value]) => key !== 'minimum_aps' && key !== 'additional_requirements' && typeof value === 'number')
    .map(([subject, required]) => {
      const currentMark = student.marks[subject as keyof Student['marks']] || 0;
      const requiredMark = required as number;
      const improvementNeeded = Math.max(0, requiredMark - currentMark);
      
      let suggestions: string[] = [];
      if (improvementNeeded > 0) {
        switch (subject) {
          case 'mathematics':
            suggestions = [
              'Practice problem-solving daily',
              'Focus on algebra and calculus',
              'Consider additional tutoring',
              'Use online resources like Khan Academy'
            ];
            break;
          case 'english':
            suggestions = [
              'Read extensively to improve vocabulary',
              'Practice essay writing',
              'Join a book club or writing group',
              'Focus on grammar and comprehension'
            ];
            break;
          case 'physical_sciences':
            suggestions = [
              'Practice physics and chemistry problems',
              'Conduct experiments at home',
              'Watch educational science videos',
              'Join a science study group'
            ];
            break;
          case 'life_sciences':
            suggestions = [
              'Study biology concepts thoroughly',
              'Use visual aids and diagrams',
              'Practice with past exam papers',
              'Consider field trips to nature reserves'
            ];
            break;
          case 'accounting':
            suggestions = [
              'Practice bookkeeping exercises',
              'Understand financial statements',
              'Use accounting software',
              'Study business mathematics'
            ];
            break;
          case 'economics':
            suggestions = [
              'Read economic news and analysis',
              'Understand supply and demand',
              'Study market dynamics',
              'Practice economic calculations'
            ];
            break;
        }
      }
      
      return {
        subject,
        currentMark,
        requiredMark: requiredMark,
        improvementNeeded,
        suggestions
      };
    });
  
  const overallPlan: string[] = [];
  
  if (apsGap > 0) {
    overallPlan.push(`Focus on improving overall APS by ${apsGap} points`);
  }
  
  if (subjectImprovements.some(s => s.improvementNeeded > 0)) {
    overallPlan.push('Prioritize subjects with the largest improvement gaps');
  }
  
  overallPlan.push('Consider taking additional courses or bridging programs');
  overallPlan.push('Set up a study schedule with regular practice');
  overallPlan.push('Seek help from teachers or tutors for difficult subjects');
  
  return {
    course,
    currentAPS,
    requiredAPS,
    apsGap,
    subjectImprovements,
    overallPlan
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
   
    { field: 'social_level', weight: 2 },
    { field: 'sleep_schedule', weight: 3 },
    { field: 'music_tolerance', weight: 1 },
    { field: 'party_frequency', weight: 2 },
    { field: 'smoking_preference', weight: 3 },

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

// Career Data
export const careers: Career[] = [
  {
    career_id: "CAREER001",
    name: "Software Engineer",
    description: "Design, develop, and maintain software applications and systems",
    category: "Technology",
    required_courses: ["WITS_CS001"],
   
    skills_required: ["Programming", "Problem Solving", "Teamwork", "Communication"],
    average_salary: {
      entry_level: 350000,
      mid_level: 650000,
      senior_level: 1200000
    },
    job_market_outlook: "Moderate demand",
    growth_rate: 22,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/it-and-telecommunications/software-developer/"
  },
  {
    career_id: "CAREER002",
    name: "Doctor",
    description: "Diagnose and treat medical conditions, provide healthcare services",
    category: "Healthcare",
    required_courses: ["UCT_MED001"],
    alternative_courses: [],
    skills_required: ["Medical Knowledge", "Empathy", "Critical Thinking", "Communication"],
    average_salary: {
      entry_level: 450000,
      mid_level: 800000,
      senior_level: 1500000
    },
    job_market_outlook: "Moderate demand",
    growth_rate: 15,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/health/doctor/"
  },
  {
    career_id: "CAREER003",
    name: "Civil Engineer",
    description: "Design and oversee construction of infrastructure projects",
    category: "Engineering",
    required_courses: ["UCT_ENG001"],
    alternative_courses: [],
    skills_required: ["Mathematics", "Problem Solving", "Project Management", "Technical Drawing"],
    average_salary: {
      entry_level: 400000,
      mid_level: 700000,
      senior_level: 1100000
    },
    job_market_outlook: "High demand",
    growth_rate: 8,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/engineering/civil-engineer/"
  },
  {
    career_id: "CAREER004",
    name: "Lawyer",
    description: "Provide legal advice, represent clients in court, draft legal documents",
    category: "Law",
    required_courses: ["WITS_LAW001"],
    alternative_courses: [],
    skills_required: ["Legal Knowledge", "Research", "Communication", "Analytical Thinking"],
    average_salary: {
      entry_level: 300000,
      mid_level: 600000,
      senior_level: 1000000
    },
    job_market_outlook: "Moderate demand",
    growth_rate: 6,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/legal/lawyer/"
  },
  {
    career_id: "CAREER005",
    name: "Agricultural Scientist",
    description: "Research and develop methods to improve agricultural productivity",
    category: "Agriculture",
    required_courses: ["UKZN_AGRI001"],
    alternative_courses: [],
    skills_required: ["Scientific Research", "Data Analysis", "Problem Solving", "Communication"],
    average_salary: {
      entry_level: 280000,
      mid_level: 500000,
      senior_level: 800000
    },
    job_market_outlook: "High demand",
    growth_rate: 12,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/agriculture/agricultural-scientist/"
  },
  {
    career_id: "CAREER006",
    name: "Financial Analyst",
    description: "Analyze financial data to help businesses make investment decisions",
    category: "Finance",
    required_courses: ["UCT_COM001"],
    alternative_courses: [],
    skills_required: ["Financial Analysis", "Excel", "Communication", "Attention to Detail"],
    average_salary: {
      entry_level: 320000,
      mid_level: 550000,
      senior_level: 900000
    },
    job_market_outlook: "High demand",
    growth_rate: 10,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/business/financial-analyst/"
  },
  {
    career_id: "CAREER007",
    name: "Data Scientist",
    description: "Extract insights from large datasets using statistical and machine learning techniques",
    category: "Technology",
    required_courses: ["WITS_CS001"],
    alternative_courses: ["UCT_ENG001", "UCT_COM001"],
    skills_required: ["Statistics", "Programming", "Machine Learning", "Data Visualization"],
    average_salary: {
      entry_level: 400000,
      mid_level: 750000,
      senior_level: 1300000
    },
    job_market_outlook: "High demand",
    growth_rate: 25,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/it-and-telecommunications/data-scientist/"
  },
  {
    career_id: "CAREER008",
    name: "Environmental Engineer",
    description: "Develop solutions to environmental problems using engineering principles",
    category: "Engineering",
    required_courses: ["UCT_ENG001"],
    alternative_courses: ["UKZN_AGRI001"],
    skills_required: ["Environmental Science", "Engineering", "Problem Solving", "Sustainability"],
    average_salary: {
      entry_level: 380000,
      mid_level: 650000,
      senior_level: 1000000
    },
    job_market_outlook: "High demand",
    growth_rate: 18,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/engineering/environmental-engineer/"
  },
  {
    career_id: "CAREER009",
    name: "Veterinarian",
    description: "Diagnose and treat diseases and injuries in animals",
    category: "Healthcare",
    required_courses: ["UP_VET001"],
    alternative_courses: [],
    skills_required: ["Animal Care", "Medical Knowledge", "Communication", "Problem Solving"],
    average_salary: {
      entry_level: 420000,
      mid_level: 750000,
      senior_level: 1200000
    },
    job_market_outlook: "High demand",
    growth_rate: 16,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/health/veterinarian/"
  },
  {
    career_id: "CAREER010",
    name: "Mining Engineer",
    description: "Design and oversee mining operations and extraction processes",
    category: "Engineering",
    required_courses: ["WITS_MINING001"],
    alternative_courses: ["UCT_ENG001"],
    skills_required: ["Engineering", "Safety Management", "Project Management", "Technical Skills"],
    average_salary: {
      entry_level: 450000,
      mid_level: 800000,
      senior_level: 1300000
    },
    job_market_outlook: "High demand",
    growth_rate: 14,
    learn_more_url: "https://www.careers.govt.nz/jobs-database/engineering/mining-engineer/"
  }
];

// Career Planning Functions
export const getRecommendedCourses = (careerId: string, student: Student): string[] => {
  const career = careers.find(c => c.career_id === careerId);
  if (!career) return [];

  // Get all relevant courses (required + alternative)
  const allRelevantCourses = [...career.required_courses, ...career.alternative_courses];
  
  // Filter courses the student is eligible for
  const eligibleCourses = allRelevantCourses.filter(courseId => {
    const course = courses.find(c => c.course_id === courseId);
    if (!course) return false;
    
    const eligibility = checkCourseEligibility(student, course);
    return eligibility.eligible;
  });

  return eligibleCourses;
};

export const getCareerRecommendations = (student: Student): Career[] => {
  // Find careers where student is eligible for at least one required course
  const recommendedCareers = careers.filter(career => {
    const eligibleCourses = getRecommendedCourses(career.career_id, student);
    return eligibleCourses.length > 0;
  });

  // Sort by job market outlook and growth rate
  return recommendedCareers.sort((a, b) => {
    const outlookScore = { "High demand": 4, "Moderate demand": 3, "Low demand": 2, "Limited demand": 1 };
    const aScore = outlookScore[a.job_market_outlook] + (a.growth_rate / 10);
    const bScore = outlookScore[b.job_market_outlook] + (b.growth_rate / 10);
    return bScore - aScore;
  });
};

export const getCareersForCourse = (courseId: string): Career[] => {
  // Find all careers that include this course in their required or alternative courses
  const relevantCareers = careers.filter(career => {
    return career.required_courses.includes(courseId) || 
           career.alternative_courses.includes(courseId);
  });

  // Sort by job market outlook and growth rate
  return relevantCareers.sort((a, b) => {
    const outlookScore = { "High demand": 4, "Moderate demand": 3, "Low demand": 2, "Limited demand": 1 };
    const aScore = outlookScore[a.job_market_outlook] + (a.growth_rate / 10);
    const bScore = outlookScore[b.job_market_outlook] + (b.growth_rate / 10);
    return bScore - aScore;
  });
};