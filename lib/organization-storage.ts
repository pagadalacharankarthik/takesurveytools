export interface Organization {
  id: string
  name: string
  description: string
  contactEmail: string
  contactPhone: string
  address: string
  createdAt: string
  status: "active" | "inactive"
  adminUsers: string[]
  conductors: string[]
  totalSurveys: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "conductor"
  organizationId: string
  status: "active" | "inactive"
  lastLogin?: string
  createdAt: string
}

// Storage keys
const ORGANIZATIONS_KEY = "takesurvey_organizations"
const USERS_KEY = "takesurvey_users"

// Initialize with demo data
const DEMO_USERS: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john@rural-dev.org",
    role: "admin",
    organizationId: "org1",
    status: "active",
    lastLogin: "2024-03-12 09:30",
    createdAt: "2024-01-15",
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah@rural-dev.org",
    role: "conductor",
    organizationId: "org1",
    status: "active",
    lastLogin: "2024-03-11 14:20",
    createdAt: "2024-02-01",
  },
  {
    id: "user3",
    name: "Dr. Michael Chen",
    email: "michael@health-edu.org",
    role: "admin",
    organizationId: "org2",
    status: "active",
    lastLogin: "2024-03-12 11:45",
    createdAt: "2024-01-20",
  },
  {
    id: "user4",
    name: "Lisa Rodriguez",
    email: "lisa@health-edu.org",
    role: "conductor",
    organizationId: "org2",
    status: "active",
    lastLogin: "2024-03-10 16:15",
    createdAt: "2024-02-10",
  },
]

export function getStoredOrganizations(): Organization[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(ORGANIZATIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Initialize with demo data from existing DEMO_ORGANIZATIONS
  const demoOrgs: Organization[] = [
    {
      id: "org1",
      name: "Rural Development Foundation",
      description: "Focused on improving water access and sanitation in rural communities across developing regions.",
      contactEmail: "contact@rural-dev.org",
      contactPhone: "+1-555-0123",
      address: "123 Development St, Rural City, RC 12345",
      createdAt: "2024-01-15",
      status: "active",
      adminUsers: ["user1"],
      conductors: ["user2"],
      totalSurveys: 8,
    },
    {
      id: "org2",
      name: "Health & Education Initiative",
      description: "Dedicated to improving healthcare access and educational outcomes in underserved communities.",
      contactEmail: "info@health-edu.org",
      contactPhone: "+1-555-0456",
      address: "456 Health Ave, Education City, EC 67890",
      createdAt: "2024-01-20",
      status: "active",
      adminUsers: ["user3"],
      conductors: ["user4"],
      totalSurveys: 7,
    },
  ]

  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(demoOrgs))
  return demoOrgs
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
  return DEMO_USERS
}

export function addOrganization(org: Omit<Organization, "id" | "createdAt" | "totalSurveys">): Organization {
  const organizations = getStoredOrganizations()
  const newOrg: Organization = {
    ...org,
    id: `org_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    totalSurveys: 0,
  }

  const updated = [...organizations, newOrg]
  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(updated))
  return newOrg
}

export function updateOrganization(id: string, updates: Partial<Organization>): Organization | null {
  const organizations = getStoredOrganizations()
  const index = organizations.findIndex((org) => org.id === id)

  if (index === -1) return null

  organizations[index] = { ...organizations[index], ...updates }
  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(organizations))
  return organizations[index]
}

export function deleteOrganization(id: string): boolean {
  const organizations = getStoredOrganizations()
  const filtered = organizations.filter((org) => org.id !== id)

  if (filtered.length === organizations.length) return false

  localStorage.setItem(ORGANIZATIONS_KEY, JSON.stringify(filtered))
  return true
}

export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getStoredUsers()
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  }

  const updated = [...users, newUser]
  localStorage.setItem(USERS_KEY, JSON.stringify(updated))
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const users = getStoredUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return users[index]
}

export function deleteUser(id: string): boolean {
  const users = getStoredUsers()
  const filtered = users.filter((user) => user.id !== id)

  if (filtered.length === users.length) return false

  localStorage.setItem(USERS_KEY, JSON.stringify(filtered))
  return true
}

export function getUsersByOrganization(organizationId: string): User[] {
  const users = getStoredUsers()
  return users.filter((user) => user.organizationId === organizationId)
}
