import { Routes, Route } from "react-router-dom";

import { AppShell } from "../Components/Layout/AppShell";
import RequireAuth from "./RequireAuth";

import Home from "../pages/Home";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ResetPasswordPage from "../pages/ResetPasswordPage";

import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";

import { ModeratorDashboardPage } from "../pages/ModeratorDashboardPage";
import { ModerationQueuePage } from "../pages/ModerationQueuePage";
import { ReportManagementPage } from "../pages/ReportManagementPage";

import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { AdminArticlesPage } from "../pages/AdminArticlesPage";

import LandingPage from "../pages/LandingPage";

import AboutPage from "../pages/AboutPage";
import { SubmitArticlePage } from "../pages/SubmitArticlePage";
import { FlaggedCommentsPage } from "../pages/FlaggedCommentsPage";

import { DashboardPage } from "../pages/DashboardPage";


export function AppRoutes() {
  return (
    <Routes>

      <Route element={<AppShell />}>

        <Route path="/" element={<LandingPage />} />

        {/* Public routes */}
        <Route path="/articles" element={<Home />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/articles/:id" element={<ArticleDetailPage />} />

        <Route path="/login" element={<Login />} />
        
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/register" element={<Register />} />

        {/* Authenticated user routes */}
        <Route element={<RequireAuth />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/articles/submit"
            element={<SubmitArticlePage />}
          />

        </Route>



        {/* Moderator routes */}
        <Route element={<RequireAuth staffOnly />}>

          <Route
            path="/moderation"
            element={<ModeratorDashboardPage />}
          />

          <Route
            path="/moderation/queue"
            element={<ModerationQueuePage />}
          />

          <Route
            path="/moderation/reports"
            element={<ReportManagementPage />}
          />

          <Route
            path="/moderation/comments"
            element={<FlaggedCommentsPage />}
          />

        </Route>


        {/* Admin routes */}
        <Route element={<RequireAuth superuserOnly />}>

          <Route
            path="/admin"
            element={<AdminDashboardPage />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsersPage />}
          />

          <Route
            path="/admin/articles"
            element={<AdminArticlesPage />}
          />

        </Route>


      </Route>

    </Routes>
  );
}