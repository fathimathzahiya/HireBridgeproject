import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { companyAPI } from "../../utils/companyDashboardAPI";
import "./CompanyProfile.css";

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    location: "",
    HRName: "",
    HREmail: "",
    phoneNumber: "",
    companyLogo: "",
    profilePhoto: "",
    aboutCompany: "",
  });

  useEffect(() => {
    fetchCompanyProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getSingleCompany(companyId);
      setCompany(data);
      setFormData(data);
      if (data.companyLogo) {
        setLogoPreview(data.companyLogo.startsWith("http") ? data.companyLogo : `http://localhost:5000${data.companyLogo}`);
      } else {
        setLogoPreview("");
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch company profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.warning("Please upload an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning("File size must be less than 5MB");
        return;
      }
      setLogoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.warning("Please upload an image file only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("File size must be less than 5MB.");
      return;
    }

    try {
      const data = new FormData();
      data.append("profilePhoto", file);
      
      const token = localStorage.getItem("hirebridge_token");
      const res = await fetch("http://localhost:5000/api/company/update-profile-photo", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      if (!res.ok) {
        throw new Error("Failed to update profile photo");
      }

      const responseData = await res.json();
      toast.success("Profile photo updated successfully!");
      
      setCompany(responseData.company);
      setFormData(responseData.company);
      setLogoPreview(responseData.profilePhoto.startsWith("http") ? responseData.profilePhoto : `http://localhost:5000${responseData.profilePhoto}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile photo: " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "companyLogo" && key !== "profilePhoto") {
          data.append(key, formData[key]);
        } else if (!logoFile && formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (logoFile) {
        data.append("companyLogo", logoFile);
      }

      const updatedCompany = await companyAPI.updateCompanyProfile(
        companyId,
        data
      );
      
      setCompany(updatedCompany);
      setFormData(updatedCompany);
      if (updatedCompany.companyLogo) {
        setLogoPreview(updatedCompany.companyLogo.startsWith("http") ? updatedCompany.companyLogo : `http://localhost:5000${updatedCompany.companyLogo}`);
      }
      setLogoFile(null);
      setIsEditing(false);
      toast.success("Company profile updated successfully!");
    } catch (err) {
      toast.error("Error updating profile: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="profile-loading-spinner"></div>
        <p>Retrieving company profile details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error-container">
        <div className="profile-error-card">
          <span className="profile-error-icon">⚠️</span>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={fetchCompanyProfile} className="btn-profile-retry">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-wrapper">
      {/* Banner / Cover area */}
      <div className="profile-cover-banner">
        <div className="banner-gradient-overlay"></div>
      </div>

      <div className="company-profile-container">
        {/* Floating Brand Card */}
        <div className="brand-floating-card">
          <div className="brand-logo-area">
            {isEditing ? (
              <label className="logo-edit-zone" title="Click to upload new logo">
                <input
                  type="file"
                  name="companyLogoFile"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  style={{ display: "none" }}
                />
                {logoPreview ? (
                  <div className="logo-preview-container">
                    <img src={logoPreview} alt="Logo Preview" className="floating-logo" />
                    <div className="logo-upload-overlay">
                      <span>📸</span>
                      <p>Change Logo</p>
                    </div>
                  </div>
                ) : (
                  <div className="logo-placeholder-container">
                    <span>🏢</span>
                    <p>Upload Logo</p>
                  </div>
                )}
              </label>
            ) : (
              <div className="logo-view-container" style={{ position: "relative" }}>
                <label className="logo-edit-zone" title="Click to upload new photo" style={{ cursor: "pointer" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    style={{ display: "none" }}
                  />
                  {company.profilePhoto || company.companyLogo ? (
                    <img
                      src={(company.profilePhoto || company.companyLogo).startsWith("http") ? (company.profilePhoto || company.companyLogo) : `http://localhost:5000${company.profilePhoto || company.companyLogo}`}
                      alt={company.name}
                      className="floating-logo"
                    />
                  ) : (
                    <div className="logo-placeholder-container">
                      <span>🏢</span>
                    </div>
                  )}
                  <div className="logo-upload-overlay" style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                  onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <span>📸</span>
                    <p style={{ margin: "2px 0 0 0", fontSize: "10px", fontWeight: "600" }}>Upload Photo</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="brand-details-area">
            <div className="brand-meta-info">
              <h2>{isEditing ? (formData.name || "Edit Profile") : company.name}</h2>
              <div className="meta-tags">
                <span className="meta-tag location">
                  📍 {isEditing ? (formData.location || "Location not set") : company.location}
                </span>
              </div>
            </div>

            {!isEditing && (
              <button
                className="btn-edit-trigger"
                onClick={() => {
                  setFormData(company);
                  setIsEditing(true);
                }}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form-grid">
            <div className="form-main-content">
              {/* Card 1: Company Profile Info */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="card-header-icon">🏢</span>
                  <h3>Company Information</h3>
                </div>
                <div className="form-card-body">
                  <div className="form-group full-width">
                    <label>Company Name *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">🏢</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Acme Corporation"
                      />
                    </div>
                  </div>

                  <div className="form-row-2col">
                    <div className="form-group">
                      <label>Email Address</label>
                      <div className="input-with-icon">
                        <span className="input-icon">✉️</span>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled
                          title="Contact support to change email"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Website URL *</label>
                      <div className="input-with-icon">
                        <span className="input-icon">🌐</span>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. https://acme.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-3col">
                    <div className="form-group" style={{ gridColumn: "span 3" }}>
                      <label>Location *</label>
                      <div className="input-with-icon">
                        <span className="input-icon">📍</span>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. New York, USA"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: About Company */}
              <div className="form-card">
                <div className="form-card-header">
                  <span className="card-header-icon">📝</span>
                  <h3>About Company</h3>
                </div>
                <div className="form-card-body">
                  <div className="form-group full-width">
                    <label>Company Overview</label>
                    <textarea
                      name="aboutCompany"
                      value={formData.aboutCompany}
                      onChange={handleInputChange}
                      placeholder="Share a compelling overview of your company, mission, work culture, and future goals..."
                      rows="6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-sidebar-content">
              {/* Card 3: HR / Point of Contact Info */}
              <div className="form-card sidebar-card">
                <div className="form-card-header">
                  <span className="card-header-icon">📞</span>
                  <h3>HR / Primary Contact</h3>
                </div>
                <div className="form-card-body">
                  <div className="form-group">
                    <label>HR Contact Name *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        name="HRName"
                        value={formData.HRName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>HR Contact Email</label>
                    <div className="input-with-icon">
                      <span className="input-icon">✉️</span>
                      <input
                        type="email"
                        name="HREmail"
                        value={formData.HREmail}
                        onChange={handleInputChange}
                        placeholder="e.g. hr@acme.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Phone Number *</label>
                    <div className="input-with-icon">
                      <span className="input-icon">📞</span>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. +1 555-0199"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Panel */}
              <div className="form-action-sticky-card">
                <button type="submit" className="btn-save-changes">
                  💾 Save Profile Changes
                </button>
                <button
                  type="button"
                  className="btn-cancel-changes"
                  onClick={() => {
                    setFormData(company);
                    if (company?.companyLogo) {
                      setLogoPreview(company.companyLogo.startsWith("http") ? company.companyLogo : `http://localhost:5000${company.companyLogo}`);
                    } else {
                      setLogoPreview("");
                    }
                    setLogoFile(null);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="profile-display-grid">
            <div className="profile-main-column">
              {/* About Section */}
              <div className="profile-info-card">
                <div className="card-title-bar">
                  <span className="card-title-icon">📄</span>
                  <h3>About Our Company</h3>
                </div>
                <div className="card-content-body">
                  {company.aboutCompany ? (
                    <p className="description-paragraph">{company.aboutCompany}</p>
                  ) : (
                    <p className="no-description-text">
                      No overview provided yet. Click the <strong>Edit Profile</strong> button to add a summary about your company!
                    </p>
                  )}
                </div>
              </div>

              {/* Key Company Information */}
              <div className="profile-info-card">
                <div className="card-title-bar">
                  <span className="card-title-icon">📊</span>
                  <h3>Corporate Details</h3>
                </div>
                <div className="card-content-body details-grid">
                  <div className="detail-pill">
                    <span className="pill-icon">🌐</span>
                    <div className="pill-meta">
                      <span className="pill-label">Website</span>
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="pill-value link">
                        {company.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </div>
                  </div>

                  <div className="detail-pill">
                    <span className="pill-icon">📍</span>
                    <div className="pill-meta">
                      <span className="pill-label">Headquarters</span>
                      <span className="pill-value">{company.location}</span>
                    </div>
                  </div>

                  </div>
                </div>
              </div>

            <div className="profile-sidebar-column">
              {/* HR / Contact Sidebar Card */}
              <div className="profile-info-card contact-sidebar-card">
                <div className="card-title-bar">
                  <span className="card-title-icon">📞</span>
                  <h3>Contact Representative</h3>
                </div>
                <div className="card-content-body contact-list">
                  <div className="contact-item">
                    <span className="contact-icon">👤</span>
                    <div className="contact-details">
                      <span className="contact-label">HR Manager</span>
                      <span className="contact-value">{company.HRName}</span>
                    </div>
                  </div>

                  {company.HREmail && (
                    <div className="contact-item">
                      <span className="contact-icon">✉️</span>
                      <div className="contact-details">
                        <span className="contact-label">HR Email</span>
                        <a href={`mailto:${company.HREmail}`} className="contact-value link">
                          {company.HREmail}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div className="contact-details">
                      <span className="contact-label">Phone Contact</span>
                      <span className="contact-value">{company.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="contact-item">
                    <span className="contact-icon">💼</span>
                    <div className="contact-details">
                      <span className="contact-label">Company Email</span>
                      <a href={`mailto:${company.email}`} className="contact-value link">
                        {company.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
