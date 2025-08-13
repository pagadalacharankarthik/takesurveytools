"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RiskMap } from "@/components/risk-map"
import { AddOrganizationDialog, OrganizationDetailsDialog } from "@/components/organization-dialogs"
import { LocationViewer } from "@/components/location-viewer"
import {
  SurveyProgressChart,
  ResponseRateChart,
  OrganizationDistributionChart,
  RiskTrendChart,
  ConductorPerformanceChart,
} from "@/components/analytics-charts"
import { SurveyResponsesViewer } from "@/components/survey-responses-viewer"
import { ConductorManagementDialog } from "@/components/conductor-management-dialog"
import { RiskInvestigationDialog, RiskDetailsDialog } from "@/components/risk-investigation-dialogs"
import {
  Building2,
  FileText,
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  UserPlus,
} from "lucide-react"
import { getStoredOrganizations, type Organization } from "@/lib/organization-storage"
import { DEMO_SURVEYS } from "@/lib/demo-data"
import { useLanguage } from "@/hooks/use-language"

export function SuperAdminDashboard() {
  const { t } = useLanguage()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [showAddOrg, setShowAddOrg] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showOrgDetails, setShowOrgDetails] = useState(false)
  const [showLocationViewer, setShowLocationViewer] = useState(false)
  const [selectedSurveyForLocation, setSelectedSurveyForLocation] = useState<{
    id: string
    title: string
  } | null>(null)
  const [showResponsesViewer, setShowResponsesViewer] = useState(false)
  const [selectedSurveyForResponses, setSelectedSurveyForResponses] = useState<{
    id: string
    title: string
  } | null>(null)
  const [showConductorManagement, setShowConductorManagement] = useState(false)
  const [showRiskInvestigation, setShowRiskInvestigation] = useState(false)
  const [showRiskDetails, setShowRiskDetails] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<any>(null)

  useEffect(() => {
    const orgs = getStoredOrganizations()
    setOrganizations(orgs)
  }, [])

  const DEMO_STATS = {
    totalOrganizations: organizations.length,
    totalSurveys: 15,
    activeSurveys: 8,
    totalConductors: 12,
    totalResponses: 1247,
    flaggedRisks: 3,
    coveragePercentage: 78,
    avgResponseTime: "4.2 min",
  }

  const handleAddOrganization = (org: Organization) => {
    setOrganizations((prev) => [...prev, org])
  }

  const handleViewDetails = (org: Organization) => {
    setSelectedOrg(org)
    setShowOrgDetails(true)
  }

  const handleUpdateOrganization = (updatedOrg: Organization) => {
    setOrganizations((prev) => prev.map((org) => (org.id === updatedOrg.id ? updatedOrg : org)))
  }

  const handleViewLocations = (surveyId: string, surveyTitle: string) => {
    setSelectedSurveyForLocation({ id: surveyId, title: surveyTitle })
    setShowLocationViewer(true)
  }

  const handleViewResponses = (surveyId: string, surveyTitle: string) => {
    setSelectedSurveyForResponses({ id: surveyId, title: surveyTitle })
    setShowResponsesViewer(true)
  }

  const handleInvestigateRisk = (risk: any) => {
    setSelectedRisk(risk)
    setShowRiskInvestigation(true)
  }

  const handleViewRiskDetails = (risk: any) => {
    setSelectedRisk(risk)
    setShowRiskDetails(true)
  }

  const handleMarkRiskResolved = (risk: any) => {
    // Handle marking risk as resolved
    console.log("Marking risk as resolved:", risk)
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
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("organizations")}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_STATS.totalOrganizations}</div>
            <p className="text-xs text-muted-foreground">{t("activeOrganizations")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalSurveys")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_STATS.totalSurveys}</div>
            <p className="text-xs text-muted-foreground">
              {DEMO_STATS.activeSurveys} {t("activeSurveys")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("conductors")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_STATS.totalConductors}</div>
            <p className="text-xs text-muted-foreground">{t("acrossOrganizations")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("riskMonitoring")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{DEMO_STATS.flaggedRisks}</div>
            <p className="text-xs text-muted-foreground">{t("requireAttention")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("viewAnalytics")}</TabsTrigger>
          <TabsTrigger value="organizations">{t("organizations")}</TabsTrigger>
          <TabsTrigger value="surveys">{t("surveys")}</TabsTrigger>
          <TabsTrigger value="risks">{t("riskMonitoring")}</TabsTrigger>
          <TabsTrigger value="map">{t("riskMap")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("viewAnalytics")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("totalResponses")}</span>
                  <span className="font-bold">{DEMO_STATS.totalResponses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("coveragePercentage")}</span>
                  <span className="font-bold text-green-600">{DEMO_STATS.coveragePercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("avgResponseTime")}</span>
                  <span className="font-bold">{DEMO_STATS.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{t("activeSurveys")}</span>
                  <span className="font-bold">{DEMO_STATS.activeSurveys}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t("recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">{t("createSurvey")}</div>
                  <div className="text-muted-foreground">Health & Education Initiative - 2 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{t("riskAlertTriggered")}</div>
                  <div className="text-muted-foreground">Duplicate responses detected - 4 hours ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{t("surveyCompleted")}</div>
                  <div className="text-muted-foreground">Water Access Assessment - 1 day ago</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{t("newConductorAssigned")}</div>
                  <div className="text-muted-foreground">Rural Development Foundation - 2 days ago</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SurveyProgressChart />
            <ResponseRateChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrganizationDistributionChart />
            <RiskTrendChart />
          </div>
          <ConductorPerformanceChart />
        </TabsContent>
        <TabsContent value="organizations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {t("organizations")} ({organizations.length})
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowConductorManagement(true)}>
                <Users className="h-4 w-4 mr-2" />
                {t("manageConductors")}
              </Button>
              <Button onClick={() => setShowAddOrg(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                {t("addOrganization")}
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {organizations.map((org) => (
              <Card key={org.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription>{org.description}</CardDescription>
                    </div>
                    <Badge variant={org.status === "active" ? "default" : "secondary"}>{org.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{t("created")}</span> {org.createdAt}
                    </div>
                    <div>
                      <span className="font-medium">{t("surveys")}</span> {org.totalSurveys}
                    </div>
                    <div>
                      <span className="font-medium">{t("users")}</span> {org.adminUsers.length + org.conductors.length}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(org)}>
                      <Eye className="h-4 w-4 mr-1" />
                      {t("viewDetails")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(org)}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      {t("manageUsers")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="surveys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("surveys")}</h3>
          </div>

          <div className="grid gap-4">
            {DEMO_SURVEYS.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <CardDescription>
                        {survey.organizationName} • {t("assignedTo")} {survey.conductorName}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(survey.status)}>{survey.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{t("assigned")}</span> {survey.assignedDate}
                    </div>
                    <div>
                      <span className="font-medium">{t("progress")}</span> {survey.responsesCollected}/
                      {survey.targetResponses}
                    </div>
                    <div>
                      <span className="font-medium">{t("completion")}</span>{" "}
                      {Math.round((survey.responsesCollected / survey.targetResponses) * 100)}%
                    </div>
                    <div className="flex items-center gap-1">
                      {survey.status === "completed" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-medium capitalize">{survey.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleViewResponses(survey.id, survey.title)}>
                      <Eye className="h-4 w-4 mr-1" />
                      {t("viewResponses")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleViewLocations(survey.id, survey.title)}>
                      <MapPin className="h-4 w-4 mr-1" />
                      {t("viewLocations")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="risks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t("riskMonitoring")}</h3>
            <Badge variant="destructive">
              {DEMO_STATS.flaggedRisks} {t("activeAlerts")}
            </Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t("automatedRiskDetection")}</AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {DEMO_STATS.flaggedRisks > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 mt-0.5 text-red-500" />
                      <div>
                        <CardTitle className="text-base">{t("multipleResponsesDetected")}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Rural Area A
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            2024-03-12 14:30
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="destructive">{t("highPriority")}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleInvestigateRisk({ id: 1, type: "duplicate_device" })}>
                      {t("investigate")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleMarkRiskResolved({ id: 1 })}>
                      {t("markResolved")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewRiskDetails({ id: 1, type: "duplicate_device" })}
                    >
                      {t("viewDetails")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="map" className="space-y-4">
          <RiskMap />
        </TabsContent>
      </Tabs>

      <AddOrganizationDialog open={showAddOrg} onOpenChange={setShowAddOrg} onSuccess={handleAddOrganization} />

      <OrganizationDetailsDialog
        organization={selectedOrg}
        open={showOrgDetails}
        onOpenChange={setShowOrgDetails}
        onUpdate={handleUpdateOrganization}
      />

      {selectedSurveyForLocation && (
        <LocationViewer
          surveyId={selectedSurveyForLocation.id}
          surveyTitle={selectedSurveyForLocation.title}
          open={showLocationViewer}
          onOpenChange={setShowLocationViewer}
        />
      )}

      {selectedSurveyForResponses && (
        <SurveyResponsesViewer
          surveyId={selectedSurveyForResponses.id}
          surveyTitle={selectedSurveyForResponses.title}
          open={showResponsesViewer}
          onOpenChange={setShowResponsesViewer}
        />
      )}

      <ConductorManagementDialog open={showConductorManagement} onOpenChange={setShowConductorManagement} />

      {selectedRisk && (
        <>
          <RiskInvestigationDialog
            risk={selectedRisk}
            open={showRiskInvestigation}
            onOpenChange={setShowRiskInvestigation}
          />
          <RiskDetailsDialog risk={selectedRisk} open={showRiskDetails} onOpenChange={setShowRiskDetails} />
        </>
      )}
    </div>
  )
}
