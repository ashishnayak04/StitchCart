# StitchCart — Product Requirements Document (PRD)

## 1. Document Info

| Field | Value |
| --- | --- |
| Product name | StitchCart |
| Type | Fashion & apparel e-commerce platform |
| Version | 3.1.0 |
| Stack | MERN (MongoDB, Express, React, Node.js) |
| Status | All v2 phases delivered + admin panel expanded |
| Market | India (INR pricing, Stripe + PayPal in INR, GST) |

---

## 2. Product Overview

StitchCart is a full-stack online store for Indian ethnic and contemporary fashion. It lets customers browse and filter a product catalog, manage a cart, place orders paid via card (Stripe) or PayPal in INR, track order history, maintain addresses and reviews, use a server-side wishlist, earn loyalty points, and get support through tickets. Administrators manage products, orders, coupons, analytics, support, FAQ, policies, variants, reviews, categories, brands, inventory, users, and the homepage through a comprehensive admin panel with active audit logging.

### Goals
- Provide a complete, working e-commerce experience from browsing to payment.
- Role-based experience for shoppers (`user`) and store managers (`admin`).
- Clean, responsive, luxury-themed UI.
- Full customer lifecycle: discovery, purchase, support, and post-purchase management.
- Comprehensive admin panel with bird's-eye-view management of all entities.

---

## 3. User Personas & Roles

| Role | Description | Capabilities |
| --- | --- | --- |
| Guest | Anonymous visitor | Browse, filter, sort, search, view details, read reviews. |
| Registered User | Logged-in shopper | Everything above + cart, checkout, orders, addresses, reviews, wishlist, loyalty points, support tickets, profile management. |
| Admin | Store manager | **Full CRUD on all entities**: products, variants, categories, brands, orders, coupons, users, FAQ, policies. Analytics dashboard, customer management, review moderation (approve/reject), support ticket management, inventory management, return processing, audit log viewer, CSV exports, featured carousel management. |

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
| AUTH-07 | Forgot/reset password flow with email tokens (30 min expiry). | P1 |
| AUTH-08 | Email verification with secure tokens (24 hr expiry). | P1 |
| AUTH-09 | Google OAuth login. | P2 |
| AUTH-10 | Profile editing (username, phone, avatar). | P2 |

### 4.2 Product Catalog (Customer)

| ID | Requirement | Priority |
| --- | --- | --- |
| CAT-01 | List products with image, title, price, sale price, stock, and rating. | P0 |
| CAT-02 | Filter by category and brand. | P0 |
| CAT-03 | Sort by price (low→high, high→low) and title (A→Z, Z→A). | P0 |
| CAT-04 | View product details including description and reviews. | P0 |
| CAT-05 | Keyword search across title, description, category, and brand. | P0 |
| CAT-06 | Home page shows a featured image carousel managed by the admin. | P1 |
| CAT-07 | Product variants (size, color, SKU with per-variant stock). | P2 |
| CAT-08 | Recently viewed products (max 20 per user). | P2 |
| CAT-09 | Product variants with per-variant pricing. | P2 |

### 4.3 Cart

| ID | Requirement | Priority |
| --- | --- | --- |
| CART-01 | Add a product to the cart with a quantity ≥ 1. | P0 |
| CART-02 | View cart items with live product info and total. | P0 |
| CART-03 | Update item quantity. | P0 |
| CART-04 | Remove an item from the cart. | P0 |
| CART-05 | Variant selection per cart item. | P2 |
| CART-06 | Guest checkout via guestId. | P2 |
| CART-07 | Reorder from past orders. | P2 |

### 4.4 Checkout & Payments

| ID | Requirement | Priority |
| --- | --- | --- |
| CHK-01 | Checkout creates a PayPal payment in INR with the cart contents. | P0 |
| CHK-02 | Customer is redirected to PayPal and back to a return page. | P0 |
| CHK-03 | On successful capture, order becomes `paid`/`confirmed`, stock decrements, cart clears. | P0 |
| CHK-04 | User sees a payment-success confirmation page. | P0 |
| CHK-05 | Stripe Checkout (cards) alongside PayPal. | P1 |
| CHK-06 | PayPal cancel route. | P1 |
| CHK-07 | Coupons / promo codes at checkout. | P1 |
| CHK-08 | GST + shipping calculated and stored on order. | P1 |
| CHK-09 | Emailed invoice/receipt on every confirmed order. | P1 |
| CHK-10 | Refund flow (user requests, admin approves). | P1 |
| CHK-11 | Order cancellation with automatic refund + stock restore. | P1 |

### 4.5 Orders

