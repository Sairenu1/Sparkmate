# BookMyShow Clone - Full Stack Application

A complete BookMyShow-style movie ticket booking platform built with React + Vite (TypeScript) frontend and Java Spring Boot backend.

## 🏗️ Project Structure

```
bookmyshow-clone/
├── backend/          # Spring Boot application
├── frontend/         # React + Vite application
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** and **npm/yarn** (for frontend)
- **PostgreSQL 14+** (database)
- **Maven 3.8+** (for backend build)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create PostgreSQL database:
   ```sql
   CREATE DATABASE bookmyshow;
   ```

3. Configure database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bookmyshow
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Configure JWT secret and payment keys in `application.properties`:
   ```properties
   jwt.secret=your-secret-key-min-256-bits
   stripe.secret.key=sk_test_your_stripe_secret_key
   stripe.publishable.key=pk_test_your_stripe_publishable_key
   ```

5. Run the application:
   ```bash
   mvn spring-boot:run
   ```

   Backend will run on `http://localhost:8080`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## 📋 Features

### User Features
- ✅ City-based movie search and filtering
- ✅ Movie listings with filters (language, genre, format)
- ✅ Movie details with showtimes
- ✅ Theater and showtime selection
- ✅ Interactive seat selection
- ✅ Payment integration (Stripe test mode)
- ✅ Booking confirmation with QR code
- ✅ User authentication (JWT)
- ✅ My Bookings page

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Movies management (CRUD)
- ✅ Theaters management (CRUD)
- ✅ Screens and shows configuration
- ✅ Seat configuration per screen
- ✅ Bookings overview
- ✅ Users management

## 🔐 Default Admin Credentials

After seeding the database, you can login with:
- Email: `admin@bookmyshow.com`
- Password: `admin123`

## 🗄️ Database

The application uses PostgreSQL with JPA/Hibernate for ORM. Database schema is auto-created on first run. Seed data includes:
- Sample cities
- Sample theaters and screens
- Sample movies
- Sample shows
- Default admin user

## 💳 Payment Integration

The application uses **Stripe** in test mode. Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Movies
- `GET /api/movies` - List movies (with filters)
- `GET /api/movies/{id}` - Get movie details

### Shows & Bookings
- `GET /api/movies/{id}/shows` - Get shows for a movie
- `GET /api/shows/{id}/seats` - Get seat availability
- `POST /api/bookings/create` - Create booking
- `POST /api/payments/create-order` - Create payment intent
- `GET /api/users/me/bookings` - Get user bookings

### Admin APIs
All admin APIs are prefixed with `/api/admin` and require ADMIN role.

## 🛠️ Tech Stack

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven
- Stripe API

**Frontend:**
- React 18
- Vite
- TypeScript
- TailwindCSS
- React Router
- Axios
- Framer Motion
- Stripe.js

## 📄 License

This project is for educational purposes.

