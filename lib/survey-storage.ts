// Survey storage and management utilities
import type { Survey, Question } from "@/lib/demo-data"

const SURVEYS_STORAGE_KEY = "takesurvey_surveys"
const QUESTIONS_STORAGE_KEY = "takesurvey_custom_questions"

export interface CustomQuestion extends Question {
  createdBy: string
  createdAt: string
}

// Survey CRUD operations
export const getStoredSurveys = (): Survey[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(SURVEYS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveSurvey = (survey: Survey): void => {
  if (typeof window === "undefined") return

  const surveys = getStoredSurveys()
  const existingIndex = surveys.findIndex((s) => s.id === survey.id)

  if (existingIndex >= 0) {
    surveys[existingIndex] = survey
  } else {
    surveys.push(survey)
  }

  localStorage.setItem(SURVEYS_STORAGE_KEY, JSON.stringify(surveys))
}

export const deleteSurvey = (surveyId: string): void => {
  if (typeof window === "undefined") return

  const surveys = getStoredSurveys()
  const filtered = surveys.filter((s) => s.id !== surveyId)
  localStorage.setItem(SURVEYS_STORAGE_KEY, JSON.stringify(filtered))
}

export const getSurveysByOrganization = (organizationId: string): Survey[] => {
  return getStoredSurveys().filter((s) => s.organizationId === organizationId)
}

// Question CRUD operations
export const getCustomQuestions = (userId: string): CustomQuestion[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(QUESTIONS_STORAGE_KEY)
  const questions = stored ? JSON.parse(stored) : []
  return questions.filter((q: CustomQuestion) => q.createdBy === userId)
}

export const saveCustomQuestion = (question: CustomQuestion): void => {
  if (typeof window === "undefined") return

  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || "[]")
  const existingIndex = questions.findIndex((q: CustomQuestion) => q.id === question.id)

  if (existingIndex >= 0) {
    questions[existingIndex] = question
  } else {
    questions.push(question)
  }

  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions))
}

export const deleteCustomQuestion = (questionId: string): void => {
  if (typeof window === "undefined") return

  const questions = JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || "[]")
  const filtered = questions.filter((q: CustomQuestion) => q.id !== questionId)
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(filtered))
}

export const generateSurveyId = (): string => {
  return `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const generateQuestionId = (): string => {
  return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
