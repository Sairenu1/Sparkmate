# BookMyShow Clone - Setup Guide

This guide will help you set up and run the complete BookMyShow clone application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** and **npm/yarn**
- **PostgreSQL 14+**
- **Git**

## Step 1: Database Setup

1. Install and start PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE bookmyshow;
   ```

3. Note your PostgreSQL credentials (username and password)

## Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Open `src/main/resources/application.properties` and update:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/bookmyshow
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   
   jwt.secret=your-secret-key-min-256-bits-change-this-in-production
   
   stripe.secret.key=sk_test_your_stripe_secret_key
   stripe.publishable.key=pk_test_your_stripe_publishable_key
   ```

3. Get Stripe test keys:
   - Sign up at https://stripe.com
   - Go to Developers > API keys
   - Copy your test keys (starts with `sk_test_` and `pk_test_`)

4. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

   **Note:** On first run, the `DataSeeder` will automatically create:
   - Admin user: `admin@bookmyshow.com` / `admin123`
   - Test user: `user@test.com` / `password123`
   - Sample cities, theaters, movies, and shows

## Step 3: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## Step 4: Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the home page with movies
3. Try logging in with:
   - Admin: `admin@bookmyshow.com` / `admin123`
   - User: `user@test.com` / `password123`

## Testing Payment Flow

The application uses Stripe in test mode. Use these test cards:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`

Use any future expiry date, any CVC, and any ZIP code.

## Project Structure

```
bookmyshow-clone/
├── backend/              # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/     # Java source code
│   │   │   └── resources/ # Configuration files
│   │   └── test/         # Test files
│   └── pom.xml          # Maven dependencies
│
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── context/     # React contexts
│   └── package.json     # npm dependencies
│
└── README.md           # Main documentation
```

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `application.properties`
- Check if port 8080 is available

### Frontend won't start
- Run `npm install` again
- Check Node.js version (should be 18+)
- Verify `.env` file exists with correct values

### Database connection errors
- Ensure PostgreSQL is running
- Check database name matches in `application.properties`
- Verify username and password are correct

### Payment not working
- Verify Stripe keys are set correctly
- Use test mode keys (starts with `sk_test_` and `pk_test_`)
- Check browser console for errors

## API Endpoints

### Public Endpoints
- `GET /api/movies` - List all movies
- `GET /api/movies/{id}` - Get movie details
- `GET /api/cities` - List all cities
- `GET /api/theaters` - List theaters
- `GET /api/shows/movie/{movieId}` - Get shows for a movie

### Protected Endpoints (Require Authentication)
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/me` - Get user bookings
- `POST /api/payments/create-order` - Create payment intent

### Admin Endpoints (Require ADMIN role)
- `GET /api/admin/dashboard-summary` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/users` - All users
- `POST /api/admin/movies` - Create movie
- `PUT /api/admin/movies/{id}` - Update movie
- `DELETE /api/admin/movies/{id}` - Delete movie

## Default Credentials

After seeding:
- **Admin:** admin@bookmyshow.com / admin123
- **User:** user@test.com / password123

## Next Steps

1. Explore the admin dashboard at `/admin`
2. Create new movies and shows
3. Test the complete booking flow
4. Customize the UI and add more features

## Support

For issues or questions, check:
- Spring Boot documentation: https://spring.io/projects/spring-boot
- React documentation: https://react.dev
- Stripe documentation: https://stripe.com/docs

