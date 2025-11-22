import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import type { Movie } from '../types';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedCity } = useCity();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      try {
        const response = await movieAPI.getById(parseInt(id));
        setMovie(response.data);
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!movie) {
    return <div className="flex items-center justify-center min-h-screen">Movie not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-yellow-500 text-xl">⭐ {movie.rating || 'N/A'}</span>
                <span className="text-gray-600">{movie.duration} min</span>
                <span className={`px-3 py-1 rounded ${
                  movie.status === 'NOW_SHOWING' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {movie.status === 'NOW_SHOWING' ? 'Now Showing' : 'Coming Soon'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Languages:</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.languages.split(',').map((lang, idx) => (
                    <span key={idx} className="bg-primary text-white px-3 py-1 rounded">
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Genres:</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.split(',').map((genre, idx) => (
                    <span key={idx} className="bg-gray-200 px-3 py-1 rounded">
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700">{movie.description}</p>
              </div>

              {movie.status === 'NOW_SHOWING' && selectedCity && (
                <Link
                  to={`/shows/${movie.id}?cityId=${selectedCity.id}`}
                  className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition"
                >
                  Book Tickets
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

