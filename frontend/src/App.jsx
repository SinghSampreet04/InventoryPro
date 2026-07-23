import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import { LoadingState } from "./components/PageState";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

export default function App() {
  const [session, setSession] = useState(() => ({
    token: sessionStorage.getItem("inventoryToken"),
    username: sessionStorage.getItem("inventoryUsername")
  }));
  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem("inventoryDisplayName") || ""
  );

  useEffect(() => {
    const expireSession = () => setSession({ token: null, username: null });
    window.addEventListener("inventory:session-expired", expireSession);
    return () => window.removeEventListener("inventory:session-expired", expireSession);
  }, []);

  if (!session.token) {
    return <Login onAuthenticated={setSession} />;
  }

  const logout = () => {
    sessionStorage.removeItem("inventoryToken");
    sessionStorage.removeItem("inventoryUsername");
    setSession({ token: null, username: null });
  };

  const saveDisplayName = (name) => {
    const cleanedName = name.trim();
    localStorage.setItem("inventoryDisplayName", cleanedName);
    setDisplayName(cleanedName);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingState message="Loading workspace…" />}>
        <Routes>
          <Route
            element={
              <Layout
                logout={logout}
                username={displayName || session.username}
              />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route
              path="/settings"
              element={
                <Settings
                  username={session.username}
                  displayName={displayName}
                  onSaveDisplayName={saveDisplayName}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
