"use client"

import { useState, useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getStudySessions, createStudySession, joinStudySession, leaveStudySession } from "../../actions/studySessions"

const Schedule = ({
  auth: { user },
  studySessions: { sessions, loading },
  getStudySessions,
  createStudySession,
  joinStudySession,
  leaveStudySession,
}) => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    date: "",
    time: "",
    duration: "",
    maxParticipants: "",
  })

  useEffect(() => {
    getStudySessions(activeTab)
  }, [getStudySessions, activeTab])

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    createStudySession(formData)

    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      subject: "",
      date: "",
      time: "",
      duration: "",
      maxParticipants: "",
    })
    setCreateModalOpen(false)
  }

  // Get today's date in YYYY-MM-DD format for the date input min value
  const today = new Date().toISOString().split("T")[0]

  // Format date to display in a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: "long", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time to display in 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Check if user is a participant in a session
  const isParticipant = (session) => {
    return session.participants.some((participant) => participant._id === user._id)
  }

  // Check if user is the host of a session
  const isHost = (session) => {
    return session.host._id === user._id
  }

  // Handle join session
  const handleJoin = (sessionId) => {
    joinStudySession(sessionId)
  }

  // Handle leave session
  const handleLeave = (sessionId) => {
    leaveStudySession(sessionId)
  }

  return loading ? (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container mt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="mb-1">Study Sessions</h1>
          <p className="text-muted">Join or schedule virtual study sessions</p>
        </div>

        <button className="btn btn-primary mt-2 mt-md-0" onClick={() => setCreateModalOpen(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Create Session
        </button>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Sessions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "my-sessions" ? "active" : ""}`}
            onClick={() => setActiveTab("my-sessions")}
          >
            My Sessions
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "past" ? "active" : ""}`} onClick={() => setActiveTab("past")}>
            Past Sessions
          </button>
        </li>
      </ul>

      {sessions.length > 0 ? (
        <div className="row">
          {sessions.map((session) => (
            <div key={session._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <span className="badge bg-light text-dark mb-2">{session.subject}</span>
                      <h5 className="card-title">{session.title}</h5>
                      <p className="card-text small text-muted mb-0">
                        Hosted by {session.host.firstName} {session.host.lastName}
                      </p>
                    </div>
                    <div className="avatar">
                      <span className="avatar-text rounded-circle bg-primary text-white">
                        {session.host.firstName.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text small text-muted mb-3">{session.description}</p>

                  <div className="small mb-2">
                    <i className="bi bi-calendar me-2 text-muted"></i>
                    {formatDate(session.date)}
                  </div>
                  <div className="small mb-2">
                    <i className="bi bi-clock me-2 text-muted"></i>
                    {formatTime(session.time)} ({session.duration} minutes)
                  </div>
                  <div className="small mb-0">
                    <i className="bi bi-people me-2 text-muted"></i>
                    {session.participants.length}/{session.maxParticipants} participants
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-outline-primary btn-sm">View Details</button>

                  {isHost(session) ? (
                    <span className="badge bg-info d-flex align-items-center">
                      <i className="bi bi-star-fill me-1"></i>
                      Host
                    </span>
                  ) : isParticipant(session) ? (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleLeave(session._id)}>
                      Leave Session
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleJoin(session._id)}
                      disabled={session.participants.length >= session.maxParticipants}
                    >
                      <i className="bi bi-camera-video me-1"></i>
                      Join Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-calendar3 fs-1 text-muted mb-3"></i>
          <h3>No {activeTab} sessions</h3>
          <p className="text-muted">
            {activeTab === "upcoming"
              ? "There are no upcoming study sessions scheduled"
              : activeTab === "my-sessions"
                ? "You haven't created or joined any sessions yet"
                : "There are no past study sessions"}
          </p>
          {activeTab !== "past" && (
            <button className="btn btn-primary mt-3" onClick={() => setCreateModalOpen(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Session
            </button>
          )}
        </div>
      )}

      {/* Create Session Modal */}
      {createModalOpen && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Study Session</h5>
                <button type="button" className="btn-close" onClick={() => setCreateModalOpen(false)}></button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Session Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={onChange}
                      placeholder="e.g., Calculus Study Group"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={onChange}
                      rows="3"
                      placeholder="Describe what will be covered in this session..."
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      name="subject"
                      value={formData.subject}
                      onChange={onChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Literature">Literature</option>
                      <option value="History">History</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={onChange}
                        min={today}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="time"
                        value={formData.time}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        onChange={onChange}
                        min="15"
                        step="15"
                        placeholder="60"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Max Participants</label>
                      <input
                        type="number"
                        className="form-control"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={onChange}
                        min="2"
                        placeholder="20"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setCreateModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      !formData.title ||
                      !formData.description ||
                      !formData.subject ||
                      !formData.date ||
                      !formData.time ||
                      !formData.duration ||
                      !formData.maxParticipants
                    }
                  >
                    Schedule Session
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  )
}

Schedule.propTypes = {
  getStudySessions: PropTypes.func.isRequired,
  createStudySession: PropTypes.func.isRequired,
  joinStudySession: PropTypes.func.isRequired,
  leaveStudySession: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  studySessions: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  studySessions: state.studySessions,
})

export default connect(mapStateToProps, { getStudySessions, createStudySession, joinStudySession, leaveStudySession })(
  Schedule,
)

