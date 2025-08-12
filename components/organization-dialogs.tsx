"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Mail, Phone, MapPin, Calendar, Trash2, Edit, UserPlus } from "lucide-react"
import {
  type Organization,
  type User,
  addOrganization,
  getUsersByOrganization,
  addUser,
  deleteUser,
  updateUser,
} from "@/lib/organization-storage"

interface AddOrganizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (org: Organization) => void
}

export function AddOrganizationDialog({ open, onOpenChange, onSuccess }: AddOrganizationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    status: "active" as const,
    adminUsers: [] as string[],
    conductors: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newOrg = addOrganization(formData)
    onSuccess(newOrg)
    onOpenChange(false)
    setFormData({
      name: "",
      description: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      status: "active",
      adminUsers: [],
      conductors: [],
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add New Organization
          </DialogTitle>
          <DialogDescription>Create a new organization to manage surveys and users.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the organization's mission and focus"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="contact@organization.org"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="+1-555-0123"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Organization address"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Organization</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface OrganizationDetailsDialogProps {
  organization: Organization | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (org: Organization) => void
}

export function OrganizationDetailsDialog({
  organization,
  open,
  onOpenChange,
  onUpdate,
}: OrganizationDetailsDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "conductor" as "admin" | "conductor",
    status: "active" as "active" | "inactive",
  })

  useState(() => {
    if (organization) {
      const orgUsers = getUsersByOrganization(organization.id)
      setUsers(orgUsers)
    }
  }, [organization])

  if (!organization) return null

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    const user = addUser({
      ...newUser,
      organizationId: organization.id,
    })
    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "conductor", status: "active" })
    setShowAddUser(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (deleteUser(userId)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    }
  }

  const handleToggleUserStatus = (userId: string, currentStatus: "active" | "inactive") => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    const updated = updateUser(userId, { status: newStatus })
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
    }
  }

  const adminUsers = users.filter((u) => u.role === "admin")
  const conductorUsers = users.filter((u) => u.role === "conductor")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {organization.name}
          </DialogTitle>
          <DialogDescription>Organization details and user management</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Organization Details</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{organization.name}</span>
                    <Badge variant={organization.status === "active" ? "default" : "secondary"}>
                      {organization.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{organization.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Created: {organization.createdAt}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{organization.contactEmail}</span>
                  </div>
                  {organization.contactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.contactPhone}</span>
                    </div>
                  )}
                  {organization.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{organization.totalSurveys}</div>
                    <div className="text-sm text-muted-foreground">Total Surveys</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{adminUsers.length}</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{conductorUsers.length}</div>
                    <div className="text-sm text-muted-foreground">Conductors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button onClick={() => setShowAddUser(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            {showAddUser && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Name *</Label>
                        <Input
                          id="userName"
                          value={newUser.name}
                          onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="User name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email *</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="user@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: "admin" | "conductor") =>
                            setNewUser((prev) => ({ ...prev, role: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="conductor">Conductor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userStatus">Status</Label>
                        <Select
                          value={newUser.status}
                          onValueChange={(value: "active" | "inactive") =>
                            setNewUser((prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Add User</Button>
                      <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                          <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{user.email}</div>
                        {user.lastLogin && (
                          <div className="text-xs text-muted-foreground mt-1">Last login: {user.lastLogin}</div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
