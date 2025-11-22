export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  posterUrl: string;
  rating: number;
  releaseDate: string;
  languages: string;
  genres: string;
  status: 'NOW_SHOWING' | 'COMING_SOON';
}

export interface City {
  id: number;
  name: string;
}

export interface Theater {
  id: number;
  name: string;
  city: City;
  address: string;
  facilities?: string;
}

export interface Show {
  id: number;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  theaterId: number;
  theaterName: string;
  theaterAddress: string;
  startTime: string;
  endTime: string;
  basePrice: number;
  language: string;
  format: string;
}

export interface Seat {
  id: number;
  rowLabel: string;
  seatNumber: number;
  seatLabel: string;
  category: 'PLATINUM' | 'GOLD' | 'SILVER';
  available: boolean;
}

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  show: Show;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  seats: BookingSeat[];
  payment?: Payment;
}

export interface BookingSeat {
  id: number;
  seatId: number;
  seatLabel: string;
  price: number;
}

export interface Payment {
  id: number;
  providerOrderId: string;
  providerPaymentId?: string;
  amount: number;
  provider: 'STRIPE' | 'RAZORPAY';
  status: 'CREATED' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  bookingId: number;
}

