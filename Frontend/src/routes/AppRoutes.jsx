import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Auth Pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

// Admin / Dashboard Pages
const SuperAdminDashboard = lazy(() => import('../pages/dashboard/SuperAdminDashboard').then(m => ({ default: m.SuperAdminDashboard })));
const UserManagementPage = lazy(() => import('../pages/users/UserManagementPage').then(m => ({ default: m.UserManagementPage })));
const PermissionManagementPage = lazy(() => import('../pages/users/PermissionManagementPage').then(m => ({ default: m.PermissionManagementPage })));

// Module Pages
const CourseListPage = lazy(() => import('../pages/courses/CourseListPage').then(m => ({ default: m.CourseListPage })));
const CourseDetailPage = lazy(() => import('../pages/courses/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const AssessmentListPage = lazy(() => import('../pages/assessments/AssessmentListPage').then(m => ({ default: m.AssessmentListPage })));
const CodingQuestionsPage = lazy(() => import('../pages/coding/CodingQuestionsPage').then(m => ({ default: m.CodingQuestionsPage })));
const ProjectManagementPage = lazy(() => import('../pages/projects/ProjectManagementPage').then(m => ({ default: m.ProjectManagementPage })));
const LiveSessionListPage = lazy(() => import('../pages/sessions/LiveSessionListPage').then(m => ({ default: m.LiveSessionListPage })));
const JobPortalPage = lazy(() => import('../pages/jobs/JobPortalPage').then(m => ({ default: m.JobPortalPage })));
const RecordingLibraryPage = lazy(() => import('../pages/library/RecordingLibraryPage').then(m => ({ default: m.RecordingLibraryPage })));
const RecordingDetailPage = lazy(() => import('../pages/library/RecordingDetailPage').then(m => ({ default: m.RecordingDetailPage })));
const PlacementPrepPage = lazy(() => import('../pages/placement/PlacementPrepPage').then(m => ({ default: m.PlacementPrepPage })));
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const StudentManagementPage = lazy(() => import('../pages/student/StudentManagementPage').then(m => ({ default: m.StudentManagementPage })));
const MilestonesRoadmapPage = lazy(() => import('../pages/milestones/MilestonesRoadmapPage').then(m => ({ default: m.MilestonesRoadmapPage })));
const BatchManagementPage = lazy(() => import('../pages/batches/BatchManagementPage').then(m => ({ default: m.BatchManagementPage })));
const BadgesPage = lazy(() => import('../pages/badges/BadgesPage').then(m => ({ default: m.BadgesPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Module...</p>
      </div>
    </div>
  );
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root Route Redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Auth Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Dashboard Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/batches" element={<BatchManagementPage />} />
          <Route path="/milestones" element={<MilestonesRoadmapPage />} />
          <Route path="/students" element={<StudentManagementPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/permissions" element={<PermissionManagementPage />} />
          
          {/* Course Routes */}
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />

          {/* Assessment & Coding Routes */}
          <Route path="/assessments" element={<AssessmentListPage />} />
          <Route path="/coding-questions" element={<CodingQuestionsPage />} />

          {/* Project Routes */}
          <Route path="/projects" element={<ProjectManagementPage />} />

          {/* Live Session Routes */}
          <Route path="/live-sessions" element={<LiveSessionListPage />} />

          {/* Job Portal Routes */}
          <Route path="/jobs" element={<JobPortalPage />} />

          {/* Library Routes */}
          <Route path="/library" element={<RecordingLibraryPage />} />
          <Route path="/library/:id" element={<RecordingDetailPage />} />

          {/* Placement Preparation */}
          <Route path="/placement" element={<PlacementPrepPage />} />

          {/* Badges & Milestone Rewards */}
          <Route path="/badges" element={<BadgesPage />} />

          {/* Student Specific View */}
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Suspense>
  );
}
