import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ErrorBoundary from "./Components/ErrorBoundary";

import { BrowserRouter } from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";


const queryClient = new QueryClient();


createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <BrowserRouter>

      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>

    </BrowserRouter>

  </StrictMode>
);