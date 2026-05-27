import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CompanyDashboardLayout from "./CompanyDashboardLayout";
import CompanyDashboardOverview from "./CompanyDashboardOverview";
import JobPostings from "./JobPostings";
import Applicants from "./Applicants";
import InterviewManagement from "./InterviewManagement";
import CompanyProfile from "./CompanyProfile";
import SingleJobView from "./SingleJobView";

const CompanyDashboardRouter = () => {
  return (
    <CompanyDashboardLayout>
      <Routes>
        <Route path="/overview" element={<CompanyDashboardOverview />} />
        <Route path="/jobs" element={<JobPostings />} />
        <Route path="/jobs/:jobId" element={<SingleJobView />} />
        <Route path="/applicants" element={<Applicants />} />
        <Route path="/interviews" element={<InterviewManagement />} />
        <Route path="/profile" element={<CompanyProfile />} />
        <Route path="/*" element={<Navigate to="/overview" />} />
      </Routes>
    </CompanyDashboardLayout>
  );
};

export default CompanyDashboardRouter;
