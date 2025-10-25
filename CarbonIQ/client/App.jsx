import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CarbonIQDashboard from "./pages/Dashboard";
import MyAssetsPage from "./pages/MyAssets";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar - Fixed on the left */}
        <Sidebar />
        
        {/* Main Content - Add ml-64 to account for fixed sidebar width */}
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<CarbonIQDashboard />} />
            <Route path="/assets" element={<MyAssetsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;