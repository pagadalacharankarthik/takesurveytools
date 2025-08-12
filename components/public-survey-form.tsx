"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Send } from "lucide-react"
import { savePublicResponse } from "@/lib/survey-responses"

interface PublicSurveyFormProps {
  survey: any
  onComplete: () => void
}

export function PublicSurveyForm({ survey, onComplete }: PublicSurveyFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const questions = survey.questions || []
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Get user's location
    let location = { latitude: 0, longitude: 0, address: "Unknown location" }
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
        }
      }
    } catch (error) {
      console.log("Location access denied")
    }

    // Save public response
    const publicResponse = {
      id: `public_${Date.now()}`,
      surveyId: survey.id,
      conductorName: "Public Participant",
      responses: Object.entries(responses).map(([index, answer]) => ({
        question: questions[Number.parseInt(index)]?.text || "",
        answer,
      })),
      location,
      submittedAt: new Date().toISOString(),
      syncStatus: "synced" as const,
      deviceInfo: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
    }

    savePublicResponse(publicResponse)

    setTimeout(() => {
      setIsSubmitting(false)
      onComplete()
    }, 1000)
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-600">This survey has no questions available.</p>
        </CardContent>
      </Card>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">{currentQ.text}</Label>
          </div>

          <div>
            {currentQ.type === "multiple_choice" && currentQ.options ? (
              <RadioGroup
                value={responses[currentQuestion] || ""}
                onValueChange={(value) => handleResponseChange(currentQuestion, value)}
              >
                {currentQ.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQ.type === "checkbox" && currentQ.options ? (
              <div className="space-y-2">
                {currentQ.options.map((option: string, index: number) => {
                  const currentResponses = responses[currentQuestion]?.split(",") || []
                  const isChecked = currentResponses.includes(option)

                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`checkbox-${index}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newResponses = currentResponses.filter((r) => r !== option)
                          if (checked) {
                            newResponses.push(option)
                          }
                          handleResponseChange(currentQuestion, newResponses.join(","))
                        }}
                      />
                      <Label htmlFor={`checkbox-${index}`}>{option}</Label>
                    </div>
                  )
                })}
              </div>
            ) : currentQ.type === "text" ? (
              <Textarea
                value={responses[currentQuestion] || ""}
                onChange={(e) => handleResponseChange(currentQuestion, e.target.value)}
                placeholder="Enter your response..."
                rows={4}
              />
            ) : (
              <Input
                value={responses[currentQuestion] || ""}
                onChange={(e) => handleResponseChange(currentQuestion, e.target.value)}
                placeholder="Enter your response..."
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button onClick={handleSubmit} disabled={!responses[currentQuestion] || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Survey
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!responses[currentQuestion]}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
