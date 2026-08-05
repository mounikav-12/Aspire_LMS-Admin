import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Admin / Dashboard Pages
import { SuperAdminDashboard } from '../pages/dashboard/SuperAdminDashboard';
import { UserManagementPage } from '../pages/users/UserManagementPage';
import { PermissionManagementPage } from '../pages/users/PermissionManagementPage';

// Module Pages
import { CourseListPage } from '../pages/courses/CourseListPage';
import { CourseDetailPage } from '../pages/courses/CourseDetailPage';
import { AssessmentListPage } from '../pages/assessments/AssessmentListPage';
import { LiveSessionListPage } from '../pages/sessions/LiveSessionListPage';
import { JobPortalPage } from '../pages/jobs/JobPortalPage';
import { RecordingLibraryPage } from '../pages/library/RecordingLibraryPage';
import { RecordingDetailPage } from '../pages/library/RecordingDetailPage';
import { PlacementPrepPage } from '../pages/placement/PlacementPrepPage';
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Dashboard Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="permissions" element={<PermissionManagementPage />} />
        
        {/* Course Routes */}
        <Route path="courses" element={<CourseListPage />} />
        <Route path="courses/:courseId" element={<CourseDetailPage />} />

        {/* Assessment Routes */}
        <Route path="assessments" element={<AssessmentListPage />} />

        {/* Live Session Routes */}
        <Route path="live-sessions" element={<LiveSessionListPage />} />

        {/* Job Portal Routes */}
        <Route path="jobs" element={<JobPortalPage />} />

        {/* Library Routes */}
        <Route path="library" element={<RecordingLibraryPage />} />
        <Route path="library/:id" element={<RecordingDetailPage />} />

        {/* Placement Preparation */}
        <Route path="placement" element={<PlacementPrepPage />} />

        {/* Student Specific View */}
        <Route path="student-dashboard" element={<StudentDashboardPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
