"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LucideThumbsUp, LucideCheck } from "lucide-react"

// Mock data for teachers
const teachers = [
  { id: 1, name: "Dr. Sarah Johnson", subject: "Mathematics", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 2, name: "Prof. Michael Chen", subject: "Physics", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 3, name: "Dr. Emily Rodriguez", subject: "Literature", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 4, name: "Prof. David Kim", subject: "Chemistry", avatar: "/placeholder.svg?height=50&width=50" },
]

export default function FeedbackPage() {
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [rating, setRating] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [previousFeedback, setPreviousFeedback] = useState([
    {
      id: 1,
      teacher: "Dr. Sarah Johnson",
      rating: "4",
      feedback: "Excellent explanations of complex topics. Would appreciate more practice problems.",
      date: "2023-03-10",
      status: "Acknowledged",
    },
    {
      id: 2,
      teacher: "Prof. Michael Chen",
      rating: "5",
      feedback: "Very engaging lectures and helpful office hours.",
      date: "2023-02-15",
      status: "Pending",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would submit the feedback to a server here
    console.log({
      teacherId: selectedTeacher,
      rating,
      feedback: feedbackText,
      anonymous: isAnonymous,
    })

    // Add to previous feedback for demo purposes
    const newFeedback = {
      id: previousFeedback.length + 1,
      teacher: teachers.find((t) => t.id.toString() === selectedTeacher)?.name || "",
      rating,
      feedback: feedbackText,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    }

    setPreviousFeedback([newFeedback, ...previousFeedback])

    // Reset form and show success message
    setSelectedTeacher("")
    setRating("")
    setFeedbackText("")
    setIsAnonymous(false)
    setIsSubmitted(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Feedback</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>
                Your feedback helps teachers improve their teaching methods and course content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center text-green-800">
                  <LucideCheck className="h-5 w-5 mr-2 text-green-600" />
                  <span>Thank you for your feedback! It has been submitted successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="teacher">Select Teacher</Label>
                      <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id.toString()}>
                              {teacher.name} - {teacher.subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Rating</Label>
                      <RadioGroup value={rating} onValueChange={setRating} className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex flex-col items-center">
                            <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="sr-only" />
                            <Label
                              htmlFor={`rating-${value}`}
                              className={`cursor-pointer p-2 rounded-full ${rating === value.toString() ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                            >
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="feedback">Your Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your thoughts about the teaching style, course content, etc."
                        rows={5}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="anonymous" className="text-sm font-normal">
                        Submit anonymously
                      </Label>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!selectedTeacher || !rating || !feedbackText || isSubmitted}
              >
                <LucideThumbsUp className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Previous Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previousFeedback.length > 0 ? (
                  previousFeedback.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{feedback.teacher}</div>
                        <Badge status={feedback.status} />
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} filled={i < Number.parseInt(feedback.rating)} />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">{feedback.date}</span>
                      </div>
                      <p className="text-sm">{feedback.feedback}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No previous feedback</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      className={`h-4 w-4 ${filled ? "text-yellow-500" : "text-muted-foreground"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  )
}

function Badge({ status }: { status: string }) {
  let color = ""

  switch (status) {
    case "Acknowledged":
      color = "bg-green-100 text-green-800"
      break
    case "Pending":
      color = "bg-yellow-100 text-yellow-800"
      break
    default:
      color = "bg-gray-100 text-gray-800"
  }

  return <span className={`text-xs px-2 py-1 rounded-full ${color}`}>{status}</span>
}

