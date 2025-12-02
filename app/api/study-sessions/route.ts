import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") || "upcoming"
    const hostId = searchParams.get("hostId")
    const participantId = searchParams.get("participantId")

    let sessions

    if (hostId) {
      sessions = await db.getStudySessionsByHost(hostId)
    } else if (participantId) {
      sessions = await db.getStudySessionsByParticipant(participantId)
    } else if (type === "upcoming") {
      sessions = await db.getUpcomingStudySessions()
    } else if (type === "past") {
      sessions = await db.getPastStudySessions()
    } else {
      // Get all sessions (in a real app, you might want to paginate this)
      sessions = Array.from(((await db) as any).studySessions.values())
    }

    return NextResponse.json(sessions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch study sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const { title, description, subject, date, time, duration, maxParticipants } = body

    if (!title || !description || !subject || !date || !time || !duration || !maxParticipants) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the study session
    const session = await db.createStudySession({
      title,
      description,
      subject,
      date,
      time,
      duration: Number.parseInt(duration),
      hostId: currentUser.id,
      maxParticipants: Number.parseInt(maxParticipants),
    })

    return NextResponse.json(session)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create study session" }, { status: 500 })
  }
}

