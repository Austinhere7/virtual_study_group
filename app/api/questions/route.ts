import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get("subject")
    const userId = searchParams.get("userId")
    const solved = searchParams.get("solved")

    let questions

    if (subject) {
      questions = await db.getQuestionsBySubject(subject)
    } else if (userId) {
      questions = await db.getQuestionsByUser(userId)
    } else {
      // Get all questions (in a real app, you might want to paginate this)
      questions = Array.from(((await db) as any).questions.values())
    }

    // Filter by solved status if provided
    if (solved !== null) {
      const isSolved = solved === "true"
      questions = questions.filter((q) => q.solved === isSolved)
    }

    return NextResponse.json(questions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch questions" }, { status: 500 })
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
    const { title, content, subject } = body

    if (!title || !content || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the question
    const question = await db.createQuestion({
      title,
      content,
      subject,
      authorId: currentUser.id,
    })

    return NextResponse.json(question)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create question" }, { status: 500 })
  }
}

