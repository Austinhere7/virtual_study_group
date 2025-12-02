# 🎓 Virtual Study Group

A comprehensive collaborative learning platform that enables students to study together, share knowledge, and enhance their academic performance through real-time video conferencing, note sharing, Q&A forums, and teacher feedback systems.

![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat&logo=mongodb)

## ✨ Special Features

### 🎥 Real-Time Video Conferencing
- **Live Video Study Sessions**: Host or join virtual study rooms with multiple participants
- **In-Session Chat**: Real-time text chat during video calls for quick questions and sharing links
- **Participant Management**: View online/away status of all participants
- **Audio/Video Controls**: Toggle microphone and camera with easy-to-use controls
- **Collaborative Environment**: Study together as if you're in the same room

### 📚 Smart Notes Repository
- **Multi-Format Support**: Upload and share PDF, DOCX, PPTX, and other document formats
- **Subject Organization**: Categorize notes by subjects (Mathematics, Physics, Chemistry, Literature, etc.)
- **Advanced Search**: Find notes quickly with search functionality and subject filters
- **File Preview**: View note details including size, upload date, and contributor
- **Download & Share**: Easy downloading and sharing of study materials
- **Community Contributions**: Access notes uploaded by peers and teachers

### 💬 Interactive Q&A Forum
- **Ask & Answer**: Post questions and get answers from peers and instructors
- **Subject Categorization**: Filter questions by subject area
- **Voting System**: Upvote/downvote questions and answers to highlight quality content
- **Solution Marking**: Mark questions as "Solved" to help others find answered queries
- **Detailed Discussions**: Each question supports multiple answers with rich text formatting
- **User Profiles**: See who asked questions and their contribution history
- **Real-time Updates**: Stay notified of new answers to your questions

### 📝 Teacher Feedback System
- **Anonymous Feedback**: Option to provide feedback anonymously for honest opinions
- **Rating System**: Rate teachers on a 1-5 scale
- **Detailed Comments**: Share constructive feedback to help improve teaching methods
- **Subject-Specific**: Provide feedback per teacher and subject
- **Feedback History**: Track your previously submitted feedback
- **Status Tracking**: See if your feedback has been acknowledged
- **Confidential & Secure**: All feedback is handled with privacy and respect

### 📅 Study Session Scheduler
- **Session Calendar**: View all upcoming study sessions in an organized calendar
- **Create Sessions**: Host your own study groups with customizable details
- **Session Details**: Include title, description, subject, date, time, and duration
- **Participant Limits**: Set maximum participant capacity for better management
- **Join/Leave Functionality**: Easy enrollment and withdrawal from sessions
- **Host Information**: See who's hosting each session with avatar displays
- **Subject Filters**: Find sessions by subject area
- **Real-time Updates**: See current participant counts

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Built-in theme switching for comfortable viewing
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Accessible Components**: Built with Radix UI for enhanced accessibility
- **Smooth Animations**: Polished transitions and interactions
- **Intuitive Navigation**: Easy-to-use interface designed for students
- **Component Library**: Extensive UI components from shadcn/ui

## 🚀 Technology Stack

### Frontend
- **Next.js 15.1.0** - React framework with App Router
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Additional Technologies
- **JWT Authentication** - Secure user authentication
- **WebRTC** - Real-time video/audio communication
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **date-fns** - Modern date utility library
- **Embla Carousel** - Smooth carousel component

## 📋 Features Overview

