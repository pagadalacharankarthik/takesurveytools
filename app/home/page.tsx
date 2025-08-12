"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Shield, Zap, Users, FileText, MapPin } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
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
      }
    }
  }, [isAuthenticated, user, router])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TakeSurvey</span>
          </div>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            AI-Powered Survey Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Survey Collection
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your data collection with AI-powered question extraction, real-time risk monitoring, and
            comprehensive survey management tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to conduct professional surveys with confidence and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Question Extraction</CardTitle>
              <CardDescription>
                Upload documents and let AI automatically extract relevant survey questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF, DOCX, TXT support</li>
                <li>• Keyword analysis</li>
                <li>• Smart question suggestions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Risk Monitoring</CardTitle>
              <CardDescription>Real-time detection of duplicate responses and suspicious patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Duplicate detection</li>
                <li>• Location verification</li>
                <li>• Device fingerprinting</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Role-Based Access</CardTitle>
              <CardDescription>Comprehensive user management with different permission levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Super Admin dashboard</li>
                <li>• Organization management</li>
                <li>• Survey conductor tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Survey Management</CardTitle>
              <CardDescription>Create, edit, and manage surveys with intuitive tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multiple question types</li>
                <li>• Custom survey creation</li>
                <li>• Progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Location Tracking</CardTitle>
              <CardDescription>GPS-enabled data collection with location verification</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GPS coordinates</li>
                <li>• Location mapping</li>
                <li>• Offline capability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Comprehensive reporting and data visualization tools</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time statistics</li>
                <li>• Progress monitoring</li>
                <li>• Export capabilities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Ready to Get Started?</CardTitle>
            <CardDescription className="text-lg">
              Join organizations worldwide using TakeSurvey for professional data collection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button size="lg">
                Start Your Survey Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold">TakeSurvey</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 TakeSurvey. AI-Powered Survey Platform.</p>
        </div>
      </footer>
    </div>
  )
}
