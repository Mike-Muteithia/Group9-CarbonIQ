import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout';
import AIEcoCoach from '../pages/AIEcoCoach';
import Emission from '../pages/Emission';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="ecocoach" element={<AIEcoCoach />} />
        <Route path="emission" element={<Emission />} />
      </Route>
    </Routes>
  );
}
