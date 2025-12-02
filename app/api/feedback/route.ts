import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const teacherId = searchParams.get("teacherId")

    let feedback

    if (teacherId) {
      // Teachers can only see feedback for themselves
      if (currentUser.role === "teacher" && currentUser.id !== teacherId) {
        return NextResponse.json({ error: "Unauthorized to view this feedback" }, { status: 403 })
      }
      feedback = await db.getFeedbackByTeacher(teacherId)
    } else if (currentUser.role === "student") {
      // Students can see their own feedback
      feedback = await db.getFeedbackByStudent(currentUser.id)
    } else if (currentUser.role === "teacher") {
      // Teachers can see feedback for themselves
      feedback = await db.getFeedbackByTeacher(currentUser.id)
    } else {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // If feedback is anonymous, remove student information for teachers
    if (currentUser.role === "teacher") {
      feedback = feedback.map((f) => {
        if (f.anonymous) {
          return {
            ...f,
            studentId: "anonymous",
          }
        }
        return f
      })
    }

    return NextResponse.json(feedback)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only students can submit feedback
    if (currentUser.role !== "student") {
      return NextResponse.json({ error: "Only students can submit feedback" }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    const { teacherId, rating, content, anonymous } = body

    if (!teacherId || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the feedback
    const feedback = await db.createFeedback({
      teacherId,
      studentId: currentUser.id,
      rating,
      content,
      anonymous: !!anonymous,
    })

    return NextResponse.json(feedback)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit feedback" }, { status: 500 })
  }
}

