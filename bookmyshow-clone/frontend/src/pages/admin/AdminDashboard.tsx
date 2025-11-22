import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await adminAPI.getDashboardSummary();
        setSummary(response.data);
      } catch (error) {
        console.error('Failed to load dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-primary">{summary?.totalBookings || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Confirmed Bookings</h3>
            <p className="text-3xl font-bold text-green-600">{summary?.confirmedBookings || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary">₹{summary?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{summary?.totalUsers || 0}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/movies"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">Manage Movies</h2>
            <p className="text-gray-600">Add, edit, or delete movies</p>
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">View Bookings</h2>
            <p className="text-gray-600">View and manage all bookings</p>
          </Link>
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold mb-2">Manage Users</h2>
            <p className="text-gray-600">View all registered users</p>
          </Link>
        </div>

        {/* Top Movies */}
        {summary?.topMovies && summary.topMovies.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Top Movies by Bookings</h2>
            <div className="space-y-2">
              {summary.topMovies.map((movie: any, index: number) => (
                <div key={movie.movieId} className="flex justify-between items-center py-2 border-b">
                  <span className="font-semibold">{index + 1}. {movie.title}</span>
                  <span className="text-primary">{movie.bookingCount} bookings</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

