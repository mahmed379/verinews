import { Routes, Route } from "react-router-dom";

import MainLayout from "./Layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import ArticleDetailPage from "./pages/ArticleDetailPage";

import useAuth from "./hooks/useAuth";

function App() {
  const { loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;