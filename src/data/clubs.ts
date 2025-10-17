// JSSSTU/SJCE Official Clubs (from jssstu.in)
export const CLUBS = [
  // Technical Clubs
  "Linux Campus Club (LCC)",
  "IEEE-SJCE",
  "Google Developer Student Club (GDSC)",
  "Computer Society of India (CSI JSSSTU)",
  "TESLA SJCE",
  "ISTE Students' Chapter",
  "IETE SJCE",
  
  // Cultural & Arts Clubs
  "Editorial Board",
  "PhotoOn (Photography Club)",
  "Sahas (Adventure Club)",
  
  // Social Service
  "Rotaract Club SJCE",
  "National Service Scheme (NSS)",
  "Youth Red Cross",
  
  // Professional Development
  "Entrepreneurship Development Cell (EDC)",
  
  "Other"
] as const;

export type ClubType = typeof CLUBS[number];

// Club categories for better organization
export const CLUB_CATEGORIES = {
  TECHNICAL: [
    "Linux Campus Club (LCC)",
    "IEEE-SJCE",
    "Google Developer Student Club (GDSC)",
    "Computer Society of India (CSI JSSSTU)",
    "TESLA SJCE",
    "ISTE Students' Chapter",
    "IETE SJCE"
  ],
  CULTURAL: [
    "Editorial Board",
    "PhotoOn (Photography Club)",
    "Sahas (Adventure Club)"
  ],
  SERVICE: [
    "Rotaract Club SJCE",
    "National Service Scheme (NSS)",
    "Youth Red Cross"
  ],
  PROFESSIONAL: [
    "Entrepreneurship Development Cell (EDC)"
  ]
} as const;