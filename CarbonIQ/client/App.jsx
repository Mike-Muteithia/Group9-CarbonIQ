import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CarbonIQDashboard from "./pages/Dashboard";
import MyAssetsPage from "./pages/MyAssets";
import Sidebar from "./components/Sidebar";

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
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                <CarbonIQDashboard />
              </main>
            </div>
          }
        />

        <Route 
          path="/assets"
          element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 ml-64 pl-4 pr-8 py-4">
                <MyAssetsPage />
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}


export default App;
