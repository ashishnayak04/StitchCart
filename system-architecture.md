# StitchCart — System Architecture

This document describes the high-level architecture of the StitchCart e-commerce platform: system overview, component breakdown, data flow, data models, and API surface.

---

## 1. Overview

StitchCart is a classic **three-tier web application** built on the MERN stack:

- **Client (React SPA)** — Vite + React 18 + Redux Toolkit + Tailwind CSS + Radix UI
- **Server (API)** — Node.js + Express, stateless REST API with JWT auth
- **Database** — MongoDB (via Mongoose ODM)

Third-party integrations:
- **PayPal** (`paypal-rest-sdk`) — payment processing (INR)
- **Stripe** (`stripe`) — card/UPI/net-banking checkout via Checkout Sessions (INR)
- **Cloudinary** — image storage/CDN (multer for upload parsing)

```
┌──────────────────────────┐
│      Browser (SPA)        │
│  React + Redux + Tailwind │
└────────────┬─────────────┘
             │ HTTP / JSON / httpOnly cookie (JWT)
             ▼
┌──────────────────────────┐        ┌──────────────┐
│   Express API  :9000      │───────▶│  PayPal      │
│  (REST, JWT guard)        │        │  Stripe      │
└──────┬───────────────────┘        └──────────────┘
       │ Mongoose ODM
       ▼
┌──────────────────────────┐        ┌──────────────┐
│   MongoDB Atlas / Local   │        │  Cloudinary  │
│   (7 collections)         │        │  (images)    │
└──────────────────────────┘        └──────────────┘
```

---

## 2. Client Architecture

The frontend is a route-driven React SPA. Entry: `client/src/main.jsx` → `App.jsx`.

### Routing tree

| Route | Layout | Guard | Page |
| --- | --- | --- | --- |
| `/` | — | `CheckAuth` | Redirect (home/admin/auth) |
| `/auth/login`, `/auth/register` | `AuthLayout` | `CheckAuth` | Login / Register |
| `/shop/home` | `ShoppingLayout` | `CheckAuth` | Home (featured carousel) |
| `/shop/listing` | `ShoppingLayout` | `CheckAuth` | Product listing + filters |
| `/shop/checkout` | `ShoppingLayout` | `CheckAuth` | Checkout |
| `/shop/account` | `ShoppingLayout` | `CheckAuth` | Account (orders + addresses) |
| `/shop/paypal-return` | `ShoppingLayout` | `CheckAuth` | PayPal redirect handler |
| `/shop/payment-success` | `ShoppingLayout` | `CheckAuth` | Payment confirmation |
| `/shop/search` | `ShoppingLayout` | `CheckAuth` | Search results |
| `/shop/wishlist` | `ShoppingLayout` | `CheckAuth` | Wishlist |
| `/admin/dashboard` | `AdminLayout` | `CheckAuth` | Admin dashboard |
| `/admin/products` | `AdminLayout` | `CheckAuth` | Product CRUD |
| `/admin/orders` | `AdminLayout` | `CheckAuth` | Order management |
| `/admin/features` | `AdminLayout` | `CheckAuth` | Featured carousel |
| `/unauth-page` | — | — | Unauthorized page |
| `*` | — | — | 404 Not Found |

### State management (Redux Toolkit)

`client/src/store/store.js` registers these slices:

| Slice | Responsibility |
| --- | --- |
| `auth` | user, isAuthenticated, isLoading; `checkAuth` thunk |
| `adminProducts` | admin product CRUD + image upload |
| `adminOrder` | all orders, order details, status updates |
| `shopProducts` | listing, filtering, sorting, product details |
| `shopCart` | cart items, add/update/remove |
| `shopAddress` | address book CRUD |
| `shopOrder` | order creation, PayPal capture, order history |
| `shopSearch` | search results |
| `shopReview` | product reviews |
| `commonFeature` | featured images |

### Key components

