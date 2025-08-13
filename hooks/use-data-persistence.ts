"use client"

import { useState, useEffect } from "react"
import { dataManager } from "@/lib/data-manager"

export function useDataPersistence() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        await dataManager.initializeData()

        // Validate data integrity
        const isValid = dataManager.validateData()
        if (!isValid) {
          console.warn("Data validation failed, refreshing...")
          dataManager.refreshData()
        }

        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const refreshData = () => {
    dataManager.refreshData()
    setIsInitialized(true)
  }

  return {
    isInitialized,
    isLoading,
    refreshData,
  }
}
