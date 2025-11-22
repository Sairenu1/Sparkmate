import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import type { Booking } from '../types';

const BookingConfirmation = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return;
      try {
        const response = await bookingAPI.getById(parseInt(bookingId));
        setBooking(response.data);
      } catch (error) {
        console.error('Failed to load booking:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!booking) {
    return <div className="flex items-center justify-center min-h-screen">Booking not found</div>;
  }

  const qrData = JSON.stringify({
    bookingId: booking.id,
    movie: booking.show.movieTitle,
    theater: booking.show.theaterName,
    showTime: booking.show.startTime,
    seats: booking.seats.map(s => s.seatLabel),
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-block bg-green-100 rounded-full p-3 mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your tickets have been booked successfully</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-left">
              <h2 className="text-xl font-bold mb-4">Booking Details</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">Booking ID:</span> #{booking.id}</p>
                <p><span className="font-semibold">Movie:</span> {booking.show.movieTitle}</p>
                <p><span className="font-semibold">Theater:</span> {booking.show.theaterName}</p>
                <p><span className="font-semibold">Screen:</span> {booking.show.screenName}</p>
                <p><span className="font-semibold">Show Time:</span> {new Date(booking.show.startTime).toLocaleString()}</p>
                <p><span className="font-semibold">Seats:</span> {booking.seats.map(s => s.seatLabel).join(', ')}</p>
                <p><span className="font-semibold">Total Amount:</span> ₹{booking.totalAmount.toFixed(2)}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">QR Code</h2>
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                <QRCodeSVG value={qrData} size={200} />
              </div>
              <p className="text-sm text-gray-600 mt-4">Show this QR code at the theater</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/my-bookings"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
            >
              View My Bookings
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Download Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

