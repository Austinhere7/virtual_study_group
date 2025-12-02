import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get("subject")
    const userId = searchParams.get("userId")

    let notes

    if (subject) {
      notes = await db.getNotesBySubject(subject)
    } else if (userId) {
      notes = await db.getNotesByUser(userId)
    } else {
      // Get all notes (in a real app, you might want to paginate this)
      notes = Array.from(((await db) as any).notes.values())
    }

    return NextResponse.json(notes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await auth.getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()

    // Get form data
    const title = formData.get("title") as string
    const subject = formData.get("subject") as string
    const file = formData.get("file") as File

    if (!title || !subject || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would upload the file to a storage service
    // and get a URL back. For this mock, we'll create a fake URL.
    const fileUrl = `/uploads/${Date.now()}_${file.name}`

    // Create the note
    const note = await db.createNote({
      title,
      subject,
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: currentUser.id,
    })

    return NextResponse.json(note)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to upload note" }, { status: 500 })
  }
}

