"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react"
import { parseFile, type ParsedContent } from "@/lib/file-parser"
import { extractKeywordsAndSuggestQuestions, type AIExtractionResult } from "@/lib/ai-simulation"

interface FileUploadProps {
  onExtractionComplete: (result: AIExtractionResult & { parsedContent: ParsedContent }) => void
}

export function FileUpload({ onExtractionComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setError("")
      setUploading(true)
      setUploadedFile(file)

      try {
        // Parse the file content
        const parsedContent = await parseFile(file)

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Extract keywords and suggest questions
        const aiResult = extractKeywordsAndSuggestQuestions(parsedContent.text)

        onExtractionComplete({
          ...aiResult,
          parsedContent,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file")
        setUploadedFile(null)
      } finally {
        setUploading(false)
      }
    },
    [onExtractionComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Survey Document
        </CardTitle>
        <CardDescription>Upload a PDF, DOCX, or TXT file to extract relevant survey questions using AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${uploading ? "cursor-not-allowed opacity-50" : "hover:border-primary hover:bg-primary/5"}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div>
                <p className="text-lg font-medium">Processing your document...</p>
                <p className="text-sm text-muted-foreground">AI is extracting keywords and suggesting questions</p>
              </div>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div>
                <p className="text-lg font-medium">File processed successfully!</p>
                <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop your file here" : "Drag & drop a file here"}
                </p>
                <p className="text-sm text-muted-foreground">or click to browse (PDF, DOCX, TXT)</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
