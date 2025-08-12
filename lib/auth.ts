// Demo user accounts with different roles
export interface User {
  id: string
  email: string
  password: string
  name: string
  role: "super_admin" | "org_admin" | "survey_conductor"
  organizationId?: string
}

export const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "superadmin@demo.com",
    password: "demo123",
    name: "Super Admin",
    role: "super_admin",
  },
  {
    id: "2",
    email: "orgadmin@demo.com",
    password: "demo123",
    name: "Organization Admin",
    role: "org_admin",
    organizationId: "org1",
  },
  {
    id: "3",
    email: "conductor@demo.com",
    password: "demo123",
    name: "Survey Conductor",
    role: "survey_conductor",
    organizationId: "org1",
  },
]

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const getStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  const stored = localStorage.getItem("survey_auth")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return { user: null, isAuthenticated: false }
    }
  }
  return { user: null, isAuthenticated: false }
}

export const setStoredAuth = (authState: AuthState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("survey_auth", JSON.stringify(authState))
  }
}

export const login = (email: string, password: string): User | null => {
  const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
  if (user) {
    const authState = { user, isAuthenticated: true }
    setStoredAuth(authState)
    return user
  }
  return null
}

export const logout = () => {
  const authState = { user: null, isAuthenticated: false }
  setStoredAuth(authState)
}
