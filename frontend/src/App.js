import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Login from "./pages/Login";

import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true"
  );

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{ background: "#0b1220", minHeight: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <Layout
                logout={() => {
                  sessionStorage.removeItem("loggedIn");
                  setLoggedIn(false);
                }}
              />
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}