import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Components
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';   // ✅ Correct component
import PrivateRoute from './components/Auth/PrivateRoute';

// Page Components
import DiscoverPage from './components/Discover/DiscoverPage';
import StandoutsPage from './components/Standouts/StandoutsPage';
import LikesPage from './components/Likes/LikesPage';
import MatchesPage from './components/Matches/MatchesPage';
import ProfilePage from './components/Profile/ProfilePage';
import SettingsPage from './components/Profile/SettingsPage';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminRoute from './components/Admin/AdminRoute';

// Layout Components
import NavigationBar from './components/Layouts/NavigationBar';
import BottomNav from './components/Layouts/BottomNav';

// Context
import { AuthProvider } from './context/AuthContext';

// Main Layout
const MainLayout = ({ children }) => {
  return (
    <>
      <NavigationBar />
      <div className="main-layout">{children}</div>
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                color: '#fff',
                border: '1px solid rgba(255, 0, 110, 0.3)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                padding: '12px 20px',
                fontSize: '14px',
              },
              success: {
                duration: 3000,
                iconTheme: { primary: '#ff006e', secondary: '#fff' },
                style: {
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255, 0, 110, 0.5)',
                },
              },
              error: {
                duration: 4000,
                iconTheme: { primary: '#ff4646', secondary: '#fff' },
                style: {
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255, 70, 70, 0.5)',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />   {/* ✅ FIXED */}

            {/* Protected Routes */}
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <DiscoverPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/standouts"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <StandoutsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/likes"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <LikesPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/matches"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <MatchesPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            <Route
              path="/chat/:matchId"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
