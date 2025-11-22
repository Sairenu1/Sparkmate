import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { seatAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { Seat } from '../types';
import toast from 'react-hot-toast';

const SeatSelection = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSeats = async () => {
      if (!showId) return;
      try {
        const response = await seatAPI.getByShow(parseInt(showId));
        setSeats(response.data);
      } catch (error) {
        console.error('Failed to load seats:', error);
        toast.error('Failed to load seats');
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [showId]);

  const toggleSeat = (seatId: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to select seats');
      navigate('/login');
      return;
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!showId) return;

    try {
      const response = await bookingAPI.create({
        showId: parseInt(showId),
        seatIds: selectedSeats,
      });
      toast.success('Booking created! Redirecting to payment...');
      navigate(`/payment/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.rowLabel]) {
      acc[seat.rowLabel] = [];
    }
    acc[seat.rowLabel].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return total;
    // Simple pricing based on category
    const basePrice = 250;
    const multiplier = seat.category === 'PLATINUM' ? 1.5 : seat.category === 'GOLD' ? 1.2 : 1.0;
    return total + basePrice * multiplier;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Select Your Seats</h1>

        {/* Screen */}
        <div className="bg-gray-800 text-white text-center py-4 mb-8 rounded-lg">
          <p className="text-lg font-semibold">SCREEN</p>
        </div>

        {/* Seat Map */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {Object.entries(seatsByRow).map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="flex items-center justify-center mb-2">
              <span className="w-8 text-center font-semibold">{rowLabel}</span>
              <div className="flex gap-1">
                {rowSeats.map((seat) => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isAvailable = seat.available;
                  return (
                    <button
                      key={seat.id}
                      onClick={() => isAvailable && toggleSeat(seat.id)}
                      disabled={!isAvailable}
                      className={`w-8 h-8 rounded text-xs font-semibold ${
                        !isAvailable
                          ? 'bg-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Selected Seats: {selectedSeats.length}</span>
            <span className="text-2xl font-bold text-primary">₹{totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

