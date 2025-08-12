"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, QrCode, Mail, MessageSquare, Facebook, Twitter, Linkedin, Check } from "lucide-react"

interface EnhancedSharingDialogProps {
  survey: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnhancedSharingDialog({ survey, open, onOpenChange }: EnhancedSharingDialogProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false)

  if (!survey) return null

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/survey/${survey.id}`
  const surveyTitle = encodeURIComponent(survey.title)
  const shareText = encodeURIComponent(`Please take this survey: ${survey.title}`)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link")
    }
  }

  const generateQRCode = () => {
    // Generate QR code using a simple canvas-based approach
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      canvas.width = 200
      canvas.height = 200

      // Simple QR code placeholder (in a real app, use a QR code library)
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("QR Code", 100, 100)
      ctx.fillText("Scan to access", 100, 120)
      ctx.fillText("survey", 100, 140)

      const qrContainer = document.getElementById("qr-code-container")
      if (qrContainer) {
        qrContainer.innerHTML = ""
        qrContainer.appendChild(canvas)
      }
    }
    setQrCodeGenerated(true)
  }

  const socialShares = [
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${surveyTitle}&body=${shareText}%0A%0A${shareUrl}`,
      color: "bg-gray-600 hover:bg-gray-700",
    },
    {
      name: "WhatsApp",
      icon: MessageSquare,
      url: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      color: "bg-blue-700 hover:bg-blue-800",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Survey: {survey.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Survey Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="share-url">Public Survey URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="share-url" value={shareUrl} readOnly className="font-mono text-sm" />
                    <Button onClick={handleCopyLink} variant="outline">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Survey Status:</span>
                    <Badge variant={survey.status === "published" ? "default" : "secondary"} className="ml-2">
                      {survey.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Questions:</span> {survey.questions?.length || 0}
                  </div>
                  <div>
                    <span className="font-medium">Est. Time:</span> ~{Math.ceil((survey.questions?.length || 0) * 0.5)}{" "}
                    min
                  </div>
                  <div>
                    <span className="font-medium">Response Type:</span> Anonymous
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div
                    id="qr-code-container"
                    className="inline-block border-2 border-dashed border-gray-300 p-4 rounded-lg"
                  >
                    {!qrCodeGenerated ? (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to generate QR code</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={generateQRCode} disabled={qrCodeGenerated}>
                    <QrCode className="h-4 w-4 mr-2" />
                    {qrCodeGenerated ? "QR Code Generated" : "Generate QR Code"}
                  </Button>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Participants can scan this QR code with their phone camera to access the survey directly.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share on Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialShares.map((platform) => (
                    <Button
                      key={platform.name}
                      variant="outline"
                      className={`${platform.color} text-white border-0 justify-start`}
                      onClick={() => window.open(platform.url, "_blank")}
                    >
                      <platform.icon className="h-4 w-4 mr-2" />
                      Share on {platform.name}
                    </Button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Share Message Preview:</strong>
                    <br />
                    Please take this survey: {survey.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
