import React, { useState } from "react";
import "./ProfilePopup.css";

function ProfilePopup({ studentData, onClose, onEdit }) {
  return (
    <div className="profile-popup-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Profile Header */}
        <div className="profile-popup-header">
          <img
            src={
              studentData?.profileImage
                ? studentData.profileImage.startsWith("http")
                  ? studentData.profileImage
                  : `http://localhost:5000${studentData.profileImage}`
                : "https://i.pravatar.cc/150"
            }
            alt={studentData?.username}
            className="profile-popup-image"
          />
          <div className="profile-popup-name">
            <h2>{studentData?.username || "Student Name"}</h2>
            <p className="department">{studentData?.department || "Department"}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-popup-details">
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <span className="label">📱 Phone:</span>
              <span className="value">{studentData?.phoneNumber || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">📍 Address:</span>
              <span className="value">{studentData?.address || "N/A"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Academic Information</h3>
            <div className="detail-item">
              <span className="label">🎓 Department:</span>
              <span className="value">{studentData?.department || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">📊 CGPA:</span>
              <span className="value">{studentData?.cgpa || "N/A"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Professional Details</h3>
            <div className="detail-item">
              <span className="label">💻 Skills:</span>
              <span className="value">{studentData?.skills || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🏆 Certifications:</span>
              <span className="value">{studentData?.certification || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">📁 Projects:</span>
              <span className="value">{studentData?.project || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">📄 Resume:</span>
              <span className="value">
                {studentData?.resume ? (
                  <a href={studentData.resume} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                ) : (
                  "Not uploaded"
                )}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Social Links</h3>
            <div className="detail-item">
              <span className="label">🔗 GitHub:</span>
              <span className="value">
                {studentData?.github ? (
                  <a href={studentData.github} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                ) : (
                  "Not provided"
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">💼 LinkedIn:</span>
              <span className="value">
                {studentData?.linkedin ? (
                  <a href={studentData.linkedin} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                ) : (
                  "Not provided"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-popup-actions">
          <button className="btn-edit" onClick={onEdit}>
            ✏️ Edit Profile
          </button>
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePopup;
