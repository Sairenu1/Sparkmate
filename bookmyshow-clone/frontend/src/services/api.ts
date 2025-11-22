import axios from 'axios';
import type { 
  AuthResponse, 
  Movie, 
  City, 
  Theater, 
  Show, 
  Seat, 
  Booking, 
  PaymentIntentResponse,
  User 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }),
};

// Movie APIs
export const movieAPI = {
  getAll: (params?: { cityId?: number; language?: string; genre?: string; format?: string }) =>
    api.get<Movie[]>('/movies', { params }),
  getNowShowing: () => api.get<Movie[]>('/movies/now-showing'),
  getComingSoon: () => api.get<Movie[]>('/movies/coming-soon'),
  getById: (id: number) => api.get<Movie>(`/movies/${id}`),
};

// City APIs
export const cityAPI = {
  getAll: () => api.get<City[]>('/cities'),
};

// Theater APIs
export const theaterAPI = {
  getAll: (cityId?: number) => api.get<Theater[]>('/theaters', { params: { cityId } }),
};

// Show APIs
export const showAPI = {
  getByMovie: (movieId: number, cityId: number, date?: string) =>
    api.get<Show[]>(`/shows/movie/${movieId}`, { params: { cityId, date } }),
  getById: (id: number) => api.get<Show>(`/shows/${id}`),
};

// Seat APIs
export const seatAPI = {
  getByShow: (showId: number) => api.get<Seat[]>(`/shows/${showId}/seats`),
};

// Booking APIs
export const bookingAPI = {
  create: (data: { showId: number; seatIds: number[] }) =>
    api.post<Booking>('/bookings/create', data),
  getById: (id: number) => api.get<Booking>(`/bookings/${id}`),
  getMyBookings: () => api.get<Booking[]>('/bookings/me'),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (bookingId: number) =>
    api.post<PaymentIntentResponse>('/payments/create-order', { bookingId }),
  confirm: (paymentIntentId: string) =>
    api.post('/payments/confirm', { paymentIntentId }),
};

// Admin APIs
export const adminAPI = {
  getDashboardSummary: () => api.get('/admin/dashboard-summary'),
  getAllBookings: (params?: { movieId?: number; theaterId?: number; date?: string }) =>
    api.get<Booking[]>('/admin/bookings', { params }),
  getAllUsers: () => api.get<User[]>('/admin/users'),
  getAllMovies: () => api.get<Movie[]>('/admin/movies'),
  createMovie: (movie: Partial<Movie>) => api.post<Movie>('/admin/movies', movie),
  updateMovie: (id: number, movie: Partial<Movie>) => api.put<Movie>(`/admin/movies/${id}`, movie),
  deleteMovie: (id: number) => api.delete(`/admin/movies/${id}`),
};

export default api;

