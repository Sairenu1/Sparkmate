import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Showtimes from './pages/Showtimes';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import MoviesAdmin from './pages/admin/MoviesAdmin';
import BookingsAdmin from './pages/admin/BookingsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return isAdmin ? <>{children}</> : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/shows/:movieId" element={<Showtimes />} />
      <Route path="/seats/:showId" element={<SeatSelection />} />
      <Route path="/payment/:bookingId" element={<PrivateRoute><Payment /></PrivateRoute>} />
      <Route path="/booking/:bookingId" element={<PrivateRoute><BookingConfirmation /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/movies" element={<AdminRoute><MoviesAdmin /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><BookingsAdmin /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><UsersAdmin /></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CityProvider>
        <Elements stripe={stripePromise}>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </Elements>
      </CityProvider>
    </AuthProvider>
  );
}

export default App;

