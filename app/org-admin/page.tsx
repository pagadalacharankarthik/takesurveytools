"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrgAdminDashboard } from "@/components/org-admin-dashboard"

export default function OrgAdminPage() {
  return (
    <ProtectedRoute allowedRoles={["org_admin"]}>
      <DashboardLayout title="Organization Admin Dashboard">
        <OrgAdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
