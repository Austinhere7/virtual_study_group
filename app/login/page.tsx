"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinnerCompact } from "@/components/loading-spinner"
import { 
  LucideMail, 
  LucideLock, 
  LucideGraduationCap,
  LucideAlertCircle,
  LucideEye,
  LucideEyeOff,
  LucideShield,
  LucideLogIn
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        setErrors({ submit: data.message || "Login failed. Please check your credentials." })
      }
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-3">
              <LucideGraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {errors.submit && (
            <Alert variant="destructive" className="mb-6">
              <LucideAlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LucideLock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinnerCompact />
                  <span className="ml-2">Signing In...</span>
                </>
              ) : (
                <>
                  <LucideLogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <LucideShield className="h-4 w-4" />
            <span>Your connection is secure and encrypted</span>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium underline underline-offset-4 hover:text-primary/80">
              Create one here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
