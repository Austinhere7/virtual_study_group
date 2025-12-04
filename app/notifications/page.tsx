"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LucideTrash2,
  LucideCheckCircle,
  LucideAlertCircle,
  LucideMessageSquare,
  LucideUsers,
  LucideCalendar,
  LucideArchive,
} from "lucide-react"
import Link from "next/link"

/**
 * Notifications Page
 * Displays user notifications with filtering and management
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, unread, read
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm("Delete all read notifications?")) return
    try {
      await fetch("/api/notifications?read=true", { method: "DELETE" })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to delete notifications:", error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "answer":
        return <LucideMessageSquare className="h-5 w-5 text-blue-500" />
      case "session":
        return <LucideCalendar className="h-5 w-5 text-purple-500" />
      case "mention":
        return <LucideAlertCircle className="h-5 w-5 text-yellow-500" />
      case "message":
        return <LucideMessageSquare className="h-5 w-5 text-green-500" />
      case "group_invite":
        return <LucideUsers className="h-5 w-5 text-indigo-500" />
      default:
        return <LucideCheckCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead
    if (filter === "read") return n.isRead
    return true
  })

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading notifications..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline">
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "unread", "read"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
        {notifications.some((n) => n.isRead) && (
          <Button variant="ghost" size="sm" onClick={handleDeleteAll} className="ml-auto text-destructive">
            <LucideTrash2 className="h-4 w-4 mr-2" />
            Delete read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <Card
              key={notification._id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? "border-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {notification.fromUser ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.fromUser.avatar} />
                      <AvatarFallback>
                        {notification.fromUser.firstName?.[0]}
                        {notification.fromUser.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                      <Badge variant={notification.isRead ? "outline" : "default"} className="ml-2 flex-shrink-0">
                        {notification.type}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()} at{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification._id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification._id)}
                        >
                          <LucideTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <LucideArchive className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No {filter !== "all" ? filter : ""} notifications</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
