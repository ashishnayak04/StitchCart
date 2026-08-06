# StitchCart — Product Requirements Document (PRD)

## 1. Document Info

| Field | Value |
| --- | --- |
| Product name | StitchCart |
| Type | Fashion & apparel e-commerce platform |
| Version | 1.0.0 |
| Stack | MERN (MongoDB, Express, React, Node.js) |
| Status | Implemented (v1) |

---

## 2. Product Overview

StitchCart is a full-stack online store for fashion and apparel. It lets customers browse and filter a product catalog, manage a cart, place orders paid via PayPal, track order history, and maintain addresses and reviews. Administrators manage products, orders, and the home-page featured carousel through a dedicated admin panel.

### Goals
- Provide a complete, working e-commerce experience from browsing to payment.
- Role-based experience for shoppers (`user`) and store managers (`admin`).
- Clean, responsive, luxury-themed UI.

### Non-goals (v1)
- No email/SMS notifications.
- No multi-vendor / marketplace support.
- No in-app wallet or COD — PayPal only.
- No admin user creation UI (roles seeded manually).

---

## 3. User Personas & Roles

| Role | Description | Capabilities |
| --- | --- | --- |
| Guest | Anonymous visitor | Browse, filter, sort, search, view details, read reviews. |
| Registered User | Logged-in shopper | Everything above + cart, checkout, orders, addresses, reviews, wishlist. |
| Admin | Store manager | Product CRUD + image upload, order status management, featured carousel management. |

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

| ID | Requirement | Priority |
| --- | --- | --- |
| AUTH-01 | User can register with username, email, and password. Duplicate email rejected. | P0 |
| AUTH-02 | User can log in; server issues a JWT in an httpOnly cookie. | P0 |
| AUTH-03 | User can log out (cookie cleared). | P0 |
| AUTH-04 | App validates session on load via `/check-auth`. | P0 |
| AUTH-05 | Admin-only pages/routes are guarded by role (`admin`). | P0 |
| AUTH-06 | Unauthorized access redirects to an `Unauthorized` page; unknown routes show a 404. | P1 |

### 4.2 Product Catalog (Customer)

| ID | Requirement | Priority |
| --- | --- | --- |
| CAT-01 | List products with image, title, price, sale price, stock, and rating. | P0 |
| CAT-02 | Filter by category (Men, Women, Kids, Accessories, Footwear). | P0 |
| CAT-03 | Filter by brand (Nike, Adidas, Puma, Levi's, Zara, H&M). | P0 |
| CAT-04 | Sort by price (low→high, high→low) and title (A→Z, Z→A). | P0 |
| CAT-05 | View product details including description and reviews. | P0 |
| CAT-06 | Keyword search across title, description, category, and brand. | P0 |
| CAT-07 | Home page shows a featured image carousel managed by the admin. | P1 |

### 4.3 Cart

| ID | Requirement | Priority |
| --- | --- | --- |
| CART-01 | Add a product to the cart with a quantity ≥ 1. | P0 |
| CART-02 | View cart items with live product info and total. | P0 |
| CART-03 | Update item quantity. | P0 |
| CART-04 | Remove an item from the cart. | P0 |

### 4.4 Checkout & Payments

| ID | Requirement | Priority |
| --- | --- | --- |
| CHK-01 | Checkout creates a PayPal payment in USD with the cart contents. | P0 |
| CHK-02 | Customer is redirected to PayPal and back to a return page. | P0 |
| CHK-03 | On successful capture, order becomes `paid`/`confirmed`, stock decrements, cart clears. | P0 |
| CHK-04 | User sees a payment-success confirmation page. | P0 |

### 4.5 Orders

| ID | Requirement | Priority |
| --- | --- | --- |
| ORD-01 | User can list their own orders with status. | P0 |
| ORD-02 | User can view order details (items, address, total, dates). | P0 |
| ORD-03 | Admin can view all orders across users. | P0 |
| ORD-04 | Admin can update an order's status. | P0 |

### 4.6 Address Book

| ID | Requirement | Priority |
| --- | --- | --- |
| ADDR-01 | Add a shipping address (address, city, pincode, phone, notes). | P0 |
| ADDR-02 | List addresses for the user. | P0 |
| ADDR-03 | Edit an address. | P0 |
| ADDR-04 | Delete an address. | P0 |

### 4.7 Reviews

| ID | Requirement | Priority |
| --- | --- | --- |
| REV-01 | User can add a review with a 1–5 star rating and message. | P1 |
| REV-02 | Reviews for a product are listed on its details page. | P1 |
| REV-03 | Product tiles show an average review score. | P1 |

### 4.8 Wishlist

| ID | Requirement | Priority |
| --- | --- | --- |
| WIS-01 | User has a wishlist page to view saved products. | P2 |

### 4.9 Admin Panel

| ID | Requirement | Priority |
| --- | --- | --- |
| ADM-01 | Admin can add a product (title, description, category, brand, price, sale price, stock, image). | P0 |
| ADM-02 | Admin can upload images to Cloudinary. | P0 |
| ADM-03 | Admin can edit and delete products. | P0 |
| ADM-04 | Admin can view all products. | P0 |
| ADM-05 | Admin can manage order statuses. | P0 |
| ADM-06 | Admin can add/delete home-page feature (carousel) images. | P1 |
| ADM-07 | Admin has a dashboard landing page. | P2 |

---

## 5. Non-Functional Requirements

| Requirement | Description |
| --- | --- |
| Usability | Intuitive navigation; single click from browsing to cart; clear success/error toasts. |
| Performance | Server-side filtering/sorting; React SPA with Redux caching of product lists. |
| Security | bcrypt-hashed passwords; JWT in httpOnly cookie; no secrets in code or committed files. |
| Compatibility | Modern evergreen browsers; responsive layout (mobile/desktop). |
| Maintainability | Layered server (routes/controllers/models); componentized React with reusable Radix UI primitives. |

---

## 6. Success Metrics

- Successful completion of the purchase funnel: **browse → cart → PayPal → confirmed order**.
- Zero stock over-sell: stock is decremented atomically on payment capture.
- Admin productivity: full product lifecycle manageable without code changes.

---

## 7. Assumptions & Dependencies

- MongoDB instance available (local or Atlas) with `MONGO_URI`.
- Cloudinary account for image uploads.
- PayPal developer app (sandbox) providing client ID/secret and mode.
- Node.js ≥ 18.
- Admin accounts are promoted to `role: "admin"` directly in the database (no signup UI for admins).

---

## 8. Known Gaps / Backlog

| Item | Notes |
| --- | --- |
| Centralize JWT secret | `CLIENT_SECRET_KEY` is hardcoded in `auth-controller.js`; move to `.env`. |
| Enforce admin role server-side | Many admin routes only verify the JWT, not the role. |
| Wishlist persistence | Currently frontend-only; persist per user. |
| Order status lifecycle | Consider predefined allowed transitions (pending → confirmed → shipped → delivered). |
| Tests | No automated test suite beyond a Playwright dev dependency; add unit/integration tests. |
| Cancellation flow | `cancel_url` route (`/shop/paypal-cancel`) is referenced but not implemented in the SPA. |
| Pagination | Product listing has no pagination/infinite scroll for large catalogs. |
| Payments | Only PayPal; no card (Stripe/razorpay) or COD options. |
