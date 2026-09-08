import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { PandalsList } from '../pages/PandalsList';
import { PandalDetail } from '../pages/PandalDetail';
import { MetroLines } from '../pages/MetroLines';
import { MetroLineTimeline } from '../pages/MetroLineTimeline';
import { MetroStationDetail } from '../pages/MetroStationDetail';
import { Nearby } from '../pages/Nearby';
import { RoutePlanner } from '../pages/RoutePlanner';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pandals" element={<PandalsList />} />
      <Route path="/areas/:areaId/pandals" element={<PandalsList />} />
      <Route path="/pandals/:pandalId" element={<PandalDetail />} />
      <Route path="/routes" element={<RoutePlanner />} />
      <Route path="/planner" element={<Navigate to="/routes" replace />} />
      <Route path="/metro" element={<MetroLines />} />
      <Route path="/metro/lines/:lineName" element={<MetroLineTimeline />} />
      <Route path="/metro/stations/:stationId" element={<MetroStationDetail />} />
      <Route path="/nearby" element={<Nearby />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

