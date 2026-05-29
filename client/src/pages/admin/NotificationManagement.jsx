import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  Bell, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Award
} from "lucide-react";

export const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load platform system notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this system alert log?")) {
      try {
        await adminService.deleteNotification(id);
        toast.success("Notification log successfully removed.");
        fetchNotifications();
      } catch (err) {
        console.error(err);
        toast.error("Failed to remove system alert.");
      }
    }
  };

  // Vetting notification category labels
  const getIconForType = (type, message) => {
    const text = (message || "").toLowerCase();
    if (text.includes("shortlisted") || text.includes("scheduled")) {
      return { icon: Calendar, color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" };
    }
    if (text.includes("selected")) {
      return { icon: Award, color: "#10b981", bg: "rgba(16,185,129,0.15)" };
    }
    if (text.includes("rejected")) {
      return { icon: AlertTriangle, color: "#ef4444", bg: "rgba(239,68,68,0.15)" };
    }
    return { icon: Info, color: "#3b82f6", bg: "rgba(59,130,246,0.15)" };
  };

  // Filter logs
  const filteredNotifications = notifications.filter((item) => {
    const messageText = item.message || "";
    const matchesSearch = messageText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.studentId?.username && item.studentId.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.companyId?.name && item.companyId.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Infer notification type from message
    let inferredType = "Placement";
    const text = messageText.toLowerCase();
    if (text.includes("scheduled")) inferredType = "Interview";
    else if (text.includes("shortlisted")) inferredType = "Warning";
    else if (text.includes("selected")) inferredType = "Success";
    else if (text.includes("rejected")) inferredType = "Error";

    const matchesType = typeFilter === "All" ? true : inferredType === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Platform System Logs</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            Monitor and audit all real-time placement signals, interview schedules, and student notification events.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={fetchNotifications}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
          >
            Refresh Logs
          </button>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#8b5cf6", background: "rgba(139,92,246,0.1)", padding: "8px 16px", borderRadius: "8px", display: "flex", alignItems: "center" }}>
            Total: {filteredNotifications.length} Events
          </div>
        </div>
      </div>

      {/* Filters and Search row */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "15px",
        alignItems: "center"
      }}>
        {/* Search input */}
        <div style={{ flex: "2 1 250px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "14px", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search system logs by candidate, company, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 15px 10px 40px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(0,0,0,0.1)",
              color: "white",
              outline: "none",
              fontSize: "14px"
            }}
          />
        </div>

        {/* Filter categories */}
        <div style={{ display: "flex", gap: "10px", flex: "1 1 200px" }}>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(15,23,42,0.6)",
              color: "white",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            <option value="All">All Vetting Signals</option>
            <option value="Success">Success (Offer Selected)</option>
            <option value="Warning">Warning (Shortlists)</option>
            <option value="Error">Error (Rejections)</option>
            <option value="Interview">Interview Schedules</option>
            <option value="Placement">General Placement News</option>
          </select>
        </div>
      </div>

      {/* Audit Log table */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        overflowX: "auto"
      }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading platform notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>No system alert records found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)", color: "#cbd5e1" }}>
                <th style={{ padding: "16px 20px" }}>Vetting Signal</th>
                <th style={{ padding: "16px 20px" }}>Candidate & Dept</th>
                <th style={{ padding: "16px 20px" }}>Recruiter Company</th>
                <th style={{ padding: "16px 20px" }}>System Log Event Message</th>
                <th style={{ padding: "16px 20px" }}>Timestamp</th>
                <th style={{ padding: "16px 20px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((item) => {
                const configObj = getIconForType(item.type, item.message);
                const ItemIcon = configObj.icon;
                return (
                  <tr key={item._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", verticalAlign: "middle" }} className="table-row-hover">
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ background: configObj.bg, padding: "6px", borderRadius: "50%", color: configObj.color, display: "flex", alignItems: "center" }}>
                          <ItemIcon size={14} />
                        </div>
                        <span style={{ fontWeight: "700", color: "#cbd5e1" }}>
                          {item.message?.toLowerCase().includes("selected") ? "Success" :
                           item.message?.toLowerCase().includes("scheduled") ? "Interview" :
                           item.message?.toLowerCase().includes("rejected") ? "Error" : "Placement"}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: "600", color: "white" }}>{item.studentId?.username || "Global / System"}</span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{item.studentId?.department || ""}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#cbd5e1", fontWeight: "600" }}>
                      {item.companyId?.name || "HireBridge Platform"}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#94a3b8", lineHeight: "1.4", maxWidth: "350px", whiteSpace: "normal" }}>
                      {item.message}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#64748b" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Clock size={12} />
                        <span>{new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <button
                        onClick={() => handleDelete(item._id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          padding: "6px",
                          borderRadius: "6px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "none"}
                        title="Delete log"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

