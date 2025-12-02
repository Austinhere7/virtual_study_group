"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getQuestions, createQuestion } from "../../actions/questions"

const Questions = ({ auth: { user }, questions: { questions, loading }, getQuestions, createQuestion }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [askModalOpen, setAskModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    subject: "",
  })

  useEffect(() => {
    getQuestions()
  }, [getQuestions])

  // Get unique subjects for filter
  const subjects = questions.length > 0 ? Array.from(new Set(questions.map((question) => question.subject))) : []

  // Filter questions based on search term, selected subject, and active tab
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || question.subject === selectedSubject
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "my-questions" && question.author && question.author._id === user._id) ||
      (activeTab === "unanswered" && question.answers === 0)

    return matchesSearch && matchesSubject && matchesTab
  })

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    createQuestion(formData)

    // Reset form and close modal
    setFormData({
      title: "",
      content: "",
      subject: "",
    })
    setAskModalOpen(false)
  }

  // Format date to relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
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
          <h1 className="mb-1">Q&A Forum</h1>
          <p className="text-muted">Ask questions and get answers from peers and teachers</p>
        </div>

        <button className="btn btn-primary mt-2 mt-md-0" onClick={() => setAskModalOpen(true)}>
          <i className="bi bi-chat-dots me-2"></i>
          Ask a Question
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-4 mt-3 mt-md-0">
          <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">All Subjects</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All Questions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "my-questions" ? "active" : ""}`}
            onClick={() => setActiveTab("my-questions")}
          >
            My Questions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "unanswered" ? "active" : ""}`}
            onClick={() => setActiveTab("unanswered")}
          >
            Unanswered
          </button>
        </li>
      </ul>

      {filteredQuestions.length > 0 ? (
        <div className="list-group">
          {filteredQuestions.map((question) => (
            <Link
              key={question._id}
              to={`/questions/${question._id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">{question.title}</h5>
                  <div className="d-flex flex-wrap align-items-center mb-2">
                    <div className="d-flex align-items-center me-3">
                      <div className="avatar avatar-sm me-2">
                        <span className="avatar-text rounded-circle bg-primary text-white">
                          {question.author ? question.author.firstName.charAt(0) : "U"}
                        </span>
                      </div>
                      <small>
                        {question.author ? `${question.author.firstName} ${question.author.lastName}` : "Unknown"}
                      </small>
                    </div>
                    <small className="text-muted me-3">{formatRelativeTime(question.createdAt)}</small>
                    <span className="badge bg-light text-dark me-3">{question.subject}</span>
                    {question.solved && (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Solved
                      </span>
                    )}
                  </div>
                  <p className="mb-1 text-muted text-truncate">{question.content}</p>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <span className="badge bg-primary mb-2">
                    {question.answers} {question.answers === 1 ? "answer" : "answers"}
                  </span>
                  <span className="badge bg-light text-dark">
                    <i className="bi bi-hand-thumbs-up me-1"></i>
                    {question.votes}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-chat-dots fs-1 text-muted mb-3"></i>
          <h3>No questions found</h3>
          <p className="text-muted">
            {searchTerm || selectedSubject || activeTab !== "all"
              ? "Try adjusting your search or filters"
              : "Be the first to ask a question"}
          </p>
          {!(searchTerm || selectedSubject) && activeTab === "all" && (
            <button className="btn btn-primary mt-3" onClick={() => setAskModalOpen(true)}>
              Ask a Question
            </button>
          )}
        </div>
      )}

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ask a Question</h5>
                <button type="button" className="btn-close" onClick={() => setAskModalOpen(false)}></button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Question Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={onChange}
                      placeholder="e.g., How do I solve this math problem?"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Details</label>
                    <textarea
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={onChange}
                      rows="5"
                      placeholder="Provide context and details about your question..."
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
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setAskModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formData.title || !formData.content || !formData.subject}
                  >
                    Post Question
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

Questions.propTypes = {
  getQuestions: PropTypes.func.isRequired,
  createQuestion: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  questions: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  questions: state.questions,
})

export default connect(mapStateToProps, { getQuestions, createQuestion })(Questions)

