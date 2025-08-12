"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, AlertTriangle, Eye, RefreshCw } from "lucide-react"
import { generateDemoRiskAlerts, getDemoSurveyLocations, type RiskAlert } from "@/lib/risk-detection"

// Simple map component using HTML5 Canvas for demo purposes
// In a real app, you'd use Leaflet.js or Mapbox
export function RiskMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [surveyLocations, setSurveyLocations] = useState<any[]>([])
  const [selectedLocation, setSelectedLocation] = useState<any>(null)

  useEffect(() => {
    setRiskAlerts(generateDemoRiskAlerts())
    setSurveyLocations(getDemoSurveyLocations())
  }, [])

  useEffect(() => {
    drawMap()
  }, [riskAlerts, surveyLocations])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e9ecef"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw survey locations
    surveyLocations.forEach((location, index) => {
      const x = 100 + ((index * 120) % (canvas.width - 200))
      const y = 100 + Math.floor((index * 120) / (canvas.width - 200)) * 100

      // Location circle
      ctx.beginPath()
      ctx.arc(x, y, 15, 0, 2 * Math.PI)
      ctx.fillStyle =
        location.riskLevel === "high" ? "#ef4444" : location.riskLevel === "medium" ? "#f59e0b" : "#10b981"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Location label
      ctx.fillStyle = "#374151"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y + 35)
      ctx.fillText(`${location.responseCount} responses`, x, y + 50)
    })

    // Draw risk alerts
    riskAlerts.forEach((alert, index) => {
      if (alert.status !== "active") return

      const x = 150 + ((index * 100) % (canvas.width - 300))
      const y = 150 + Math.floor((index * 100) / (canvas.width - 300)) * 120

      // Alert triangle
      ctx.beginPath()
      ctx.moveTo(x, y - 10)
      ctx.lineTo(x - 8, y + 6)
      ctx.lineTo(x + 8, y + 6)
      ctx.closePath()
      ctx.fillStyle = alert.severity === "high" ? "#dc2626" : alert.severity === "medium" ? "#d97706" : "#2563eb"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()

      // Alert label
      ctx.fillStyle = "#374151"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Risk Alert", x, y + 25)
    })
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if click is near any location
    surveyLocations.forEach((location, index) => {
      const locationX = 100 + ((index * 120) % (canvas.width - 200))
      const locationY = 100 + Math.floor((index * 120) / (canvas.width - 200)) * 100

      const distance = Math.sqrt((x - locationX) ** 2 + (y - locationY) ** 2)
      if (distance < 20) {
        setSelectedLocation(location)
      }
    })
  }

  const refreshData = () => {
    setRiskAlerts(generateDemoRiskAlerts())
    setSurveyLocations(getDemoSurveyLocations())
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const activeAlerts = riskAlerts.filter((alert) => alert.status === "active")

  return (
    <div className="space-y-6">
      {/* Map Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Survey Location & Risk Map</h3>
          <p className="text-sm text-muted-foreground">Interactive map showing survey locations and risk alerts</p>
        </div>
        <Button onClick={refreshData} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-600"></div>
          <span>Active Alert</span>
        </div>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardContent className="p-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full border rounded cursor-pointer bg-gray-50"
            onClick={handleCanvasClick}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p className="text-xs text-muted-foreground mt-2">Click on locations to view details</p>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedLocation.name}
            </CardTitle>
            <CardDescription>Survey location details and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Region:</span> {selectedLocation.region}
              </div>
              <div>
                <span className="font-medium">Responses:</span> {selectedLocation.responseCount}
              </div>
              <div>
                <span className="font-medium">Risk Level:</span>{" "}
                <Badge variant={getSeverityColor(selectedLocation.riskLevel)}>{selectedLocation.riskLevel}</Badge>
              </div>
              <div>
                <span className="font-medium">Last Activity:</span>{" "}
                {new Date(selectedLocation.lastActivity).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Coordinates:</span> {selectedLocation.lat.toFixed(4)},{" "}
                {selectedLocation.lng.toFixed(4)}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                View Responses
              </Button>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Risk Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Risk Alerts ({activeAlerts.length})
            </CardTitle>
            <CardDescription>Automated risk detection alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Detected: {new Date(alert.detectedAt).toLocaleString()} • {alert.affectedResponses.length}{" "}
                        responses affected
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveyLocations.length}</div>
            <p className="text-xs text-muted-foreground">Survey locations monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {surveyLocations.filter((loc) => loc.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Locations flagged as high risk</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
