"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, FileText, Download, Eye } from "lucide-react"
import { getResponsesBySurvey } from "@/lib/survey-responses"

interface ConductorResponseViewerProps {
  surveyId: string
  surveyTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConductorResponseViewer({ surveyId, surveyTitle, open, onOpenChange }: ConductorResponseViewerProps) {
  const responses = getResponsesBySurvey(surveyId)

  const exportResponses = () => {
    const csvContent = responses
      .map(
        (response) =>
          `${response.id},${response.conductorName},${response.location.address},${response.submittedAt},${response.responses.length},${response.syncStatus}`,
      )
      .join("\n")

    const blob = new Blob([`ID,Conductor,Location,Submitted,Questions Answered,Sync Status\n${csvContent}`], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${surveyTitle.replace(/\s+/g, "_")}_my_responses.csv`
    a.click()
  }

  const viewResponseDetails = (response: any) => {
    // Create a detailed view of the response
    const detailWindow = window.open("", "_blank", "width=800,height=600")
    if (detailWindow) {
      detailWindow.document.write(`
        <html>
          <head><title>Response Details - ${response.id}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Response Details</h2>
            <p><strong>Response ID:</strong> ${response.id}</p>
            <p><strong>Conductor:</strong> ${response.conductorName}</p>
            <p><strong>Location:</strong> ${response.location.address}</p>
            <p><strong>Submitted:</strong> ${response.submittedAt}</p>
            <p><strong>Sync Status:</strong> ${response.syncStatus}</p>
            <h3>Responses:</h3>
            ${response.responses
              .map(
                (r: any, i: number) => `
              <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                <strong>Question ${i + 1}:</strong> ${r.question}<br>
                <strong>Answer:</strong> ${r.answer}
              </div>
            `,
              )
              .join("")}
          </body>
        </html>
      `)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Responses: {surveyTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="responses">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="responses">Responses ({responses.length})</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            <Button onClick={exportResponses} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
          </div>

          <TabsContent value="responses" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {responses.map((response) => (
                  <Card key={response.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-medium">Response #{response.id}</CardTitle>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {response.location.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {response.submittedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={response.syncStatus === "synced" ? "default" : "secondary"}>
                            {response.syncStatus}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => viewResponseDetails(response)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {response.responses.slice(0, 2).map((answer, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">Q{index + 1}:</span> {answer.answer.substring(0, 50)}
                            {answer.answer.length > 50 && "..."}
                          </div>
                        ))}
                        {response.responses.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{response.responses.length - 2} more answers
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {responses.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No responses collected yet for this survey.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{responses.length}</div>
                  <div className="text-xs text-muted-foreground">Total Responses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{responses.filter((r) => r.syncStatus === "synced").length}</div>
                  <div className="text-xs text-muted-foreground">Synced</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{responses.filter((r) => r.syncStatus === "pending").length}</div>
                  <div className="text-xs text-muted-foreground">Pending Sync</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">
                    {responses.length > 0
                      ? Math.round(responses.reduce((acc, r) => acc + r.responses.length, 0) / responses.length)
                      : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Questions/Response</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collection Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {responses
                    .slice(-5)
                    .reverse()
                    .map((response, index) => (
                      <div key={response.id} className="flex justify-between items-center text-sm">
                        <span>Response #{response.id}</span>
                        <span className="text-muted-foreground">{response.submittedAt}</span>
                      </div>
                    ))}
                  {responses.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">No responses to display</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
