// Local storage management for survey responses
export interface PersonalInfo {
  name: string
  email: string
  mobile: string
  aadhar: string
}

export interface SurveyResponse {
  id: string
  surveyId: string
  conductorId?: string
  conductorName?: string
  personalInfo?: PersonalInfo // Added personal information field
  responses: { question: string; answer: string }[] | { [questionId: string]: string | string[] }
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  deviceInfo: {
    userAgent: string
    timestamp: string | number
    deviceId?: string
  }
  submittedAt: string
  syncStatus: "pending" | "synced" | "failed"
}

export const generateDeviceId = (): string => {
  const stored = localStorage.getItem("survey_device_id")
  if (stored) return stored

  const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem("survey_device_id", deviceId)
  return deviceId
}

export const saveResponse = (response: Omit<SurveyResponse, "id" | "submittedAt" | "syncStatus">): string => {
  const responseId = `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const fullResponse: SurveyResponse = {
    ...response,
    id: responseId,
    submittedAt: new Date().toISOString(),
    syncStatus: "pending",
  }

  const existingResponses = getStoredResponses()
  const updatedResponses = [...existingResponses, fullResponse]
  localStorage.setItem("survey_responses", JSON.stringify(updatedResponses))

  return responseId
}

export const savePublicResponse = (response: Omit<SurveyResponse, "id" | "submittedAt" | "syncStatus">): string => {
  const responseId = `public_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const fullResponse: SurveyResponse = {
    ...response,
    id: responseId,
    submittedAt: new Date().toISOString(),
    syncStatus: "synced", // Public responses are immediately considered synced
  }

  const existingResponses = getStoredResponses()
  const updatedResponses = [...existingResponses, fullResponse]
  localStorage.setItem("survey_responses", JSON.stringify(updatedResponses))

  return responseId
}

export const getStoredResponses = (): SurveyResponse[] => {
  const stored = localStorage.getItem("survey_responses")
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export const getResponsesBySurvey = (surveyId: string): SurveyResponse[] => {
  return getStoredResponses().filter((response) => response.surveyId === surveyId)
}

export const getSurveyResponses = (surveyId: string): SurveyResponse[] => {
  const responses = getResponsesBySurvey(surveyId)

  // Convert responses to expected format if needed
  return responses.map((response) => ({
    ...response,
    // Ensure responses are in the expected format
    responses: Array.isArray(response.responses)
      ? response.responses
      : Object.entries(response.responses as any).map(([question, answer]) => ({
          question,
          answer: Array.isArray(answer) ? answer.join(", ") : String(answer),
        })),
  }))
}

export const markResponsesSynced = (responseIds: string[]) => {
  const responses = getStoredResponses()
  const updatedResponses = responses.map((response) =>
    responseIds.includes(response.id) ? { ...response, syncStatus: "synced" as const } : response,
  )
  localStorage.setItem("survey_responses", JSON.stringify(updatedResponses))
}

export const getPendingResponsesCount = (): number => {
  return getStoredResponses().filter((response) => response.syncStatus === "pending").length
}
