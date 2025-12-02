"use client"

import { useState, useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getFeedback, submitFeedback, acknowledgeFeedback } from "../../actions/feedback"
import { getTeachers } from "../../actions/users"

const Feedback = ({
  auth: { user },
  feedback: { feedback, loading },
  users: { teachers },
  getFeedback,
  submitFeedback,
  acknowledgeFeedback,
  getTeachers,
}) => {
  const [formData, setFormData] = useState({
    teacherId: "",
    rating: "",
    content: "",
    anonymous: false,
  })

  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    getFeedback()
    if (user && user.role === "student") {
      getTeachers()
    }
  }, [getFeedback, getTeachers, user])

  const { teacherId, rating, content, anonymous } = formData

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const onCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    submitFeedback(formData)

    // Reset form and show success message
    setFormData({
      teacherId: "",
      rating: "",
      content: "",
      anonymous: false,
    })

    setSubmitSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSubmitSuccess(false)
    }, 3000)
  }

  const handleAcknowledge = (id) => {
    acknowledgeFeedback(id)
  }

  // Render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <i key={index} className={`bi ${index < rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}></i>
    ))
  }

  return loading ? (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container mt-4">
      <h1 className="mb-4">Teacher Feedback</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Submit Feedback</h5>
            </div>
            <div className="card-body">
              {submitSuccess ? (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>Thank you for your feedback! It has been submitted successfully.</div>
                </div>
              ) : user && user.role === "student" ? (
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Select Teacher</label>
                    <select className="form-select" name="teacherId" value={teacherId} onChange={onChange} required>
                      <option value="">Choose a teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.firstName} {teacher.lastName} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div className="d-flex">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="me-3">
                          <input
                            type="radio"
                            className="btn-check"
                            name="rating"
                            id={`rating-${value}`}
                            value={value}
                            onChange={onChange}
                            required
                          />
                          <label
                            className={`btn ${rating == value ? "btn-primary" : "btn-outline-primary"}`}
                            htmlFor={`rating-${value}`}
                          >
                            {value}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your Feedback</label>
                    <textarea
                      className="form-control"
                      name="content"
                      value={content}
                      onChange={onChange}
                      rows="5"
                      placeholder="Share your thoughts about the teaching style, course content, etc."
                      required
                    ></textarea>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="anonymous"
                      name="anonymous"
                      checked={anonymous}
                      onChange={onCheckboxChange}
                    />
                    <label className="form-check-label" htmlFor="anonymous">
                      Submit anonymously
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-hand-thumbs-up me-2"></i>
                    Submit Feedback
                  </button>
                </form>
              ) : (
                <div className="alert alert-info" role="alert">
                  Only students can submit feedback to teachers.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Your Previous Feedback</h5>
            </div>
            <div className="card-body">
              {feedback.length > 0 ? (
                <div className="list-group">
                  {feedback.map((item) => (
                    <div key={item._id} className="list-group-item list-group-item-action">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">
                          {user && user.role === "student"
                            ? `${item.teacherId.firstName} ${item.teacherId.lastName}`
                            : item.studentId.firstName === "Anonymous"
                              ? "Anonymous Student"
                              : `${item.studentId.firstName} ${item.studentId.lastName}`}
                        </h6>
                        <span
                          className={`badge ${item.status === "acknowledged" ? "bg-success" : "bg-warning text-dark"}`}
                        >
                          {item.status === "acknowledged" ? "Acknowledged" : "Pending"}
                        </span>
                      </div>
                      <div className="mb-2">
                        {renderStars(item.rating)}
                        <small className="text-muted ms-2">{new Date(item.createdAt).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1">{item.content}</p>

                      {user && user.role === "teacher" && item.status === "pending" && (
                        <button
                          className="btn btn-sm btn-outline-success mt-2"
                          onClick={() => handleAcknowledge(item._id)}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Acknowledge
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted mb-0">No previous feedback</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Feedback.propTypes = {
  getFeedback: PropTypes.func.isRequired,
  submitFeedback: PropTypes.func.isRequired,
  acknowledgeFeedback: PropTypes.func.isRequired,
  getTeachers: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  feedback: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  feedback: state.feedback,
  users: state.users,
})

export default connect(mapStateToProps, { getFeedback, submitFeedback, acknowledgeFeedback, getTeachers })(Feedback)