| ID | Requirement | Priority |
| --- | --- | --- |
| ORD-01 | User can list their own orders with status. | P0 |
| ORD-02 | User can view order details (items, address, total, dates). | P0 |
| ORD-03 | Admin can view all orders across users. | P0 |
| ORD-04 | Admin can update an order's status with tracking info. | P0 |
| ORD-05 | Order status lifecycle enforcement (pending → confirmed → shipped → delivered). | P1 |
| ORD-06 | Order tracking timeline with status history. | P2 |
| ORD-07 | Return request within 30 days of delivery. | P2 |

### 4.6 Address Book

| ID | Requirement | Priority |
| --- | --- | --- |
| ADDR-01 | Add a shipping address (address, city, pincode, phone, notes). | P0 |
| ADDR-02 | List addresses for the user. | P0 |
| ADDR-03 | Edit an address. | P0 |
| ADDR-04 | Delete an address. | P0 |
| ADDR-05 | Default address support. | P2 |

### 4.7 Reviews

| ID | Requirement | Priority |
| --- | --- | --- |
| REV-01 | User can add a review with a 1–5 star rating and message. | P1 |
| REV-02 | Reviews for a product are listed on its details page. | P1 |
| REV-03 | Product tiles show an average review score. | P1 |
| REV-04 | Admin review moderation: list, filter by status, approve, reject, delete. | P2 |
| REV-05 | Reviews have a `status` field: `pending` (default), `approved`, `rejected`. | P2 |

### 4.8 Wishlist

| ID | Requirement | Priority |
| --- | --- | --- |
| WIS-01 | Server-side persisted wishlist per user. | P2 |
| WIS-02 | Add/remove products from wishlist. | P2 |
| WIS-03 | Check if a product is wishlisted. | P2 |

### 4.9 Admin Panel

| ID | Requirement | Priority |
| --- | --- | --- |
| ADM-01 | Admin can add/edit/delete products with image upload. | P0 |
| ADM-02 | Admin can upload images to Cloudinary. | P0 |
| ADM-03 | Admin can view all products. | P0 |
| ADM-04 | Admin can manage order statuses with tracking info. | P0 |
| ADM-05 | Admin can add/delete home-page feature images. | P1 |
| ADM-06 | Admin has a dashboard landing page. | P2 |
| ADM-07 | Analytics dashboard (revenue, orders, top products, low stock, revenue by category/brand, coupon performance). | P2 |
| ADM-08 | Customer management with CSV export. | P2 |
| ADM-09 | Review moderation (list, filter by status, approve, reject, delete). | P2 |
| ADM-10 | Support ticket management (view, filter, reply, update status). | P2 |
| ADM-11 | FAQ management with inline edit UI. | P2 |
| ADM-12 | Policy page management with inline edit UI. | P2 |
| ADM-13 | Audit log with active logging of 16+ operation types. | P2 |
| ADM-14 | Product variant management (size, color, SKU, stock, pricing). | P2 |
| ADM-15 | CSV exports (orders, products, customers). | P2 |
| ADM-16 | **User management: full CRUD on all users (admin, user, blocked) with search and role filter.** | P2 |
| ADM-17 | **Category management: full CRUD for product categories.** | P2 |
| ADM-18 | **Brand management: full CRUD for brands.** | P2 |
| ADM-19 | **Inventory management: view/edit stock levels, low-stock filter, bulk update.** | P2 |
| ADM-20 | **Return management: view/approve/reject return requests with auto stock restore.** | P2 |
| ADM-21 | **Code-splitting: all admin pages lazy-loaded via React.lazy for optimal bundle size.** | P2 |

### 4.10 Notifications

| ID | Requirement | Priority |
| --- | --- | --- |
| NOT-01 | In-app notification center with read/unread status. | P2 |
| NOT-02 | Notification types: order, promotion, system, support. | P2 |
| NOT-03 | Unread badge count. | P2 |

### 4.11 Loyalty

| ID | Requirement | Priority |
| --- | --- | --- |
| LOY-01 | Earn 1 point per ₹1 spent on confirmed orders. | P2 |
| LOY-02 | View points balance and history. | P2 |
| LOY-03 | Redeem points at checkout. | P2 |

### 4.12 Support

| ID | Requirement | Priority |
| --- | --- | --- |
| SUP-01 | Create support tickets with subject, message, priority. | P2 |
| SUP-02 | Threaded replies between customer and admin. | P2 |
| SUP-03 | Ticket status tracking (open → in_progress → resolved → closed). | P2 |
| SUP-04 | Link tickets to orders. | P2 |

### 4.13 Trust & Content

| ID | Requirement | Priority |
| --- | --- | --- |
| TRU-01 | FAQ / Help center page. | P2 |
| TRU-02 | Editable policy pages (privacy, terms, shipping, returns). | P2 |

