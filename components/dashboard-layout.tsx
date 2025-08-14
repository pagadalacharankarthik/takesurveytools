"use client"

import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LanguageSelector } from "@/components/language-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIChatbot } from "@/components/ai-chatbot"
import { LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return t("superAdmin")
      case "org_admin":
        return t("organizationAdmin")
      case "survey_conductor":
        return t("surveyConductor")
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/home" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{t("appName")}</span>
            </Link>
            <div className="border-l pl-4">
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">{t("appDescription")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSelector />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{getRoleDisplayName(user?.role || "")}</p>
                  </div>
                </div>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="p-6">{children}</main>

      <AIChatbot />
    </div>
  )
}
