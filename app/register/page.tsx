"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { 
  LucideUser, 
  LucideMail, 
  LucideLock, 
  LucideGraduationCap, 
  LucideBook,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideEye,
  LucideEyeOff,
  LucideShield
} from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    subject: "",
    grade: "",
    institution: "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setFormData((prev) => ({ ...prev, role: value }))
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (activeTab === "student" && !formData.grade) {
      newErrors.grade = "Please select your grade"
    }

    if (activeTab === "teacher" && !formData.subject) {
      newErrors.subject = "Please select your subject"
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: "", color: "" }
    
    let strength = 0
    if (password.length >= 6) strength += 25
    if (password.length >= 10) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 15
    if (/[^A-Za-z0-9]/.test(password)) strength += 10

    let label = ""
    let color = ""
    if (strength < 25) { label = "Weak"; color = "bg-red-500" }
    else if (strength < 50) { label = "Fair"; color = "bg-orange-500" }
    else if (strength < 75) { label = "Good"; color = "bg-yellow-500" }
    else { label = "Strong"; color = "bg-green-500" }

    return { strength, label, color }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subscribeNewsletter,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        setErrors({ submit: data.message || "Registration failed. Please try again." })
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <LucideGraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Create Your Account</CardTitle>
          <CardDescription className="text-base">
            Join EduSync and start your collaborative learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="data-[state=active]:bg-primary">
                <LucideGraduationCap className="h-4 w-4 mr-2" />
                Student
              </TabsTrigger>
              <TabsTrigger value="teacher" className="data-[state=active]:bg-primary">
                <LucideBook className="h-4 w-4 mr-2" />
                Teacher
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {errors.submit && (
            <Alert variant="destructive" className="mb-6">
              <LucideAlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <LucideUser className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Personal Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <LucideMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">We'll send a verification link to this email</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">School/Institution (Optional)</Label>
                <Input
                  id="institution"
                  name="institution"
                  placeholder="e.g., Stanford University"
                  value={formData.institution}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2">
                <LucideShield className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Account Security</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <LucideLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password Strength: {passwordStrength.label}</span>
                      <span>{passwordStrength.strength}%</span>
                    </div>
                    <Progress value={passwordStrength.strength} className="h-1" />
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <LucideLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <LucideCheckCircle2 className="h-3 w-3" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2">
                <LucideBook className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">Academic Information</h3>
              </div>

              {activeTab === "student" && (
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Year *</Label>
                  <Select onValueChange={(value) => handleSelectChange("grade", value)}>
                    <SelectTrigger className={errors.grade ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9">9th Grade (Freshman)</SelectItem>
                      <SelectItem value="10">10th Grade (Sophomore)</SelectItem>
                      <SelectItem value="11">11th Grade (Junior)</SelectItem>
                      <SelectItem value="12">12th Grade (Senior)</SelectItem>
                      <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                      <SelectItem value="PhD">PhD Student</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.grade && (
                    <p className="text-xs text-red-500">{errors.grade}</p>
                  )}
                </div>
              )}

              {activeTab === "teacher" && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Primary Subject *</Label>
                  <Select onValueChange={(value) => handleSelectChange("subject", value)}>
                    <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your teaching subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Literature">English/Literature</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="Foreign Languages">Foreign Languages</SelectItem>
                      <SelectItem value="Arts">Arts & Humanities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-red-500">{errors.subject}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Brief Bio (Optional)</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder={activeTab === "student" ? "Tell us about your academic interests..." : "Share your teaching experience and expertise..."}
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/500</p>
              </div>
            </div>

            {/* Terms and Preferences */}
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    setAcceptedTerms(checked as boolean)
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }))
                  }}
                  className={errors.terms ? "border-red-500" : ""}
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </Label>
                  {errors.terms && (
                    <p className="text-xs text-red-500">{errors.terms}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={subscribeNewsletter}
                  onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                />
                <Label htmlFor="newsletter" className="text-sm font-normal cursor-pointer">
                  Send me study tips, platform updates, and educational resources
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Creating Account...
                </>
              ) : (
                <>
                  <LucideCheckCircle2 className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <LucideShield className="h-4 w-4" />
            <span>Your data is secure and encrypted</span>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium underline underline-offset-4 hover:text-primary/80">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
