"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getUpcomingSessions } from "../../actions/studySessions"

const Dashboard = ({ auth: { user }, studySessions: { sessions, loading }, getUpcomingSessions }) => {
  useEffect(() => {
    getUpcomingSessions()
  }, [getUpcomingSessions])

  return loading || user === null ? (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container mt-4">
      <h1 className="mb-4">Welcome, {user.firstName}!</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Virtual Study Group</h2>
              <p className="card-text">
                Collaborate with peers, share notes, and learn together in a virtual environment.
              </p>

              <div className="row mt-4">
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-camera-video me-2"></i>
                        Video Calls
                      </h5>
                      <p className="card-text">Join virtual study sessions with real-time video conferencing</p>
                      <Link to="/video-call" className="btn btn-outline-primary">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-journal-text me-2"></i>
                        Notes Repository
                      </h5>
                      <p className="card-text">Upload, organize and access study materials</p>
                      <Link to="/notes" className="btn btn-outline-primary">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-hand-thumbs-up me-2"></i>
                        Teacher Feedback
                      </h5>
                      <p className="card-text">Provide constructive feedback to your instructors</p>
                      <Link to="/feedback" className="btn btn-outline-primary">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <i className="bi bi-chat-dots me-2"></i>
                        Q&A Forum
                      </h5>
                      <p className="card-text">Ask questions and get answers from peers and teachers</p>
                      <Link to="/questions" className="btn btn-outline-primary">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Upcoming Study Sessions</h5>
            </div>
            <div className="card-body">
              {sessions.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {sessions.slice(0, 3).map((session) => (
                    <li key={session._id} className="list-group-item">
                      <h6>{session.title}</h6>
                      <div className="d-flex justify-content-between">
                        <small>{session.subject}</small>
                        <small>{new Date(`${session.date}T${session.time}`).toLocaleString()}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center mb-0">No upcoming sessions</p>
              )}
            </div>
            <div className="card-footer">
              <Link to="/schedule" className="btn btn-outline-primary btn-sm w-100">
                View All Sessions
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/schedule" className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Study Session
                </Link>
                <Link to="/notes" className="btn btn-outline-primary">
                  <i className="bi bi-upload me-2"></i>
                  Upload Notes
                </Link>
                <Link to="/questions" className="btn btn-outline-primary">
                  <i className="bi bi-question-circle me-2"></i>
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  studySessions: PropTypes.object.isRequired,
  getUpcomingSessions: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  studySessions: state.studySessions,
})

export default connect(mapStateToProps, { getUpcomingSessions })(Dashboard)

