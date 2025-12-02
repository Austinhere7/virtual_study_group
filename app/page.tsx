import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideBook, LucideVideo, LucideMessageSquare, LucideThumbsUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Virtual Study Group</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Collaborate with peers, share notes, and learn together in a virtual environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          title="Video Calls"
          description="Join virtual study sessions with real-time video conferencing"
          icon={<LucideVideo className="h-8 w-8" />}
          href="/video-call"
        />
        <FeatureCard
          title="Notes Repository"
          description="Upload, organize and access study materials"
          icon={<LucideBook className="h-8 w-8" />}
          href="/notes"
        />
        <FeatureCard
          title="Teacher Feedback"
          description="Provide constructive feedback to your instructors"
          icon={<LucideThumbsUp className="h-8 w-8" />}
          href="/feedback"
        />
        <FeatureCard
          title="Q&A Forum"
          description="Ask questions and get answers from peers and teachers"
          icon={<LucideMessageSquare className="h-8 w-8" />}
          href="/questions"
        />
      </div>

      <div className="mt-16 bg-muted rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-muted-foreground mb-6">
              Join our virtual study group platform to enhance your learning experience. Connect with peers, share
              knowledge, and improve your academic performance.
            </p>
            <Button size="lg" asChild>
              <Link href="/register">Create an Account</Link>
            </Button>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Upcoming Study Sessions</h3>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Advanced Mathematics</span>
                <span className="text-muted-foreground">Today, 3:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Physics Group Discussion</span>
                <span className="text-muted-foreground">Tomorrow, 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Literature Analysis</span>
                <span className="text-muted-foreground">Wed, 4:30 PM</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/schedule">View All Sessions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
  href,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2 text-primary">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={href}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

