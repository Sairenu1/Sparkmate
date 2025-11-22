import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCity } from '../../context/CityContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cities, selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">BookMyShow</span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* City Selector */}
            <select
              value={selectedCity?.id || ''}
              onChange={(e) => {
                const city = cities.find(c => c.id === parseInt(e.target.value));
                setSelectedCity(city || null);
              }}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>

            {/* Navigation Links */}
            <Link to="/" className="text-gray-700 hover:text-primary transition">
              Movies
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-gray-700 hover:text-primary transition">
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">{user?.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

