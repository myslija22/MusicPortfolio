import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home.tsx';
import Downloads from './pages/Downloads.tsx';
import Login from './pages/Login.tsx';
import Exclusive from './pages/Exclusive.tsx';
import Admin from './pages/Admin.tsx';
import Navbar from './components/layout/Navbar.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';

const App: React.FC = () => {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/login" element={<Login />} />
        <Route path="/exclusive" element={
          <ProtectedRoute>
            <Exclusive />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

export default App;