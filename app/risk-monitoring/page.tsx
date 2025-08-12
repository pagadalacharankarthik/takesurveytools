"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { RiskMonitoringDashboard } from "@/components/risk-monitoring-dashboard"

export default function RiskMonitoringPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin", "org_admin"]}>
      <DashboardLayout title="Risk Monitoring & Analysis">
        <RiskMonitoringDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
