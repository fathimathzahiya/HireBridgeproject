import React, { useState, useEffect } from "react";
import "./ProfilePopup.css";

function ProfilePopup({ studentData, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    department: "",
    cgpa: "",
    project: "",
    skills: "",
    certification: "",
    address: "",
    github: "",
    linkedin: "",
    profileImage: "",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form data when entering edit mode or when studentData changes
  useEffect(() => {
    if (studentData) {
      setFormData({
        username: studentData.username || "",
        phoneNumber: studentData.phoneNumber || "",
        department: studentData.department || "",
        cgpa: studentData.cgpa || "",
        project: studentData.project || "",
        skills: studentData.skills || "",
        certification: studentData.certification || "",
        address: studentData.address || "",
        github: studentData.github || "",
        linkedin: studentData.linkedin || "",
        profileImage: studentData.profileImage || "",
      });
      setImagePreview(
        studentData.profileImage
          ? studentData.profileImage.startsWith("http")
            ? studentData.profileImage
            : `http://localhost:5000${studentData.profileImage}`
          : ""
      );
    }
  }, [studentData, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        setImageFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file");
        setResumeFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setResumeFile(null);
        return;
      }
      setResumeFile(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) {
        setError("Student ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profileImage") {
          if (formData[key] !== undefined && formData[key] !== null) {
            data.append(key, formData[key]);
          }
        } else if (!imageFile && formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      if (imageFile) {
        data.append("profileImage", imageFile);
      }

      const token = localStorage.getItem("hirebridge_token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `http://localhost:5000/api/student/updatestudent/${studentId}`,
        {
          method: "PUT",
          headers,
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setSuccess("Profile updated successfully!");
      
      if (onSave) {
        onSave(updatedData);
      }

      setTimeout(() => {
        setSuccess("");
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderProfileImage = () => {
    const imgSrc = studentData?.profileImage
      ? studentData.profileImage.startsWith("http")
        ? studentData.profileImage
        : `http://localhost:5000${studentData.profileImage}`
      : "https://i.pravatar.cc/150";
    return imgSrc;
  };

  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div className="profile-popup-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="popup-close-btn" onClick={onClose}>
          ✕
        </button>

        {!isEditing ? (
          /* DETAILS VIEW MODE */
          <div className="profile-details-view">
            <div className="profile-details-header">
              <img
                src={renderProfileImage()}
                alt={studentData?.username}
                className="profile-details-avatar"
              />
              <div className="profile-details-identity">
                <h2>{studentData?.username || "Student Name"}</h2>
                <p className="student-dept-tag">🎓 {studentData?.department || "Department"}</p>
              </div>
            </div>

            <div className="profile-details-sections">
              <div className="profile-info-section">
                <h3>📞 Contact Details</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">Phone</span>
                    <span className="profile-info-val">{studentData?.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">Address</span>
                    <span className="profile-info-val">{studentData?.address || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="profile-info-section">
                <h3>📊 Academic Standings</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">Department</span>
                    <span className="profile-info-val">{studentData?.department || "N/A"}</span>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">CGPA</span>
                    <span className="profile-info-val highlight-cgpa">{studentData?.cgpa || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="profile-info-section">
                <h3>💻 Professional & Experience</h3>
                <div className="profile-info-full">
                  <div className="profile-info-block">
                    <span className="profile-info-label">Key Skills</span>
                    <div className="profile-skills-list">
                      {studentData?.skills ? (
                        studentData.skills.split(",").map((skill, index) => (
                          <span key={index} className="skill-badge-popup">
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="profile-info-val">N/A</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="profile-info-block" style={{ marginTop: "12px" }}>
                    <span className="profile-info-label">Academic Projects</span>
                    <p className="profile-block-text">{studentData?.project || "No projects uploaded yet."}</p>
                  </div>

                  <div className="profile-info-block" style={{ marginTop: "12px" }}>
                    <span className="profile-info-label">Certifications</span>
                    <p className="profile-block-text">{studentData?.certification || "No certifications uploaded yet."}</p>
                  </div>

                  <div className="profile-info-block" style={{ marginTop: "12px" }}>
                    <span className="profile-info-label">Attached Resume</span>
                    <div className="resume-download-link">
                      {studentData?.resume ? (
                        <a
                          href={
                            studentData.resume.startsWith("http")
                              ? studentData.resume
                              : `http://localhost:5000${studentData.resume}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-resume-popup"
                        >
                          📄 View Current Resume PDF
                        </a>
                      ) : (
                        <span className="text-muted" style={{ fontSize: "13px" }}>Not uploaded yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-info-section">
                <h3>🔗 Social Handles</h3>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-info-label">GitHub</span>
                    {studentData?.github ? (
                      <a href={studentData.github} target="_blank" rel="noopener noreferrer" className="popup-link">
                        GitHub Profile →
                      </a>
                    ) : (
                      <span className="profile-info-val text-muted">Not provided</span>
                    )}
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-info-label">LinkedIn</span>
                    {studentData?.linkedin ? (
                      <a href={studentData.linkedin} target="_blank" rel="noopener noreferrer" className="popup-link">
                        LinkedIn Profile →
                      </a>
                    ) : (
                      <span className="profile-info-val text-muted">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-popup-footer">
              <button className="btn-edit-popup" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile Details
              </button>
              <button className="btn-close-popup" onClick={onClose}>
                Close Popup
              </button>
            </div>
          </div>
        ) : (
          /* EDIT PROFILE FORM MODE */
          <div className="profile-edit-mode">
            <h2>Update Profile Details</h2>
            <p className="edit-subtitle">Modify your contact, academic, and professional fields below.</p>

            {error && <div className="popup-error-alert">{error}</div>}
            {success && <div className="popup-success-alert">{success}</div>}

            <form onSubmit={handleSubmit} className="profile-edit-form">
              <div className="form-row-popup">
                <div className="form-group-popup">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group-popup">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row-popup">
                <div className="form-group-popup">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group-popup">
                  <label>CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              <div className="form-group-popup">
                <label>Permanent Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group-popup">
                <label>Skills (Comma-separated)</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, MongoDB, Python"
                  rows="2"
                />
              </div>

              <div className="form-group-popup">
                <label>Academic Projects</label>
                <textarea
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  placeholder="Summarize your key projects..."
                  rows="2"
                />
              </div>

              <div className="form-group-popup">
                <label>Certifications</label>
                <textarea
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="List your professional credentials..."
                  rows="2"
                />
              </div>

              <div className="form-row-popup">
                <div className="form-group-popup">
                  <label>GitHub Link</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-group-popup">
                  <label>LinkedIn Link</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <div className="form-row-popup">
                <div className="form-group-popup">
                  <label>Upload Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="file-info-label">Supports JPEG, PNG (Max 5MB)</p>
                  {imagePreview && (
                    <div className="edit-avatar-preview">
                      <img src={imagePreview} alt="avatar preview" />
                    </div>
                  )}
                </div>

                <div className="form-group-popup">
                  <label>Upload Resume (PDF File)</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                  />
                  <p className="file-info-label">PDF document only (Max 5MB)</p>
                  {resumeFile && (
                    <p className="file-ready-tag">✓ PDF Chosen: {resumeFile.name}</p>
                  )}
                  {studentData?.resume && !resumeFile && (
                    <p className="resume-attached-note">✓ Resume PDF is already attached</p>
                  )}
                </div>
              </div>

              <div className="profile-edit-actions">
                <button
                  type="submit"
                  className="btn-submit-edit"
                  disabled={loading}
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-cancel-edit"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePopup;
