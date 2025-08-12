"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, Search, MoreHorizontal } from "lucide-react"
import { getStoredOrganizations, type Organization } from "@/lib/organization-storage"
import { DEMO_SURVEYS } from "@/lib/demo-data"

interface ConductorManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConductorManagementDialog({ open, onOpenChange }: ConductorManagementDialogProps) {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>("all")

  useEffect(() => {
    const orgs = getStoredOrganizations()
    setOrganizations(orgs)
  }, [])

  const allConductors = [
    ...organizations.flatMap((org) =>
      org.conductors.map((conductor) => ({
        ...conductor,
        organizationName: org.name,
        organizationId: org.id,
        source: "organization" as const,
      })),
    ),
    ...DEMO_SURVEYS.map((survey) => ({
      id: survey.conductorId,
      name: survey.conductorName || "Unknown Conductor",
      email: `${(survey.conductorName || "unknown").toLowerCase().replace(/\s+/g, ".")}@example.com`,
      role: "conductor" as const,
      status: "active" as const,
      organizationName: survey.organizationName || "Unknown Organization",
      organizationId: survey.organizationId,
      source: "survey" as const,
      assignedSurveys: 1,
      completedSurveys: survey.status === "completed" ? 1 : 0,
    })),
  ]

  const filteredConductors = allConductors.filter((conductor) => {
    const matchesSearch =
      (conductor.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (conductor.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesOrg = selectedOrg === "all" || conductor.organizationId === selectedOrg
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "active" && conductor.status === "active") ||
      (selectedTab === "inactive" && conductor.status === "inactive")

    return matchesSearch && matchesOrg && matchesTab
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Conductor Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Conductors</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="org-filter">Filter by Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="All Organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All ({allConductors.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({allConductors.filter((c) => c.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({allConductors.filter((c) => c.status === "inactive").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredConductors.map((conductor) => (
                    <Card key={`${conductor.id}-${conductor.organizationId}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="font-medium">{conductor.name}</div>
                            <div className="text-sm text-muted-foreground">{conductor.email}</div>
                            <div className="text-xs text-muted-foreground">{conductor.organizationName}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={conductor.status === "active" ? "default" : "secondary"}>
                              {conductor.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {(conductor as any).assignedSurveys && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            Assigned: {(conductor as any).assignedSurveys} surveys • Completed:{" "}
                            {(conductor as any).completedSurveys || 0} surveys
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
