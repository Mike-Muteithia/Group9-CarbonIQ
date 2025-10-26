import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AIecoCoach from "../pages/AIecoCoach";
import EmissionGoals from "../pages/EmissionGoals";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmissionGoals />} />
        <Route path="/AIecoCoach" element={<AIecoCoach />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