| Feature | Description |
|---------|-------------|
| 🔐 **User Authentication** | Secure login and registration with JWT tokens |
| 👥 **Study Groups** | Create and join virtual study rooms |
| 📹 **Video Calls** | High-quality video conferencing with WebRTC |
| 📁 **File Management** | Upload, organize, and download study materials |
| ❓ **Q&A System** | Ask questions and get community answers |
| ⭐ **Rating System** | Vote on helpful answers and questions |
| 📊 **Teacher Feedback** | Anonymous or public feedback to instructors |
| 🗓️ **Scheduling** | Plan and manage study sessions |
| 💬 **Live Chat** | Real-time messaging during video sessions |
| 🔍 **Smart Search** | Find notes and questions quickly |
| 📱 **Responsive** | Works on all devices and screen sizes |
| 🎨 **Theming** | Dark and light mode support |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- pnpm, npm, or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Austinhere7/virtual_study_group.git
cd virtual_study_group
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
pnpm install
# or
npm install

# Install client dependencies (if using separate client)
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=development

# Next.js (optional)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Application

#### Development Mode
```bash
# Run Next.js frontend
pnpm dev
# or
npm run dev

# Run backend server (in a separate terminal)
cd server
npm start
```

#### Production Mode
```bash
# Build the application
pnpm build
npm run build

# Start production server
pnpm start
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
virtual-study-group/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── notes/              # Notes management
│   │   ├── questions/          # Q&A system
│   │   ├── feedback/           # Teacher feedback
│   │   └── study-sessions/     # Session management
│   ├── feedback/               # Feedback page
│   ├── notes/                  # Notes repository page
│   ├── questions/              # Q&A forum page
│   ├── schedule/               # Study sessions page
│   ├── video-call/             # Video conferencing page
│   ├── register/               # User registration
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   └── theme-provider.tsx      # Theme context
├── server/                      # Backend server
│   ├── models/                 # MongoDB models
│   ├── routes/                 # Express routes
│   ├── middleware/             # Custom middleware
│   └── server.js               # Server entry point
├── client/                      # Legacy React client (optional)
│   └── src/                    # Client source files
├── lib/                        # Utility functions
│   ├── auth.ts                 # Auth utilities
│   ├── db.ts                   # Database config
│   └── utils.ts                # Helper functions
├── public/                     # Static assets
├── hooks/                      # Custom React hooks
├── tailwind.config.ts          # Tailwind configuration
├── next.config.mjs             # Next.js configuration
└── package.json                # Dependencies
```

## 🎯 Use Cases

### For Students
- 📖 **Collaborative Learning**: Study together with classmates in real-time
- 🔍 **Resource Access**: Find and download notes from peers and teachers
- ❓ **Get Help**: Ask questions and receive answers from the community
- 📅 **Organized Study**: Schedule and plan study sessions effectively
- 💡 **Knowledge Sharing**: Contribute your notes and help others learn

### For Teachers
- 👨‍🏫 **Student Engagement**: Host virtual study sessions and office hours
- 📢 **Receive Feedback**: Get constructive feedback to improve teaching methods
- 📚 **Share Materials**: Upload lecture notes and study guides
- 🎓 **Monitor Progress**: See student questions and participation levels
- 🤝 **Community Building**: Foster a collaborative learning environment

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Anonymous Feedback**: Privacy-protected feedback system
- **Input Validation**: Server-side and client-side validation
- **CORS Protection**: Configured CORS policies
- **Secure File Uploads**: Validated file types and sizes

## 🌟 Unique Selling Points

1. **All-in-One Platform**: Combines video calls, notes, Q&A, and scheduling in one place
2. **Student-Centric Design**: Built specifically for collaborative learning
3. **Real-Time Collaboration**: Live video and chat for immediate interaction
4. **Anonymous Feedback**: Encourages honest, constructive feedback
5. **Community-Driven**: Peer-to-peer learning and resource sharing
6. **Modern Tech Stack**: Built with latest web technologies for performance
7. **Fully Responsive**: Works seamlessly on any device
8. **Accessible**: Built with accessibility best practices

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)
*Main landing page with feature cards and upcoming sessions*

