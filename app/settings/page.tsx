"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/loading-spinner"
import { LucideUser, LucideLock, LucideBell, LucideShield } from "lucide-react"

/**
 * Settings Page
 * User account settings and preferences
 */
export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Email verification
  const [emailVerified, setEmailVerified] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchProfile(parsedUser.id)
    }
    checkEmailVerification()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const userProfileKey = `userProfile_${userId}`
      
      // First check localStorage for user-specific profile
      const savedProfile = localStorage.getItem(userProfileKey)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        setProfile(profile)
        setLoading(false)
        return
      }
      
      // Otherwise fetch from API
      const res = await fetch("/api/profile/me")
      const data = await res.json()
      localStorage.setItem(userProfileKey, JSON.stringify(data))
      setProfile(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      setLoading(false)
    }
  }

  const checkEmailVerification = async () => {
    try {
      const res = await fetch("/api/verify-email/status")
      const data = await res.json()
      setEmailVerified(data.emailVerified)
    } catch (error) {
      console.error("Failed to check verification status:", error)
    }
  }

  const handleSendVerification = async () => {
    setSendingVerification(true)
    try {
      await fetch("/api/verify-email/send", { method: "POST" })
      alert("Verification email sent! Check your inbox.")
    } catch (error) {
      alert("Failed to send verification email")
    } finally {
      setSendingVerification(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("/api/password-reset/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      })

      if (res.ok) {
        alert("Password changed successfully!")
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        const data = await res.json()
        alert(data.message || "Failed to change password")
      }
    } catch (error) {
      alert("Failed to change password")
    }
  }

  const handleUpdatePreferences = async (key, value) => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) return
      
      const parsedUser = JSON.parse(userData)
      
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: {
            ...profile?.preferences,
            [key]: value,
          },
        }),
      })
      fetchProfile(parsedUser.id)
    } catch (error) {
      console.error("Failed to update preferences:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading settings..." />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideUser className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>View your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  {emailVerified ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      Verified
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSendVerification}
                      disabled={sendingVerification}
                    >
                      {sendingVerification ? "Sending..." : "Verify Email"}
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <div>
                <Label>Member Since</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(profile?.joinDate || user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideLock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    minLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    minLength={6}
                    required
                  />
                </div>
                <Button type="submit">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideBell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={profile?.preferences?.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleUpdatePreferences("emailNotifications", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="studyReminders">Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for scheduled study sessions
                  </p>
                </div>
                <Switch
                  id="studyReminders"
                  checked={profile?.preferences?.studyReminders}
                  onCheckedChange={(checked) => handleUpdatePreferences("studyReminders", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="newAnswerNotifications">Answer Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when someone answers your questions
                  </p>
                </div>
                <Switch
                  id="newAnswerNotifications"
                  checked={profile?.preferences?.newAnswerNotifications}
                  onCheckedChange={(checked) =>
                    handleUpdatePreferences("newAnswerNotifications", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LucideShield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>Control your privacy and data sharing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isPublic">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to view your profile
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={profile?.isPublic}
                  onCheckedChange={async (checked) => {
                    try {
                      await fetch("/api/profile", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ isPublic: checked }),
                      })
                      fetchProfile()
                    } catch (error) {
                      console.error("Failed to update privacy:", error)
                    }
                  }}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Management</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Request a copy of your data or delete your account
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Download My Data
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
