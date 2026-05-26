import React from "react";
import "./CompanyProfilePopup.css";

function CompanyProfilePopup({ companyData, onClose, onEdit }) {
  return (
    <div className="company-profile-overlay" onClick={onClose}>
      <div className="company-profile-popup" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* Profile Header */}
        <div className="company-profile-header">
          <img
            src={
              companyData?.companyLogo
                ? companyData.companyLogo.startsWith("http")
                  ? companyData.companyLogo
                  : `http://localhost:5000${companyData.companyLogo}`
                : "https://via.placeholder.com/150?text=" + encodeURIComponent(companyData?.name || "Company")
            }
            alt={companyData?.name}
            className="company-profile-image"
          />
          <div className="company-profile-name">
            <h2>{companyData?.name || "Company Name"}</h2>
          </div>
        </div>

        {/* Profile Details */}
        <div className="company-profile-details">
          <div className="detail-section">
            <h3>Company Information</h3>
            <div className="detail-item">
              <span className="label">📧 Email:</span>
              <span className="value">{companyData?.email || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">🌍 Website:</span>
              <span className="value">
                {companyData?.website ? (
                  <a href={companyData.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">📍 Location:</span>
              <span className="value">{companyData?.location || "N/A"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Contact Details</h3>
            <div className="detail-item">
              <span className="label">👤 HR Name:</span>
              <span className="value">{companyData?.HRName || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="label">📞 Phone:</span>
              <span className="value">{companyData?.phoneNumber || "N/A"}</span>
            </div>
          </div>

          {companyData?.description && (
            <div className="detail-section">
              <h3>About Company</h3>
              <p className="description">{companyData.description}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="company-profile-actions">
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

export default CompanyProfilePopup;
