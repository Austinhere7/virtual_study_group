"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LucideCalendar, LucideVideo, LucideUsers, LucideClock, LucidePlus } from "lucide-react"

// Mock data for study sessions
const mockSessions = [
  {
    id: 1,
    title: "Advanced Mathematics",
    description: "Covering calculus topics including limits, derivatives, and integrals.",
    subject: "Mathematics",
    date: "2023-03-23",
    time: "15:00",
    duration: 60,
    host: "Dr. Sarah Johnson",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: 12,
    maxParticipants: 20,
  },
  {
    id: 2,
    title: "Physics Group Discussion",
    description: "Discussion on mechanics and Newton's laws of motion.",
    subject: "Physics",
    date: "2023-03-24",
    time: "17:00",
    duration: 90,
    host: "Prof. Michael Chen",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: 8,
    maxParticipants: 15,
  },
  {
    id: 3,
    title: "Literature Analysis",
    description: "Analysis of Shakespeare's Hamlet and themes of revenge.",
    subject: "Literature",
    date: "2023-03-25",
    time: "16:30",
    duration: 75,
    host: "Dr. Emily Rodriguez",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: 10,
    maxParticipants: 15,
  },
  {
    id: 4,
    title: "Chemistry Lab Preparation",
    description: "Preparation for the upcoming titration lab experiment.",
    subject: "Chemistry",
    date: "2023-03-26",
    time: "14:00",
    duration: 60,
    host: "Prof. David Kim",
    hostAvatar: "/placeholder.svg?height=40&width=40",
    participants: 6,
    maxParticipants: 12,
  },
]

export default function SchedulePage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newSession, setNewSession] = useState({
    title: "",
    description: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    maxParticipants: "",
  })
  const [activeTab, setActiveTab] = useState("upcoming")

  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split("T")[0]

  // Filter sessions based on the active tab
  const filteredSessions = mockSessions.filter((session) => {
    const sessionDate = new Date(`${session.date}T${session.time}`)
    const now = new Date()

    if (activeTab === "upcoming") {
      return sessionDate > now
    } else if (activeTab === "past") {
      return sessionDate < now
    } else if (activeTab === "my-sessions") {
      // In a real app, you would filter based on the logged-in user
      return false
    }
    return true
  })

  // Sort sessions by date and time
  filteredSessions.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time to display in 12-hour format
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Handle form submission for new session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the session to a server here
    console.log("Creating session:", newSession)
    setCreateDialogOpen(false)
    // Reset form
    setNewSession({
      title: "",
      description: "",
      subject: "",
      date: "",
      time: "",
      duration: "",
      maxParticipants: "",
    })
    // Show success message or update UI
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Study Sessions</h1>
          <p className="text-muted-foreground mt-1">Join or schedule virtual study sessions</p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <LucidePlus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Session</DialogTitle>
              <DialogDescription>Schedule a virtual study session for your group.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSession}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Calculus Study Group"
                    value={newSession.title}
                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what will be covered in this session..."
                    rows={3}
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => setNewSession({ ...newSession, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={newSession.date}
                      onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSession.time}
                      onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="15"
                      step="15"
                      placeholder="60"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="2"
                      placeholder="20"
                      value={newSession.maxParticipants}
                      onChange={(e) => setNewSession({ ...newSession, maxParticipants: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Schedule Session</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="my-sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} formatDate={formatDate} formatTime={formatTime} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <LucideCalendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No upcoming sessions</h3>
                <p className="text-muted-foreground mt-1 mb-4">Create a new study session to get started</p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <LucidePlus className="mr-2 h-4 w-4" />
                  Create Session
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-sessions" className="mt-0">
          <div className="text-center py-12">
            <LucideCalendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">You haven't created any sessions yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Schedule a study session for your group</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <LucidePlus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-0">
          <div className="text-center py-12">
            <LucideCalendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No past sessions</h3>
            <p className="text-muted-foreground mt-1">Your completed study sessions will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SessionCard({
  session,
  formatDate,
  formatTime,
}: {
  session: any
  formatDate: (date: string) => string
  formatTime: (time: string) => string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {session.subject}
            </Badge>
            <CardTitle>{session.title}</CardTitle>
            <CardDescription className="mt-1">Hosted by {session.host}</CardDescription>
          </div>
          <Avatar>
            <AvatarImage src={session.hostAvatar} alt={session.host} />
            <AvatarFallback>{session.host.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{session.description}</p>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <LucideCalendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(session.date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <LucideClock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatTime(session.time)} ({session.duration} minutes)
            </span>
          </div>
          <div className="flex items-center text-sm">
            <LucideUsers className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {session.participants}/{session.maxParticipants} participants
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button variant="outline">View Details</Button>
          <Button>
            <LucideVideo className="mr-2 h-4 w-4" />
            Join Session
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

