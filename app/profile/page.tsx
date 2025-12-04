"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LucideUser, LucideUpload, LucideGithub, LucideLinkedin, LucideTwitter, LucideMail } from "lucide-react"

/**
 * User Profile Page
 * Displays and allows editing of user profile information
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: "",
    subject: "",
    grade: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
    },
    preferences: {
      emailNotifications: true,
      studyReminders: true,
      newAnswerNotifications: true,
    },
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile/me")
      const data = await res.json()
      setProfile(data)
      setFormData({
        bio: data.bio || "",
        subject: data.subject || "",
        grade: data.grade || "",
        socialLinks: data.socialLinks || {},
        preferences: data.preferences || {},
      })
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [name]: value,
      },
    })
  }

  const handlePreferenceChange = (key) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [key]: !formData.preferences[key],
      },
    })
  }

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      setProfile(data)
      setEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      alert("Failed to update profile")
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append("avatar", file)

    try {
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formDataUpload,
      })
      const data = await res.json()
      setProfile({ ...profile, avatar: data.avatar })
      alert("Avatar uploaded successfully!")
    } catch (error) {
      alert("Failed to upload avatar")
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card - Left Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar} />
                  <AvatarFallback>
                    <LucideUser className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>

                {editing && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <Button size="sm" variant="outline" className="w-full">
                      <LucideUpload className="h-4 w-4 mr-2" />
                      Change Avatar
                    </Button>
                  </label>
                )}

                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {profile?.userId?.firstName} {profile?.userId?.lastName}
                  </h2>
                  <p className="text-muted-foreground text-sm">{profile?.subject}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Email</Label>
                <p className="flex items-center gap-2">
                  <LucideMail className="h-4 w-4" />
                  {profile?.userId?.email}
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Member Since</Label>
                <p>{new Date(profile?.joinDate).toLocaleDateString()}</p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Grade/Level</Label>
                <Badge variant="secondary">{profile?.grade}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Notes Uploaded</span>
                <Badge variant="outline">{profile?.stats?.notesUploaded || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Questions Asked</span>
                <Badge variant="outline">{profile?.stats?.questionsAsked || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Answers Given</span>
                <Badge variant="outline">{profile?.stats?.answersGiven || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sessions Hosted</span>
                <Badge variant="outline">{profile?.stats?.sessionsHosted || 0}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Sessions Attended</span>
                <Badge variant="outline">{profile?.stats?.sessionsAttended || 0}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile - Right Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your profile details and preferences</CardDescription>
              </div>
              <Button
                onClick={() => setEditing(!editing)}
                variant={editing ? "destructive" : "default"}
              >
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="social">Social Links</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      disabled={!editing}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) =>
                          setFormData({ ...formData, subject: value })
                        }
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mathematics">Mathematics</SelectItem>
                          <SelectItem value="Physics">Physics</SelectItem>
                          <SelectItem value="Chemistry">Chemistry</SelectItem>
                          <SelectItem value="Biology">Biology</SelectItem>
                          <SelectItem value="Literature">Literature</SelectItem>
                          <SelectItem value="History">History</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="grade">Grade/Level</Label>
                      <Select
                        value={formData.grade}
                        onValueChange={(value) =>
                          setFormData({ ...formData, grade: value })
                        }
                        disabled={!editing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9">Grade 9</SelectItem>
                          <SelectItem value="10">Grade 10</SelectItem>
                          <SelectItem value="11">Grade 11</SelectItem>
                          <SelectItem value="12">Grade 12</SelectItem>
                          <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Social Links Tab */}
                <TabsContent value="social" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="flex gap-2">
                      <LucideTwitter className="h-10 w-10 text-blue-400 flex-shrink-0" />
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.socialLinks.twitter || ""}
                        onChange={handleSocialChange}
                        placeholder="@username"
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="flex gap-2">
                      <LucideLinkedin className="h-10 w-10 text-blue-600 flex-shrink-0" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.socialLinks.linkedin || ""}
                        onChange={handleSocialChange}
                        placeholder="linkedin.com/in/username"
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <div className="flex gap-2">
                      <LucideGithub className="h-10 w-10 flex-shrink-0" />
                      <Input
                        id="github"
                        name="github"
                        value={formData.socialLinks.github || ""}
                        onChange={handleSocialChange}
                        placeholder="github.com/username"
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.preferences.emailNotifications}
                        onChange={() => handlePreferenceChange("emailNotifications")}
                        disabled={!editing}
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Study Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders for scheduled sessions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.preferences.studyReminders}
                        onChange={() => handlePreferenceChange("studyReminders")}
                        disabled={!editing}
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label className="font-medium">Answer Notifications</Label>
                        <p className="text-sm text-muted-foreground">Notify when someone answers your questions</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.preferences.newAnswerNotifications}
                        onChange={() => handlePreferenceChange("newAnswerNotifications")}
                        disabled={!editing}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            {editing && (
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