---

## 5. Non-Functional Requirements

| Requirement | Description |
| --- | --- |
| Usability | Intuitive navigation; single click from browsing to cart; clear success/error toasts. |
| Performance | Server-side filtering/sorting; React SPA with Redux caching; code-split admin pages (~905 KB core, 3–11 KB per admin page). |
| Security | bcrypt-hashed passwords; JWT in httpOnly cookie; Helmet headers; rate limiting; no secrets in code; admin routes guarded by `authMiddleware` + `adminMiddleware`. |
| Compatibility | Modern evergreen browsers; responsive layout (mobile/desktop). |
| Maintainability | Layered server (routes/controllers/models); componentized React with reusable Radix UI primitives. |
| Auditability | All critical admin operations logged with user, action, entity, entity ID, details, and IP address. |

---

## 6. Success Metrics

- Successful completion of the purchase funnel: **browse → cart → checkout → confirmed order**.
- Zero stock over-sell: stock is decremented atomically on payment capture.
- Admin productivity: full product lifecycle manageable without code changes.
- Customer self-service: wishlist, loyalty, support tickets, returns, profile management.
- Full admin control: user management, review moderation, audit trail, inventory management.

---

## 7. Assumptions & Dependencies

- MongoDB instance available (local or Atlas) with `MONGO_URI`.
- Cloudinary account for image uploads.
- Payment provider accounts: PayPal developer app and Stripe.
- Node.js ≥ 18.
- Admin accounts are created via the admin user management panel (`/admin/users`).
- SMTP configured for invoice emails, password reset, and email verification.

---

## 8. Known Gaps / Backlog

| Item | Notes |
| --- | --- |
| SMS notifications | Twilio integration scaffolded (env vars in .env.example) but not yet implemented. |
| Live chat | Real-time chat not yet implemented. |
| SEO / sitemap | Auto-generated sitemap not yet implemented. |
| PWA | Progressive Web App features not yet implemented. |
| Search autocomplete | Debounced search suggestions not yet implemented. |
| Size guide / fit finder | Not yet implemented. |
| Product comparison | Not yet implemented. |
| Recommendations | AI/product-based recommendations not yet implemented. |

---

## 9. v2 Roadmap — All Phases Delivered

### Phase 0 — Platform hardening
- Centralized JWT secret to `.env`.
- Server-side role enforcement on all admin/feature routes.
- Security headers (Helmet), rate limiting, configurable CORS.
- Pagination on shop products, admin products, and admin orders.
- `.env.example` deployment documentation.

### Phase 1 — Payments & money
- Stripe Checkout alongside PayPal.
- Coupons / promo codes with admin management UI.
- GST + shipping calculated at checkout and stored on the order.
- Emailed invoice/receipt on every confirmed order.
- Refund flow + admin management.
- Order cancellation with automatic refund + stock restore.

### Phase 2 — Account & auth
- Forgot/reset password with email tokens.
- Email verification with secure tokens.
- Google OAuth login.
- Profile editing + avatar.
- Default address support.
- Guest checkout (guestId on Cart).
- Server-side persisted wishlist.
- Reorder from past orders.

### Phase 3 — Notifications
- In-app notification center with read/unread status.
- Notification types: order, promotion, system, support.
- Unread badge count.

### Phase 4 — Admin analytics & operations
- Revenue/order/top-product dashboards with revenue-by-category/brand and coupon performance.
- Customer management with CSV export, block/unblock.
- **User management: full CRUD on all users (admin, user, blocked) with search and role filter.**
- Review moderation: list, filter by status, **approve/reject**, delete.
- Support ticket management with threaded replies.
- FAQ management with **inline edit UI**.
- Policy page management with **inline edit UI**.
- **Active audit logging** of 16+ admin operations (products, orders, coupons, categories, brands, returns, support tickets).
- Product variant management (size, color, SKU, stock, pricing).
- **Category management: full CRUD.**
- **Brand management: full CRUD.**
- **Inventory management: view/edit stock levels, low-stock filter, bulk update.**
- **Return management: view/approve/reject with auto stock restore.**
- CSV exports (orders, products, customers).
- **Code-splitting: all admin pages lazy-loaded via React.lazy.**

### Phase 5 — Trust & support
- FAQ / Help center page.
- Support tickets with threaded replies.
- Ticket status tracking.
- Editable policy pages.

### Phase 6 — Engagement & catalog depth
- Loyalty points (earn + redeem).
- Recently viewed products.
- Product variants (size, color, SKU, stock).
- Order tracking timeline.
- Returns/exchange requests.
- Profile editing.
- Email verification.
- Guest checkout.
