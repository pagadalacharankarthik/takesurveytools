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
import { Trash2, Plus, Edit3, Save, X, GripVertical } from "lucide-react"
import type { Survey, Question } from "@/lib/demo-data"
import { generateQuestionId } from "@/lib/survey-storage"
import { useAuth } from "@/hooks/use-auth"

interface SurveyEditorProps {
  survey?: Survey
  onSave: (survey: Survey) => void
  onCancel: () => void
}

export function SurveyEditor({ survey, onSave, onCancel }: SurveyEditorProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState(survey?.title || "")
  const [questions, setQuestions] = useState<Question[]>(survey?.questions || [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question>>({})
  const [keywords, setKeywords] = useState<string[]>(survey?.extractedKeywords || [])
  const [newKeyword, setNewKeyword] = useState("")

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
      id: generateQuestionId(),
      text: "New question",
      type: "text",
      domain: ["custom"],
    }
    setQuestions((prev) => [...prev, newQuestion])
    handleEditQuestion(newQuestion)
  }

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    const newQuestions = [...questions]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newQuestions.length) {
      ;[newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]]
      setQuestions(newQuestions)
    }
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords((prev) => [...prev, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword))
  }

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return

    const updatedSurvey: Survey = {
      id: survey?.id || `survey_${Date.now()}`,
      title: title.trim(),
      organizationId: user?.organizationId || "",
      questions,
      createdAt: survey?.createdAt || new Date().toISOString().split("T")[0],
      status: survey?.status || "draft",
      extractedKeywords: keywords,
      uploadedFileName: survey?.uploadedFileName,
    }

    onSave(updatedSurvey)
  }

  return (
    <div className="space-y-6">
      {/* Survey Details */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="survey-title">Survey Title</Label>
            <Input
              id="survey-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title..."
            />
          </div>

          <div>
            <Label>Keywords</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveKeyword(keyword)}
                >
                  {keyword} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add keyword..."
                onKeyPress={(e) => e.key === "Enter" && handleAddKeyword()}
              />
              <Button type="button" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
          <CardDescription>Create and manage survey questions</CardDescription>
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
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
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
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveQuestion(index, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveQuestion(index, "down")}
                        disabled={index === questions.length - 1}
                      >
                        ↓
                      </Button>
                    </div>
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
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!title.trim() || questions.length === 0}>
          {survey ? "Update Survey" : "Create Survey"}
        </Button>
      </div>

      {(!title.trim() || questions.length === 0) && (
        <Alert>
          <AlertDescription>
            Please provide a survey title and ensure you have at least one question before saving.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
