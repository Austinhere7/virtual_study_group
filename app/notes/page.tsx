"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideUpload, LucideFile, LucideFileText, LucideFolder, LucideSearch, LucideDownload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for notes
const mockNotes = [
  {
    id: 1,
    title: "Calculus Notes - Chapter 1",
    subject: "Mathematics",
    uploadedBy: "John Doe",
    date: "2023-03-15",
    type: "pdf",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Physics Formulas",
    subject: "Physics",
    uploadedBy: "Jane Smith",
    date: "2023-03-10",
    type: "docx",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Literature Analysis - Shakespeare",
    subject: "Literature",
    uploadedBy: "Alex Johnson",
    date: "2023-03-05",
    type: "pdf",
    size: "3.2 MB",
  },
  {
    id: 4,
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    uploadedBy: "Sarah Williams",
    date: "2023-02-28",
    type: "pdf",
    size: "4.5 MB",
  },
  {
    id: 5,
    title: "History Timeline - World War II",
    subject: "History",
    uploadedBy: "Michael Brown",
    date: "2023-02-20",
    type: "pptx",
    size: "5.7 MB",
  },
]

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [newNote, setNewNote] = useState({
    title: "",
    subject: "",
    file: null as File | null,
  })

  // Filter notes based on search term and selected subject
  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || note.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  // Get unique subjects for filter
  const subjects = Array.from(new Set(mockNotes.map((note) => note.subject)))

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewNote({
        ...newNote,
        file: e.target.files[0],
      })
    }
  }

  // Handle form submission (mock)
  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would upload the file to a server here
    console.log("Uploading:", newNote)
    setUploadDialogOpen(false)
    // Reset form
    setNewNote({
      title: "",
      subject: "",
      file: null,
    })
    // Show success message or update UI
  }

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <LucideFileText className="h-6 w-6 text-red-500" />
      case "docx":
        return <LucideFileText className="h-6 w-6 text-blue-500" />
      case "pptx":
        return <LucideFileText className="h-6 w-6 text-orange-500" />
      default:
        return <LucideFile className="h-6 w-6" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notes Repository</h1>
          <p className="text-muted-foreground mt-1">Upload and access study materials</p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <LucideUpload className="mr-2 h-4 w-4" />
              Upload Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Study Notes</DialogTitle>
              <DialogDescription>
                Share your notes with your study group. Supported formats: PDF, DOCX, PPTX.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your notes"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => setNewNote({ ...newNote, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" accept=".pdf,.docx,.pptx" onChange={handleFileChange} required />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={!newNote.title || !newNote.subject || !newNote.file}>
                  Upload
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="relative">
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search notes by title or uploader..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Select onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
          <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="mr-2">{getFileIcon(note.type)}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Uploaded by {note.uploadedBy} on {new Date(note.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{note.subject}</Badge>
                      <span className="text-muted-foreground">{note.size}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">
                        <LucideDownload className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <LucideFolder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm || selectedSubject
                    ? "Try adjusting your search or filters"
                    : "Upload some notes to get started"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-uploads" className="mt-0">
          <div className="text-center py-12">
            <LucideFolder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">You haven't uploaded any notes yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Share your knowledge with your study group</p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <LucideUpload className="mr-2 h-4 w-4" />
              Upload Notes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <div className="text-center py-12">
            <LucideFolder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No recently viewed notes</h3>
            <p className="text-muted-foreground mt-1">Notes you view will appear here for quick access</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

