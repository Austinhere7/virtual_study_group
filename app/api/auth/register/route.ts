/**
 * Registration API Route
 * Handles new user registration for students and teachers
 * 
 * @route POST /api/auth/register
 * @access Public
 */

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { firstName, lastName, email, password, role } = body

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Register the user
    const user = await auth.registerUser(body)

    // Create a simple token (in production, use JWT)
    const token = `mock-token-${user.id}-${Date.now()}`

    // Return success response with token and user data
    return NextResponse.json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Failed to register user" }, { status: 400 })
  }
}

