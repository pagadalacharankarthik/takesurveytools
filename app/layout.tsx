import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { LanguageProvider } from "@/hooks/use-language"
import { DataInitializer } from "@/components/data-initializer"
import { ErrorBoundary } from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "TakeSurvey",
  description: "TakeSurvey - AI-Powered Smart Survey Tool for Data Collection and Analysis",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* Added error boundary and proper provider nesting */}
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <DataInitializer>{children}</DataInitializer>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
