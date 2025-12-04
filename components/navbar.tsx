'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

/**
 * Navigation Bar Component
 * Displays site branding, navigation, and theme toggle
 */
export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="font-bold text-xl hover:opacity-80 transition">
          EduSync
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/video-call" className="text-sm font-medium hover:text-primary transition">
            Video Calls
          </Link>
          <Link href="/notes" className="text-sm font-medium hover:text-primary transition">
            Notes
          </Link>
          <Link href="/questions" className="text-sm font-medium hover:text-primary transition">
            Q&A
          </Link>
          <Link href="/schedule" className="text-sm font-medium hover:text-primary transition">
            Schedule
          </Link>
          <Link href="/feedback" className="text-sm font-medium hover:text-primary transition">
            Feedback
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
