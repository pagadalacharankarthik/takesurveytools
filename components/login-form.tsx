"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { DEMO_USERS } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(email, password)
    if (success) {
      // Get the current user to determine redirect path
      const user = DEMO_USERS.find((u) => u.email === email)
      if (user) {
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
            router.push("/")
        }
      }
    } else {
      setError("Invalid email or password")
    }
    setLoading(false)
  }

  const handleDemoLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)

    setError("")
    setLoading(true)

    const success = await login(userEmail, userPassword)
    if (success) {
      const user = DEMO_USERS.find((u) => u.email === userEmail)
      if (user) {
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
            router.push("/")
        }
      }
    } else {
      setError("Login failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">TakeSurvey</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-3 text-center">Demo Accounts (click to login):</div>
            <div className="space-y-2">
              {DEMO_USERS.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left bg-transparent"
                  onClick={() => handleDemoLogin(user.email, user.password)}
                  disabled={loading}
                >
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
