import React from "react";
import "./ConfirmLogout.css";

function ConfirmLogout({ onConfirm, onCancel }) {
  return (
    <div className="confirm-logout-overlay" onClick={onCancel}>
      <div className="confirm-logout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="logout-icon">🚪</div>
        <h2>Logout Confirmation</h2>
        <p>Are you sure you want to logout?</p>
        <p className="logout-info">You'll need to login again to access your account.</p>

        <div className="logout-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirm Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogout;
