import type { SurveyResponse } from "./survey-responses"

export interface RiskAlert {
  id: string
  type: "duplicate_responses" | "location_mismatch" | "suspicious_pattern" | "device_anomaly"
  severity: "low" | "medium" | "high"
  message: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  affectedResponses: string[]
  detectedAt: string
  status: "active" | "investigating" | "resolved"
  metadata?: any
}

// Demo locations for risk simulation
const DEMO_SURVEY_LOCATIONS = [
  { lat: 28.6139, lng: 77.209, name: "New Delhi Area", region: "Urban Zone A" },
  { lat: 19.076, lng: 72.8777, name: "Mumbai Region", region: "Urban Zone B" },
  { lat: 13.0827, lng: 80.2707, name: "Chennai District", region: "Coastal Area C" },
  { lat: 22.5726, lng: 88.3639, name: "Kolkata Zone", region: "Eastern Region D" },
  { lat: 12.9716, lng: 77.5946, name: "Bangalore Rural", region: "Rural Area E" },
]

export const generateDemoRiskAlerts = (): RiskAlert[] => {
  const alerts: RiskAlert[] = []
  const now = new Date()

  // Generate duplicate response alerts
  alerts.push({
    id: "risk_dup_001",
    type: "duplicate_responses",
    severity: "high",
    message: "Multiple responses detected from same device within 5 minutes",
    location: DEMO_SURVEY_LOCATIONS[0],
    affectedResponses: ["resp_001", "resp_002", "resp_003"],
    detectedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    status: "active",
    metadata: {
      deviceId: "device_123456",
      timeSpan: "5 minutes",
      responseCount: 3,
    },
  })

  // Generate location mismatch alerts
  alerts.push({
    id: "risk_loc_001",
    type: "location_mismatch",
    severity: "medium",
    message: "Survey responses recorded outside designated survey area boundaries",
    location: DEMO_SURVEY_LOCATIONS[1],
    affectedResponses: ["resp_004", "resp_005"],
    detectedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    status: "investigating",
    metadata: {
      expectedRegion: "Urban Zone B",
      actualDistance: "15.2 km",
      boundaryViolation: true,
    },
  })

  // Generate suspicious pattern alerts
  alerts.push({
    id: "risk_pat_001",
    type: "suspicious_pattern",
    severity: "low",
    message: "Unusually fast response completion times detected",
    location: DEMO_SURVEY_LOCATIONS[2],
    affectedResponses: ["resp_006", "resp_007", "resp_008", "resp_009"],
    detectedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    status: "active",
    metadata: {
      averageTime: "45 seconds",
      expectedTime: "4-6 minutes",
      responseCount: 4,
    },
  })

  // Generate device anomaly alerts
  alerts.push({
    id: "risk_dev_001",
    type: "device_anomaly",
    severity: "medium",
    message: "Suspicious device fingerprint patterns detected",
    location: DEMO_SURVEY_LOCATIONS[3],
    affectedResponses: ["resp_010", "resp_011"],
    detectedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    status: "resolved",
    metadata: {
      deviceFingerprint: "anomalous_pattern_detected",
      similarDevices: 2,
      riskScore: 0.75,
    },
  })

  return alerts
}

export const analyzeResponseRisks = (responses: SurveyResponse[]): RiskAlert[] => {
  const alerts: RiskAlert[] = []
  const now = new Date()

  // Check for duplicate responses from same device
  const deviceGroups = responses.reduce(
    (groups, response) => {
      const deviceId = response.deviceInfo.deviceId
      if (!groups[deviceId]) groups[deviceId] = []
      groups[deviceId].push(response)
      return groups
    },
    {} as { [deviceId: string]: SurveyResponse[] },
  )

  Object.entries(deviceGroups).forEach(([deviceId, deviceResponses]) => {
    if (deviceResponses.length > 1) {
      // Check if responses were submitted too quickly
      const sortedResponses = deviceResponses.sort(
        (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      )

      for (let i = 1; i < sortedResponses.length; i++) {
        const timeDiff =
          new Date(sortedResponses[i].submittedAt).getTime() - new Date(sortedResponses[i - 1].submittedAt).getTime()
        const minutesDiff = timeDiff / (1000 * 60)

        if (minutesDiff < 10) {
          // Responses within 10 minutes - potential duplicate
          alerts.push({
            id: `risk_dup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "duplicate_responses",
            severity: minutesDiff < 5 ? "high" : "medium",
            message: `Multiple responses from same device within ${Math.round(minutesDiff)} minutes`,
            location: sortedResponses[i].location || DEMO_SURVEY_LOCATIONS[0],
            affectedResponses: [sortedResponses[i - 1].id, sortedResponses[i].id],
            detectedAt: now.toISOString(),
            status: "active",
            metadata: {
              deviceId,
              timeSpan: `${Math.round(minutesDiff)} minutes`,
              responseCount: 2,
            },
          })
        }
      }
    }
  })

  return alerts
}

export const getDemoSurveyLocations = () => {
  return DEMO_SURVEY_LOCATIONS.map((location, index) => ({
    ...location,
    id: `location_${index}`,
    responseCount: Math.floor(Math.random() * 50) + 10,
    riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}
