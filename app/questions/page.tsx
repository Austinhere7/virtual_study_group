"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LucideMessageSquare, LucideThumbsUp, LucideThumbsDown, LucideCheck, LucideSearch } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for questions
const mockQuestions = [
  {
    id: 1,
    title: "How do you solve a quadratic equation using the quadratic formula?",
    content:
      "I'm having trouble understanding how to apply the quadratic formula to solve equations. Can someone explain the steps?",
    author: "John Doe",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-15T10:30:00",
    subject: "Mathematics",
    answers: 3,
    solved: true,
    votes: 12,
  },
  {
    id: 2,
    title: "What's the difference between mitosis and meiosis?",
    content:
      "I keep confusing these two cell division processes. Can someone explain the key differences and when each occurs?",
    author: "Jane Smith",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-14T14:45:00",
    subject: "Biology",
    answers: 2,
    solved: false,
    votes: 8,
  },
  {
    id: 3,
    title: "How to analyze the theme of identity in 'The Great Gatsby'?",
    content:
      "I need to write an essay on the theme of identity in The Great Gatsby. What are some key points I should focus on?",
    author: "Alex Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-12T09:15:00",
    subject: "Literature",
    answers: 1,
    solved: false,
    votes: 5,
  },
  {
    id: 4,
    title: "Can someone explain Newton's Third Law with examples?",
    content:
      "I understand the basic concept that for every action there is an equal and opposite reaction, but I'd like some real-world examples to help me visualize it better.",
    author: "Sarah Williams",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-10T16:20:00",
    subject: "Physics",
    answers: 4,
    solved: true,
    votes: 15,
  },
]

// Mock data for answers to the first question
const mockAnswers = [
  {
    id: 1,
    questionId: 1,
    content:
      "The quadratic formula is used to solve equations in the form ax² + bx + c = 0. The formula is: x = (-b ± √(b² - 4ac)) / 2a. First, identify the values of a, b, and c from your equation, then plug them into the formula. The ± symbol means you'll get two solutions (unless the discriminant b² - 4ac equals zero, in which case you get one solution).",
    author: "Dr. Sarah Johnson",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-15T11:15:00",
    isTeacher: true,
    votes: 8,
    accepted: true,
  },
  {
    id: 2,
    questionId: 1,
    content:
      "Here's a step-by-step example: For 2x² + 5x - 3 = 0\n1. Identify a=2, b=5, c=-3\n2. Plug into the formula: x = (-5 ± √(5² - 4×2×(-3))) / (2×2)\n3. Simplify: x = (-5 ± √(25 + 24)) / 4\n4. x = (-5 ± √49) / 4\n5. x = (-5 ± 7) / 4\n6. x = (-5 + 7) / 4 or (-5 - 7) / 4\n7. x = 2/4 or -12/4\n8. x = 0.5 or -3",
    author: "Michael Brown",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-15T12:30:00",
    isTeacher: false,
    votes: 5,
    accepted: false,
  },
  {
    id: 3,
    questionId: 1,
    content:
      "I find it helpful to remember that the discriminant (b² - 4ac) tells you how many solutions you'll have:\n- If b² - 4ac > 0: Two real solutions\n- If b² - 4ac = 0: One real solution (repeated)\n- If b² - 4ac < 0: Two complex solutions",
    author: "Emily Rodriguez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    date: "2023-03-15T14:45:00",
    isTeacher: false,
    votes: 3,
    accepted: false,
  },
]

