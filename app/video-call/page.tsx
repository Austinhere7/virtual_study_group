"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LucideMic,
  LucideMicOff,
  LucideVideo,
  LucideVideoOff,
  LucidePhoneOff,
  LucideMessageSquare,
  LucideUsers,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function VideoCallPage() {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: "John Doe", text: "Hi everyone! Ready for the study session?", time: "2:30 PM" },
    { sender: "Jane Smith", text: "Yes, I've prepared my notes on chapter 5.", time: "2:31 PM" },
    { sender: "Alex Johnson", text: "I have some questions about the last problem set.", time: "2:32 PM" },
  ])
  const localVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Simulating getting user media for the demo
    if (isVideoOn && localVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err)
        })
    }

    return () => {
      // Clean up the stream when component unmounts
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isVideoOn])

  const toggleMic = () => setIsMicOn(!isMicOn)
  const toggleVideo = () => setIsVideoOn(!isVideoOn)

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        sender: "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  const participants = [
    { name: "John Doe", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Jane Smith", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Alex Johnson", status: "online", avatar: "/placeholder.svg?height=40&width=40" },
    { name: "Sarah Williams", status: "away", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Advanced Mathematics Study Session</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-video">
                  {isVideoOn ? (
                    <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
                    You {!isMicOn && "(Muted)"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-video">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="John's video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">John Doe</div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-video">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Jane's video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">Jane Smith</div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-video">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Alex's video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-sm">
                    Alex Johnson
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Button variant={isMicOn ? "default" : "destructive"} size="lg" onClick={toggleMic}>
              {isMicOn ? <LucideMic className="mr-2 h-5 w-5" /> : <LucideMicOff className="mr-2 h-5 w-5" />}
              {isMicOn ? "Mute" : "Unmute"}
            </Button>

            <Button variant={isVideoOn ? "default" : "destructive"} size="lg" onClick={toggleVideo}>
              {isVideoOn ? <LucideVideo className="mr-2 h-5 w-5" /> : <LucideVideoOff className="mr-2 h-5 w-5" />}
              {isVideoOn ? "Stop Video" : "Start Video"}
            </Button>

            <Button variant="destructive" size="lg">
              <LucidePhoneOff className="mr-2 h-5 w-5" />
              End Call
            </Button>
          </div>
        </div>

        <div>
          <Tabs defaultValue="chat">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">
                <LucideMessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants">
                <LucideUsers className="mr-2 h-4 w-4" />
                Participants
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Group Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] ${msg.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"} rounded-lg px-4 py-2`}
                          >
                            {msg.sender !== "You" && <div className="font-semibold text-sm">{msg.sender}</div>}
                            <div>{msg.text}</div>
                            <div className="text-xs opacity-70 mt-1">{msg.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button type="submit">Send</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Participants (4)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{participant.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {participant.status === "online" ? (
                                  <span className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Online
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span> Away
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

