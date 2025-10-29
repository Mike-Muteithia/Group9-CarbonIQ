import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Layout from "./components/Layout";
import AIecoCoach from "./pages/AIecoCoach";
import EmissionGoals from "./pages/EmissionGoals";

export default function App() {
  return (
    <>
      {/* Optional: Dev-only nav to test routing */}
      <nav className="p-4 bg-gray-100 flex gap-4">
        <Link to="/" className="text-blue-600 hover:underline">AI Eco-Coach</Link>
        <Link to="/emission-goals" className="text-blue-600 hover:underline">Emission Goals</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AIecoCoach />} />
          <Route path="emission-goals" element={<EmissionGoals />} />
        </Route>

        {/* Optional: fallback route for debugging */}
        <Route path="*" element={<div className="p-6 text-red-600">404: Page not found</div>} />
      </Routes>
    </>
  );
}