export default function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [askDialogOpen, setAskDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    subject: "",
  })
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [newAnswer, setNewAnswer] = useState("")

  // Get unique subjects for filter
  const subjects = Array.from(new Set(mockQuestions.map((q) => q.subject)))

  // Filter questions based on search term and selected subject
  const filteredQuestions = mockQuestions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || question.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  // Handle form submission for new question
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the question to a server here
    console.log("Asking question:", newQuestion)
    setAskDialogOpen(false)
    // Reset form
    setNewQuestion({
      title: "",
      content: "",
      subject: "",
    })
    // Show success message or update UI
  }

  // Handle form submission for new answer
  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the answer to a server here
    console.log("Submitting answer:", { questionId: activeQuestion, content: newAnswer })
    // Reset form
    setNewAnswer("")
    // Show success message or update UI
  }

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Q&A Forum</h1>
          <p className="text-muted-foreground mt-1">Ask questions and get answers from peers and teachers</p>
        </div>

        <Dialog open={askDialogOpen} onOpenChange={setAskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <LucideMessageSquare className="mr-2 h-4 w-4" />
              Ask a Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>Be specific and provide details to get better answers.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAskQuestion}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., How do I solve this math problem?"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Details</Label>
                  <Textarea
                    id="content"
                    placeholder="Provide context and details about your question..."
                    rows={5}
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => setNewQuestion({ ...newQuestion, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={!newQuestion.title || !newQuestion.content || !newQuestion.subject}>
                  Post Question
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Select onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="my-questions">My Questions</TabsTrigger>
          <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {activeQuestion ? (
            <div>
              <Button variant="ghost" className="mb-4" onClick={() => setActiveQuestion(null)}>
                ← Back to Questions
              </Button>

              {/* Display the active question */}
              {mockQuestions
                .filter((q) => q.id === activeQuestion)
                .map((question) => (
                  <div key={question.id}>
                    <Card className="mb-6">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{question.title}</CardTitle>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={question.authorAvatar} alt={question.author} />
                                  <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{question.author}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{formatRelativeTime(question.date)}</span>
                              <Badge variant="outline">{question.subject}</Badge>
                              {question.solved && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <LucideCheck className="mr-1 h-3 w-3" />
                                  Solved
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <LucideThumbsUp className="h-4 w-4 mr-1" />
                              {question.votes}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">{question.content}</p>
                      </CardContent>
                    </Card>

                    <h2 className="text-xl font-bold mb-4">{mockAnswers.length} Answers</h2>

                    {/* Display answers */}
                    {mockAnswers.map((answer) => (
                      <Card key={answer.id} className={`mb-4 ${answer.accepted ? "border-green-500" : ""}`}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={answer.authorAvatar} alt={answer.author} />
                                <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm font-medium">{answer.author}</span>
                                {answer.isTeacher && (
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    Teacher
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(answer.date)}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <p className="whitespace-pre-line">{answer.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <LucideThumbsUp className="h-4 w-4 mr-1" />
                              {answer.votes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <LucideThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                          {answer.accepted && (
                            <Badge className="bg-green-100 text-green-800">
                              <LucideCheck className="mr-1 h-3 w-3" />
                              Accepted Answer
                            </Badge>
                          )}
                        </CardFooter>
                      </Card>
                    ))}

                    {/* Answer form */}
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>Your Answer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmitAnswer}>
                          <Textarea
                            placeholder="Write your answer here..."
                            rows={6}
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            required
                          />
                          <Button type="submit" className="mt-4" disabled={!newAnswer.trim()}>
                            Post Answer
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                  <Card
                    key={question.id}
                    className="cursor-pointer hover:border-primary"
                    onClick={() => setActiveQuestion(question.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{question.title}</CardTitle>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={question.authorAvatar} alt={question.author} />
                                <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{question.author}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(question.date)}</span>
                            <Badge variant="outline">{question.subject}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {question.answers} {question.answers === 1 ? "answer" : "answers"}
                          </span>
                          <Button variant="outline" size="sm">
                            <LucideThumbsUp className="h-4 w-4 mr-1" />
                            {question.votes}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="line-clamp-2 text-muted-foreground">{question.content}</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveQuestion(question.id)
                          }}
                        >
                          Read more
                        </Button>
                        {question.solved && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <LucideCheck className="mr-1 h-3 w-3" />
                            Solved
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <LucideMessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No questions found</h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {searchTerm || selectedSubject
                      ? "Try adjusting your search or filters"
                      : "Be the first to ask a question"}
                  </p>
                  <Button onClick={() => setAskDialogOpen(true)}>Ask a Question</Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-questions" className="mt-0">
          <div className="text-center py-12">
            <LucideMessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">You haven't asked any questions yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Ask a question to get help from your peers and teachers</p>
            <Button onClick={() => setAskDialogOpen(true)}>Ask a Question</Button>
          </div>
        </TabsContent>

        <TabsContent value="unanswered" className="mt-0">
          <div className="space-y-4">
            {filteredQuestions.filter((q) => q.answers === 0).length > 0 ? (
              filteredQuestions
                .filter((q) => q.answers === 0)
                .map((question) => (
                  <Card
                    key={question.id}
                    className="cursor-pointer hover:border-primary"
                    onClick={() => setActiveQuestion(question.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{question.title}</CardTitle>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={question.authorAvatar} alt={question.author} />
                                <AvatarFallback>{question.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{question.author}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{formatRelativeTime(question.date)}</span>
                            <Badge variant="outline">{question.subject}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">0 answers</span>
                          <Button variant="outline" size="sm">
                            <LucideThumbsUp className="h-4 w-4 mr-1" />
                            {question.votes}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="line-clamp-2 text-muted-foreground">{question.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveQuestion(question.id)
                        }}
                      >
                        Answer this question
                      </Button>
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <div className="text-center py-12">
                <LucideMessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No unanswered questions</h3>
                <p className="text-muted-foreground mt-1">All questions have been answered. Great job!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    >
      {children}
    </label>
  )
}

