import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { firstName, lastName, email, password, role } = body

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Register the user
    const user = await auth.registerUser(body)

    // Create user in the database
    await db.createUser({
      firstName,
      lastName,
      email,
      role,
      subject: body.subject,
      grade: body.grade,
    })

    // Return success response (without password)
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register user" }, { status: 400 })
  }
}

