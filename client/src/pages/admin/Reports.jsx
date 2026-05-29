import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { toast } from "react-toastify";
import { 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  TrendingUp, 
  Building2, 
  GraduationCap, 
  Download,
  Calendar,
  Layers,
  Award
} from "lucide-react";

export const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load platform analytics for reports.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flex: 1, height: "80vh", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ marginTop: "15px", color: "#64748b" }}>Generating analytics reports...</p>
      </div>
    );
  }

  const { stats, charts } = data || {};

  // CSV Exporter
  const exportCSV = () => {
    if (!charts || !charts.departmentPlacements) return;
    
    const headers = ["Department", "Total Enrolled", "Selected / Placed", "Placement Success (%)"];
    const rows = charts.departmentPlacements.map(dept => [
      `"${dept.department}"`,
      dept.total,
      dept.placed,
      `${dept.percentage}%`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HireBridge_Placement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file exported successfully!");
  };

  // Excel HTML Exporter
  const exportExcel = () => {
    if (!charts || !charts.departmentPlacements) return;

    let excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Department Placements</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { background-color: #4f46e5; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #e2e8f0; padding: 8px; }
          .title { font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #1e1b4b; }
          .kpi-table { margin-bottom: 30px; }
          .kpi-table td { background-color: #f8fafc; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="title">HireBridge College Placement & Analytical Report</div>
        
        <h3>Key Performance Metrics</h3>
        <table class="kpi-table">
          <tr>
            <td>Total Students Vetted</td><td>${stats?.totalStudents || 0}</td>
            <td>Selected Candidates</td><td>${stats?.selectedStudents || 0}</td>
          </tr>
          <tr>
            <td>Active Recruiter Openings</td><td>${stats?.totalJobs || 0}</td>
            <td>Platform Success Ratio</td><td>${stats?.successRatio || 0}%</td>
          </tr>
        </table>

        <h3>Placement Share By Academic Departments</h3>
        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Total Students Vetted</th>
              <th>Placed Students Count</th>
              <th>Departmental Success Rate (%)</th>
            </tr>
          </thead>
          <tbody>
    `;

    charts.departmentPlacements.forEach(dept => {
      excelHTML += `
        <tr>
          <td>${dept.department}</td>
          <td>${dept.total}</td>
          <td>${dept.placed}</td>
          <td>${dept.percentage}%</td>
        </tr>
      `;
    });

    excelHTML += `
          </tbody>
        </table>
        
        <br/>
        <h3>Recruiter Hiring Pipelines</h3>
        <table>
          <thead>
            <tr>
              <th>Corporate Recruiter Company</th>
              <th>Submitted Job Applications</th>
            </tr>
          </thead>
          <tbody>
    `;

    charts.companyHiringStats?.forEach(comp => {
      excelHTML += `
        <tr>
          <td>${comp.company}</td>
          <td>${comp.applications}</td>
        </tr>
      `;
    });

    excelHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HireBridge_Placement_Report_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel Spreadsheet (.xls) exported successfully!");
  };

  // Modern corporate PDF Printer Popup
  const printPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to download PDF.");
      return;
    }

    const deptRowsHTML = charts?.departmentPlacements?.map(dept => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">${dept.department}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${dept.total}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #16a34a; font-weight: bold;">${dept.placed}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">
          <span style="padding: 4px 8px; background: rgba(16,185,129,0.1); color: #10b981; border-radius: 6px; font-weight: 700; font-size: 13px;">
            ${dept.percentage}%
          </span>
        </td>
      </tr>
    `).join("") || "";

    const companyRowsHTML = charts?.companyHiringStats?.map(comp => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #1e293b;">${comp.company}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #2563eb; font-weight: bold;">${comp.applications} Applications</td>
      </tr>
    `).join("") || "";

    printWindow.document.write(`
      <html>
        <head>
          <title>HireBridge Placement & Analytical Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: white; margin: 0; }
            .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
            .title-area h1 { margin: 0; font-size: 26px; font-weight: 800; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .title-area p { margin: 5px 0 0 0; color: #64748b; font-size: 13px; font-weight: 500; }
            .meta-date { text-align: right; font-size: 12px; color: #64748b; font-weight: 600; }
            
            .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 40px; }
            .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 10px; text-align: center; }
            .kpi-card span { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            .kpi-card h2 { margin: 5px 0 0 0; font-size: 22px; font-weight: 800; color: #1e1b4b; }

            .section-title { font-size: 16px; font-weight: 700; color: #1e1b4b; border-left: 4px solid #4f46e5; padding-left: 10px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { background: #f1f5f9; color: #475569; padding: 12px; font-weight: 700; font-size: 12px; text-align: left; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
            
            .footer { position: fixed; bottom: 30px; left: 40px; right: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; }
            
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="title-area">
              <h1>HireBridge Placement Analytics</h1>
              <p>Placement & Analytical Board Report summary of college pipelines</p>
            </div>
            <div class="meta-date">
              Report Generated<br/>
              <span style="color: #1e293b; font-size: 13px;">${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <span>Total Vetted Students</span>
              <h2>${stats?.totalStudents || 0}</h2>
            </div>
            <div class="kpi-card">
              <span>Placed Candidates</span>
              <h2 style="color: #10b981;">${stats?.selectedStudents || 0}</h2>
            </div>
            <div class="kpi-card">
              <span>Corporate Vacancies</span>
              <h2 style="color: #f59e0b;">${stats?.totalJobs || 0}</h2>
            </div>
            <div class="kpi-card">
              <span>Overall Success Rate</span>
              <h2 style="color: #3b82f6;">${stats?.successRatio || 0}%</h2>
            </div>
          </div>

          <div class="section-title">Department Placement breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Academic Department Name</th>
                <th style="text-align: center;">Total Enrolled</th>
                <th style="text-align: center;">Placed Students</th>
                <th style="text-align: center;">Placement Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              ${deptRowsHTML}
            </tbody>
          </table>

          <div class="section-title">Corporate Hiring Pipelines (Top Recruiters)</div>
          <table>
            <thead>
              <tr>
                <th>Recruiting Company Name</th>
                <th style="text-align: center;">Submitted Job Applications</th>
              </tr>
            </thead>
            <tbody>
              ${companyRowsHTML}
            </tbody>
          </table>

          <div class="footer">
            HireBridge MERN Placement Platform System Auto-Generated Analytical Board Report. Page 1 of 1.
          </div>

          <script>
            window.onload = function() {
              window.print();
              // close print window once print dialogue finishes
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      {/* Upper header with operations */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>Placement Reports & Analytics</h2>
          <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "14px" }}>
            Extract premium placement audits, department analytics, and pipeline summaries in multiple spreadsheet formats.
          </p>
        </div>
        
        {/* Export buttons panel */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={exportCSV}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              background: "rgba(255, 255, 255, 0.03)",
              color: "#3b82f6",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(59,130,246,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"}
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={exportExcel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              background: "rgba(255, 255, 255, 0.03)",
              color: "#10b981",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(16,185,129,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"}
          >
            <Download size={16} />
            <span>Export Excel</span>
          </button>

          <button
            onClick={printPDF}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(139,92,246,0.2)",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <Printer size={16} />
            <span>Print PDF Report</span>
          </button>
        </div>
      </div>

      {/* Analytical summaries */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {[
          { label: "Overall Success Ratio", value: `${stats?.successRatio || 0}%`, subtitle: "Selected vs. Total applications", icon: TrendingUp, color: "#3b82f6" },
          { label: "Hiring Recruiters", value: stats?.activeRecruiters || 0, subtitle: "Vetted companies with openings", icon: Building2, color: "#10b981" },
          { label: "Vetted Class Registrations", value: stats?.totalStudents || 0, subtitle: "Approved active student profiles", icon: GraduationCap, color: "#8b5cf6" },
          { label: "Final Selected Offers", value: stats?.selectedStudents || 0, subtitle: "Secured employment contracts", icon: Award, color: "#f59e0b" }
        ].map((item, idx) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.label}
                </span>
                <h3 style={{ margin: "5px 0 2px 0", fontSize: "24px", fontWeight: "800", color: "white" }}>
                  {item.value}
                </h3>
                <span style={{ fontSize: "11px", color: "#64748b" }}>{item.subtitle}</span>
              </div>
              <div style={{
                background: `rgba(${item.color === "#3b82f6" ? "59,130,250" : item.color === "#10b981" ? "16,185,129" : item.color === "#8b5cf6" ? "139,92,246" : "245,158,11"}, 0.15)`,
                padding: "10px",
                borderRadius: "10px",
                color: item.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <ItemIcon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Reports Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "25px"
      }}>
        {/* Department Breakdown */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(139,92,246,0.15)", padding: "8px", borderRadius: "8px", color: "#8b5cf6" }}>
              <Layers size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Placement breakdown by Department</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {charts?.departmentPlacements?.map((dept, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{dept.department}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    <strong style={{ color: "#10b981" }}>{dept.placed} Placed</strong> / {dept.total} Total ({dept.percentage}%)
                  </span>
                </div>
                {/* Horizontal Progress Bar */}
                <div style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "4px",
                  width: "100%",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${dept.percentage}%`,
                    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "4px",
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "25px",
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ background: "rgba(59,130,246,0.15)", padding: "8px", borderRadius: "8px", color: "#3b82f6" }}>
              <Building2 size={18} />
            </div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>Recruiter Hiring Pipeline shares</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {charts?.companyHiringStats?.map((comp, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 15px",
                  background: "rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.03)",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "24px",
                    height: "24px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#8b5cf6"
                  }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>{comp.company}</span>
                </div>
                <span style={{
                  fontSize: "12px",
                  padding: "4px 10px",
                  background: "rgba(59,130,246,0.1)",
                  color: "#3b82f6",
                  borderRadius: "6px",
                  fontWeight: "700"
                }}>
                  {comp.applications} Applications
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
