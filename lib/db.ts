// This is a mock database service for the virtual study group application
// In a real application, this would connect to a real database like MongoDB, PostgreSQL, etc.

// Types for our data models
export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "student" | "teacher"
  avatar?: string
  subject?: string // For teachers
  grade?: string // For students
  createdAt: Date
}

export type Note = {
  id: string
  title: string
  subject: string
  fileUrl: string
  fileType: string
  fileSize: number
  uploadedBy: string
  createdAt: Date
}

export type Question = {
  id: string
  title: string
  content: string
  subject: string
  authorId: string
  solved: boolean
  createdAt: Date
}

export type Answer = {
  id: string
  questionId: string
  content: string
  authorId: string
  accepted: boolean
  createdAt: Date
}

export type Feedback = {
  id: string
  teacherId: string
  studentId: string
  rating: number
  content: string
  anonymous: boolean
  status: "pending" | "acknowledged"
  createdAt: Date
}

export type StudySession = {
  id: string
  title: string
  description: string
  subject: string
  date: string
  time: string
  duration: number
  hostId: string
  maxParticipants: number
  participants: string[] // Array of user IDs
  createdAt: Date
}

// Mock database service
class DatabaseService {
  // In a real app, these would be database collections or tables
  private users: Map<string, User> = new Map()
  private notes: Map<string, Note> = new Map()
  private questions: Map<string, Question> = new Map()
  private answers: Map<string, Answer> = new Map()
  private feedback: Map<string, Feedback> = new Map()
  private studySessions: Map<string, StudySession> = new Map()

  // Generate a simple UUID for IDs
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // User methods
  async createUser(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const id = this.generateId()
    const user: User = {
      id,
      ...userData,
      createdAt: new Date(),
    }
    this.users.set(id, user)
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  // Notes methods
  async createNote(noteData: Omit<Note, "id" | "createdAt">): Promise<Note> {
    const id = this.generateId()
    const note: Note = {
      id,
      ...noteData,
      createdAt: new Date(),
    }
    this.notes.set(id, note)
    return note
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes.get(id) || null
  }

  async getNotesBySubject(subject: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter((note) => note.subject === subject)
  }

  async getNotesByUser(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter((note) => note.uploadedBy === userId)
  }

  // Question methods
  async createQuestion(questionData: Omit<Question, "id" | "createdAt" | "solved">): Promise<Question> {
    const id = this.generateId()
    const question: Question = {
      id,
      ...questionData,
      solved: false,
      createdAt: new Date(),
    }
    this.questions.set(id, question)
    return question
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return this.questions.get(id) || null
  }

  async getQuestionsBySubject(subject: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter((question) => question.subject === subject)
  }

  async getQuestionsByUser(userId: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter((question) => question.authorId === userId)
  }

  async markQuestionAsSolved(id: string): Promise<Question | null> {
    const question = this.questions.get(id)
    if (question) {
      question.solved = true
      this.questions.set(id, question)
      return question
    }
    return null
  }

  // Answer methods
  async createAnswer(answerData: Omit<Answer, "id" | "createdAt" | "accepted">): Promise<Answer> {
    const id = this.generateId()
    const answer: Answer = {
      id,
      ...answerData,
      accepted: false,
      createdAt: new Date(),
    }
    this.answers.set(id, answer)
    return answer
  }

  async getAnswerById(id: string): Promise<Answer | null> {
    return this.answers.get(id) || null
  }

  async getAnswersByQuestion(questionId: string): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter((answer) => answer.questionId === questionId)
  }

  async getAnswersByUser(userId: string): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter((answer) => answer.authorId === userId)
  }

  async markAnswerAsAccepted(id: string): Promise<Answer | null> {
    const answer = this.answers.get(id)
    if (answer) {
      // First, unmark any previously accepted answers for this question
      const questionAnswers = await this.getAnswersByQuestion(answer.questionId)
      for (const qa of questionAnswers) {
        if (qa.accepted) {
          qa.accepted = false
          this.answers.set(qa.id, qa)
        }
      }

      // Mark this answer as accepted
      answer.accepted = true
      this.answers.set(id, answer)

      // Mark the question as solved
      await this.markQuestionAsSolved(answer.questionId)

      return answer
    }
    return null
  }

  // Feedback methods
  async createFeedback(feedbackData: Omit<Feedback, "id" | "createdAt" | "status">): Promise<Feedback> {
    const id = this.generateId()
    const feedback: Feedback = {
      id,
      ...feedbackData,
      status: "pending",
      createdAt: new Date(),
    }
    this.feedback.set(id, feedback)
    return feedback
  }

  async getFeedbackById(id: string): Promise<Feedback | null> {
    return this.feedback.get(id) || null
  }

  async getFeedbackByTeacher(teacherId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter((feedback) => feedback.teacherId === teacherId)
  }

  async getFeedbackByStudent(studentId: string): Promise<Feedback[]> {
    return Array.from(this.feedback.values()).filter((feedback) => feedback.studentId === studentId)
  }

  async acknowledgeFeedback(id: string): Promise<Feedback | null> {
    const feedback = this.feedback.get(id)
    if (feedback) {
      feedback.status = "acknowledged"
      this.feedback.set(id, feedback)
      return feedback
    }
    return null
  }

  // Study Session methods
  async createStudySession(
    sessionData: Omit<StudySession, "id" | "createdAt" | "participants">,
  ): Promise<StudySession> {
    const id = this.generateId()
    const session: StudySession = {
      id,
      ...sessionData,
      participants: [sessionData.hostId], // Host is automatically a participant
      createdAt: new Date(),
    }
    this.studySessions.set(id, session)
    return session
  }

  async getStudySessionById(id: string): Promise<StudySession | null> {
    return this.studySessions.get(id) || null
  }

  async getUpcomingStudySessions(): Promise<StudySession[]> {
    const now = new Date()
    return Array.from(this.studySessions.values()).filter((session) => {
      const sessionDateTime = new Date(`${session.date}T${session.time}`)
      return sessionDateTime > now
    })
  }

  async getPastStudySessions(): Promise<StudySession[]> {
    const now = new Date()
    return Array.from(this.studySessions.values()).filter((session) => {
      const sessionDateTime = new Date(`${session.date}T${session.time}`)
      return sessionDateTime < now
    })
  }

  async getStudySessionsByHost(hostId: string): Promise<StudySession[]> {
    return Array.from(this.studySessions.values()).filter((session) => session.hostId === hostId)
  }

  async getStudySessionsByParticipant(userId: string): Promise<StudySession[]> {
    return Array.from(this.studySessions.values()).filter((session) => session.participants.includes(userId))
  }

  async joinStudySession(sessionId: string, userId: string): Promise<StudySession | null> {
    const session = this.studySessions.get(sessionId)
    if (session) {
      if (session.participants.length >= session.maxParticipants) {
        throw new Error("Session is full")
      }
      if (!session.participants.includes(userId)) {
        session.participants.push(userId)
        this.studySessions.set(sessionId, session)
      }
      return session
    }
    return null
  }

  async leaveStudySession(sessionId: string, userId: string): Promise<StudySession | null> {
    const session = this.studySessions.get(sessionId)
    if (session) {
      // Host cannot leave their own session
      if (session.hostId === userId) {
        throw new Error("Host cannot leave their own session")
      }

      const index = session.participants.indexOf(userId)
      if (index !== -1) {
        session.participants.splice(index, 1)
        this.studySessions.set(sessionId, session)
      }
      return session
    }
    return null
  }
}

// Export a singleton instance of the database service
export const db = new DatabaseService()

