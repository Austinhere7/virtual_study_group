import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-3 mb-4">Virtual Study Group</h1>
              <p className="lead">Collaborate with peers, share notes, and learn together in a virtual environment.</p>
              <div className="buttons">
                <Link to="/register" className="btn btn-primary btn-lg me-3">
                  Sign Up
                </Link>
                <Link to="/login" className="btn btn-light btn-lg">
                  Login
                </Link>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-camera-video display-4 text-primary mb-3"></i>
                  <h4>Video Calls</h4>
                  <p>Join virtual study sessions with real-time video conferencing</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-journal-text display-4 text-primary mb-3"></i>
                  <h4>Notes Repository</h4>
                  <p>Upload, organize and access study materials</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-hand-thumbs-up display-4 text-primary mb-3"></i>
                  <h4>Teacher Feedback</h4>
                  <p>Provide constructive feedback to your instructors</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-chat-dots display-4 text-primary mb-3"></i>
                  <h4>Q&A Forum</h4>
                  <p>Ask questions and get answers from peers and teachers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps)(Landing)

