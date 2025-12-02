"use client"

import { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import io from "socket.io-client"

const VideoCall = ({ auth: { user } }) => {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [participants, setParticipants] = useState([])
  const [activeTab, setActiveTab] = useState("chat")

  const localVideoRef = useRef(null)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io()

    // Join room
    if (user) {
      socketRef.current.emit("joinRoom", {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        room: "study-session",
      })
    }

    // Listen for messages
    socketRef.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    // Listen for room info (participants)
    socketRef.current.on("roomUsers", ({ users }) => {
      setParticipants(users)
    })

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user])

  // Set up video
  useEffect(() => {
    if (isVideoOn && localVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: isMicOn })
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
        const stream = localVideoRef.current.srcObject
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [isVideoOn, isMicOn])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleMic = () => {
    setIsMicOn(!isMicOn)

    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isMicOn
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)

    if (!isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: isMicOn })
        .then((stream) => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Error accessing media devices:", err)
        })
    } else if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject
      stream.getVideoTracks().forEach((track) => {
        track.stop()
      })
      localVideoRef.current.srcObject = null
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()

    if (message.trim() && socketRef.current) {
      socketRef.current.emit("chatMessage", message)
      setMessage("")
    }
  }

  const endCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject
      stream.getTracks().forEach((track) => track.stop())
    }

    if (socketRef.current) {
      socketRef.current.disconnect()
    }

    window.location.href = "/dashboard"
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Advanced Mathematics Study Session</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body p-0">
                  <div className="position-relative bg-light" style={{ aspectRatio: "16/9" }}>
                    {isVideoOn ? (
                      <video ref={localVideoRef} autoPlay muted playsInline className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="text-center">
                          <div className="avatar avatar-lg mb-2">
                            <span className="avatar-text rounded-circle bg-primary text-white">
                              {user && user.firstName ? user.firstName.charAt(0) : "U"}
                            </span>
                          </div>
                          <p>You</p>
                        </div>
                      </div>
                    )}
                    <div className="position-absolute bottom-0 start-0 m-2 bg-dark bg-opacity-75 px-2 py-1 rounded text-white small">
                      You {!isMicOn && "(Muted)"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {participants
              .filter((p) => p.userId !== (user ? user._id : ""))
              .slice(0, 3)
              .map((participant, index) => (
                <div key={participant.userId} className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body p-0">
                      <div className="position-relative bg-light" style={{ aspectRatio: "16/9" }}>
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                          <div className="text-center">
                            <div className="avatar avatar-lg mb-2">
                              <span className="avatar-text rounded-circle bg-primary text-white">
                                {participant.name.charAt(0)}
                              </span>
                            </div>
                            <p>{participant.name}</p>
                          </div>
                        </div>
                        <div className="position-absolute bottom-0 start-0 m-2 bg-dark bg-opacity-75 px-2 py-1 rounded text-white small">
                          {participant.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="d-flex justify-content-center gap-3 mb-4">
            <button className={`btn ${isMicOn ? "btn-primary" : "btn-danger"}`} onClick={toggleMic}>
              <i className={`bi ${isMicOn ? "bi-mic-fill" : "bi-mic-mute-fill"} me-2`}></i>
              {isMicOn ? "Mute" : "Unmute"}
            </button>

            <button className={`btn ${isVideoOn ? "btn-primary" : "btn-danger"}`} onClick={toggleVideo}>
              <i className={`bi ${isVideoOn ? "bi-camera-video-fill" : "bi-camera-video-off-fill"} me-2`}></i>
              {isVideoOn ? "Stop Video" : "Start Video"}
            </button>

            <button className="btn btn-danger" onClick={endCall}>
              <i className="bi bi-telephone-x-fill me-2"></i>
              End Call
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "chat" ? "active" : ""}`}
                    onClick={() => setActiveTab("chat")}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    Chat
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "participants" ? "active" : ""}`}
                    onClick={() => setActiveTab("participants")}
                  >
                    <i className="bi bi-people-fill me-2"></i>
                    Participants ({participants.length})
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === "chat" ? (
                <>
                  <div className="chat-messages" style={{ height: "400px", overflowY: "auto" }}>
                    {messages.map((msg, index) => (
                      <div key={index} className={`mb-3 ${msg.userId === (user ? user._id : "") ? "text-end" : ""}`}>
                        <div
                          className={`d-inline-block px-3 py-2 rounded-3 ${
                            msg.userId === (user ? user._id : "") ? "bg-primary text-white" : "bg-light"
                          }`}
                          style={{ maxWidth: "80%" }}
                        >
                          {msg.userId !== (user ? user._id : "") && <div className="fw-bold small">{msg.username}</div>}
                          <div>{msg.text}</div>
                          <div className="text-end small opacity-75">
                            {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={sendMessage} className="mt-3">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="participants-list" style={{ height: "400px", overflowY: "auto" }}>
                  {participants.map((participant) => (
                    <div key={participant.userId} className="d-flex align-items-center mb-3">
                      <div className="avatar me-3">
                        <span className="avatar-text rounded-circle bg-primary text-white">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="fw-medium">
                          {participant.name}
                          {participant.userId === (user ? user._id : "") && " (You)"}
                        </div>
                        <div className="small text-success">
                          <i className="bi bi-circle-fill me-1"></i>
                          Online
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

VideoCall.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps)(VideoCall)

