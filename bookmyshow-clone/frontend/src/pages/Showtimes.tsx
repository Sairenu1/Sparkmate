import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { showAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import type { Show } from '../types';

const Showtimes = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('cityId');
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      if (!movieId || !cityId) return;
      try {
        const response = await showAPI.getByMovie(parseInt(movieId), parseInt(cityId), selectedDate);
        setShows(response.data);
      } catch (error) {
        console.error('Failed to load shows:', error);
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, [movieId, cityId, selectedDate]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const groupedShows = shows.reduce((acc, show) => {
    const theaterId = show.theaterId;
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theaterName: show.theaterName,
        theaterAddress: show.theaterAddress,
        shows: [],
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {} as Record<number, { theaterName: string; theaterAddress: string; shows: Show[] }>);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Select Showtime</h1>

        {/* Date Selector */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-4">
          {dates.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            );
          })}
        </div>

        {/* Theaters and Shows */}
        <div className="space-y-6">
          {Object.entries(groupedShows).map(([theaterId, theater]) => (
            <div key={theaterId} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">{theater.theaterName}</h2>
              <p className="text-gray-600 mb-4">{theater.theaterAddress}</p>
              <div className="flex flex-wrap gap-3">
                {theater.shows.map((show) => {
                  const startTime = new Date(show.startTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <button
                      key={show.id}
                      onClick={() => navigate(`/seats/${show.id}`)}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold"
                    >
                      {startTime} - {show.format} ({show.language})
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {shows.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No shows available for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Showtimes;

