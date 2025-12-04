"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideCheckCircle, LucideXCircle, LucideLoader2 } from "lucide-react"
import Link from "next/link"
import { LoadingSpinner } from "@/components/loading-spinner"

/**
 * Email Verification Page
 * Verifies user email using token from query params
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus("error")
      setMessage("No verification token provided")
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const res = await fetch("/api/verify-email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Email verified successfully! You can now log in.")
      } else {
        setStatus("error")
        setMessage(data.message || "Verification failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("An error occurred during verification")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {status === "loading" && (
              <div className="py-8">
                <LoadingSpinner size="lg" text="Verifying your email..." />
              </div>
            )}

            {status === "success" && (
              <>
                <LucideCheckCircle className="h-16 w-16 text-green-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Success!</h3>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  <Link href="/register">
                    <Button>Go to Login</Button>
                  </Link>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <LucideXCircle className="h-16 w-16 text-red-500" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-red-600 mb-2">Verification Failed</h3>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  <div className="flex gap-2">
                    <Link href="/register">
                      <Button variant="outline">Back to Login</Button>
                    </Link>
                    <Link href="/resend-verification">
                      <Button>Resend Email</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
