"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Clock, User, FileText, Download, AlertCircle, Eye } from "lucide-react"
import { getSurveyResponses, type SurveyResponse } from "@/lib/survey-responses"

interface SurveyResponsesViewerProps {
  surveyId: string
  surveyTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyResponsesViewer({ surveyId, surveyTitle, open, onOpenChange }: SurveyResponsesViewerProps) {
  const [selectedTab, setSelectedTab] = useState("responses")
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && surveyId) {
      setLoading(true)
      try {
        const surveyResponses = getSurveyResponses(surveyId)
        setResponses(surveyResponses)
      } catch (error) {
        console.error("Error loading survey responses:", error)
        setResponses([])
      } finally {
        setLoading(false)
      }
    }
  }, [open, surveyId])

  const exportResponses = () => {
    if (responses.length === 0) {
      alert("No responses to export")
      return
    }

    try {
      const csvContent = responses
        .map((response) => {
          const location = response.location?.address || "Unknown"
          const conductor = response.conductorName || "Unknown"
          const submittedDate = new Date(response.submittedAt).toLocaleDateString()
          const answersCount = Array.isArray(response.responses) ? response.responses.length : 0

          return `"${response.id}","${conductor}","${location}","${submittedDate}","${answersCount}"`
        })
        .join("\n")

      const blob = new Blob([`ID,Conductor,Location,Submitted,Questions Answered\n${csvContent}`], {
        type: "text/csv;charset=utf-8;",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${surveyTitle.replace(/\s+/g, "_")}_responses.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting responses:", error)
      alert("Failed to export responses")
    }
  }

  const handleViewDetails = (response: SurveyResponse) => {
    setSelectedResponse(response)
    setShowDetailDialog(true)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  const getResponsesArray = (responses: SurveyResponse["responses"]) => {
    if (Array.isArray(responses)) {
      return responses
    }

    // Convert object format to array format
    return Object.entries(responses as any).map(([question, answer]) => ({
      question,
      answer: Array.isArray(answer) ? answer.join(", ") : String(answer),
    }))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Survey Responses: {surveyTitle}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading responses...</span>
            </div>
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="responses">Responses ({responses.length})</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                {responses.length > 0 && (
                  <Button onClick={exportResponses} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                )}
              </div>

              <TabsContent value="responses" className="space-y-4">
                {responses.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No responses found for this survey. Responses will appear here once survey conductors start
                      collecting data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {responses.map((response) => {
                        const responsesArray = getResponsesArray(response.responses)

                        return (
                          <Card key={response.id}>
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-sm font-medium">
                                    Response #{response.id.slice(-8)}
                                  </CardTitle>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {response.conductorName || "Unknown Conductor"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {response.location?.address || "Location not recorded"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(response.submittedAt)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{responsesArray.length} answers</Badge>
                                  <Badge variant={response.syncStatus === "synced" ? "default" : "secondary"}>
                                    {response.syncStatus}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2">
                                {responsesArray.slice(0, 3).map((answer, index) => (
                                  <div key={index} className="text-sm">
                                    <span className="font-medium">Q{index + 1}:</span> {answer.question}
                                    <div className="text-muted-foreground ml-4">A: {answer.answer}</div>
                                  </div>
                                ))}
                                {responsesArray.length > 3 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{responsesArray.length - 3} more answers
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button size="sm" variant="outline" onClick={() => handleViewDetails(response)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Full Response
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                {responses.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Analytics will be available once responses are collected.</AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">{responses.length}</div>
                        <div className="text-xs text-muted-foreground">Total Responses</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {responses.length > 0
                            ? Math.round(
                                responses.reduce((acc, r) => {
                                  const responsesArray = getResponsesArray(r.responses)
                                  return acc + responsesArray.length
                                }, 0) / responses.length,
                              )
                            : 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Questions Answered</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {new Set(responses.map((r) => r.conductorName || "Unknown")).size}
                        </div>
                        <div className="text-xs text-muted-foreground">Unique Conductors</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                          {new Set(responses.map((r) => r.location?.address || "Unknown")).size}
                        </div>
                        <div className="text-xs text-muted-foreground">Unique Locations</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Full Response Details</DialogTitle>
          </DialogHeader>
          {selectedResponse && (
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {/* Response Metadata */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Response Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <strong>ID:</strong> {selectedResponse.id}
                    </div>
                    <div>
                      <strong>Conductor:</strong> {selectedResponse.conductorName || "Unknown"}
                    </div>
                    <div>
                      <strong>Submitted:</strong> {formatDate(selectedResponse.submittedAt)}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedResponse.syncStatus}
                    </div>
                    {selectedResponse.location && (
                      <div>
                        <strong>Location:</strong> {selectedResponse.location.address || "Unknown"}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* All Responses */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Survey Answers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getResponsesArray(selectedResponse.responses).map((answer, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-3">
                        <div className="font-medium text-sm">
                          Q{index + 1}: {answer.question}
                        </div>
                        <div className="text-muted-foreground mt-1">{answer.answer}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
