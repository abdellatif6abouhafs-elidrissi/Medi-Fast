# Medi-Fast Backend API

## MVC Architecture

This backend follows the Model-View-Controller (MVC) pattern for better code organization and maintainability.

### Project Structure

```
Backend/
├── config/
│   └── database.js          # Database connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User management logic
│   ├── pharmacyController.js # Pharmacy management logic
│   ├── orderController.js   # Order management logic
│   └── notificationController.js # Notification logic
├── middleware/
│   └── auth.js             # Authentication & authorization middleware
├── models/
│   ├── User.js             # User model
│   ├── Pharmacy.js         # Pharmacy model
│   ├── Order.js            # Order model
│   └── Notification.js     # Notification model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User routes
│   ├── pharmacies.js       # Pharmacy routes
│   ├── orders.js           # Order routes
│   └── notifications.js    # Notification routes
├── utils/
│   └── seedDatabase.js     # Database seeding utility
├── server.js               # Main server file
├── package.json
└── .env                    # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/admin
- `POST /api/auth/login` - User login

### Users
- `PUT /api/users/:id` - Update user profile (authenticated)

### Pharmacies
- `GET /api/pharmacies` - Get all pharmacies
- `GET /api/pharmacies/:id/medicines` - Get pharmacy medicines
- `PUT /api/pharmacies/:id/medicines` - Update pharmacy medicines (admin only)
- `POST /api/pharmacies` - Create new pharmacy (admin only)
- `PUT /api/pharmacies/:id` - Update pharmacy (admin only)
- `DELETE /api/pharmacies/:id` - Delete pharmacy (admin only)

### Orders
- `GET /api/orders` - Get orders (user sees own, admin sees pharmacy orders)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order (authenticated)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications (authenticated)
- `PATCH /api/notifications/:id/read` - Mark notification as read (authenticated)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get admin dashboard data with pharmacy info and statistics (admin only)
- `GET /api/admin/pharmacy` - Get admin's pharmacy details (admin only)
- `PUT /api/admin/pharmacy` - Update admin's pharmacy information (admin only)
- `GET /api/admin/pharmacy/orders` - Get admin's pharmacy orders with pagination (admin only)

## Database Seeding

The application automatically seeds the database with sample data on first run:

### Default Accounts
- **Admin 1** (صيدلية النور): admin@medfast.com / admin123
- **Admin 2** (صيدلية الأمل): admin2@medfast.com / admin123  
- **Admin 3** (صيدلية السلام): admin3@medfast.com / admin123
- **User**: user@medfast.com / user123

### Sample Pharmacies (Each Admin Has One Pharmacy)
- صيدلية النور (Admin 1) - with Paracetamol, Ibuprofen
- صيدلية الأمل (Admin 2) - with Aspirin, Vitamin D3
- صيدلية السلام (Admin 3) - with Omega 3, Multivitamin

## Features

- ✅ JWT Authentication & Authorization
- ✅ Role-based access control (User/Admin)
- ✅ MongoDB integration with Mongoose
- ✅ Automatic database seeding
- ✅ Input validation & error handling
- ✅ CORS enabled for frontend integration
- ✅ Request logging with Morgan
- ✅ Clean MVC architecture
- ✅ RESTful API design
- ✅ **One pharmacy per admin** enforcement
- ✅ **Admin dashboard** with pharmacy management
- ✅ **Pharmacy statistics** and order tracking
- ✅ **Automatic pharmacy creation** during admin registration

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based middleware protection
- Input sanitization and validation
