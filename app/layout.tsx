import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { LanguageProvider } from "@/hooks/use-language"
import { DataInitializer } from "@/components/data-initializer"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        {/* Added error boundary and proper provider nesting */}
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <AuthProvider>
                <DataInitializer>{children}</DataInitializer>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
