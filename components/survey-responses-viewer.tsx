"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Clock, User, FileText, Download } from "lucide-react"
import { getSurveyResponses } from "@/lib/survey-responses"

interface SurveyResponsesViewerProps {
  surveyId: string
  surveyTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyResponsesViewer({ surveyId, surveyTitle, open, onOpenChange }: SurveyResponsesViewerProps) {
  const [selectedTab, setSelectedTab] = useState("responses")
  const responses = getSurveyResponses(surveyId)

  const exportResponses = () => {
    const csvContent = responses
      .map(
        (response) =>
          `${response.id},${response.conductorName},${response.location.address},${response.submittedAt},${response.responses.length}`,
      )
      .join("\n")

    const blob = new Blob([`ID,Conductor,Location,Submitted,Questions Answered\n${csvContent}`], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${surveyTitle.replace(/\s+/g, "_")}_responses.csv`
    a.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Survey Responses: {surveyTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="responses">Responses ({responses.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <Button onClick={exportResponses} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
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
                              <User className="h-3 w-3" />
                              {response.conductorName}
                            </span>
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
                        <Badge variant="outline">{response.responses.length} answers</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {response.responses.slice(0, 3).map((answer, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">Q{index + 1}:</span> {answer.answer}
                          </div>
                        ))}
                        {response.responses.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{response.responses.length - 3} more answers
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
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
                    {Math.round(responses.reduce((acc, r) => acc + r.responses.length, 0) / responses.length)}
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Questions Answered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{new Set(responses.map((r) => r.conductorName)).size}</div>
                  <div className="text-xs text-muted-foreground">Unique Conductors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{new Set(responses.map((r) => r.location.address)).size}</div>
                  <div className="text-xs text-muted-foreground">Unique Locations</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
