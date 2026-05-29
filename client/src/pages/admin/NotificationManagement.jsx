import React, { useState } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XOctagon,
  Eye,
  Megaphone,
  Users
} from "lucide-react";

export const NotificationManagement = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Info");
  const [isSending, setIsSending] = useState(false);

  const announcementTypes = [
    { value: "Info", label: "General Info", color: "#3b82f6", icon: Info, bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
    { value: "Success", label: "Success Alert", color: "#10b981", icon: CheckCircle, bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    { value: "Warning", label: "Warning Alert", color: "#f59e0b", icon: AlertTriangle, bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    { value: "Danger", label: "Critical Danger", color: "#ef4444", icon: XOctagon, bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.warning("Please fill in all fields.");
      return;
    }

    try {
      setIsSending(true);
      const res = await adminService.sendAnnouncement(title, message, type);
      toast.success(res.message || "Announcement broadcasted successfully!");
      setTitle("");
      setMessage("");
      setType("Info");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to dispatch system bulletin.");
    } finally {
      setIsSending(false);
    }
  };

  const selectedTypeObj = announcementTypes.find(t => t.value === type);
  const PreviewIcon = selectedTypeObj ? selectedTypeObj.icon : Info;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Placement Announcements</h2>
        <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
          Broadcast global notifications, campus placement reminders, and immediate alerts to all vetted students.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "25px",
        alignItems: "start"
      }}>
        {/* Dissemination Form */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(139,92,246,0.15)", padding: "10px", borderRadius: "10px", color: "#8b5cf6" }}>
              <Megaphone size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Compose Broadcast</h3>
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Announcement Type Selection */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Alert Severity Level
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {announcementTypes.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = type === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setType(item.value)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: isSelected ? `2px solid ${item.color}` : "1px solid rgba(255,255,255,0.08)",
                        background: isSelected ? item.bg : "rgba(0,0,0,0.15)",
                        color: isSelected ? "white" : "#94a3b8",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "13px",
                        transition: "all 0.2s ease",
                        textAlign: "left"
                      }}
                    >
                      <ItemIcon size={16} style={{ color: item.color }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Announcement Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. TCS Elite Hiring - CGPA Eligibility Updated"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.2)",
                  color: "white",
                  outline: "none",
                  fontSize: "14px",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Message Body */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#94a3b8", marginBottom: "8px" }}>
                Broadcast Message
              </label>
              <textarea
                placeholder="Write the details here. Include application links, instructions, or specific deadlines."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.2)",
                  color: "white",
                  outline: "none",
                  fontSize: "14px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            {/* Broadcast Button */}
            <button
              type="submit"
              disabled={isSending}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px",
                borderRadius: "8px",
                border: "none",
                background: isSending ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                color: "white",
                cursor: isSending ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
              onMouseOver={(e) => {
                if (!isSending) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)";
              }}
            >
              {isSending ? (
                <>
                  <div className="spinner-border spinner-border-sm text-light" style={{ width: "1rem", height: "1rem" }} role="status"></div>
                  <span>Broadcasting Message...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Send Live Broadcast</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Realtime Live Preview & Guidelines */}
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {/* Realtime Preview */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ background: "rgba(59,130,246,0.15)", padding: "10px", borderRadius: "10px", color: "#3b82f6" }}>
                <Eye size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>Live Bulletin Preview</h3>
            </div>

            <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 15px 0" }}>
              This is how the notification card will display inside the Student Dashboard notification center.
            </p>

            {/* Virtual Notification Card */}
            <div style={{
              background: selectedTypeObj?.bg || "rgba(255,255,255,0.02)",
              border: `1px solid ${selectedTypeObj?.border || "rgba(255,255,255,0.05)"}`,
              borderLeft: `5px solid ${selectedTypeObj?.color || "#3b82f6"}`,
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              gap: "15px",
              alignItems: "start",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                background: "rgba(0,0,0,0.2)",
                padding: "8px",
                borderRadius: "50%",
                color: selectedTypeObj?.color || "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <PreviewIcon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "white" }}>
                    {title ? title : "Announcement Headline"}
                  </h4>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "500" }}>Just Now</span>
                </div>
                <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                  {message ? `[${type.toUpperCase()}] ${title}: ${message}` : `[${type.toUpperCase()}] Complete preview details will be displayed here as you write.`}
                </p>
                <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", padding: "3px 8px", background: "rgba(0,0,0,0.2)", borderRadius: "4px", color: selectedTypeObj?.color || "#3b82f6", fontWeight: "600" }}>
                    Category: {type} Alert
                  </span>
                  <span style={{ fontSize: "10px", color: "#64748b" }}>• Dispatch to All Student Audits</span>
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast Guidelines Card */}
          <div style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)",
            color: "#94a3b8",
            fontSize: "13px",
            lineHeight: "1.6"
          }}>
            <h4 style={{ color: "white", margin: "0 0 12px 0", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={16} style={{ color: "#8b5cf6" }} />
              Broadcast System Guidelines
            </h4>
            <ul style={{ paddingLeft: "20px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <strong style={{ color: "white" }}>Target Audience:</strong> Broadcast notifications will reach all active (unblocked) students registered on the platform.
              </li>
              <li>
                <strong style={{ color: "white" }}>Vetting Alert Levels:</strong>
                <ul style={{ paddingLeft: "15px", listStyleType: "circle", marginTop: "5px" }}>
                  <li><span style={{ color: "#3b82f6" }}>Info:</span> General news, non-critical placement scheduling updates.</li>
                  <li><span style={{ color: "#10b981" }}>Success:</span> Achievement milestones, list of selected students reports.</li>
                  <li><span style={{ color: "#f59e0b" }}>Warning:</span> Deadline extensions, pending profile vetting approvals.</li>
                  <li><span style={{ color: "#ef4444" }}>Critical Danger:</span> Placement criteria overrides, emergency cancellations.</li>
                </ul>
              </li>
              <li>
                <strong style={{ color: "white" }}>Responsibility:</strong> This broadcast triggers instantly. Please ensure spelling, formatting, and hyperlinks are correct before dispatching.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
