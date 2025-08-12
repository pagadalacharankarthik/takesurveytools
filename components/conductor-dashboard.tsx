"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Play, CheckCircle, MapPin, Wifi, WifiOff, Upload, Eye, BarChart3, Edit3 } from "lucide-react"
import { SurveyForm } from "@/components/survey-form"
import { SurveyEditor } from "@/components/survey-editor"
import { SurveyPreviewDialog } from "@/components/survey-preview-dialog"
import { ConductorResponseViewer } from "@/components/conductor-response-viewer"
import { DEMO_SURVEYS, type Survey } from "@/lib/demo-data"
import { getResponsesBySurvey, getPendingResponsesCount, markResponsesSynced } from "@/lib/survey-responses"
import { getStoredSurveys, saveSurvey } from "@/lib/survey-storage"
import { useAuth } from "@/hooks/use-auth"

// Demo assigned surveys for the conductor
const DEMO_ASSIGNED_SURVEYS = [
  {
    surveyId: "survey1",
    assignedDate: "2024-03-10",
    targetResponses: 100,
    priority: "high",
    deadline: "2024-03-20",
    location: "Rural Area A",
  },
  {
    surveyId: "survey2",
    assignedDate: "2024-03-08",
    targetResponses: 75,
    priority: "medium",
    deadline: "2024-03-25",
    location: "Community Center B",
  },
]

