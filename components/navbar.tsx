'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LucideUser, LucideLogOut, LucideSettings, LucideBell, LucideMessageCircle } from 'lucide-react'

/**
 * Navigation Bar Component
 * Displays site branding, navigation, theme toggle, and user account menu
 */
export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [user, setUser] = React.useState(null)
  const [userAvatar, setUserAvatar] = React.useState(null)

  React.useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      // Get user data from localStorage
      const userData = localStorage.getItem('user')
      if (userData && userData !== 'undefined') {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
        }
      }
      // Fetch user profile for avatar
      fetchUserProfile()
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/profile/me')
      const data = await res.json()
      setUserAvatar(data.avatar)
    } catch (error) {
      console.error('Failed to fetch user avatar:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/" className="font-bold text-xl hover:opacity-80 transition">
          EduSync
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 items-center">
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition">
                Dashboard
              </Link>
              <Link href="/study-groups" className="text-sm font-medium hover:text-primary transition">
                Groups
              </Link>
            </>
          )}
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
          {isAuthenticated && (
            <>
              <Link href="/notifications" className="relative text-sm font-medium hover:text-primary transition">
                <LucideBell className="h-5 w-5" />
              </Link>
              <Link href="/messages" className="relative text-sm font-medium hover:text-primary transition">
                <LucideMessageCircle className="h-5 w-5" />
              </Link>
            </>
          )}
          <ThemeToggle />
          
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <LucideUser className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center">
                    <LucideSettings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LucideLogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
