import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated
    const currentUser = await auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = params.id

    // Leave the study session
    const session = await db.leaveStudySession(sessionId, currentUser.id)

    if (!session) {
      return NextResponse.json({ error: "Study session not found" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to leave study session" }, { status: 500 })
  }
}

