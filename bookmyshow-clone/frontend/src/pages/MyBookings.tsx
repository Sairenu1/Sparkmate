import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import type { Booking } from '../types';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingAPI.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to load bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
            <Link
              to="/"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-bold">{booking.show.movieTitle}</h2>
                      <span className={`px-3 py-1 rounded text-sm ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{booking.show.theaterName} - {booking.show.screenName}</p>
                    <p className="text-gray-600 mb-2">
                      {new Date(booking.show.startTime).toLocaleString()}
                    </p>
                    <p className="text-gray-600 mb-2">
                      Seats: {booking.seats.map(s => s.seatLabel).join(', ')}
                    </p>
                    <p className="text-lg font-semibold text-primary">₹{booking.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    {booking.status === 'CONFIRMED' && (
                      <Link
                        to={`/booking/${booking.id}`}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
                      >
                        View Ticket
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

