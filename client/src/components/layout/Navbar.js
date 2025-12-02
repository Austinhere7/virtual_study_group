"use client"

import { Fragment } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
  const authLinks = (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/dashboard">
          <i className="bi bi-speedometer2 me-1"></i>
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/video-call">
          <i className="bi bi-camera-video me-1"></i>
          Video Call
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/notes">
          <i className="bi bi-journal-text me-1"></i>
          Notes
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/questions">
          <i className="bi bi-chat-dots me-1"></i>
          Q&A
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/schedule">
          <i className="bi bi-calendar3 me-1"></i>
          Schedule
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/feedback">
          <i className="bi bi-hand-thumbs-up me-1"></i>
          Feedback
        </Link>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle me-1"></i>
          {user ? `${user.firstName} ${user.lastName}` : ""}
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <Link className="dropdown-item" to="/profile">
              <i className="bi bi-person me-2"></i>
              Profile
            </Link>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a onClick={logout} className="dropdown-item" href="#!">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </a>
          </li>
        </ul>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul className="navbar-nav ms-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Register
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  )

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-book me-2"></i>
          Virtual Study Group
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarMain">
          {!loading && <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>}
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)

