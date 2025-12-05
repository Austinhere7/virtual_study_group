const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message)
    console.warn("Server will continue without MongoDB. Some features may not work.")
  })

mongoose.connection.on("error", (err) => {
  console.error("📊 Mongoose connection error:", err.message)
})

// Define routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/profile", require("./routes/profile"))
app.use("/api/dashboard", require("./routes/dashboard"))
app.use("/api/notes", require("./routes/notes"))
app.use("/api/questions", require("./routes/questions"))
app.use("/api/feedback", require("./routes/feedback"))
app.use("/api/study-sessions", require("./routes/study-sessions"))
app.use("/api/verify-email", require("./routes/verify-email"))
app.use("/api/password-reset", require("./routes/password-reset"))
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/study-groups", require("./routes/study-groups"))
app.use("/api/messages", require("./routes/messages"))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  })
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

