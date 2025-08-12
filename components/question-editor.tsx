"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, Edit3, Save, X } from "lucide-react"
import type { Question } from "@/lib/demo-data"
import type { AIExtractionResult } from "@/lib/ai-simulation"
import type { ParsedContent } from "@/lib/file-parser"

interface QuestionEditorProps {
  aiResult: AIExtractionResult & { parsedContent: ParsedContent }
  onSave: (questions: Question[], title: string) => void
}

export function QuestionEditor({ aiResult, onSave }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(aiResult.suggestedQuestions)
  const [surveyTitle, setSurveyTitle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({})

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id)
    setEditingQuestion(question)
  }

  const handleSaveEdit = () => {
    if (editingId && editingQuestion.text) {
      setQuestions((prev) => prev.map((q) => (q.id === editingId ? ({ ...q, ...editingQuestion } as Question) : q)))
      setEditingId(null)
      setEditingQuestion({})
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingQuestion({})
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      text: "New question",
      type: "text",
      domain: ["custom"],
    }
    setQuestions((prev) => [...prev, newQuestion])
    handleEditQuestion(newQuestion)
  }

  const handleSave = () => {
    if (!surveyTitle.trim()) {
      return
    }
    onSave(questions, surveyTitle)
  }

  return (
    <div className="space-y-6">
      {/* AI Extraction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            AI Extraction Results
          </CardTitle>
          <CardDescription>
            Confidence: {Math.round(aiResult.confidence * 100)}% | File: {aiResult.parsedContent.fileName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Extracted Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {aiResult.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Survey Title */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="survey-title">Survey Title</Label>
            <Input
              id="survey-title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Enter survey title..."
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Questions ({questions.length})</CardTitle>
          <CardDescription>Review, edit, or add questions for your survey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4">
              {editingId === question.id ? (
                <div className="space-y-4">
                  <div>
                    <Label>Question Text</Label>
                    <Textarea
                      value={editingQuestion.text || ""}
                      onChange={(e) => setEditingQuestion((prev) => ({ ...prev, text: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Question Type</Label>
                    <Select
                      value={editingQuestion.type || question.type}
                      onValueChange={(value) =>
                        setEditingQuestion((prev) => ({ ...prev, type: value as Question["type"] }))
                      }
                    >
                      <SelectTrigger className="w-48 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Response</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="rating">Rating Scale</SelectItem>
                        <SelectItem value="yes_no">Yes/No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(editingQuestion.type === "multiple_choice" || question.type === "multiple_choice") && (
                    <div>
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={editingQuestion.options?.join("\n") || question.options?.join("\n") || ""}
                        onChange={(e) =>
                          setEditingQuestion((prev) => ({
                            ...prev,
                            options: e.target.value.split("\n").filter((opt) => opt.trim()),
                          }))
                        }
                        className="mt-1"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-2">{question.text}</p>
                    {question.options && (
                      <div className="text-xs text-muted-foreground">Options: {question.options.join(", ")}</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditQuestion(question)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteQuestion(question.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={handleAddQuestion} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Question
          </Button>
        </CardContent>
      </Card>

      {/* Save Survey */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={!surveyTitle.trim() || questions.length === 0}>
          Save Survey
        </Button>
      </div>

      {(!surveyTitle.trim() || questions.length === 0) && (
        <Alert>
          <AlertDescription>
            Please provide a survey title and ensure you have at least one question before saving.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
