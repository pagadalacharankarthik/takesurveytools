"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Eye, Share2 } from "lucide-react"
import { EnhancedSharingDialog } from "@/components/enhanced-sharing-dialog"
import { useState } from "react"

interface SurveyPreviewDialogProps {
  survey: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SurveyPreviewDialog({ survey, open, onOpenChange }: SurveyPreviewDialogProps) {
  const [showSharingDialog, setShowSharingDialog] = useState(false)

  if (!survey) return null

  const handleShare = () => {
    setShowSharingDialog(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Survey Preview: {survey.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={survey.status === "published" ? "default" : "secondary"}>{survey.status}</Badge>
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Survey Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Survey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Created:</span> {survey.createdAt}
                  </div>
                  <div>
                    <span className="font-medium">Keywords:</span> {survey.keywords?.join(", ") || "None"}
                  </div>
                  <div>
                    <span className="font-medium">Questions:</span> {survey.questions?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Time:</span>{" "}
                    {Math.ceil((survey.questions?.length || 0) * 0.5)} min
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions ({survey.questions?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {survey.questions?.map((question: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Badge variant="outline">{question.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{question.text}</p>

                        {question.options && question.options.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium">Options:</p>
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="text-xs text-muted-foreground ml-4">
                                • {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )) || <div className="text-center text-muted-foreground py-8">No questions available</div>}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <EnhancedSharingDialog survey={survey} open={showSharingDialog} onOpenChange={setShowSharingDialog} />
    </>
  )
}