export function ConductorDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState("assigned")
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  const [showSurveyForm, setShowSurveyForm] = useState(false)
  const [showSurveyEditor, setShowSurveyEditor] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [allSurveys, setAllSurveys] = useState<Survey[]>([])
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showResponseViewer, setShowResponseViewer] = useState(false)
  const [selectedSurveyForResponses, setSelectedSurveyForResponses] = useState<{
    id: string
    title: string
  } | null>(null)

  useEffect(() => {
    setPendingCount(getPendingResponsesCount())

    // Load all surveys (demo + stored)
    const storedSurveys = getStoredSurveys()
    const combinedSurveys = [...DEMO_SURVEYS, ...storedSurveys]
    setAllSurveys(combinedSurveys)

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const assignedSurveys = DEMO_ASSIGNED_SURVEYS.map((assignment) => {
    const survey = allSurveys.find((s) => s.id === assignment.surveyId)
    const responses = getResponsesBySurvey(assignment.surveyId)
    return {
      ...assignment,
      survey,
      responsesCollected: responses.length,
      completionPercentage: Math.round((responses.length / assignment.targetResponses) * 100),
    }
  }).filter((item) => item.survey)

  const handleStartSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setShowSurveyForm(true)
  }

  const handleSurveyComplete = () => {
    setShowSurveyForm(false)
    setSelectedSurvey(null)
    setPendingCount(getPendingResponsesCount())
  }

  const handleEditSurvey = (survey: Survey) => {
    setEditingSurvey(survey)
    setShowSurveyEditor(true)
  }

  const handleSurveyEditorSave = (survey: Survey) => {
    saveSurvey(survey)

    // Update local state
    setAllSurveys((prev) => prev.map((s) => (s.id === survey.id ? survey : s)))
    setShowSurveyEditor(false)
    setEditingSurvey(null)
  }

  const handlePreviewSurvey = (survey: Survey) => {
    setSelectedSurvey(survey)
    setShowPreviewDialog(true)
  }

  const handleViewResponses = (surveyId: string, surveyTitle: string) => {
    setSelectedSurveyForResponses({ id: surveyId, title: surveyTitle })
    setShowResponseViewer(true)
  }

  const handleSyncData = async () => {
    // Simulate sync process
    const pendingResponses = getPendingResponsesCount()
    if (pendingResponses > 0) {
      // In a real app, this would sync with the server
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark all as synced for demo
      const allResponses = JSON.parse(localStorage.getItem("survey_responses") || "[]")
      const pendingIds = allResponses.filter((r: any) => r.syncStatus === "pending").map((r: any) => r.id)

      markResponsesSynced(pendingIds)
      setPendingCount(0)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
          </div>
          {pendingCount > 0 && (
            <Badge variant="outline" className="bg-yellow-50">
              {pendingCount} responses pending sync
            </Badge>
          )}
        </div>

        {pendingCount > 0 && isOnline && (
          <Button size="sm" onClick={handleSyncData}>
            <Upload className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        )}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Surveys</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedSurveys.length}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responses Collected</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedSurveys.reduce((sum, survey) => sum + survey.responsesCollected, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignedSurveys.length > 0
                ? Math.round(
                    assignedSurveys.reduce((sum, survey) => sum + survey.completionPercentage, 0) /
                      assignedSurveys.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Average progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Responses to sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Offline Alert */}
      {!isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Responses will be saved locally and synced when connection is restored.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned">Assigned Surveys</TabsTrigger>
          <TabsTrigger value="responses">My Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Assigned Surveys</h3>
          </div>

          <div className="grid gap-4">
            {assignedSurveys.map((assignment) => (
              <Card key={assignment.surveyId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assignment.survey?.title}</CardTitle>
                      <CardDescription>
                        {assignment.survey?.questions.length} questions • Assigned {assignment.assignedDate}
                        <br />
                        <span className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {assignment.location}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant={getPriorityColor(assignment.priority)}>{assignment.priority} priority</Badge>
                      <Badge variant="outline">Due: {assignment.deadline}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>
                          Progress: {assignment.responsesCollected}/{assignment.targetResponses}
                        </span>
                        <span>{assignment.completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(assignment.completionPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Keywords */}
                    {assignment.survey?.extractedKeywords && (
                      <div>
                        <span className="text-sm font-medium">Keywords: </span>
                        {assignment.survey.extractedKeywords.slice(0, 4).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs mr-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Dialog open={showSurveyForm} onOpenChange={setShowSurveyForm}>
                        <DialogTrigger asChild>
                          <Button onClick={() => handleStartSurvey(assignment.survey!)}>
                            <Play className="h-4 w-4 mr-2" />
                            Start Survey
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Conduct Survey: {selectedSurvey?.title}</DialogTitle>
                            <DialogDescription>Fill out this survey form with participant responses</DialogDescription>
                          </DialogHeader>
                          {selectedSurvey && (
                            <SurveyForm
                              survey={selectedSurvey}
                              conductorId={user?.id || ""}
                              onComplete={handleSurveyComplete}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="outline" size="sm" onClick={() => handlePreviewSurvey(assignment.survey!)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview Questions
                      </Button>

                      <Button variant="outline" size="sm" onClick={() => handleEditSurvey(assignment.survey!)}>
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit Survey
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Response History</h3>
          </div>

          <div className="grid gap-4">
            {assignedSurveys.map((assignment) => {
              const responses = getResponsesBySurvey(assignment.surveyId)

              return (
                <Card key={assignment.surveyId}>
                  <CardHeader>
                    <CardTitle className="text-lg">{assignment.survey?.title}</CardTitle>
                    <CardDescription>
                      {responses.length} responses collected • Last response:{" "}
                      {responses.length > 0
                        ? new Date(responses[responses.length - 1].submittedAt).toLocaleDateString()
                        : "None"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Responses:</span> {responses.length}
                      </div>
                      <div>
                        <span className="font-medium">Synced:</span>{" "}
                        {responses.filter((r) => r.syncStatus === "synced").length}
                      </div>
                      <div>
                        <span className="font-medium">Pending:</span>{" "}
                        {responses.filter((r) => r.syncStatus === "pending").length}
                      </div>
                    </div>

                    {responses.length > 0 && (
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewResponses(assignment.surveyId, assignment.survey?.title || "")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View All Responses
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Survey Editor Dialog */}
      <Dialog open={showSurveyEditor} onOpenChange={setShowSurveyEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Survey</DialogTitle>
            <DialogDescription>Modify survey questions and settings</DialogDescription>
          </DialogHeader>
          {editingSurvey && (
            <SurveyEditor
              survey={editingSurvey}
              onSave={handleSurveyEditorSave}
              onCancel={() => {
                setShowSurveyEditor(false)
                setEditingSurvey(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <SurveyPreviewDialog survey={selectedSurvey} open={showPreviewDialog} onOpenChange={setShowPreviewDialog} />

      {selectedSurveyForResponses && (
        <ConductorResponseViewer
          surveyId={selectedSurveyForResponses.id}
          surveyTitle={selectedSurveyForResponses.title}
          open={showResponseViewer}
          onOpenChange={setShowResponseViewer}
        />
      )}
    </div>
  )
}
