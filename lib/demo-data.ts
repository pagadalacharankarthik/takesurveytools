// Demo organizations and question banks
export interface Organization {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Question {
  id: string
  text: string
  type: "text" | "multiple_choice" | "rating" | "yes_no"
  options?: string[]
  domain: string[]
}

export interface Survey {
  id: string
  title: string
  organizationId: string
  questions: Question[]
  createdAt: string
  status: "draft" | "active" | "completed"
  uploadedFileName?: string
  extractedKeywords?: string[]
}

export const DEMO_ORGANIZATIONS: Organization[] = [
  {
    id: "org1",
    name: "Rural Development Foundation",
    description: "Focused on water access and rural infrastructure",
    createdAt: "2024-01-15",
  },
  {
    id: "org2",
    name: "Health & Education Initiative",
    description: "Community health and literacy programs",
    createdAt: "2024-02-01",
  },
]

export const DEMO_QUESTION_BANK: Question[] = [
  // Water domain questions
  {
    id: "q1",
    text: "What is your primary source of drinking water?",
    type: "multiple_choice",
    options: ["Tap water", "Well water", "River/stream", "Bottled water", "Other"],
    domain: ["water", "infrastructure"],
  },
  {
    id: "q2",
    text: "How many hours per day do you have access to clean water?",
    type: "multiple_choice",
    options: ["Less than 2 hours", "2-6 hours", "6-12 hours", "12-18 hours", "24 hours"],
    domain: ["water", "access"],
  },
  {
    id: "q3",
    text: "Rate the quality of your water supply (1-5 scale)",
    type: "rating",
    domain: ["water", "quality"],
  },
  {
    id: "q4",
    text: "Do you treat your water before drinking?",
    type: "yes_no",
    domain: ["water", "treatment"],
  },
  {
    id: "q5",
    text: "How far do you travel to collect water?",
    type: "multiple_choice",
    options: ["Less than 100m", "100m-500m", "500m-1km", "1km-5km", "More than 5km"],
    domain: ["water", "distance", "access"],
  },

  // Health domain questions
  {
    id: "q6",
    text: "How would you rate your overall health?",
    type: "multiple_choice",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
    domain: ["health", "general"],
  },
  {
    id: "q7",
    text: "Do you have access to a healthcare facility within 5km?",
    type: "yes_no",
    domain: ["health", "access", "infrastructure"],
  },
  {
    id: "q8",
    text: "What health challenges do you face most often?",
    type: "multiple_choice",
    options: ["Respiratory issues", "Digestive problems", "Skin conditions", "Injuries", "Chronic diseases"],
    domain: ["health", "challenges"],
  },
  {
    id: "q9",
    text: "How often do you visit a healthcare provider?",
    type: "multiple_choice",
    options: ["Weekly", "Monthly", "Every 3-6 months", "Annually", "Only when sick", "Never"],
    domain: ["health", "frequency"],
  },

  // Education/Literacy domain questions
  {
    id: "q10",
    text: "What is your highest level of education?",
    type: "multiple_choice",
    options: ["No formal education", "Primary school", "Secondary school", "Higher secondary", "College/University"],
    domain: ["education", "literacy"],
  },
  {
    id: "q11",
    text: "Can you read and write in your local language?",
    type: "yes_no",
    domain: ["literacy", "language"],
  },
  {
    id: "q12",
    text: "Do children in your household attend school regularly?",
    type: "yes_no",
    domain: ["education", "children"],
  },
  {
    id: "q13",
    text: "What are the main barriers to education in your area?",
    type: "multiple_choice",
    options: ["Distance to school", "Cost of education", "Need to work", "Lack of teachers", "Cultural factors"],
    domain: ["education", "barriers"],
  },

  // General demographic questions
  {
    id: "q14",
    text: "What is your age group?",
    type: "multiple_choice",
    options: ["18-25", "26-35", "36-45", "46-55", "56-65", "Over 65"],
    domain: ["demographic"],
  },
  {
    id: "q15",
    text: "What is your primary occupation?",
    type: "multiple_choice",
    options: ["Farming", "Small business", "Government job", "Private sector", "Student", "Unemployed"],
    domain: ["demographic", "occupation"],
  },
]

// Demo surveys (pre-created)
export const DEMO_SURVEYS: Survey[] = [
  {
    id: "survey1",
    title: "Water Access Assessment",
    organizationId: "org1",
    questions: DEMO_QUESTION_BANK.filter((q) => q.domain.includes("water")).slice(0, 5),
    createdAt: "2024-03-01",
    status: "active",
    uploadedFileName: "water_assessment_document.pdf",
    extractedKeywords: ["water", "access", "quality", "infrastructure"],
  },
  {
    id: "survey2",
    title: "Community Health Survey",
    organizationId: "org2",
    questions: DEMO_QUESTION_BANK.filter((q) => q.domain.includes("health")).slice(0, 4),
    createdAt: "2024-03-05",
    status: "draft",
    uploadedFileName: "health_survey_template.docx",
    extractedKeywords: ["health", "access", "challenges", "community"],
  },
]
