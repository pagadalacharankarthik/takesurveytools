"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, FileText, Clock, MapPin } from "lucide-react"
import { PublicSurveyForm } from "@/components/public-survey-form"
import { DEMO_SURVEYS } from "@/lib/demo-data"
import { getStoredSurveys } from "@/lib/survey-storage"

interface PublicSurveyPageProps {
  params: {
    id: string
  }
}

export default function PublicSurveyPage({ params }: PublicSurveyPageProps) {
  const [survey, setSurvey] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find survey from demo data or stored surveys
    const allSurveys = [...DEMO_SURVEYS, ...getStoredSurveys()]
    const foundSurvey = allSurveys.find((s) => s.id === params.id)
    setSurvey(foundSurvey)
    setLoading(false)
  }, [params.id])

  const handleSurveyComplete = () => {
    setIsSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Survey Not Found</h2>
            <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => (window.location.href = "/")}>Go to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-4">Your response has been submitted successfully.</p>
            <Button onClick={() => (window.location.href = "/")}>Return to Homepage</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Survey Header */}
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <Badge variant="outline">Public Survey</Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{survey.title}</CardTitle>
              <CardDescription className="text-lg">
                Please take a few minutes to complete this survey. Your responses are valuable to us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{survey.questions?.length || 0} Questions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    ~{Math.ceil((survey.questions?.length || 0) * 0.5)} minutes
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Location will be recorded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Alert className="mb-6">
            <AlertDescription>
              Your responses are anonymous and will be used for research purposes only. Location data helps us
              understand geographic patterns in responses.
            </AlertDescription>
          </Alert>

          {/* Survey Form */}
          <PublicSurveyForm survey={survey} onComplete={handleSurveyComplete} />
        </div>
      </div>
    </div>
  )
}