### Login Page
![Login Page](docs/screenshots/login.png)
*User authentication interface*

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Notes Endpoints

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer {token}
```

**Query Parameters:**
- `subject` (optional): Filter by subject
- `search` (optional): Search in title and description

**Response:**
```json
[
  {
    "id": "note_id",
    "title": "Calculus Notes - Chapter 1",
    "subject": "Mathematics",
    "uploadedBy": {
      "id": "user_id",
      "name": "John Doe"
    },
    "fileUrl": "/uploads/notes/file.pdf",
    "fileType": "pdf",
    "fileSize": 2457600,
    "createdAt": "2023-03-15T10:30:00Z"
  }
]
```

#### Upload Note
```http
POST /api/notes
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Physics Formulas",
  "subject": "Physics",
  "description": "Important formulas for final exam",
  "file": [binary_file_data]
}
```

#### Download Note
```http
GET /api/notes/:id/download
Authorization: Bearer {token}
```

### Questions Endpoints

#### Get All Questions
```http
GET /api/questions
Authorization: Bearer {token}
```

**Query Parameters:**
- `subject` (optional): Filter by subject
- `solved` (optional): Filter by solved status (true/false)

**Response:**
```json
[
  {
    "id": "question_id",
    "title": "How to solve quadratic equations?",
    "content": "I need help understanding the quadratic formula...",
    "subject": "Mathematics",
    "author": {
      "id": "user_id",
      "name": "Jane Smith"
    },
    "answers": 3,
    "votes": 12,
    "solved": true,
    "createdAt": "2023-03-15T14:30:00Z"
  }
]
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "How to solve quadratic equations?",
  "content": "I need help understanding the quadratic formula...",
  "subject": "Mathematics"
}
```

#### Answer Question
```http
POST /api/questions/:id/answers
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "The quadratic formula is: x = (-b ± √(b²-4ac)) / 2a"
}
```

#### Vote on Question
```http
POST /api/questions/:id/vote
Authorization: Bearer {token}
Content-Type: application/json

{
  "voteType": "upvote" // or "downvote"
}
```

### Feedback Endpoints

#### Submit Feedback
```http
POST /api/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "teacherId": "teacher_id",
  "rating": 4,
  "comment": "Great explanations, very helpful!",
  "anonymous": false
}
```

#### Get My Feedback
```http
GET /api/feedback/my-feedback
Authorization: Bearer {token}
```

### Study Sessions Endpoints

#### Get All Sessions
```http
GET /api/study-sessions
Authorization: Bearer {token}
```

**Query Parameters:**
- `subject` (optional): Filter by subject
- `upcoming` (optional): Show only upcoming sessions (true/false)

**Response:**
```json
[
  {
    "id": "session_id",
    "title": "Advanced Mathematics",
    "description": "Covering calculus topics",
    "subject": "Mathematics",
    "date": "2023-03-23",
    "time": "15:00",
    "duration": 60,
    "host": {
      "id": "user_id",
      "name": "Dr. Sarah Johnson"
    },
    "participants": [
      {
        "id": "participant_id",
        "name": "John Doe"
      }
    ],
    "maxParticipants": 20,
    "meetingLink": "https://meet.example.com/session_id"
  }
]
```

#### Create Study Session
```http
POST /api/study-sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Physics Study Group",
  "description": "Discussing mechanics and motion",
  "subject": "Physics",
  "date": "2023-03-25",
  "time": "16:00",
  "duration": 90,
  "maxParticipants": 15
}
```

#### Join Study Session
```http
POST /api/study-sessions/:id/join
Authorization: Bearer {token}
```

#### Leave Study Session
```http
POST /api/study-sessions/:id/leave
Authorization: Bearer {token}
```

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "error": "No token provided" // or "Invalid token"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Server error message"
}
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### API Testing with cURL

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get notes (requires token):**
```bash
curl -X GET http://localhost:5000/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Austinhere7**
- GitHub: [@Austinhere7](https://github.com/Austinhere7)
- Repository: [virtual_study_group](https://github.com/Austinhere7/virtual_study_group)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

⭐ **Star this repository if you find it helpful!**

*Made with ❤️ for students, by students*