- `components/common/check-auth.jsx` — route guard that reads `auth` state and redirects unauthenticated/unauthorized users.
- `components/ui/*` — Radix UI primitives (button, card, dialog, select, tabs, toast, etc.).
- `components/shopping-view/*` — storefront components (header, footer, product tile/details, cart, address, orders).
- `components/admin-view/*` — admin shell (sidebar, header, layout) + management components.
- `config/index.js` — declarative form controls, category/brand maps, filter & sort options.

---

## 3. Server Architecture

Entry: `server/server.js`. Layered as **routes → controllers → models/helpers**.

```
Express app
 ├── Middleware: cors (localhost:5173, credentials), cookie-parser, express.json
 ├── /api/auth/*            → auth routes → auth-controller
 ├── /api/admin/products/*  → admin products routes → admin products-controller
 ├── /api/admin/orders/*    → admin order routes → admin order-controller
 ├── /api/shop/products/*   → shop products routes → shop products-controller
 ├── /api/shop/cart/*       → cart routes → cart-controller
 ├── /api/shop/address/*    → address routes → address-controller
  ├── /api/shop/order/*      → order routes → order-controller (PayPal + Stripe)
 ├── /api/shop/search/*     → search routes → search-controller
 ├── /api/shop/review/*     → review routes → product-review-controller
 └── /api/common/feature/*  → feature routes → feature-controller
```

### Helpers

| Helper | Purpose |
| --- | --- |
| `helpers/cloudinary.js` | Configures Cloudinary SDK, multer in-memory storage, `imageUploadUtil`. |
| `helpers/paypal.js` | Configures `paypal-rest-sdk` from env vars. |
| `helpers/stripe.js` | Configures the Stripe SDK from `STRIPE_SECRET_KEY`. |
| `helpers/pricing.js` | Computes subtotal, coupon discount, GST, shipping, and total for an order. |
| `helpers/mailer.js` | Builds and sends HTML invoice/receipt emails via SMTP (nodemailer). |

### Authentication

- JWT signed with a secret (`CLIENT_SECRET_KEY`, 60-min expiry), stored in an **httpOnly cookie** named `token`.
- `authMiddleware` verifies the cookie on every protected request and attaches `req.user`.
- Authorization is coarse-grained at the controller level via the role embedded in the JWT payload.

---

## 4. Database Schema

All models live in `server/models/`.

### User
```json
{
  "_id": "ObjectId",
  "userName": "string (unique, required)",
  "email": "string (unique, required)",
  "password": "string (hashed, required)",
  "role": "string, default 'user'"
}
```

### Product
```json
{
  "_id": "ObjectId",
  "image": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "brand": "string",
  "price": "number",
  "salePrice": "number",
  "totalStock": "number",
  "averageReview": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Cart
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId → ref User (required)",
  "items": [
    {
      "productId": "ObjectId → ref Product (required)",
      "quantity": "number ≥ 1 (required)"
    }
  ],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Address
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "address": "string",
  "city": "string",
  "pincode": "string",
  "phone": "string",
  "notes": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Order
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "cartId": "string",
  "cartItems": [
    { "productId": "string", "title": "string", "image": "string",
      "price": "string", "quantity": "number" }
  ],
  "addressInfo": {
    "addressId": "string", "address": "string", "city": "string",
    "pincode": "string", "phone": "string", "notes": "string"
  },
  "orderStatus": "string",
  "paymentMethod": "string",
  "paymentStatus": "string",
  "totalAmount": "number",
  "orderDate": "date",
  "orderUpdateDate": "date",
  "paymentId": "string",
  "payerId": "string"
}
```

