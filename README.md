# StitchCart

A full-stack e-commerce platform for Indian ethnic and contemporary fashion, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Shopping
- Browse products by category, brand, and price
- Product search with filtering and sorting
- Product details with image gallery and reviews
- Shopping cart management
- Wishlist functionality
- Secure checkout with PayPal + Stripe, billed in INR
- Order tracking and history

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes and role-based access (user/admin)

### Admin Dashboard
- Product management (CRUD with image upload via Cloudinary)
- Order management and status updates
- Featured image carousel management

### Tech Highlights
- **Frontend**: React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Radix UI
- **Backend**: Express.js, Mongoose ODM, JWT, bcryptjs
- **Payments**: PayPal REST SDK + Stripe (INR, GST applied at checkout)
- **Media**: Cloudinary integration for image uploads
- **Styling**: Tailwind CSS with custom luxury theme

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Client   | React 18, Vite, Redux Toolkit, Tailwind CSS     |
| Server   | Node.js, Express.js                             |
| Database | MongoDB with Mongoose ODM                       |
| Auth     | JWT (JSON Web Tokens), bcryptjs                 |
| Payments | PayPal REST SDK + Stripe (INR)                |
| Storage  | Cloudinary (image uploads)                      |
| UI       | Radix UI primitives, Lucide icons               |

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB connection string (local or Atlas)
- Cloudinary account
- PayPal developer credentials
- Stripe secret key

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

```bash
# Start the server (from server/)
npm run dev

# Start the client (from client/)
npm run dev
```

The server runs on `http://localhost:9000` and the client on `http://localhost:5173`.

## Project Structure

```
StitchCart/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin-view/    # Admin panel components
│   │   │   ├── shopping-view/ # Storefront components
│   │   │   ├── auth/          # Auth layout
│   │   │   ├── common/        # Shared components
│   │   │   └── ui/            # Radix UI primitives
│   │   ├── pages/             # Route pages
│   │   │   ├── admin-view/    # Admin pages
│   │   │   ├── auth/          # Login/Register
│   │   │   └── shopping-view/ # Storefront pages
│   │   ├── store/             # Redux Toolkit slices
│   │   └── config/            # App configuration
│   └── ...
├── server/                    # Express backend
│   ├── controllers/           # Route handlers
│   │   ├── admin/             # Admin controllers
│   │   ├── auth/              # Auth controller
│   │   ├── common/            # Shared controllers
│   │   └── shop/              # Shop controllers
│   ├── helpers/               # Utility modules
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Review.js
│   │   ├── Address.js
│   │   └── Feature.js
│   ├── routes/                # API route definitions
│   └── server.js              # Entry point
└── README.md
```

## API Overview

| Endpoint                | Description           |
| ----------------------- | --------------------- |
| `/api/auth`             | Authentication        |
| `/api/admin/products`   | Admin product CRUD    |
| `/api/admin/orders`     | Admin order management|
| `/api/shop/products`    | Public product listing|
| `/api/shop/cart`        | Cart operations       |
| `/api/shop/address`     | Address management    |
| `/api/shop/order`       | Order placement       |
| `/api/shop/search`      | Product search        |
| `/api/shop/review`      | Product reviews       |
| `/api/common/feature`   | Featured images       |

## License

MIT
