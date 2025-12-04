/**
 * Login API Route
 * Handles user authentication and session management
 * 
 * @route POST /api/auth/login
 * @access Public
 */

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Login the user
    const user = await auth.login({ email, password })

    // Create a simple token (in production, use JWT)
    const token = `mock-token-${user.id}-${Date.now()}`

    // Return success response with token and user data
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Invalid email or password" }, { status: 401 })
  }
}

