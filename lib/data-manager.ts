// Centralized data management with automatic initialization and persistence
import { DEMO_SURVEYS, type Survey, type Organization } from "@/lib/demo-data"
import { getStoredSurveys, saveSurvey } from "@/lib/survey-storage"
import { getStoredOrganizations, getStoredUsers } from "@/lib/organization-storage"
import { getStoredResponses } from "@/lib/survey-responses"

export class DataManager {
  private static instance: DataManager
  private initialized = false

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  // Initialize all data on app start
  async initializeData(): Promise<void> {
    if (this.initialized || typeof window === "undefined") return

    try {
      // Initialize demo data if not exists
      this.initializeDemoSurveys()
      this.initializeDemoOrganizations()
      this.initializeDemoResponses()

      this.initialized = true
      console.log("Data Manager: All data initialized successfully")
    } catch (error) {
      console.error("Data Manager: Failed to initialize data", error)
    }
  }

  private initializeDemoSurveys(): void {
    const storedSurveys = getStoredSurveys()

    // Add demo surveys if they don't exist in storage
    DEMO_SURVEYS.forEach((demoSurvey) => {
      const exists = storedSurveys.find((s) => s.id === demoSurvey.id)
      if (!exists) {
        saveSurvey(demoSurvey)
      }
    })
  }

  private initializeDemoOrganizations(): void {
    // Organizations are already initialized in organization-storage.ts
    getStoredOrganizations()
    getStoredUsers()
  }

  private initializeDemoResponses(): void {
    const responses = getStoredResponses()

    // Add demo responses if none exist
    if (responses.length === 0) {
      const demoResponses = [
        {
          id: "response_demo_1",
          surveyId: "survey1",
          conductorId: "3",
          conductorName: "Survey Conductor",
          responses: [
            { question: "What is your primary source of drinking water?", answer: "Well water" },
            { question: "How many hours per day do you have access to clean water?", answer: "12-18 hours" },
            { question: "Rate the quality of your water supply (1-5 scale)", answer: "4" },
          ],
          location: { latitude: 40.7128, longitude: -74.006, address: "New York, NY" },
          deviceInfo: {
            userAgent: "Demo Device",
            timestamp: Date.now(),
            deviceId: "demo_device_1",
          },
          submittedAt: new Date().toISOString(),
          syncStatus: "synced" as const,
        },
        {
          id: "response_demo_2",
          surveyId: "survey2",
          conductorId: "3",
          conductorName: "Survey Conductor",
          responses: [
            { question: "How would you rate your overall health?", answer: "Good" },
            { question: "Do you have access to a healthcare facility within 5km?", answer: "Yes" },
          ],
          location: { latitude: 34.0522, longitude: -118.2437, address: "Los Angeles, CA" },
          deviceInfo: {
            userAgent: "Demo Device",
            timestamp: Date.now(),
            deviceId: "demo_device_2",
          },
          submittedAt: new Date().toISOString(),
          syncStatus: "synced" as const,
        },
      ]

      localStorage.setItem("survey_responses", JSON.stringify(demoResponses))
    }
  }

  // Get all data with proper fallbacks
  getAllSurveys(): Survey[] {
    const stored = getStoredSurveys()
    const demo = DEMO_SURVEYS

    // Merge and deduplicate
    const allSurveys = [...demo]
    stored.forEach((survey) => {
      if (!allSurveys.find((s) => s.id === survey.id)) {
        allSurveys.push(survey)
      }
    })

    return allSurveys
  }

  getAllOrganizations(): Organization[] {
    return getStoredOrganizations()
  }

  // Force refresh all data
  refreshData(): void {
    this.initialized = false
    this.initializeData()
  }

  // Check data integrity
  validateData(): boolean {
    try {
      const surveys = this.getAllSurveys()
      const organizations = this.getAllOrganizations()
      const responses = getStoredResponses()

      return surveys.length > 0 && organizations.length > 0
    } catch (error) {
      console.error("Data validation failed:", error)
      return false
    }
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance()

// Auto-initialize when module loads
if (typeof window !== "undefined") {
  dataManager.initializeData()
}
