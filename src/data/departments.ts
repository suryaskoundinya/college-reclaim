// JSSSTU/SJCE Official Departments (from jssstu.in)
export const DEPARTMENTS = [
  // Engineering Departments
  "Civil Engineering",
  "Computer Science & Engineering",
  "Electrical & Electronics Engineering",
  "Electronics & Communication Engineering",
  "Electronics & Instrumentation Engineering",
  "Environmental Engineering",
  "Industrial & Production Engineering",
  "Information Science & Engineering",
  "Mechanical Engineering",
  "Polymer Science & Technology",
  
  // School of Life Sciences
  "Biotechnology",
  "Microbiology",
  "Biochemistry",
  
  // School of Physical & Chemical Sciences
  "Chemistry",
  "Physics",
  
  // School of Mathematical & Statistical Sciences
  "Mathematics",
  "Statistics",
  
  // Management & Commerce
  "Master of Business Administration (MBA)",
  "Commerce",
  
  // Computer Applications
  "Master of Computer Applications (MCA)",
  "Bachelor of Computer Applications (BCA)",
  
  // Pharmacy
  "Pharmacy",
  
  "Other"
] as const;

export type DepartmentType = typeof DEPARTMENTS[number];

// Department categories for better organization
export const DEPARTMENT_CATEGORIES = {
  ENGINEERING: [
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering",
    "Electronics & Instrumentation Engineering",
    "Environmental Engineering",
    "Industrial & Production Engineering",
    "Information Science & Engineering",
    "Mechanical Engineering",
    "Polymer Science & Technology"
  ],
  LIFE_SCIENCES: [
    "Biotechnology",
    "Microbiology",
    "Biochemistry"
  ],
  PHYSICAL_SCIENCES: [
    "Chemistry",
    "Physics"
  ],
  MATHEMATICAL_SCIENCES: [
    "Mathematics",
    "Statistics"
  ],
  MANAGEMENT: [
    "Master of Business Administration (MBA)",
    "Commerce"
  ],
  COMPUTER_APPLICATIONS: [
    "Master of Computer Applications (MCA)",
    "Bachelor of Computer Applications (BCA)"
  ],
  PHARMACY: [
    "Pharmacy"
  ]
} as const;

// Department short codes for easy reference
export const DEPARTMENT_CODES = {
  "Civil Engineering": "CE",
  "Computer Science & Engineering": "CSE",
  "Electrical & Electronics Engineering": "EEE",
  "Electronics & Communication Engineering": "ECE",
  "Electronics & Instrumentation Engineering": "EIE",
  "Environmental Engineering": "ENV",
  "Industrial & Production Engineering": "IPE",
  "Information Science & Engineering": "ISE",
  "Mechanical Engineering": "ME",
  "Polymer Science & Technology": "PST",
  "Biotechnology": "BT",
  "Microbiology": "MB",
  "Biochemistry": "BC",
  "Chemistry": "CHEM",
  "Physics": "PHY",
  "Mathematics": "MATH",
  "Statistics": "STAT",
  "Master of Computer Applications (MCA)": "MCA",
  "Bachelor of Computer Applications (BCA)": "BCA",
  "Master of Business Administration (MBA)": "MBA",
  "Commerce": "COM",
  "Pharmacy": "PHARM"
} as const;