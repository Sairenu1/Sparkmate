# Quick Start Guide - BookMyShow Clone

Follow these steps in order to get the application running.

## Step 1: Set Up PostgreSQL Database

### Option A: If PostgreSQL is already installed
1. Open Command Prompt or PowerShell
2. Start PostgreSQL service (if not running):
   ```cmd
   # Windows - Start PostgreSQL service
   net start postgresql-x64-14
   # Or check Services app and start "postgresql-x64-14" service
   ```

3. Open PostgreSQL command line (psql) or pgAdmin
4. Create the database:
   ```sql
   CREATE DATABASE bookmyshow;
   ```
5. Note your PostgreSQL username (usually `postgres`) and password

### Option B: If PostgreSQL is NOT installed
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Install it (remember the password you set for `postgres` user)
3. After installation, open pgAdmin or psql
4. Create database:
   ```sql
   CREATE DATABASE bookmyshow;
   ```

## Step 2: Configure Backend Database

1. Open the file: `backend\src\main\resources\application.properties`
2. Update these lines with YOUR PostgreSQL credentials:
   ```properties
   spring.datasource.username=postgres          # Change if different
   spring.datasource.password=your_password    # Change to your PostgreSQL password
   ```
3. If your PostgreSQL is on a different port (not 5432), also update:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:YOUR_PORT/bookmyshow
   ```

## Step 3: Get Stripe Test Keys (Optional - for payment testing)

1. Go to https://stripe.com and sign up (free)
2. Go to Developers > API keys
3. Copy your **Test** keys:
   - Secret key (starts with `sk_test_`)
   - Publishable key (starts with `pk_test_`)
4. Update in `backend\src\main\resources\application.properties`:
   ```properties
   stripe.secret.key=sk_test_your_actual_key_here
   stripe.publishable.key=pk_test_your_actual_key_here
   ```
5. Update in `frontend\.env`:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

**Note:** You can skip Stripe setup for now and test other features. Payment will fail but rest will work.

## Step 4: Run Backend

Open Command Prompt or PowerShell in the project root (`bookmyshow-clone`):

```cmd
cd backend
mvn clean install
mvn spring-boot:run
```

**Wait for:** "Started BookMyShowApplication" message

**First run will:**
- Create all database tables automatically
- Seed sample data (cities, movies, theaters, shows)
- Create admin user: `admin@bookmyshow.com` / `admin123`
- Create test user: `user@test.com` / `password123`

**Keep this terminal window open!**

## Step 5: Run Frontend (New Terminal Window)

Open a NEW Command Prompt or PowerShell window:

```cmd
cd C:\Users\HP\sparkmate\bookmyshow-clone\frontend
npm install
npm run dev
```

**Wait for:** "Local: http://localhost:5173" message

## Step 6: Access the Application

1. Open browser: http://localhost:5173
2. You should see the home page with movies
3. Try logging in:
   - Admin: `admin@bookmyshow.com` / `admin123`
   - User: `user@test.com` / `password123`

## Troubleshooting

### Backend won't start
- **Error: "Connection refused"** → PostgreSQL is not running. Start it.
- **Error: "password authentication failed"** → Wrong password in `application.properties`
- **Error: "database does not exist"** → Create database: `CREATE DATABASE bookmyshow;`
- **Port 8080 already in use** → Change port in `application.properties`: `server.port=8081`

### Frontend won't start
- **Error: "npm not found"** → Install Node.js from https://nodejs.org
- **Error: "port 5173 already in use"** → Kill the process or change port in `vite.config.ts`

### Database errors
- Make sure PostgreSQL service is running
- Check database name is exactly `bookmyshow`
- Verify username and password in `application.properties`

## Default Credentials (After First Run)

- **Admin:** admin@bookmyshow.com / admin123
- **User:** user@test.com / password123

## Testing Payment (After Stripe Setup)

Use Stripe test card:
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

## Next Steps

1. Explore the home page
2. Click on a movie to see details
3. Book tickets (select city, showtime, seats)
4. Test payment flow (if Stripe is configured)
5. Login as admin and check admin dashboard

Enjoy your BookMyShow clone! 🎬

