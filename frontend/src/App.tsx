import { Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import MainLayout from "./Layouts/MainLayout";

import LoadingSpinner from "./Components/ui/LoadingSpinner";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import ArticleDetailPage from "./pages/ArticleDetailPage";


import { ModeratorDashboardPage } from "./pages/ModeratorDashboardPage";
import { ModerationQueuePage } from "./pages/ModerationQueuePage";
import { ReportManagementPage } from "./pages/ReportManagementPage";

import useAuth from "./hooks/useAuth";

function App() {
  const { loading } = useAuth();

  if (loading) {
  return <LoadingSpinner />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

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


        <Route
          path="/articles/:id"
          element={<ArticleDetailPage />}
        />


        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </>
  );
}

export default App;