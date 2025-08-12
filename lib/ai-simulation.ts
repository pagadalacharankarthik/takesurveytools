import { DEMO_QUESTION_BANK, type Question } from "./demo-data"

export interface AIExtractionResult {
  keywords: string[]
  suggestedQuestions: Question[]
  confidence: number
}

// Demo AI logic for keyword extraction and question suggestion
export const extractKeywordsAndSuggestQuestions = (text: string): AIExtractionResult => {
  const lowercaseText = text.toLowerCase()

  // Define keyword patterns and their associated domains
  const keywordPatterns = {
    water: ["water", "drinking", "well", "tap", "river", "stream", "quality", "clean", "supply", "access"],
    health: ["health", "medical", "healthcare", "doctor", "clinic", "hospital", "medicine", "treatment", "disease"],
    education: ["education", "school", "literacy", "learning", "teacher", "student", "reading", "writing"],
    infrastructure: ["infrastructure", "road", "electricity", "transport", "facility", "building"],
    demographic: ["age", "occupation", "income", "family", "household", "community"],
  }

  // Extract keywords based on text content
  const extractedKeywords: string[] = []
  const domainScores: { [key: string]: number } = {}

  Object.entries(keywordPatterns).forEach(([domain, patterns]) => {
    let score = 0
    patterns.forEach((pattern) => {
      const matches = (lowercaseText.match(new RegExp(pattern, "g")) || []).length
      score += matches
      if (matches > 0 && !extractedKeywords.includes(pattern)) {
        extractedKeywords.push(pattern)
      }
    })
    domainScores[domain] = score
  })

  // Sort domains by relevance score
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a)
    .map(([domain]) => domain)

  // Select top domains and suggest questions
  const topDomains = sortedDomains.slice(0, 3).filter((domain) => domainScores[domain] > 0)

  const suggestedQuestions: Question[] = []
  topDomains.forEach((domain) => {
    const domainQuestions = DEMO_QUESTION_BANK.filter((q) => q.domain.includes(domain))
    // Add 2-3 questions per domain, up to 8 total
    const questionsToAdd = domainQuestions.slice(0, Math.min(3, Math.ceil(8 / topDomains.length)))
    suggestedQuestions.push(...questionsToAdd)
  })

  // If no specific domains detected, add some general questions
  if (suggestedQuestions.length === 0) {
    suggestedQuestions.push(...DEMO_QUESTION_BANK.filter((q) => q.domain.includes("demographic")).slice(0, 3))
  }

  // Limit to 8 questions maximum
  const finalQuestions = suggestedQuestions.slice(0, 8)

  // Calculate confidence based on keyword matches and domain relevance
  const totalMatches = Object.values(domainScores).reduce((sum, score) => sum + score, 0)
  const confidence = Math.min(0.95, Math.max(0.3, totalMatches / 20))

  return {
    keywords: extractedKeywords.slice(0, 10), // Limit keywords
    suggestedQuestions: finalQuestions,
    confidence,
  }
}
