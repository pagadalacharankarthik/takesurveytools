"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Phone, Mail, Send } from "lucide-react"

interface ContactConductorDialogProps {
  conductor: {
    name: string
    email: string
    phone?: string
    status: string
  }
  survey: {
    title: string
    status: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactConductorDialog({ conductor, survey, open, onOpenChange }: ContactConductorDialogProps) {
  const [contactMethod, setContactMethod] = useState("email")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    // Handle sending message
    console.log("Sending message:", { contactMethod, subject, message })
    onOpenChange(false)
    // Reset form
    setSubject("")
    setMessage("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Conductor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conductor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conductor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{conductor.name}</div>
                  <div className="text-sm text-muted-foreground">{conductor.email}</div>
                  {conductor.phone && <div className="text-sm text-muted-foreground">{conductor.phone}</div>}
                </div>
                <Badge variant={conductor.status === "active" ? "default" : "secondary"}>{conductor.status}</Badge>
              </div>
              <div className="text-sm">
                <span className="font-medium">Current Survey:</span> {survey.title}
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="contact-method">Contact Method</Label>
              <Select value={contactMethod} onValueChange={setContactMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject..."
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} disabled={!subject || !message}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
