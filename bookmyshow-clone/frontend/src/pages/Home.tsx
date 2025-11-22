import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';
import { useCity } from '../context/CityContext';
import type { Movie } from '../types';
import { motion } from 'framer-motion';

const Home = () => {
  const { selectedCity } = useCity();
  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [nowShowingRes, comingSoonRes] = await Promise.all([
          movieAPI.getNowShowing(),
          movieAPI.getComingSoon(),
        ]);
        setNowShowing(nowShowingRes.data);
        setComingSoon(comingSoonRes.data);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to BookMyShow</h1>
          <p className="text-xl mb-8">Book your favorite movies and shows in {selectedCity?.name || 'your city'}</p>
        </div>
      </div>

      {/* Now Showing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-6">Now Showing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nowShowing.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {comingSoon.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    >
      <Link to={`/movie/${movie.id}`}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-80 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-yellow-500">⭐ {movie.rating || 'N/A'}</span>
            <span className="text-gray-600">{movie.duration} min</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {movie.genres.split(',').slice(0, 2).map((genre, idx) => (
              <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                {genre.trim()}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Home;

