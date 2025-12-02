"use client"

import { useState, useEffect } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { getNotes, uploadNote } from "../../actions/notes"

const Notes = ({ auth: { user }, notes: { notes, loading }, getNotes, uploadNote }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    file: null,
  })

  useEffect(() => {
    getNotes()
  }, [getNotes])

  // Get unique subjects for filter
  const subjects = notes.length > 0 ? Array.from(new Set(notes.map((note) => note.subject))) : []

  // Filter notes based on search term and selected subject
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.uploadedBy &&
        typeof note.uploadedBy === "object" &&
        `${note.uploadedBy.firstName} ${note.uploadedBy.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = !selectedSubject || note.subject === selectedSubject
    const matchesTab =
      activeTab === "all" || (activeTab === "my-uploads" && note.uploadedBy && note.uploadedBy._id === user._id)

    return matchesSearch && matchesSubject && matchesTab
  })

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const { title, subject, file } = formData

    // Create form data object
    const data = new FormData()
    data.append("title", title)
    data.append("subject", subject)
    data.append("file", file)

    uploadNote(data)

    // Reset form and close modal
    setFormData({
      title: "",
      subject: "",
      file: null,
    })
    setUploadModalOpen(false)
  }

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.includes("pdf")) {
      return <i className="bi bi-file-earmark-pdf text-danger fs-3"></i>
    } else if (type.includes("word") || type.includes("doc")) {
      return <i className="bi bi-file-earmark-word text-primary fs-3"></i>
    } else if (type.includes("powerpoint") || type.includes("presentation")) {
      return <i className="bi bi-file-earmark-ppt text-warning fs-3"></i>
    } else {
      return <i className="bi bi-file-earmark-text fs-3"></i>
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
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
          <h1 className="mb-1">Notes Repository</h1>
          <p className="text-muted">Upload and access study materials</p>
        </div>

        <button className="btn btn-primary mt-2 mt-md-0" onClick={() => setUploadModalOpen(true)}>
          <i className="bi bi-upload me-2"></i>
          Upload Notes
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
              placeholder="Search notes by title or uploader..."
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
            All Notes
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "my-uploads" ? "active" : ""}`}
            onClick={() => setActiveTab("my-uploads")}
          >
            My Uploads
          </button>
        </li>
      </ul>

      {filteredNotes.length > 0 ? (
        <div className="row">
          {filteredNotes.map((note) => (
            <div key={note._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex align-items-center">
                  {getFileIcon(note.fileType)}
                  <div className="ms-3">
                    <h5 className="card-title mb-0">{note.title}</h5>
                    <p className="card-text small text-muted mb-0">
                      Uploaded by{" "}
                      {note.uploadedBy ? `${note.uploadedBy.firstName} ${note.uploadedBy.lastName}` : "Unknown"} on{" "}
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">{note.subject}</span>
                    <span className="text-muted small">{formatFileSize(note.fileSize)}</span>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <a
                    href={note.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Preview
                  </a>
                  <a href={note.fileUrl} download className="btn btn-primary btn-sm">
                    <i className="bi bi-download me-1"></i>
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-folder fs-1 text-muted mb-3"></i>
          <h3>No notes found</h3>
          <p className="text-muted">
            {searchTerm || selectedSubject || activeTab === "my-uploads"
              ? "Try adjusting your search or filters"
              : "Upload some notes to get started"}
          </p>
          {!(searchTerm || selectedSubject) && activeTab !== "my-uploads" && (
            <button className="btn btn-primary mt-3" onClick={() => setUploadModalOpen(true)}>
              <i className="bi bi-upload me-2"></i>
              Upload Notes
            </button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Study Notes</h5>
                <button type="button" className="btn-close" onClick={() => setUploadModalOpen(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <select
                      className="form-select"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
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

                  <div className="mb-3">
                    <label className="form-label">File</label>
                    <input type="file" className="form-control" onChange={handleFileChange} required />
                    <div className="form-text">Supported formats: PDF, DOCX, PPTX, TXT</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setUploadModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!formData.title || !formData.subject || !formData.file}
                  >
                    Upload
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

Notes.propTypes = {
  getNotes: PropTypes.func.isRequired,
  uploadNote: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  notes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  notes: state.notes,
})

export default connect(mapStateToProps, { getNotes, uploadNote })(Notes)

