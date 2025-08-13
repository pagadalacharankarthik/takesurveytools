"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language, Translations } from "@/lib/translations"
import { getTranslation } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: keyof Translations) => string
  availableLanguages: { code: Language; name: string; nativeName: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const LANGUAGE_STORAGE_KEY = "takesurvey_language"

export const availableLanguages = [
  { code: "en" as Language, name: "English", nativeName: "English" },
  { code: "hi" as Language, name: "Hindi", nativeName: "हिन्दी" },
  { code: "te" as Language, name: "Telugu", nativeName: "తెలుగు" },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (savedLanguage && availableLanguages.find((lang) => lang.code === savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      if (availableLanguages.find((lang) => lang.code === browserLang)) {
        setLanguageState(browserLang)
      }
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)

    // Update document language attribute
    document.documentElement.lang = newLanguage
  }

  const t = (key: keyof Translations): string => {
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
