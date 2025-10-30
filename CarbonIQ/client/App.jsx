import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CarbonIQDashboard from "./pages/Dashboard";
import MyAssetsPage from "./pages/MyAssets";
import Activities from "./pages/Activities"; // Import the Activities page
import AIecoCoach from "./pages/AIecoCoach"; // Import AI EcoCoach page
import Goals from "./pages/Goals"; // Import Goals page
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public route: Signup & Login */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                  <CarbonIQDashboard />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        <Route 
          path="/assets"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                  <MyAssetsPage />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Add Activities route */}
        <Route 
          path="/activities"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                  <Activities />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Add AI EcoCoach route (if the page exists) */}
        <Route 
          path="/ecocoach"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                  <AIecoCoach />
                </main>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Add Goals route (if the page exists) */}
        <Route 
          path="/goals"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                  <Goals />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;