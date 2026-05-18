import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Preview from "./pages/Preview";
import History from "./pages/History";

import Nav from "./components/Nav";

function App() {
  const token = localStorage.getItem("token"); // simple auth demo

  return (
    <div>
      {/* Show navbar only when logged in */}
      {token && <Nav />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        {/* ✅ THIS WAS MISSING */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/upload"
          element={token ? <Upload /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/preview"
          element={token ? <Preview /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/history"
          element={token ? <History /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
