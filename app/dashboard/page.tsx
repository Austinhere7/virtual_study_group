"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  LucideBook,
  LucideMessageSquare,
  LucideCalendar,
  LucideUsers,
  LucideFileText,
  LucideClock,
  LucideAward,
  LucideTrendingUp,
  LucideVideo,
} from "lucide-react"
import Link from "next/link"

/**
 * User Dashboard
 * Personalized dashboard showing user statistics, recent activity, and quick actions
 */
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats] = useState({
    studyHours: 24,
    sessionsJoined: 12,
    notesShared: 8,
    questionsAnswered: 15,
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      window.location.href = "/login"
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Load user-specific profile data
      const userProfileKey = `userProfile_${parsedUser.id}`
      const profileData = localStorage.getItem(userProfileKey)
      if (profileData) {
        const profile = JSON.parse(profileData)
        setUser((prev) => ({ ...prev, ...profile }))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = "/login"
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />
  }

  if (!user) return null

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.firstName || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Welcome back to your learning hub. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <LucideClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyHours}h</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Joined</CardTitle>
            <LucideUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessionsJoined}</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
            <Progress value={45} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes Shared</CardTitle>
            <LucideFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notesShared}</div>
            <p className="text-xs text-muted-foreground">Helping others learn</p>
            <Progress value={32} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <LucideAward className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAnswered}</div>
            <p className="text-xs text-muted-foreground">Top 10% this month</p>
            <Progress value={88} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Study Sessions</CardTitle>
                  <CardDescription>Your scheduled sessions for this week</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/schedule">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: 'Advanced Mathematics',
                    time: 'Today, 3:00 PM',
                    duration: '2 hours',
                    participants: 8,
                    subject: 'Math',
                  },
                  {
                    title: 'Physics Group Discussion',
                    time: 'Tomorrow, 5:00 PM',
                    duration: '1.5 hours',
                    participants: 12,
                    subject: 'Physics',
                  },
                  {
                    title: 'Literature Analysis',
                    time: 'Wed, 4:30 PM',
                    duration: '1 hour',
                    participants: 6,
                    subject: 'Literature',
                  },
                ].map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <LucideCalendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{session.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <LucideClock className="h-3 w-3" />
                            {session.time}
                          </span>
                          <span>•</span>
                          <span>{session.duration}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <LucideUsers className="h-3 w-3" />
                            {session.participants} participants
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{session.subject}</Badge>
                      <Button size="sm" asChild>
                        <Link href="/schedule">Join</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/video-call" className="block">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <LucideVideo className="h-6 w-6" />
                    <span>Join Video Call</span>
                  </Button>
                </Link>
                <Link href="/notes" className="block">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <LucideBook className="h-6 w-6" />
                    <span>Upload Notes</span>
                  </Button>
                </Link>
                <Link href="/questions" className="block">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <LucideMessageSquare className="h-6 w-6" />
                    <span>Ask Question</span>
                  </Button>
                </Link>
                <Link href="/study-groups" className="block">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <LucideUsers className="h-6 w-6" />
                    <span>Browse Groups</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
                <Badge variant="secondary" className="mb-4">
                  {user?.role || 'Student'}
                </Badge>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    icon: <LucideBook className="h-4 w-4" />,
                    text: 'Uploaded "Calculus Notes"',
                    time: '2 hours ago',
                  },
                  {
                    icon: <LucideMessageSquare className="h-4 w-4" />,
                    text: 'Answered a question',
                    time: '5 hours ago',
                  },
                  {
                    icon: <LucideUsers className="h-4 w-4" />,
                    text: 'Joined "Physics Study Group"',
                    time: '1 day ago',
                  },
                  {
                    icon: <LucideAward className="h-4 w-4" />,
                    text: 'Earned "Helpful" badge',
                    time: '2 days ago',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground mb-4">Days in a row!</p>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div key={day} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <LucideTrendingUp className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Keep it up! Study today to maintain your streak.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

