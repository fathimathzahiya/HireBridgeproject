import React, { useState } from "react";
import "./EditProfile.css";

function EditProfile({ studentData, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: studentData?.username || "",
    phoneNumber: studentData?.phoneNumber || "",
    department: studentData?.department || "",
    cgpa: studentData?.cgpa || "",
    project: studentData?.project || "",
    skills: studentData?.skills || "",
    certification: studentData?.certification || "",
    resume: studentData?.resume || "",
    address: studentData?.address || "",
    github: studentData?.github || "",
    linkedin: studentData?.linkedin || "",
    profileImage: studentData?.profileImage || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

      const response = await fetch(
        `http://localhost:5000/api/student/updatestudent/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setSuccess("Profile updated successfully!");
      
      // Call parent callback to update student data
      if (onSave) {
        onSave(updatedData);
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-overlay" onClick={onClose}>
      <div className="edit-profile" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Edit Profile</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="4"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Projects</label>
              <textarea
                name="project"
                value={formData.project}
                onChange={handleChange}
                placeholder="Describe your projects"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Certifications</label>
              <textarea
                name="certification"
                value={formData.certification}
                onChange={handleChange}
                placeholder="List your certifications"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Resume URL</label>
              <input
                type="url"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Profile</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
