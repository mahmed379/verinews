import { Routes, Route } from "react-router-dom";

import { AppShell } from "../Components/Layout/AppShell";
import RequireAuth from "./RequireAuth";

import Home from "../pages/Home";
import ArticleDetailPage from "../pages/ArticleDetailPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

import { ModeratorDashboardPage } from "../pages/ModeratorDashboardPage";
import { ModerationQueuePage } from "../pages/ModerationQueuePage";
import { ReportManagementPage } from "../pages/ReportManagementPage";

import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { AdminArticlesPage } from "../pages/AdminArticlesPage";

import LandingPage from "../pages/LandingPage";

import AboutPage from "../pages/AboutPage";

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

        <Route path="/register" element={<Register />} />


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