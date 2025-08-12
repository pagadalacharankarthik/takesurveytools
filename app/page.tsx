"use client"

import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        switch (user.role) {
          case "super_admin":
            router.push("/super-admin")
            break
          case "org_admin":
            router.push("/org-admin")
            break
          case "survey_conductor":
            router.push("/conductor")
            break
          default:
            break
        }
      } else {
        // Redirect to home page for unauthenticated users
        router.push("/home")
      }
    }
  }, [isAuthenticated, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
}
