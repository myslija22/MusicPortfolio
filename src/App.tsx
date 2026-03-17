import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react'; // Add this import
import Home from './pages/Home.tsx';
import Downloads from './pages/Downloads.tsx';
import Login from './pages/Login.tsx';
import Exclusive from './pages/Exclusive.tsx';
import Admin from './pages/Admin.tsx';
import Navbar from './components/layout/Navbar.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import Register from './pages/Register.tsx';
import { AudioProvider, useAudio } from './context/AudioContext.tsx'; // Add useAudio import
import AudioPlayer from './components/audio/AudioPlayer.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import Background from './components/layout/Background.tsx';

const ContentWrapper = () => {
  const { currentTrack } = useAudio();

  return (
    <Box pt="20" pb={currentTrack ? "120px" : "0"} transition="padding-bottom 0.3s ease">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exclusive" element={
          <ProtectedRoute allowedRoles={['admin', 'vip']}>
            <Exclusive />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <Background />
      <Navbar />

      <ContentWrapper />

      <AudioPlayer />
      <Toaster />
    </AudioProvider>
  );
};

export default App;