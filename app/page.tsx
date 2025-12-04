'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/loading-spinner'
import {
  LucideBook,
  LucideVideo,
  LucideMessageSquare,
  LucideUsers,
  LucideCheckCircle,
  LucideArrowRight,
  LucideStar,
  LucideGraduationCap,
  LucideCalendar,
  LucideAward,
} from 'lucide-react'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      // Redirect authenticated users to dashboard
      window.location.href = '/dashboard'
    } else {
      setLoading(false)
    }
  }, [])

  if (loading || isAuthenticated) {
    return <LoadingSpinner fullScreen text="Loading..." />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <LucideGraduationCap className="h-3 w-3 mr-1" />
              The Future of Collaborative Learning
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Learn Together,
              <br />
              <span className="text-primary">Achieve More</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students collaborating in virtual study groups. Share notes, attend video sessions, and
              excel in your academic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/register">
                  Get Started Free <LucideArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Shared Notes</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to enhance your learning experience and help you achieve your academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<LucideVideo className="h-10 w-10" />}
            title="Live Video Sessions"
            description="Join real-time study sessions with HD video and audio. Screen sharing and interactive whiteboards included."
          />
          <FeatureCard
            icon={<LucideBook className="h-10 w-10" />}
            title="Notes Repository"
            description="Upload, organize, and access study materials anytime. Share notes with your study group effortlessly."
          />
          <FeatureCard
            icon={<LucideMessageSquare className="h-10 w-10" />}
            title="Q&A Forum"
            description="Ask questions and get answers from peers and instructors. Build knowledge together through discussion."
          />
          <FeatureCard
            icon={<LucideUsers className="h-10 w-10" />}
            title="Study Groups"
            description="Create or join subject-specific study groups. Collaborate with students who share your learning goals."
          />
          <FeatureCard
            icon={<LucideCalendar className="h-10 w-10" />}
            title="Smart Scheduling"
            description="Never miss a session with automated reminders and calendar integration for all your study activities."
          />
          <FeatureCard
            icon={<LucideAward className="h-10 w-10" />}
            title="Progress Tracking"
            description="Monitor your learning progress with detailed analytics and achievement badges to stay motivated."
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How EduSync Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard number={1} title="Create Your Account" description="Sign up for free in seconds. No credit card required." />
            <StepCard
              number={2}
              title="Join Study Groups"
              description="Browse and join groups that match your subjects and interests."
            />
            <StepCard number={3} title="Start Learning Together" description="Attend sessions, share notes, and achieve your goals." />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Students Love EduSync</h2>
            <div className="space-y-4">
              <BenefitItem text="Study 2x more effectively with collaborative learning" />
              <BenefitItem text="Access quality study materials shared by top students" />
              <BenefitItem text="Get instant help from peers and instructors" />
              <BenefitItem text="Stay motivated with learning streaks and achievements" />
              <BenefitItem text="Flexible schedule - study anytime, anywhere" />
              <BenefitItem text="100% free with no hidden costs" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <LucideStar key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle>Student Testimonial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  "EduSync transformed my study routine! The collaborative sessions helped me understand complex topics, and
                  the notes repository saved me countless hours. My grades improved significantly!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                    SM
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Mitchell</div>
                    <div className="text-sm text-muted-foreground">Computer Science Major</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Excel in Your Studies?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join EduSync today and experience the power of collaborative learning. It's completely free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8">
              <Link href="/register">
                Start Learning Now <LucideArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-2 hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="mb-4 text-primary">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        <LucideCheckCircle className="h-5 w-5 text-primary" />
      </div>
      <p className="text-lg">{text}</p>
    </div>
  )
}


