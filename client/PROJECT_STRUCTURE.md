# Project Structure Documentation

## Backend Structure (`server/src/`)

### Entry Point
- **`server.js`**: Main server entry point
- **`app.js`**: Express application setup with middleware and routes

### API Layer (`api/`)

#### Routes (`api/routes/`)
- `authRoutes.js` - Authentication endpoints
- `adminRoutes.js` - Admin management (SuperAdmin only)
- `bookingsRoutes.js` - Booking operations
- `branchesRoutes.js` - Branch CRUD operations
- `destinationsRoutes.js` - Destination CRUD operations
- `guidedTripsRoutes.js` - Guided trips (read-only)
- `guideRoutes.js` - Guide CRUD operations
- `tripInfoRoutes.js` - TripInfo CRUD operations
- `userRoutes.js` - User management

#### Controllers (`api/controllers/`)
- `authController.js` - Authentication logic
- `AdminController.js` - Admin management
- `bookingsController.js` - Booking operations
- `branchesController.js` - Branch operations
- `destinationsController.js` - Destination operations
- `guideControllers.js` - Guide operations
- `guidedTripsController.js` - Guided trip operations
- `tripInfoController.js` - TripInfo operations
- `userController.js` - User operations

#### Middlewares (`api/middlewares/`)
- `authMiddleware.js` - JWT verification, role-based access control
  - `verifySupabaseToken` - Verify JWT token
  - `requireSuperAdmin` - SuperAdmin only
  - `requireAdmin_or_SuperAdmin` - Admin or SuperAdmin
- `uploadMiddleware.js` - File upload handling (Multer)

#### Validators (`api/validators/`)
- Validation for all entities (booking, branch, destination, guide, guidedTrip, tripInfo, user, auth)

### Core Layer (`core/`)

#### Entities (`core/entities/`)
Domain models: Booking, Branch, Destination, Guide, GuidedTrip, Payer, Traveler, TripInfo, Users, BookingStatusHistory

#### Use Cases (`core/usecases/`)
Business logic organized by feature:
- Authentication/
- Booking/
- branches/
- Destinations/
- Guide/
- guidedTrips/
- tripInfo/
- Users/

### Repositories (`repositories/`)
Data access layer for all entities

### Configuration (`config/`)
- `config.js` - Environment configuration
- `supabase.js` - Supabase client setup

---

## Frontend Structure (`client/src/`)

### Entry Point
- **`main.jsx`**: React application entry with routing

### Pages (`Pages/`)
#### Admin Pages
- `admin_bookings.jsx` - Booking management
- `admin_branches.jsx` - Branch management
- `admin_dashboard.jsx` - Admin dashboard
- `admin_destinations.jsx` - Destination management
- `admin_employees.jsx` - Employee management (Admins & Guides)
- `admin_guided_trips.jsx` - Guided trip management
- `admin_settings.jsx` - Admin settings

#### User Pages
- `Homepage.jsx` - Home page
- `bookings.jsx` - User bookings
- `Branches.jsx` - Branch listing
- `Destinations.jsx` - Destination listing
- `group_trips.jsx` - Group trips
- `umrah.jsx` - Umrah trips
- `Profile.jsx` - User profile
- `Authentication/` - Login, Signup, ForgotPassword, ResetPassword, FillInformation

### Components (`components/`)
- Reusable UI components
- Admin-specific components in `admin-*` folders
- Layout components (Header, Footer, Layout)

### API Layer (`../api/`)
- `request.js` - HTTP client with auth
- `auth.js` - Authentication API
- `bookings.js` - Booking API
- `branches.js` - Branch API
- `destinations.js` - Destination API
- `guidedTrips.js` - Guided trips API
- `guide.js` - Guide API
- `admin.js` - Admin API
- `user.js` - User API

### Hooks (`../hooks/`)
- `useAuthHandlers.js` - Authentication hooks
- `useBranches.js` - Branch operations
- `useBookings.js` - Booking operations
- `useGuidedTrips.js` - Guided trip operations
- `useDestinations.js` - Destination operations
- `useGuidesHandlers.js` - Guide operations
- `useAdminHandlers.js` - Admin operations
- `useUserHandlers.js` - User operations
- `useUserBookings.js` - User booking operations

### Configuration (`../config/`)
- `env.js` - Environment variables

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /signup` - User registration
- `POST /signin` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /signout` - Logout

### Admin (`/api/admin`) - Requires SuperAdmin
- `POST /add-admin` - Create admin
- `PUT /update` - Update admin
- `DELETE /delete` - Delete admin

### Branches (`/api/branches`)
- `GET /` - Get all branches
- `GET /active` - Get active branches
- `GET /:id` - Get branch by ID
- `POST /` - Create branch (SuperAdmin)
- `PUT /:id` - Update branch (SuperAdmin)
- `DELETE /:id` - Delete branch (SuperAdmin)

### Bookings (`/api/bookings`)
- `POST /create` - Create booking
- `GET /user/:userId` - Get user bookings
- `PATCH /assign-branch` - Assign branch (SuperAdmin)
- `PATCH /update-status` - Update status (Admin/SuperAdmin)

### Destinations (`/api/destinations`)
- `GET /` - Get all destinations
- `GET /featured` - Get featured destinations
- `GET /search` - Search destinations
- `GET /:id` - Get destination by ID
- `POST /` - Create destination
- `PUT /:id` - Update destination
- `DELETE /:id` - Delete destination

### Guided Trips (`/api/guided-trips`)
- `GET /` - Get all guided trips (with filters)
- `GET /:id` - Get trip by ID
- `GET /type/:type` - Get trips by type (Umrah/Normal)

### Guides (`/api/guide`)
- `GET /` - Get all guides
- `GET /:id` - Get guide by ID
- `POST /` - Create guide (Admin/SuperAdmin)
- `PUT /:id` - Update guide (Admin/SuperAdmin)
- `DELETE /:id` - Delete guide (Admin/SuperAdmin)

### TripInfo (`/api/trip-info`)
- `GET /` - Get all trip info
- `GET /:id` - Get trip info by ID
- `POST /` - Create trip info
- `PUT /:id` - Update trip info
- `DELETE /:id` - Delete trip info

### Users (`/api/user`)
- User management endpoints

---

## Authentication Flow

1. User logs in via `POST /api/auth/signin`
2. Backend returns JWT tokens (access & refresh)
3. Frontend stores tokens in `localStorage`
4. Subsequent requests include `Authorization: Bearer <token>` header
5. Backend middleware verifies token and extracts user info
6. Role-based access control enforced via middleware

---

## Environment Variables

### Backend (`server/.env`)
- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NODE_ENV` - Environment (development/production)

### Frontend (`client/.env`)
- `VITE_API_BASE` - Backend API base URL (e.g., http://localhost:3000)

---

## CORS Configuration

Backend is configured to accept requests from:
- Origin: `http://localhost:5173` (Vite default)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: true

