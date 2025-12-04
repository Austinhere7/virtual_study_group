"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LucideSend, LucideSmile, LucideSearch, LucideCheck, LucideCheckCheck } from "lucide-react"
import Link from "next/link"

/**
 * Messages Page
 * Direct messaging interface for one-on-one conversations
 */
export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [conversationLoading, setConversationLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 20000) // Refresh every 20 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id)
    }
  }, [selectedConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setConversations(data.conversations)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch conversations:", error)
      setLoading(false)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      setConversationLoading(true)
      const res = await fetch(`/api/messages/${userId}`)
      const data = await res.json()
      setMessages(data.messages)
      setConversationLoading(false)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setConversationLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: selectedConversation.user._id,
          content: messageInput,
        }),
      })

      if (res.ok) {
        setMessageInput("")
        fetchMessages(selectedConversation.user._id)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await fetch(`/api/messages/${messageId}`, { method: "DELETE" })
      fetchMessages(selectedConversation.user._id)
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading messages..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen max-h-screen flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Conversations List */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Messages</CardTitle>
          </CardHeader>
          <div className="px-6 mb-4">
            <div className="relative">
              <LucideSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 px-6">
              {conversations.length > 0 ? (
                conversations.map((conv) => (
                  <button
                    key={conv.user._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation?.user._id === conv.user._id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.user.avatar} />
                          <AvatarFallback>
                            {conv.user.firstName?.[0]}
                            {conv.user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unreadCount > 0 && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {conv.user.firstName} {conv.user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No conversations yet</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Messages Area */}
        {selectedConversation ? (
          <Card className="lg:col-span-2 flex flex-col">
            {/* Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.user.avatar} />
                    <AvatarFallback>
                      {selectedConversation.user.firstName?.[0]}
                      {selectedConversation.user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {selectedConversation.user.firstName} {selectedConversation.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.user.email}</p>
                  </div>
                </div>
                <Link href={`/profile/${selectedConversation.user._id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <CardContent className="pt-6 space-y-4">
                {conversationLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinnerCompact />
                    <span className="ml-2 text-sm text-muted-foreground">Loading messages...</span>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.senderId._id === selectedConversation.user._id ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId._id === selectedConversation.user._id
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {msg.senderId._id !== selectedConversation.user._id && (
                            <span>
                              {msg.isRead ? (
                                <LucideCheckCheck className="h-3 w-3" />
                              ) : (
                                <LucideCheck className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={scrollRef} />
              </CardContent>
            </ScrollArea>

            {/* Input */}
            <CardContent className="pt-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <LucideSend className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Select a conversation to start messaging</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
