"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinnerCompact } from "@/components/loading-spinner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideCheckCircle, LucideXCircle } from "lucide-react"
import Link from "next/link"

/**
 * Password Reset Page
 * Allows users to reset their password using a token
 */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setStatus("error")
      setMessage("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setStatus("error")
      setMessage("Password must be at least 6 characters")
      return
    }

    if (!token) {
      setStatus("error")
      setMessage("Invalid reset token")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/password-reset/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Password reset successfully!")
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to reset password")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Invalid Link</CardTitle>
              <CardDescription>This password reset link is invalid</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <LucideXCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <Link href="/forgot-password">
                <Button>Request New Link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="flex flex-col items-center space-y-4">
                <LucideCheckCircle className="h-16 w-16 text-green-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Success!</h3>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  <Link href="/register">
                    <Button>Go to Login</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === "error" && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                    {message}
                  </div>
                )}

                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinnerCompact />
                      <span className="ml-2">Resetting...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
