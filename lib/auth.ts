// Types for authentication
export type AuthUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "student" | "teacher"
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "student" | "teacher"
  subject?: string // For teachers
  grade?: string // For students
}

// Mock authentication service
class AuthService {
  private currentUser: AuthUser | null = null

  // Mock user database (in memory)
  private users: Map<string, { user: AuthUser; password: string }> = new Map()

  constructor() {
    // Add some mock users for testing
    this.registerUser({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      role: "student",
      grade: "11",
    })

    this.registerUser({
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      password: "teacher123",
      role: "teacher",
      subject: "Mathematics",
    })
  }

  // Generate a simple UUID for IDs
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Register a new user
  async registerUser(data: RegisterData): Promise<AuthUser> {
    // Check if email already exists
    for (const entry of this.users.values()) {
      if (entry.user.email === data.email) {
        throw new Error("Email already in use")
      }
    }

    const id = this.generateId()
    const user: AuthUser = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    }

    this.users.set(id, { user, password: data.password })
    return user
  }

  // Login a user
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    for (const entry of this.users.values()) {
      if (entry.user.email === credentials.email && entry.password === credentials.password) {
        this.currentUser = entry.user
        return entry.user
      }
    }
    throw new Error("Invalid email or password")
  }

  // Logout the current user
  async logout(): Promise<void> {
    this.currentUser = null
  }

  // Get the current logged-in user
  async getCurrentUser(): Promise<AuthUser | null> {
    return this.currentUser
  }

  // Check if a user is logged in
  async isLoggedIn(): Promise<boolean> {
    return this.currentUser !== null
  }

  // Update user profile
  async updateProfile(userId: string, data: Partial<Omit<AuthUser, "id" | "email">>): Promise<AuthUser> {
    const entry = this.users.get(userId)
    if (!entry) {
      throw new Error("User not found")
    }

    const updatedUser = {
      ...entry.user,
      ...data,
    }

    this.users.set(userId, { user: updatedUser, password: entry.password })

    // Update current user if this is the logged-in user
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = updatedUser
    }

    return updatedUser
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const entry = this.users.get(userId)
    if (!entry) {
      throw new Error("User not found")
    }

    if (entry.password !== currentPassword) {
      throw new Error("Current password is incorrect")
    }

    this.users.set(userId, { user: entry.user, password: newPassword })
    return true
  }
}

// Export a singleton instance of the auth service
export const auth = new AuthService()

