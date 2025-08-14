"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Save, Send, User } from "lucide-react"
import type { Survey, Question } from "@/lib/demo-data"
import { saveResponse, generateDeviceId } from "@/lib/survey-responses"

interface SurveyFormProps {
  survey: Survey
  conductorId: string
  onComplete: () => void
}

interface PersonalInfo {
  name: string
  email: string
  mobile: string
  aadhar: string
}

export function SurveyForm({ survey, conductorId, onComplete }: SurveyFormProps) {
  const [responses, setResponses] = useState<{ [questionId: string]: string | string[] }>({})
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    mobile: "",
    aadhar: "",
  })
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Get location if not already obtained
    if (!currentLocation) {
      getLocation()
    }

    // Calculate response time
    const responseTime = Date.now() - startTime

    const responseId = saveResponse({
      surveyId: survey.id,
      conductorId,
      personalInfo, // Add personal information to response
      responses,
      location: currentLocation || undefined,
      deviceInfo: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        deviceId: generateDeviceId(),
      },
    })

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onComplete()
  }

  const renderQuestion = (question: Question, index: number) => {
    const questionId = question.id
    const currentResponse = responses[questionId]

    return (
      <Card key={questionId}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">
                Q{index + 1}. {question.text}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {question.type.replace("_", " ")}
                </Badge>
                {question.domain.map((domain, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {question.type === "text" && (
            <Textarea
              value={(currentResponse as string) || ""}
              onChange={(e) => handleResponseChange(questionId, e.target.value)}
              placeholder="Enter response..."
              className="min-h-[100px]"
            />
          )}

          {question.type === "multiple_choice" && question.options && (
            <RadioGroup
              value={(currentResponse as string) || ""}
              onValueChange={(value) => handleResponseChange(questionId, value)}
            >
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${questionId}-${optionIndex}`} />
                  <Label htmlFor={`${questionId}-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "yes_no" && (
            <RadioGroup
              value={(currentResponse as string) || ""}
              onValueChange={(value) => handleResponseChange(questionId, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`${questionId}-yes`} />
                <Label htmlFor={`${questionId}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`${questionId}-no`} />
                <Label htmlFor={`${questionId}-no`}>No</Label>
              </div>
            </RadioGroup>
          )}

          {question.type === "rating" && (
            <RadioGroup
              value={(currentResponse as string) || ""}
              onValueChange={(value) => handleResponseChange(questionId, value)}
            >
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating.toString()} id={`${questionId}-${rating}`} />
                    <Label htmlFor={`${questionId}-${rating}`}>{rating}</Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    )
  }

  const completedQuestions = Object.keys(responses).filter((key) => {
    const response = responses[key]
    return response && (typeof response === "string" ? response.trim() : response.length > 0)
  }).length

  const progressPercentage = Math.round((completedQuestions / survey.questions.length) * 100)
  const isPersonalInfoComplete = personalInfo.name && personalInfo.email && personalInfo.mobile && personalInfo.aadhar

  return (
    <div className="space-y-6">
      {/* Survey Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{survey.title}</h2>
          <p className="text-muted-foreground">{survey.questions.length} questions</p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>
              Progress: {completedQuestions}/{survey.questions.length}
            </span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Location and Time Info */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Started: {new Date(startTime).toLocaleTimeString()}
          </div>
          <Button variant="outline" size="sm" onClick={getLocation} className="flex items-center gap-1 bg-transparent">
            <MapPin className="h-4 w-4" />
            {currentLocation ? "Location captured" : "Get location"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Participant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                placeholder="Enter participant's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                placeholder="Enter participant's email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={personalInfo.mobile}
                onChange={(e) => handlePersonalInfoChange("mobile", e.target.value)}
                placeholder="Enter participant's mobile number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number *</Label>
              <Input
                id="aadhar"
                value={personalInfo.aadhar}
                onChange={(e) => handlePersonalInfoChange("aadhar", e.target.value)}
                placeholder="Enter participant's Aadhar number"
                maxLength={12}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">{survey.questions.map((question, index) => renderQuestion(question, index))}</div>

      {/* Submit Section */}
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Response will be saved locally and synced when online. Make sure to capture location and fill all personal
            information for accurate data.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || completedQuestions === 0 || !isPersonalInfoComplete}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Response"}
          </Button>
        </div>
      </div>
    </div>
  )
}
