"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideCheckCircle, LucideMail } from "lucide-react"
import Link from "next/link"

/**
 * Forgot Password Page
 * Request password reset email
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("If that email exists, we've sent a password reset link")
      } else {
        setStatus("error")
        setMessage(data.message || "Failed to send reset email")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>We'll send you a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="flex flex-col items-center space-y-4">
                <LucideCheckCircle className="h-16 w-16 text-green-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Check Your Email</h3>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  <Link href="/register">
                    <Button variant="outline">Back to Login</Button>
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

                <div className="text-center mb-6">
                  <LucideMail className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
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
