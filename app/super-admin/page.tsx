"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"

export default function SuperAdminPage() {
  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <DashboardLayout title="Super Admin Dashboard">
        <SuperAdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
