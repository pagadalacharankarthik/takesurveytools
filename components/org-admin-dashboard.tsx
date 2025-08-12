"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, FileText, Users, BarChart3, Upload, Eye, Edit3, Trash2, UserPlus } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { QuestionEditor } from "@/components/question-editor"
import { SurveyEditor } from "@/components/survey-editor"
import { SurveyPreviewDialog } from "@/components/survey-preview-dialog"
import { SurveyResponsesViewer } from "@/components/survey-responses-viewer"
import { ContactConductorDialog } from "@/components/contact-conductor-dialog"
import { ConductorManagementDialog } from "@/components/conductor-management-dialog"
import { SurveyProgressChart, ResponseRateChart, OrganizationDistributionChart } from "@/components/analytics-charts"
import { DEMO_SURVEYS, type Survey, type Question } from "@/lib/demo-data"
import type { AIExtractionResult } from "@/lib/ai-simulation"
import type { ParsedContent } from "@/lib/file-parser"
import { useAuth } from "@/hooks/use-auth"
import { getStoredSurveys, saveSurvey, deleteSurvey } from "@/lib/survey-storage"

// Demo conductors for assignment
const DEMO_CONDUCTORS = [
  { id: "conductor1", name: "Survey Conductor", email: "conductor@demo.com", status: "available" },
  { id: "conductor2", name: "Field Researcher", email: "researcher@demo.com", status: "busy" },
  { id: "conductor3", name: "Data Collector", email: "collector@demo.com", status: "available" },
]

// Demo survey progress data
const DEMO_SURVEY_PROGRESS = [
  {
    surveyId: "survey1",
    conductorName: "Survey Conductor",
    assignedDate: "2024-03-10",
    status: "active",
    responsesCollected: 45,
    targetResponses: 100,
    lastActivity: "2 hours ago",
  },
  {
    surveyId: "survey2",
    conductorName: "Field Researcher",
    assignedDate: "2024-03-08",
    status: "completed",
    responsesCollected: 78,
    targetResponses: 75,
    lastActivity: "1 day ago",
  },
]

