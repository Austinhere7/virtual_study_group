import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Login the user
    const user = await auth.login({ email, password })

    // Return success response (without password)
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid email or password" }, { status: 401 })
  }
}

