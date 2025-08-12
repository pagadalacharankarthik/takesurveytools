"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, MapPin, Shield, TrendingUp, Eye, CheckCircle, X } from "lucide-react"
import { RiskMap } from "@/components/risk-map"
import { RiskInvestigationDialog, RiskDetailsDialog } from "@/components/risk-investigation-dialogs"
import { generateDemoRiskAlerts, analyzeResponseRisks, type RiskAlert } from "@/lib/risk-detection"
import { getStoredResponses } from "@/lib/survey-responses"

export function RiskMonitoringDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [realTimeAlerts, setRealTimeAlerts] = useState<RiskAlert[]>([])
  const [showInvestigationDialog, setShowInvestigationDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null)

  useEffect(() => {
    const demoAlerts = generateDemoRiskAlerts()
    setRiskAlerts(demoAlerts)

    const responses = getStoredResponses()
    const detectedRisks = analyzeResponseRisks(responses)
    setRealTimeAlerts(detectedRisks)
  }, [])

  const allAlerts = [...riskAlerts, ...realTimeAlerts]
  const activeAlerts = allAlerts.filter((alert) => alert.status === "active")
  const highPriorityAlerts = activeAlerts.filter((alert) => alert.severity === "high")

  const handleResolveAlert = (alertId: string, resolution?: string, notes?: string) => {
    const timestamp = new Date().toISOString()
    setRiskAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved" as const,
              resolvedAt: timestamp,
              resolution,
              resolutionNotes: notes,
            }
          : alert,
      ),
    )
    setRealTimeAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved" as const,
              resolvedAt: timestamp,
              resolution,
              resolutionNotes: notes,
            }
          : alert,
      ),
    )
  }

  const handleInvestigateAlert = (alert: RiskAlert) => {
    setSelectedAlert(alert)
    setShowInvestigationDialog(true)
  }

  const handleViewDetails = (alert: RiskAlert) => {
    setSelectedAlert(alert)
    setShowDetailsDialog(true)
  }

  const handleUpdateStatus = (alertId: string, status: string) => {
    const timestamp = new Date().toISOString()
    setRiskAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: status as any,
              investigatedAt: status === "investigating" ? timestamp : alert.investigatedAt,
            }
          : alert,
      ),
    )
    setRealTimeAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: status as any,
              investigatedAt: status === "investigating" ? timestamp : alert.investigatedAt,
            }
          : alert,
      ),
    )
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive"
      case "investigating":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskTypeIcon = (type: string) => {
    switch (type) {
      case "duplicate_responses":
        return "👥"
      case "location_mismatch":
        return "📍"
      case "suspicious_pattern":
        return "⚡"
      case "device_anomaly":
        return "📱"
      default:
        return "⚠️"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allAlerts.length}</div>
            <p className="text-xs text-muted-foreground">{activeAlerts.length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{highPriorityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locations Monitored</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Survey locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highPriorityAlerts.length > 0 ? "High" : activeAlerts.length > 2 ? "Medium" : "Low"}
            </div>
            <p className="text-xs text-muted-foreground">Overall system risk</p>
          </CardContent>
        </Card>
      </div>

      {highPriorityAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{highPriorityAlerts.length} high priority alerts</strong> require immediate attention. Review the
            alerts below and take appropriate action.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="map">Location Map</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Risk Alerts</CardTitle>
              <CardDescription>Latest automated risk detection alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{getRiskTypeIcon(alert.type)}</div>
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(alert.detectedAt).toLocaleString()} • {alert.affectedResponses.length} responses
                        affected
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                    <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Risk Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    type: "duplicate_responses",
                    count: allAlerts.filter((a) => a.type === "duplicate_responses").length,
                  },
                  { type: "location_mismatch", count: allAlerts.filter((a) => a.type === "location_mismatch").length },
                  {
                    type: "suspicious_pattern",
                    count: allAlerts.filter((a) => a.type === "suspicious_pattern").length,
                  },
                  { type: "device_anomaly", count: allAlerts.filter((a) => a.type === "device_anomaly").length },
                ].map((category) => (
                  <div key={category.type} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{category.type.replace("_", " ")}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detection Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Detection Rate</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">False Positives</span>
                  <span className="font-medium">2.1%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="font-medium">3.2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">System Uptime</span>
                  <span className="font-medium">99.8%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <RiskMap />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Alert Management</h3>
            <div className="flex gap-2">
              <Badge variant="outline">{activeAlerts.length} Active</Badge>
              <Badge variant="secondary">{allAlerts.filter((a) => a.status === "resolved").length} Resolved</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {allAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-lg">{getRiskTypeIcon(alert.type)}</span>
                        {alert.message}
                      </CardTitle>
                      <CardDescription>
                        Detected: {new Date(alert.detectedAt).toLocaleString()} • {alert.affectedResponses.length}{" "}
                        responses affected
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                      <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {alert.metadata && (
                    <div className="text-sm text-muted-foreground mb-4">
                      <strong>Details:</strong>{" "}
                      {Object.entries(alert.metadata)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" • ")}
                    </div>
                  )}

                  {alert.status === "active" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleInvestigateAlert(alert)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(alert)}>
                        <X className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  )}
                  {alert.status === "investigating" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(alert)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  )}
                  {alert.status === "resolved" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(alert)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <RiskInvestigationDialog
        alert={selectedAlert}
        open={showInvestigationDialog}
        onOpenChange={setShowInvestigationDialog}
        onResolve={handleResolveAlert}
        onUpdateStatus={handleUpdateStatus}
      />

      <RiskDetailsDialog alert={selectedAlert} open={showDetailsDialog} onOpenChange={setShowDetailsDialog} />
    </div>
  )
}
