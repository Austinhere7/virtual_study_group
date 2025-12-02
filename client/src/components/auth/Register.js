"use client"

import { useState } from "react"
import { connect } from "react-redux"
import { Link, Redirect } from "react-router-dom"
import { setAlert } from "../../actions/alert"
import { register } from "../../actions/auth"
import PropTypes from "prop-types"

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    role: "student",
    subject: "",
    grade: "",
  })

  const { firstName, lastName, email, password, password2, role, subject, grade } = formData

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert("Passwords do not match", "danger")
    } else {
      register({ firstName, lastName, email, password, role, subject, grade })
    }
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h2>Create an Account</h2>
              <p className="mb-0">Join our virtual study group platform</p>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${role === "student" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "student" })}
                  >
                    Student
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${role === "teacher" ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: "teacher" })}
                  >
                    Teacher
                  </button>
                </li>
              </ul>

              <form onSubmit={onSubmit}>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={firstName}
                      onChange={onChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={lastName}
                      onChange={onChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChange}
                    minLength="6"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                    minLength="6"
                    required
                  />
                </div>

                {role === "student" ? (
                  <div className="mb-3">
                    <label className="form-label">Grade/Year</label>
                    <select className="form-select" name="grade" value={grade} onChange={onChange} required>
                      <option value="">Select your grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                      <option value="freshman">College Freshman</option>
                      <option value="sophomore">College Sophomore</option>
                      <option value="junior">College Junior</option>
                      <option value="senior">College Senior</option>
                      <option value="graduate">Graduate Student</option>
                    </select>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <select className="form-select" name="subject" value={subject} onChange={onChange} required>
                      <option value="">Select your subject</option>
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
                )}

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Create Account
                </button>
              </form>
            </div>
            <div className="card-footer text-center">
              <p className="mb-1">
                By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>
              <p className="mb-0">
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { setAlert, register })(Register)

