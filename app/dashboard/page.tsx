"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LucideBook,
  LucideHelpCircle,
  LucideMessageSquare,
  LucideCalendar,
  LucideUsers,
  LucideArrowRight,
  LucideFileText,
  LucideBarChart3,
} from "lucide-react"
import Link from "next/link"

/**
 * User Dashboard
 * Personalized dashboard showing user statistics, recent activity, and quick actions
 */
export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      window.location.href = "/register"
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDashboardData()
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = "/register"
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, activityRes] = await Promise.all([
        fetch("/api/profile/me"),
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/activity"),
      ])

      if (profileRes.ok) setProfile(await profileRes.json())
      if (statsRes.ok) setStats(await statsRes.json())
      if (activityRes.ok) setRecentActivity(await activityRes.json())
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              {profile?.subject ? `${profile.subject} • ${profile.grade}` : "Complete your profile to get started"}
            </p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes</CardTitle>
            <LucideBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.notesUploaded || 0}</div>
            <p className="text-xs text-muted-foreground">uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <LucideHelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.questionsAsked || 0}</div>
            <p className="text-xs text-muted-foreground">asked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Answers</CardTitle>
            <LucideMessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.answersGiven || 0}</div>
            <p className="text-xs text-muted-foreground">provided</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <LucideCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.sessionsAttended || 0) + (stats?.sessionsHosted || 0)}</div>
            <p className="text-xs text-muted-foreground">attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <LucideUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.groupsJoined || 0}</div>
            <p className="text-xs text-muted-foreground">joined</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions on EduSync</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="mt-1">
                        {activity.type === "note" && <LucideBook className="h-4 w-4 text-blue-500" />}
                        {activity.type === "question" && <LucideHelpCircle className="h-4 w-4 text-yellow-500" />}
                        {activity.type === "answer" && <LucideMessageSquare className="h-4 w-4 text-green-500" />}
                        {activity.type === "session" && <LucideCalendar className="h-4 w-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <LucideFileText className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start something new</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/notes">
                  <Button variant="outline" className="w-full justify-start">
                    <LucideBook className="h-4 w-4 mr-2" />
                    Upload Notes
                  </Button>
                </Link>
                <Link href="/questions">
                  <Button variant="outline" className="w-full justify-start">
                    <LucideHelpCircle className="h-4 w-4 mr-2" />
                    Ask Question
                  </Button>
                </Link>
                <Link href="/video-call">
                  <Button variant="outline" className="w-full justify-start">
                    <LucideCalendar className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </Link>
                <Link href="/schedule">
                  <Button variant="outline" className="w-full justify-start">
                    <LucideUsers className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-semibold">{profile ? "75%" : "50%"}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: profile ? "75%" : "50%" }}
                  ></div>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm" className="w-full">
                  Complete Profile
                  <LucideArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <LucideBarChart3 className="h-4 w-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sessions attended</span>
                <span className="font-semibold">{stats?.weeklySessionsAttended || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Notes uploaded</span>
                <span className="font-semibold">{stats?.weeklyNotesUploaded || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Questions asked</span>
                <span className="font-semibold">{stats?.weeklyQuestionsAsked || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recommended */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/questions">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Badge className="mr-2">New</Badge>
                  Unanswered Questions
                </Button>
              </Link>
              <Link href="/schedule">
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                  <Badge className="mr-2">Today</Badge>
                  Upcoming Sessions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
