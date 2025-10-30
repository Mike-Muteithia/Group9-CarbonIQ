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
       <main className="flex-1 ml-64 pl-4 pr-8 py-4">
          <Routes>
            <Route path="/" element={<CarbonIQDashboard />} />
            <Route path="/assets" element={<MyAssetsPage />} />
            <Route path="/Dashboard" element={<CarbonIQDashboard />} />
            <Route path="/MyAssets" element={<MyAssetsPage />} />
            {/* <Route path="/Activities" element={<ActivitiesPage />} />
            <Route path="/Ecocoach" element={<EcoCoachPage />} />
            <Route path="/Goals" element={<GoalsPage />} /> */}
   
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;