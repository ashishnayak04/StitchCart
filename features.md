# StitchCart — Feature Documentation

StitchCart is a full-stack fashion & apparel e-commerce platform (MERN stack). This document details every implemented feature, grouped by functional module.

> **v2 note:** This document now also covers Phase 0 (platform hardening) and Phase 1 (payments & money) features.

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Customer (Shop) Features](#2-customer-shop-features)
3. [Shopping Cart](#3-shopping-cart)
4. [Checkout & Payments](#4-checkout--payments)
5. [Orders](#5-orders)
6. [Address Book](#6-address-book)
7. [Product Reviews](#7-product-reviews)
8. [Search](#8-search)
9. [Wishlist](#9-wishlist)
10. [Admin Panel](#10-admin-panel)
11. [Cross-Cutting Features](#11-cross-cutting-features)
12. [Coupons & Discounts](#12-coupons--discounts)
13. [Tax, Shipping & Invoices](#13-tax-shipping--invoices)
14. [Refunds & Cancellation](#14-refunds--cancellation)
15. [Platform Hardening (Phase 0)](#15-platform-hardening-phase-0)

---

## 1. Authentication & Authorization

JWT-based authentication with role-based access (`user` / `admin`).

| Feature | Description | Endpoint |
| --- | --- | --- |
| Register | Create an account with username, email, and password (hashed with bcrypt, salt rounds = 12). Rejects duplicate emails. | `POST /api/auth/register` |
| Login | Verifies credentials, issues a JWT (60 min expiry) stored in an HTTP-only cookie. | `POST /api/auth/login` |
| Logout | Clears the auth cookie. | `POST /api/auth/logout` |
| Session check | Validates the cookie token and returns the current user. Runs once on app load. | `GET /api/auth/check-auth` |

**Notes**
- Passwords are never stored or returned in plain text.
- Role is assigned at signup and defaults to `user`; admins are seeded/promoted manually.
- Protected routes are enforced client-side via `CheckAuth` (route guard) and server-side via the `authMiddleware` JWT verifier.

---

## 2. Customer (Shop) Features

| Feature | Description | Endpoint |
| --- | --- | --- |
| Browse catalog | Grid of product tiles with image, title, price, sale price, and rating. | `GET /api/shop/products/get` |
| Filter products | By category (Men, Women, Kids, Accessories, Footwear) and brand (Nike, Adidas, Puma, Levi's, Zara, H&M). | `GET /api/shop/products/get` |
| Sort products | Price (low→high, high→low) and title (A→Z, Z→A). | `GET /api/shop/products/get` |
| Product details | Full description, gallery image, price/sale price, stock, and reviews. | `GET /api/shop/products/get/:id` |
| Featured carousel | Rotating promotional image carousel on the home page. | `GET /api/common/feature/get` |

---

## 3. Shopping Cart

Persisted per-user cart stored in MongoDB.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add to cart | Add a product (quantity ≥ 1) to the user's cart. | `POST /api/shop/cart/add` |
| View cart | Fetch all items for a user, enriched with live product data. | `GET /api/shop/cart/get/:userId` |
| Update quantity | Increment/decrement quantity in the cart. | `PUT /api/shop/cart/update-cart` |
| Remove item | Delete a single product from the cart. | `DELETE /api/shop/cart/:userId/:productId` |

---

## 4. Checkout & Payments

Checkout supports two payment methods: **PayPal** and **Stripe (cards)**, both in USD.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Create order (PayPal) | Creates a PayPal payment (USD) from the cart items, persists the order with `pending` status, and returns the PayPal approval URL + order id. | `POST /api/shop/order/create` |
| PayPal redirect | Customer is redirected to PayPal (`return_url: /shop/paypal-return`). | — |
| Capture payment (PayPal) | Confirms the payment with PayPal, marks the order `paid` / `confirmed`, decrements product stock, and deletes the user's cart. | `POST /api/shop/order/capture` |
| Create order (Stripe) | Creates a Stripe Checkout Session, persists the order as `pending`, returns the hosted checkout URL. | `POST /api/shop/order/create-stripe` |
| Stripe return | Verifies the Stripe session, confirms the order (`paid`/`confirmed`), decrements stock, clears cart, emails invoice. | `GET /api/shop/order/stripe-return/:orderId/:sessionId` |
| Payment success | Confirmation screen shown after a successful capture. | `GET /shop/payment-success` |

**Checkout flow**
1. User reviews cart → selects payment method → `createOrder` (PayPal) or `createStripeOrder`
2. Frontend redirects browser to PayPal approval URL or Stripe hosted Checkout
3. PayPal redirects back to `/shop/paypal-return`; Stripe redirects back to `/shop/payment-success`
4. Payment is captured/confirmed, cart is cleared, stock is decremented, invoice email is sent

---

## 5. Orders

| Feature | Description | Endpoint |
| --- | --- | --- |
| User order list | All orders placed by a specific user (most recent first). | `GET /api/shop/order/list/:userId` |
| User order details | Full breakdown of a single order (items, address, amounts, status). | `GET /api/shop/order/details/:id` |
| Admin order list | All orders across all users. | `GET /api/admin/orders/get` |
| Admin order details | Single order view for the admin. | `GET /api/admin/orders/details/:id` |
| Update order status | Admin can move orders through statuses (e.g. confirmed → shipped → delivered). | `PUT /api/admin/orders/update/:id` |

---

## 6. Address Book

Stores multiple shipping addresses per user.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add address | Address, city, pincode, phone, optional notes. | `POST /api/shop/address/add` |
| List addresses | All addresses for a user. | `GET /api/shop/address/get/:userId` |
| Edit address | Update an existing address. | `PUT /api/shop/address/update/:userId/:addressId` |
| Delete address | Remove an address. | `DELETE /api/shop/address/delete/:userId/:addressId` |

---

## 7. Product Reviews

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add review | Post a rating (1–5) and message for a product. | `POST /api/shop/review/add` |
| List reviews | All reviews for a product. | `GET /api/shop/review/:productId` |
| Average rating | Product-level `averageReview` is maintained and shown on tiles/details. | (computed from reviews) |

---

## 8. Search

| Feature | Description | Endpoint |
| --- | --- | --- |
| Keyword search | Searches product title, description, category, and brand via regex (case-insensitive). | `GET /api/shop/search/:keyword` |

---

## 9. Wishlist

- Dedicated wishlist page for saved products (frontend-only, backed by product listing data).
- Route: `/shop/wishlist`.

---

## 10. Admin Panel

Accessible at `/admin/*` for users with the `admin` role.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Dashboard | Overview view for the admin (`/admin/dashboard`). | — |
| Product management | Create, read, update, and delete products. | `POST /api/admin/products/add`, `GET /api/admin/products/get`, `PUT /api/admin/products/edit/:id`, `DELETE /api/admin/products/delete/:id` |
| Image upload | Upload product/feature images to Cloudinary (multer in-memory → Cloudinary API). | `POST /api/admin/products/upload-image` |
| Order management | View all orders, view details, update status. | See [Orders](#5-orders) |
| Featured carousel | Add, list, and delete home-page feature images. | `POST /api/common/feature/add`, `GET /api/common/feature/get`, `DELETE /api/common/feature/delete/:id` |

---

## 11. Cross-Cutting Features

- **Responsive UI** — Tailwind CSS with a custom luxury theme, Radix UI primitives, Lucide icons.
- **Global state** — Redux Toolkit slices for auth, products, cart, address, orders, search, reviews, and features.
- **Role-based navigation** — separate layouts for `shopping-view`, `admin-view`, and `auth`.
- **Toast notifications** — feedback for cart/order/auth actions.
- **Loading skeletons** — placeholders while data loads.
- **Error / guard pages** — 404 `Not Found` and `Unauthorized` pages.
- **Image gallery** — product images served from Cloudinary CDN.

---

## 12. Coupons & Discounts

| Feature | Description | Endpoint |
| --- | --- | --- |
| Create coupon | Admin creates a coupon (code, type, value, min cart, expiry, usage limit). | `POST /api/admin/coupons/add` |
| List coupons | Admin lists all coupons. | `GET /api/admin/coupons/get` |
| Edit coupon | Admin edits a coupon. | `PUT /api/admin/coupons/edit/:id` |
| Toggle / delete coupon | Admin toggles active state or deletes a coupon. | `PUT /api/admin/coupons/toggle/:id`, `DELETE /api/admin/coupons/delete/:id` |
| Validate coupon | Customer applies a coupon code; server validates min-cart, expiry, usage, and returns the discounted amount. | `POST /api/shop/coupon/validate` |

**Coupon model fields**: `code` (unique, uppercase), `description`, `discountType` (`percent` | `fixed`), `discountValue`, `minimumCartValue`, `expirationDate`, `usageLimit`, `usedCount`, `isActive`.

---

## 13. Tax, Shipping & Invoices

- **Order pricing breakdown** — orders store `subtotalAmount`, `shippingAmount`, `taxAmount`, `discountAmount`, and `totalAmount`.
- **Shipping** — flat-rate shipping applied when configured (`SHIPPING_FLAT_RATE`, default `$0` = free).
- **Tax** — US sales tax computed from `US_TAX_RATE` (e.g. `0.08`) applied to the post-discount subtotal.
- **Invoice email** — every confirmed order sends an HTML receipt/invoice to the customer email via SMTP (`SMTP_*` env vars, nodemailer).

---

## 14. Refunds & Cancellation

| Feature | Description | Endpoint |
| --- | --- | --- |
| Request cancellation | User cancels a paid/unshipped order; server issues refund (Stripe/PayPal), restores stock, marks `cancelled`. | `POST /api/shop/order/cancel/:id` |
| Refund order | Admin initiates/records a refund for an order. | `POST /api/admin/orders/refund/:id` |
| Refund listing | Admin lists orders with refunds. | `GET /api/admin/orders/refunds` |

**Order refund fields**: `refundStatus` (`none` | `requested` | `approved` | `processed`), `refundReason`, `refundAmount`, `refundedAt`.

---

## 15. Platform Hardening (Phase 0)

- **Centralized secrets** — JWT secret read from `JWT_SECRET` env (no hardcoded values).
- **Server-side role enforcement** — `authMiddleware` (JWT) + `adminMiddleware` (`role === "admin"`) applied to all admin and feature routes.
- **Security headers** — Helmet enabled.
- **Rate limiting** — `express-rate-limit` on `/api` (configurable via `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`).
- **Configurable CORS** — origins from `CORS_ORIGIN` (default `http://localhost:5173`).
- **Pagination** — `GET /api/shop/products/get`, `GET /api/admin/products/get`, `GET /api/admin/orders/get` accept `page` & `limit` and return `{ data, total, totalPages, page, limit }`.
- **Deployment** — `.env.example` documents every environment variable for reproducible runs.
- **Bug fixes** — undefined `error` references in catch blocks replaced with `e`.
