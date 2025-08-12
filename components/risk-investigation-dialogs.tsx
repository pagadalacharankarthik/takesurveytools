"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  User,
  FileText,
  CheckCircle,
  Search,
  Download,
  Flag,
  Shield,
  Mail,
  MessageSquare,
} from "lucide-react"
import type { RiskAlert } from "@/lib/risk-detection"

interface RiskInvestigationDialogProps {
  alert: RiskAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onResolve: (alertId: string, resolution: string, notes: string) => void
  onUpdateStatus: (alertId: string, status: string) => void
}

export function RiskInvestigationDialog({
  alert,
  open,
  onOpenChange,
  onResolve,
  onUpdateStatus,
}: RiskInvestigationDialogProps) {
  const [resolution, setResolution] = useState("")
  const [notes, setNotes] = useState("")
  const [investigationNotes, setInvestigationNotes] = useState("")
  const [showEscalationDialog, setShowEscalationDialog] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [escalationReason, setEscalationReason] = useState("")
  const [escalationNotes, setEscalationNotes] = useState("")
  const [contactMessage, setContactMessage] = useState("")

  if (!alert) return null

  const handleResolve = () => {
    if (resolution && notes) {
      onResolve(alert.id, resolution, notes)
      onOpenChange(false)
      setResolution("")
      setNotes("")
    }
  }

  const handleUpdateStatus = (newStatus: string) => {
    onUpdateStatus(alert.id, newStatus)
    if (newStatus === "investigating") {
      // Save investigation notes if any
      if (investigationNotes) {
        // In a real app, this would save to backend
        console.log("Investigation notes:", investigationNotes)
      }
    }
  }

  const handleExportEvidence = () => {
    const evidenceData = {
      alertId: alert.id,
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      detectedAt: alert.detectedAt,
      affectedResponses: alert.affectedResponses,
      metadata: alert.metadata,
      investigationNotes,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(evidenceData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `risk_evidence_${alert.id}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEscalateToAdmin = () => {
    setShowEscalationDialog(true)
  }

  const handleSubmitEscalation = () => {
    // In a real app, this would send to admin system
    console.log("Escalating to admin:", {
      alertId: alert.id,
      reason: escalationReason,
      notes: escalationNotes,
      escalatedAt: new Date().toISOString(),
    })
    setShowEscalationDialog(false)
    setEscalationReason("")
    setEscalationNotes("")
    // Show success message or update UI
  }

  const handleContactConductor = () => {
    setShowContactDialog(true)
  }

  const handleSendMessage = () => {
    // In a real app, this would send message to conductor
    console.log("Contacting conductor:", {
      alertId: alert.id,
      message: contactMessage,
      sentAt: new Date().toISOString(),
    })
    setShowContactDialog(false)
    setContactMessage("")
    // Show success message
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Investigation: {alert.type.replace("_", " ")}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${getSeverityColor(alert.severity)}`} />
                      Alert Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Message</Label>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Severity</Label>
                        <Badge variant={alert.severity === "high" ? "destructive" : "default"}>{alert.severity}</Badge>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Badge variant="outline">{alert.status}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Detected</Label>
                        <p className="text-muted-foreground">{new Date(alert.detectedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>Affected Responses</Label>
                        <p className="text-muted-foreground">{alert.affectedResponses.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Level</span>
                        <Badge variant={alert.severity === "high" ? "destructive" : "default"}>{alert.severity}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span className="font-medium">
                          {alert.severity === "high" ? "95%" : alert.severity === "medium" ? "78%" : "62%"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Impact Score</span>
                        <span className="font-medium">
                          {alert.affectedResponses.length > 5
                            ? "High"
                            : alert.affectedResponses.length > 2
                              ? "Medium"
                              : "Low"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Affected Survey Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {alert.affectedResponses.map((responseId, index) => (
                        <div key={responseId} className="flex justify-between items-center p-2 border rounded">
                          <span className="text-sm">Response #{responseId}</span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {alert.metadata && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {Object.entries(alert.metadata).map(([key, value]) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace("_", " ")}</Label>
                          <p className="text-muted-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Automated Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Pattern Detection:</strong> This alert was triggered by automated pattern recognition
                      algorithms detecting anomalous behavior in survey responses.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommended Actions:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Review affected survey responses for data quality</li>
                      <li>• Contact survey conductors for verification</li>
                      <li>• Consider implementing additional validation measures</li>
                      <li>• Monitor for similar patterns in future responses</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Investigation Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add your investigation findings and notes here..."
                    value={investigationNotes}
                    onChange={(e) => setInvestigationNotes(e.target.value)}
                    rows={4}
                  />
                  <Button size="sm" className="mt-2" onClick={() => handleUpdateStatus("investigating")}>
                    Save Investigation Notes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleUpdateStatus("investigating")}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Mark as Investigating
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleExportEvidence}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Evidence
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleEscalateToAdmin}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Escalate to Admin
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={handleContactConductor}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Contact Conductor
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Resolution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="resolution-type">Resolution Type</Label>
                      <Select value={resolution} onValueChange={setResolution}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select resolution type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false_positive">False Positive</SelectItem>
                          <SelectItem value="data_corrected">Data Corrected</SelectItem>
                          <SelectItem value="conductor_contacted">Conductor Contacted</SelectItem>
                          <SelectItem value="system_updated">System Updated</SelectItem>
                          <SelectItem value="escalated">Escalated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="resolution-notes">Resolution Notes</Label>
                      <Textarea
                        id="resolution-notes"
                        placeholder="Describe the resolution taken..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
                <Button
                  onClick={handleResolve}
                  disabled={!resolution || !notes}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve Alert
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showEscalationDialog} onOpenChange={setShowEscalationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Escalate to Admin
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="escalation-reason">Escalation Reason</Label>
              <Select value={escalationReason} onValueChange={setEscalationReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_severity">High Severity Issue</SelectItem>
                  <SelectItem value="requires_admin_action">Requires Admin Action</SelectItem>
                  <SelectItem value="policy_violation">Policy Violation</SelectItem>
                  <SelectItem value="technical_issue">Technical Issue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="escalation-notes">Additional Notes</Label>
              <Textarea
                id="escalation-notes"
                placeholder="Provide additional context for the escalation..."
                value={escalationNotes}
                onChange={(e) => setEscalationNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEscalationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitEscalation} disabled={!escalationReason}>
              <Flag className="h-4 w-4 mr-2" />
              Escalate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Contact Conductor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                This message will be sent to the survey conductor associated with the affected responses.
              </AlertDescription>
            </Alert>
            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Enter your message to the conductor..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!contactMessage}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface RiskDetailsDialogProps {
  alert: RiskAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RiskDetailsDialog({ alert, open, onOpenChange }: RiskDetailsDialogProps) {
  if (!alert) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Risk Alert Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{alert.message}</CardTitle>
              <CardDescription>Alert ID: {alert.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <div className="font-medium">{alert.type.replace("_", " ")}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Severity:</span>
                  <div className="font-medium">{alert.severity}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="font-medium">{alert.status}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Detected:</span>
                  <div className="font-medium">{new Date(alert.detectedAt).toLocaleString()}</div>
                </div>
              </div>

              {alert.metadata && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Additional Information:</h4>
                  <div className="bg-muted p-3 rounded-lg space-y-1">
                    {Object.entries(alert.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{key.replace("_", " ")}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Affected Responses:</h4>
                <div className="text-sm">
                  <Badge variant="destructive">{alert.affectedResponses.length}</Badge> survey responses are affected by
                  this risk alert.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
