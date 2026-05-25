import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { companyAPI } from "../../utils/companyDashboardAPI";
import "./CompanyProfile.css";

const CompanyProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    location: "",
    industry: "",
    companySize: "",
    HRName: "",
    HREmail: "",
    phoneNumber: "",
    companyLogo: "",
    aboutCompany: "",
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, [companyId]);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const data = await companyAPI.getSingleCompany(companyId);
      setCompany(data);
      setFormData(data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCompany = await companyAPI.updateCompanyProfile(
        companyId,
        formData
      );
      setCompany(updatedCompany);
      setIsEditing(false);
      alert("Company profile updated successfully!");
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading company profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="company-profile-container">
      <div className="profile-header">
        <h2>Company Profile</h2>
        <button
          className={`btn-edit-profile ${isEditing ? "cancel" : ""}`}
          onClick={() => {
            if (isEditing) {
              setFormData(company);
            }
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Cancel" : "✏️ Edit Profile"}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Website *</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  placeholder="e.g., IT, Finance, Healthcare"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                >
                  <option value="">Select company size</option>
                  <option value="Startup">Startup</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="form-group">
                <label>Company Logo URL</label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>HR Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>HR Name *</label>
                <input
                  type="text"
                  name="HRName"
                  value={formData.HRName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>HR Email</label>
                <input
                  type="email"
                  name="HREmail"
                  value={formData.HREmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>About Company</h3>

            <div className="form-group">
              <label>About Company</label>
              <textarea
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleInputChange}
                placeholder="Tell us about your company..."
                rows="4"
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-card">
            <div className="profile-header-info">
              {company.companyLogo && (
                <img src={company.companyLogo} alt={company.name} className="profile-logo" />
              )}
              <div className="company-header-text">
                <h2>{company.name}</h2>
                <p>{company.location}</p>
              </div>
            </div>

            <div className="profile-sections">
              <div className="profile-section">
                <h3>Basic Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{company.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Website:</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  </div>
                  <div className="info-item">
                    <span className="label">Industry:</span>
                    <span className="value">{company.industry || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Company Size:</span>
                    <span className="value">{company.companySize || "Not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3>HR Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">HR Name:</span>
                    <span className="value">{company.HRName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">HR Email:</span>
                    <span className="value">{company.HREmail || "Not specified"}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{company.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {company.aboutCompany && (
                <div className="profile-section">
                  <h3>About Company</h3>
                  <p className="about-text">{company.aboutCompany}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
