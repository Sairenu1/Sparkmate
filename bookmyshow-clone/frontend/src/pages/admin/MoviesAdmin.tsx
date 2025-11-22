import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import type { Movie } from '../../types';
import toast from 'react-hot-toast';

const MoviesAdmin = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<Partial<Movie>>({
    title: '',
    description: '',
    duration: 0,
    posterUrl: '',
    rating: 0,
    languages: '',
    genres: '',
    status: 'NOW_SHOWING',
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await adminAPI.getAllMovies();
      setMovies(response.data);
    } catch (error) {
      console.error('Failed to load movies:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await adminAPI.updateMovie(editingMovie.id, formData);
        toast.success('Movie updated successfully');
      } else {
        await adminAPI.createMovie(formData);
        toast.success('Movie created successfully');
      }
      setShowForm(false);
      setEditingMovie(null);
      setFormData({
        title: '',
        description: '',
        duration: 0,
        posterUrl: '',
        rating: 0,
        languages: '',
        genres: '',
        status: 'NOW_SHOWING',
      });
      loadMovies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData(movie);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    try {
      await adminAPI.deleteMovie(id);
      toast.success('Movie deleted successfully');
      loadMovies();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Movies</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMovie(null);
              setFormData({
                title: '',
                description: '',
                duration: 0,
                posterUrl: '',
                rating: 0,
                languages: '',
                genres: '',
                status: 'NOW_SHOWING',
              });
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Add Movie
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingMovie ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Poster URL</label>
                  <input
                    type="url"
                    required
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Languages (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Genres (comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'NOW_SHOWING' | 'COMING_SOON' })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="NOW_SHOWING">Now Showing</option>
                    <option value="COMING_SOON">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
                >
                  {editingMovie ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMovie(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{movie.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      movie.status === 'NOW_SHOWING' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {movie.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{movie.rating || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoviesAdmin;

