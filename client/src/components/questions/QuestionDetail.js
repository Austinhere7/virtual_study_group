"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getQuestion, addAnswer, voteQuestion, voteAnswer, acceptAnswer } from "../../actions/questions"

const QuestionDetail = ({
  match,
  auth: { user },
  questions: { question, answers, loading },
  getQuestion,
  addAnswer,
  voteQuestion,
  voteAnswer,
  acceptAnswer,
}) => {
  const [answerText, setAnswerText] = useState("")

  useEffect(() => {
    getQuestion(match.params.id)
  }, [getQuestion, match.params.id])

  const onSubmit = (e) => {
    e.preventDefault()
    addAnswer(question._id, { content: answerText })
    setAnswerText("")
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

  return loading || !question ? (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    <div className="container mt-4">
      <Link to="/questions" className="btn btn-outline-primary mb-4">
        <i className="bi bi-arrow-left me-2"></i>
        Back to Questions
      </Link>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="mb-1">{question.title}</h2>
              <div className="d-flex flex-wrap align-items-center">
                <div className="d-flex align-items-center me-3">
                  <div className="avatar avatar-sm me-2">
                    <span className="avatar-text rounded-circle bg-primary text-white">
                      {question.author ? question.author.firstName.charAt(0) : "U"}
                    </span>
                  </div>
                  <span>
                    {question.author ? `${question.author.firstName} ${question.author.lastName}` : "Unknown"}
                  </span>
                </div>
                <span className="text-muted me-3">{formatRelativeTime(question.createdAt)}</span>
                <span className="badge bg-light text-dark me-3">{question.subject}</span>
                {question.solved && (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Solved
                  </span>
                )}
              </div>
            </div>
            <button className="btn btn-outline-primary" onClick={() => voteQuestion(question._id)}>
              <i className="bi bi-hand-thumbs-up me-1"></i>
              {question.votes}
            </button>
          </div>
        </div>
        <div className="card-body">
          <p className="card-text whitespace-pre-line">{question.content}</p>
        </div>
      </div>

      <h3 className="mb-3">
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h3>

      {answers.map((answer) => (
        <div key={answer._id} className={`card mb-3 ${answer.accepted ? "border-success" : ""}`}>
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-sm me-2">
                  <span className="avatar-text rounded-circle bg-primary text-white">
                    {answer.author ? answer.author.firstName.charAt(0) : "U"}
                  </span>
                </div>
                <div>
                  <span>{answer.author ? `${answer.author.firstName} ${answer.author.lastName}` : "Unknown"}</span>
                  {answer.author && answer.author.role === "teacher" && (
                    <span className="badge bg-info ms-2">Teacher</span>
                  )}
                </div>
              </div>
              <span className="text-muted">{formatRelativeTime(answer.createdAt)}</span>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text whitespace-pre-line">{answer.content}</p>
          </div>
          <div className="card-footer d-flex justify-content-between align-items-center">
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => voteAnswer(question._id, answer._id)}
              >
                <i className="bi bi-hand-thumbs-up me-1"></i>
                {answer.votes}
              </button>
            </div>
            {answer.accepted ? (
              <span className="badge bg-success">
                <i className="bi bi-check-circle me-1"></i>
                Accepted Answer
              </span>
            ) : (
              user &&
              question.author &&
              user._id === question.author._id &&
              !question.solved && (
                <button className="btn btn-sm btn-success" onClick={() => acceptAnswer(question._id, answer._id)}>
                  <i className="bi bi-check-circle me-1"></i>
                  Accept Answer
                </button>
              )
            )}
          </div>
        </div>
      ))}

      <div className="card mt-4">
        <div className="card-header">
          <h4 className="mb-0">Your Answer</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="5"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Write your answer here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={!answerText.trim()}>
              Post Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

QuestionDetail.propTypes = {
  getQuestion: PropTypes.func.isRequired,
  addAnswer: PropTypes.func.isRequired,
  voteQuestion: PropTypes.func.isRequired,
  voteAnswer: PropTypes.func.isRequired,
  acceptAnswer: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  questions: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  questions: state.questions,
})

export default connect(mapStateToProps, { getQuestion, addAnswer, voteQuestion, voteAnswer, acceptAnswer })(
  QuestionDetail,
)

