"use client"

import { useDataPersistence } from "@/hooks/use-data-persistence"
import { useLanguage } from "@/hooks/use-language"
import type { ReactNode } from "react"

interface DataInitializerProps {
  children: ReactNode
}

export function DataInitializer({ children }: DataInitializerProps) {
  const { isInitialized, isLoading } = useDataPersistence()
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