export function OrgAdminDashboard() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showSurveyEditor, setShowSurveyEditor] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null)
  const [editingSurvey, setEditingSurvey] = useState<any>(null)
  const [surveys, setSurveys] = useState<any[]>([])
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showResponsesViewer, setShowResponsesViewer] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showConductorManagement, setShowConductorManagement] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedConductor, setSelectedConductor] = useState<any>(null)
  const [aiExtractionResult, setAiExtractionResult] = useState<any>(null)
  const [showQuestionEditor, setShowQuestionEditor] = useState(false)

  useEffect(() => {
    // Load surveys from storage and demo data
    const storedSurveys = getStoredSurveys()
    const demoSurveys = DEMO_SURVEYS.filter((s) => s.organizationId === user?.organizationId)
    const allSurveys = [...demoSurveys, ...storedSurveys.filter((s) => s.organizationId === user?.organizationId)]
    setSurveys(allSurveys)
  }, [user?.organizationId])

  // Get organization surveys
  const orgSurveys = surveys
  const activeSurveys = orgSurveys.filter((s) => s.status === "active")
  const draftSurveys = orgSurveys.filter((s) => s.status === "draft")

  const handleFileExtractionComplete = (result: AIExtractionResult & { parsedContent: ParsedContent }) => {
    setAiExtractionResult(result)
    setShowUploadDialog(false)
    setShowQuestionEditor(true)
  }

  const handleSaveSurvey = (questions: Question[], title: string) => {
    if (!aiExtractionResult) return

    const newSurvey: Survey = {
      id: `survey_${Date.now()}`,
      title,
      organizationId: user?.organizationId || "",
      questions,
      createdAt: new Date().toISOString().split("T")[0],
      status: "draft",
      uploadedFileName: aiExtractionResult.parsedContent.fileName,
      extractedKeywords: aiExtractionResult.keywords,
    }

    saveSurvey(newSurvey)
    setSurveys((prev) => [...prev, newSurvey])
    setShowQuestionEditor(false)
    setAiExtractionResult(null)
  }

  const handleCreateSurvey = () => {
    setEditingSurvey(null)
    setShowSurveyEditor(true)
  }

  const handleEditSurvey = (survey: any) => {
    setEditingSurvey(survey)
    setShowSurveyEditor(true)
  }

  const handleSurveyEditorSave = (survey: any) => {
    saveSurvey(survey)

    if (editingSurvey) {
      // Update existing survey
      setSurveys((prev) => prev.map((s) => (s.id === survey.id ? survey : s)))
    } else {
      // Add new survey
      setSurveys((prev) => [...prev, survey])
    }

    setShowSurveyEditor(false)
    setEditingSurvey(null)
  }

  const handleDeleteSurvey = (surveyId: string) => {
    if (confirm("Are you sure you want to delete this survey? This action cannot be undone.")) {
      deleteSurvey(surveyId)
      setSurveys((prev) => prev.filter((s) => s.id !== surveyId))
    }
  }

  const handlePublishSurvey = (surveyId: string) => {
    const survey = surveys.find((s) => s.id === surveyId)
    if (survey) {
      const updatedSurvey = { ...survey, status: "active" as const }
      saveSurvey(updatedSurvey)
      setSurveys((prev) => prev.map((s) => (s.id === surveyId ? updatedSurvey : s)))
    }
  }

  const handleAssignSurvey = (surveyId: string, conductorId: string, targetResponses: number) => {
    // In a real app, this would make an API call
    console.log("Assigning survey:", { surveyId, conductorId, targetResponses })
    setShowAssignDialog(false)
    setSelectedSurvey(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "outline"
    }
  }

  const handlePreviewSurvey = (survey: any) => {
    setSelectedSurvey(survey)
    setShowPreviewDialog(true)
  }

  const handleViewResponses = (survey: any) => {
    setSelectedSurvey(survey)
    setShowResponsesViewer(true)
  }

  const handleContactConductor = (survey: any) => {
    setSelectedSurvey(survey)
    setSelectedConductor({
      name: survey.conductorName || "John Doe",
      email: `${(survey.conductorName || "john.doe").toLowerCase().replace(" ", ".")}@example.com`,
      status: "active",
    })
    setShowContactDialog(true)
  }

  const handleManageConductors = () => {
    setShowConductorManagement(true)
  }

  const handleViewAnalytics = () => {
    setShowAnalytics(true)
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Surveys</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgSurveys.length}</div>
            <p className="text-xs text-muted-foreground">{activeSurveys.length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Surveys</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftSurveys.length}</div>
            <p className="text-xs text-muted-foreground">Ready to assign</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conductors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{DEMO_CONDUCTORS.length}</div>
            <p className="text-xs text-muted-foreground">
              {DEMO_CONDUCTORS.filter((c) => c.status === "available").length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="surveys">My Surveys</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Survey Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Upload Survey Document</DialogTitle>
                    <DialogDescription>
                      Upload a PDF, DOCX, or TXT file to extract survey questions using AI
                    </DialogDescription>
                  </DialogHeader>
                  <FileUpload onExtractionComplete={handleFileExtractionComplete} />
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleManageConductors}>
                <Users className="h-4 w-4 mr-2" />
                Manage Conductors
              </Button>

              <Button variant="outline" onClick={handleViewAnalytics}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Survey "Water Access Assessment" completed</div>
                <div className="text-muted-foreground">78 responses collected - 2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New survey document uploaded</div>
                <div className="text-muted-foreground">health_survey_template.docx - 1 day ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Survey assigned to conductor</div>
                <div className="text-muted-foreground">Community Health Survey - 2 days ago</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surveys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Surveys ({orgSurveys.length})</h3>
            <div className="flex gap-2">
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Extract
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Survey from Document</DialogTitle>
                    <DialogDescription>Upload a document to extract survey questions using AI</DialogDescription>
                  </DialogHeader>
                  <FileUpload onExtractionComplete={handleFileExtractionComplete} />
                </DialogContent>
              </Dialog>

              <Button onClick={handleCreateSurvey}>
                <Plus className="h-4 w-4 mr-2" />
                Create Survey
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {orgSurveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      <CardDescription>
                        {survey.questions.length} questions • Created {survey.createdAt}
                        {survey.uploadedFileName && (
                          <>
                            <br />
                            Source: {survey.uploadedFileName}
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(survey.status)}>{survey.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {survey.extractedKeywords && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {survey.extractedKeywords.slice(0, 5).map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="outline" onClick={() => handlePreviewSurvey(survey)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditSurvey(survey)}>
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit Survey
                    </Button>
                    {survey.status === "draft" && (
                      <>
                        <Button size="sm" onClick={() => handlePublishSurvey(survey.id)}>
                          Publish
                        </Button>
                        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedSurvey(survey)}>
                              <UserPlus className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Survey to Conductor</DialogTitle>
                              <DialogDescription>
                                Select a conductor and set target responses for "{survey.title}"
                              </DialogDescription>
                            </DialogHeader>
                            {/* Assignment form would go here */}
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSurvey(survey.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Survey Progress Tracking</h3>
          </div>

          <div className="grid gap-4">
            {DEMO_SURVEY_PROGRESS.map((progress) => {
              const survey = orgSurveys.find((s) => s.id === progress.surveyId)
              if (!survey) return null

              const completionPercentage = Math.round((progress.responsesCollected / progress.targetResponses) * 100)

              return (
                <Card key={progress.surveyId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{survey.title}</CardTitle>
                        <CardDescription>
                          Assigned to {progress.conductorName} • {progress.assignedDate}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(progress.status)}>{progress.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Progress:</span> {progress.responsesCollected}/
                        {progress.targetResponses}
                      </div>
                      <div>
                        <span className="font-medium">Completion:</span> {completionPercentage}%
                      </div>
                      <div>
                        <span className="font-medium">Last Activity:</span> {progress.lastActivity}
                      </div>
                      <div className="flex items-center gap-1">
                        {progress.status === "completed" ? (
                          <div className="h-4 w-4 text-green-500">✓</div>
                        ) : progress.status === "active" ? (
                          <div className="h-4 w-4 text-blue-500">🕒</div>
                        ) : (
                          <div className="h-4 w-4 text-yellow-500">⚠️</div>
                        )}
                        <span className="font-medium capitalize">{progress.status}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewResponses(survey)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Responses
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleContactConductor(survey)}>
                        Contact Conductor
                      </Button>
                    </div>
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
            <DialogTitle>{editingSurvey ? "Edit Survey" : "Create New Survey"}</DialogTitle>
            <DialogDescription>
              {editingSurvey ? "Modify your existing survey" : "Create a new survey from scratch"}
            </DialogDescription>
          </DialogHeader>
          <SurveyEditor
            survey={editingSurvey || undefined}
            onSave={handleSurveyEditorSave}
            onCancel={() => {
              setShowSurveyEditor(false)
              setEditingSurvey(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Question Editor Dialog */}
      <Dialog open={showQuestionEditor} onOpenChange={setShowQuestionEditor}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review & Edit Survey Questions</DialogTitle>
            <DialogDescription>Review the AI-suggested questions and customize them for your survey</DialogDescription>
          </DialogHeader>
          {aiExtractionResult && <QuestionEditor aiResult={aiExtractionResult} onSave={handleSaveSurvey} />}
        </DialogContent>
      </Dialog>

      <SurveyPreviewDialog survey={selectedSurvey} open={showPreviewDialog} onOpenChange={setShowPreviewDialog} />

      {selectedSurvey && (
        <SurveyResponsesViewer
          surveyId={selectedSurvey.id}
          surveyTitle={selectedSurvey.title}
          open={showResponsesViewer}
          onOpenChange={setShowResponsesViewer}
        />
      )}

      {selectedConductor && selectedSurvey && (
        <ContactConductorDialog
          conductor={selectedConductor}
          survey={selectedSurvey}
          open={showContactDialog}
          onOpenChange={setShowContactDialog}
        />
      )}

      <ConductorManagementDialog open={showConductorManagement} onOpenChange={setShowConductorManagement} />

      {/* Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Organization Analytics
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SurveyProgressChart />
              <ResponseRateChart />
            </div>
            <OrganizationDistributionChart />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