### ProductReview
```json
{
  "_id": "ObjectId",
  "productId": "string",
  "userId": "string",
  "userName": "string",
  "reviewMessage": "string",
  "reviewValue": "number (1–5)",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Feature
```json
{
  "_id": "ObjectId",
  "image": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 5. Key Data Flows

### 5.1 Product listing with filters
1. `ShoppingListing` dispatches `fetchAllFilteredProducts({ filterParams, sortParams })`.
2. `GET /api/shop/products/get` builds a MongoDB `$and` query from category/brand filters and applies a sort (price/title).
3. Results are stored in `shopProducts` and rendered as product tiles.

### 5.2 Add to cart
1. User clicks "Add to Cart" on a tile/details page.
2. `POST /api/shop/cart/add` with `{ userId, productId, quantity }`.
3. Controller upserts the item into the user's cart document.

### 5.3 Order placement (PayPal)
1. `createOrder` builds the PayPal `create_payment_json` (items, INR amount, return/cancel URLs) and calls `paypal.payment.create`.
2. The order is persisted with `paymentStatus: pending` and the `approval_url` is returned.
3. After PayPal approval, the browser hits `/shop/paypal-return`.
4. `capturePayment` verifies the order, sets `paid`/`confirmed`, decrements stock per item, and deletes the cart.

### 5.4 Image upload (admin)
1. `multer` parses the multipart file into memory.
2. `imageUploadUtil` uploads to Cloudinary (`resource_type: auto`).
3. The returned Cloudinary URL is saved on the product/feature document.

---

## 6. API Surface

Base URL: `http://localhost:9000/api`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | Register user |
| POST | `/auth/login` | — | Login, set cookie |
| POST | `/auth/logout` | — | Clear cookie |
| GET | `/auth/check-auth` | JWT | Validate session |
| POST | `/admin/products/upload-image` | JWT* | Upload image → Cloudinary |
| POST | `/admin/products/add` | JWT* | Create product |
| PUT | `/admin/products/edit/:id` | JWT* | Edit product |
| DELETE | `/admin/products/delete/:id` | JWT* | Delete product |
| GET | `/admin/products/get` | JWT* | List all products |
| GET | `/admin/orders/get` | JWT* | All orders |
| GET | `/admin/orders/details/:id` | JWT* | Order details |
| PUT | `/admin/orders/update/:id` | JWT* | Update order status |
| GET | `/shop/products/get` | — | Filtered/sorted products |
| GET | `/shop/products/get/:id` | — | Product details |
| POST | `/shop/cart/add` | — | Add to cart |
| GET | `/shop/cart/get/:userId` | — | Get cart |
| PUT | `/shop/cart/update-cart` | — | Update quantity |
| DELETE | `/shop/cart/:userId/:productId` | — | Remove item |
| POST | `/shop/address/add` | — | Add address |
| GET | `/shop/address/get/:userId` | — | List addresses |
| PUT | `/shop/address/update/:userId/:addressId` | — | Edit address |
| DELETE | `/shop/address/delete/:userId/:addressId` | — | Delete address |
| POST | `/shop/order/create` | — | Create PayPal order |
| POST | `/shop/order/capture` | — | Capture payment |
| GET | `/shop/order/list/:userId` | — | User orders |
| GET | `/shop/order/details/:id` | — | Order details |
| GET | `/shop/search/:keyword` | — | Search products |
| POST | `/shop/review/add` | — | Add review |
| GET | `/shop/review/:productId` | — | List reviews |
| POST | `/common/feature/add` | JWT* | Add feature image |
| GET | `/common/feature/get` | — | List feature images |
| DELETE | `/common/feature/delete/:id` | JWT* | Delete feature image |

> *Auth middleware is present; fine-grained role checks are enforced per controller.

---

## 7. Deployment & Environment

Environment variables (in `server/.env`):

```
MONGO_URI=
JWT_SECRET / CLIENT_SECRET_KEY
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
PAYPAL_MODE / PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET
STRIPE_SECRET_KEY
PORT=9000
```

- **CORS** is locked to `http://localhost:5173` (Vite dev).
- Client and server run as separate processes; Vite proxies are not used — the client calls the API directly.
- PayPal `return_url` / `cancel_url` point to `http://localhost:5173/shop/paypal-return` and `/shop/paypal-cancel`.

---

## 8. Security Considerations

- Passwords hashed with **bcrypt** (12 rounds).
- JWT stored in an **httpOnly** cookie (not exposed to JS).
- Secrets are loaded from `.env` — never committed to the repository.
- Note (improvement): `CLIENT_SECRET_KEY` is hardcoded in `auth-controller.js`; move it to `.env` before production.
