"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ConductorDashboard } from "@/components/conductor-dashboard"

export default function ConductorPage() {
  return (
    <ProtectedRoute allowedRoles={["survey_conductor"]}>
      <DashboardLayout title="Survey Conductor Dashboard">
        <ConductorDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
