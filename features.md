# StitchCart — Feature Documentation

StitchCart is a full-stack fashion & apparel e-commerce platform (MERN stack). This document details every implemented feature, grouped by functional module.

> **v2.1 note:** This document covers all delivered phases: Phase 0 (platform hardening), Phase 1 (payments & money), Phase 2 (account & auth), Phase 3 (notifications), Phase 4 (admin analytics & operations), Phase 5 (trust & support), and Phase 6 (engagement & catalog depth). Phase 4 has been expanded with full user management, active audit logging, review approve/reject workflow, and inline edit UIs for FAQ and policies.

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
16. [Account & Auth (Phase 2)](#16-account--auth-phase-2)
17. [Notifications (Phase 3)](#17-notifications-phase-3)
18. [Admin Analytics & Operations (Phase 4)](#18-admin-analytics--operations-phase-4)
19. [Trust & Support (Phase 5)](#19-trust--support-phase-5)
20. [Engagement & Catalog Depth (Phase 6)](#20-engagement--catalog-depth-phase-6)

---

## 1. Authentication & Authorization

JWT-based authentication with role-based access (`user` / `admin` / `blocked`).

| Feature | Description | Endpoint |
| --- | --- | --- |
| Register | Create an account with username, email, and password (hashed with bcrypt, salt rounds = 12). Rejects duplicate emails. | `POST /api/auth/register` |
| Login | Verifies credentials, issues a JWT (60 min expiry) stored in an HTTP-only cookie. | `POST /api/auth/login` |
| Logout | Clears the auth cookie. | `POST /api/auth/logout` |
| Session check | Validates the cookie token and returns the current user. Runs once on app load. | `GET /api/auth/check-auth` |
| Forgot password | Sends a password reset email with a secure token (30 min expiry). | `POST /api/auth/forgot-password` |
| Reset password | Resets password using the token from email. | `POST /api/auth/reset-password` |
| Email verification | Sends a verification email with a secure token (24 hr expiry). | `POST /api/auth/send-verification/:userId` |
| Verify email | Confirms email address using the token. | `POST /api/auth/verify-email` |
| Profile editing | Update username, phone, and avatar URL. | `PUT /api/auth/update-profile` |
| Google OAuth | Login/register via Google authentication. | `POST /api/auth/google` |

---

## 2. Customer (Shop) Features

| Feature | Description | Endpoint |
| --- | --- | --- |
| Browse catalog | Grid of product tiles with image, title, price, sale price, and rating. | `GET /api/shop/products/get` |
| Filter products | By category and brand. | `GET /api/shop/products/get` |
| Sort products | Price (low→high, high→low) and title (A→Z, Z→A). | `GET /api/shop/products/get` |
| Product details | Full description, gallery image, price/sale price, stock, and reviews. | `GET /api/shop/products/get/:id` |
| Featured carousel | Rotating promotional image carousel on the home page. | `GET /api/common/feature/get` |
| Product variants | Size/color variants per product. | `GET /api/shop/variants/get/:productId` |
| Recently viewed | Track and display recently viewed products (max 20). | `GET /api/shop/recently-viewed/get/:userId` |
| Category browsing | Shop by category with dedicated category nav. | `GET /api/shop/categories/get` |
| Brand browsing | Shop by brand with dedicated brand nav. | `GET /api/shop/brands/get` |

---

## 3. Shopping Cart

Persisted per-user cart stored in MongoDB. Supports guest checkout via `guestId`.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add to cart | Add a product (quantity ≥ 1) to the user's cart. Supports variant selection. | `POST /api/shop/cart/add` |
| View cart | Fetch all items for a user, enriched with live product data. | `GET /api/shop/cart/get/:userId` |
| Update quantity | Increment/decrement quantity in the cart. | `PUT /api/shop/cart/update-cart` |
| Remove item | Delete a single product from the cart. | `DELETE /api/shop/cart/:userId/:productId` |
| Reorder | Add all items from a past order back to cart. | `POST /api/shop/reorder` |

---

## 4. Checkout & Payments

Checkout supports two payment methods: **PayPal** and **Stripe (cards)**, both billed in **INR**.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Create order (PayPal) | Creates a PayPal payment (INR) from the cart items. | `POST /api/shop/order/create` |
| Capture payment (PayPal) | Confirms the payment, marks order `paid`/`confirmed`, decrements stock, clears cart, emails invoice. | `POST /api/shop/order/capture` |
| Create order (Stripe) | Creates a Stripe Checkout Session. | `POST /api/shop/order/create-stripe` |
| Stripe return | Verifies session, confirms order, decrements stock, emails invoice. | `GET /api/shop/order/stripe-return/:orderId/:sessionId` |
| PayPal cancel | Handles cancelled PayPal payments. | `/shop/paypal-cancel` |

---

## 5. Orders

| Feature | Description | Endpoint |
| --- | --- | --- |
| User order list | All orders placed by a specific user (most recent first). | `GET /api/shop/order/list/:userId` |
| User order details | Full breakdown of a single order. | `GET /api/shop/order/details/:id` |
| Admin order list | All orders across all users (paginated). | `GET /api/admin/orders/get` |
| Admin order details | Single order view for the admin. | `GET /api/admin/orders/details/:id` |
| Update order status | Admin can move orders through statuses with tracking number/URL. | `PUT /api/admin/orders/update/:id` |
| Order tracking | Visual tracking timeline with status history. | `GET /api/shop/tracking/:id` |
| Order cancellation | User can cancel paid/unshipped orders with auto-refund. | `POST /api/shop/order/cancel/:id` |
| Returns | User can request returns within 30 days of delivery. | `POST /api/shop/returns/request/:id` |
| Refunded orders | Admin can view all refunded orders. | `GET /api/admin/orders/refunds` |

---

## 6. Address Book

Stores multiple shipping addresses per user with default address support.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add address | Address, city, pincode, phone, optional notes. | `POST /api/shop/address/add` |
| List addresses | All addresses for a user. | `GET /api/shop/address/get/:userId` |
| Edit address | Update an existing address. | `PUT /api/shop/address/update/:userId/:addressId` |
| Delete address | Remove an address. | `DELETE /api/shop/address/delete/:userId/:addressId` |
| Default address | Mark an address as default. | (via `isDefault` field) |

---

## 7. Product Reviews

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add review | Post a rating (1–5) and message for a product. | `POST /api/shop/review/add` |
| List reviews | All reviews for a product. | `GET /api/shop/review/:productId` |
| Average rating | Product-level `averageReview` is maintained. | (computed from reviews) |
| Review moderation | Admin can list, approve, reject, and delete reviews. | `GET/DELETE /api/admin/reviews/*`, `PUT /api/admin/reviews/status/:id` |
| Review status | Reviews have a `status` field: `pending` (default), `approved`, `rejected`. | (via `status` field) |

---

## 8. Search

| Feature | Description | Endpoint |
| --- | --- | --- |
| Keyword search | Searches product title, description, category, and brand via regex. | `GET /api/shop/search/:keyword` |

---

## 9. Wishlist

Server-side persisted wishlist per user.

| Feature | Description | Endpoint |
| --- | --- | --- |
| Add to wishlist | Save a product to wishlist. | `POST /api/shop/wishlist/add` |
| Remove from wishlist | Remove a product from wishlist. | `DELETE /api/shop/wishlist/:userId/:productId` |
| Get wishlist | List all wishlisted products. | `GET /api/shop/wishlist/get/:userId` |
| Check wishlist | Check if a product is wishlisted. | `GET /api/shop/wishlist/check/:userId/:productId` |

---

## 10. Admin Panel

Accessible at `/admin/*` for users with the `admin` role. All admin pages are code-split via `React.lazy` for optimal bundle size.

### 10.1 Dashboard & Analytics

| Feature | Description | Endpoint |
| --- | --- | --- |
| Analytics dashboard | KPIs: today/month revenue, avg order value, orders by status, revenue change %. | `GET /api/admin/analytics/stats` |
| Revenue chart | Daily revenue for configurable period (7/30/90/365 days). | `GET /api/admin/analytics/revenue` |
| Revenue by category | Revenue breakdown by product category. | `GET /api/admin/analytics/revenue-by-category` |
| Revenue by brand | Revenue breakdown by product brand. | `GET /api/admin/analytics/revenue-by-brand` |
| Top products | Best-selling products by quantity and revenue. | `GET /api/admin/analytics/top-products` |
| Coupon performance | Discount usage and revenue per coupon code. | `GET /api/admin/analytics/coupon-performance` |
| Quick actions | Links to pending orders, returns, low stock, support tickets. | (from stats) |

### 10.2 Product & Catalog Management

| Feature | Description | Endpoint |
| --- | --- | --- |
| Product CRUD | Add, edit, delete products with Cloudinary image upload. | `POST/PUT/DELETE /api/admin/products/*` |
| Category management | Full CRUD for product categories (name, slug, description, sortOrder). | `POST/PUT/DELETE /api/admin/categories/*` |
| Brand management | Full CRUD for brands (name, slug, logo, description, sortOrder). | `POST/PUT/DELETE /api/admin/brands/*` |
| Product variants | Create, edit, delete size/color/SKU variants per product. | `POST/PUT/DELETE /api/admin/variants/*` |
| Inventory overview | View stock levels across all products with variant stock. | `GET /api/admin/inventory/get` |
| Stock editing | Inline single-item stock updates. | `PUT /api/admin/inventory/update/:id` |
| Bulk stock update | Bulk update stock for multiple products. | `POST /api/admin/inventory/bulk-update` |
| Low stock filter | Filter products with stock ≤ 10. | `GET /api/admin/inventory/get?lowStock=true` |

### 10.3 Order Management

| Feature | Description | Endpoint |
| --- | --- | --- |
| Order list | All orders across users (paginated, filterable). | `GET /api/admin/orders/get` |
| Order details | Full order breakdown with status history. | `GET /api/admin/orders/details/:id` |
| Update status | Move order through: pending → confirmed → shipped → delivered → cancelled. | `PUT /api/admin/orders/update/:id` |
| Tracking info | Add tracking number and URL when shipping. | (via update status body) |
| Status history | Every status change is logged with timestamp and note. | (via `statusHistory` array) |
| Process refund | Refund via Stripe/PayPal with reason. | `POST /api/admin/orders/refund/:id` |
| Refunded orders | View all orders with refund status. | `GET /api/admin/orders/refunds` |

### 10.4 Customer & User Management

| Feature | Description | Endpoint |
| --- | --- | --- |
| Customer list | Paginated list of customers with order count and total spent. | `GET /api/admin/analytics/customers` |
| Customer details | Full profile with orders, wishlist, loyalty points. | `GET /api/admin/analytics/customers/:id` |
| Block/unblock | Toggle user role between `user` and `blocked`. | `PUT /api/admin/analytics/customers/block/:id` |
| **User management** | **Full CRUD on all users (admin, user, blocked).** | `GET/POST/PUT/DELETE /api/admin/users/*` |
| **List all users** | **Paginated, searchable, filterable by role.** | `GET /api/admin/users/get` |
| **Create user** | **Admin can create new user or admin accounts.** | `POST /api/admin/users/add` |
| **Edit user** | **Update username, email, phone, role.** | `PUT /api/admin/users/update/:id` |
| **Delete user** | **Delete any user (cannot delete self).** | `DELETE /api/admin/users/delete/:id` |
| **Toggle block** | **Toggle user role between `user` and `blocked`.** | `PUT /api/admin/users/toggle-block/:id` |
| CSV export | Export customers as CSV. | `GET /api/admin/export/customers` |

### 10.5 Review Moderation

| Feature | Description | Endpoint |
| --- | --- | --- |
| Review list | All reviews across all products (paginated). | `GET /api/admin/reviews/get` |
| Filter by status | Filter reviews by: All, Pending, Approved, Rejected. | (client-side filter) |
| **Approve review** | **Set review status to `approved`.** | `PUT /api/admin/reviews/status/:id` |
| **Reject review** | **Set review status to `rejected`.** | `PUT /api/admin/reviews/status/:id` |
| Delete review | Permanently delete a review. | `DELETE /api/admin/reviews/delete/:id` |

### 10.6 Coupons & Discounts

| Feature | Description | Endpoint |
| --- | --- | --- |
| Create coupon | Admin creates a coupon (code, type, value, min-cart, expiry, usage limit). | `POST /api/admin/coupons/add` |
| List coupons | Admin lists all coupons. | `GET /api/admin/coupons/get` |
| Edit coupon | Admin edits a coupon. | `PUT /api/admin/coupons/edit/:id` |
| Toggle active | Enable/disable a coupon. | `PUT /api/admin/coupons/toggle/:id` |
| Delete coupon | Remove a coupon. | `DELETE /api/admin/coupons/delete/:id` |

### 10.7 Support, FAQ & Policies

| Feature | Description | Endpoint |
| --- | --- | --- |
| Support tickets | View all tickets, filter by status, reply to threads. | `GET/PUT/POST /api/admin/support/*` |
| Update ticket status | Set ticket to: open, in_progress, resolved, closed. | `PUT /api/admin/support/status/:id` |
| Admin reply | Reply to a support ticket (adds to thread). | `POST /api/admin/support/reply/:id` |
| FAQ management | Full CRUD for FAQ entries (question, answer, category, sortOrder). | `POST/PUT/DELETE /api/admin/faq/*` |
| FAQ edit UI | Inline edit with pre-filled form. | (via admin FAQ page) |
| Policy management | Full CRUD for policy pages (slug, title, content). | `POST/PUT/DELETE /api/admin/policies/*` |
| Policy edit UI | Inline edit with pre-filled form. | (via admin policies page) |

### 10.8 Audit Log

| Feature | Description | Endpoint |
| --- | --- | --- |
| Audit log viewer | Paginated list of all admin actions with timestamps. | `GET /api/admin/audit/get` |
| **Active logging** | **All critical operations are logged automatically.** | (fire-and-forget) |

Logged operations:

| Action | Entity | When |
| --- | --- | --- |
| `CREATE_PRODUCT` | Product | Product created |
| `UPDATE_PRODUCT` | Product | Product edited |
| `DELETE_PRODUCT` | Product | Product deleted |
| `CREATE_COUPON` | Coupon | Coupon created |
| `UPDATE_COUPON` | Coupon | Coupon edited |
| `DELETE_COUPON` | Coupon | Coupon deleted |
| `UPDATE_ORDER_STATUS` | Order | Order status changed |
| `REFUND_ORDER` | Order | Refund processed |
| `CREATE_CATEGORY` | Category | Category created |
| `UPDATE_CATEGORY` | Category | Category edited |
| `DELETE_CATEGORY` | Category | Category deleted |
| `CREATE_BRAND` | Brand | Brand created |
| `UPDATE_BRAND` | Brand | Brand edited |
| `DELETE_BRAND` | Brand | Brand deleted |
| `APPROVE_RETURN` | Order | Return approved |
| `REJECT_RETURN` | Order | Return rejected |
| `UPDATE_TICKET_STATUS` | SupportTicket | Ticket status changed |

### 10.9 CSV Exports

| Feature | Description | Endpoint |
| --- | --- | --- |
| Export orders | Download all orders as CSV. | `GET /api/admin/export/orders` |
| Export products | Download all products as CSV. | `GET /api/admin/export/products` |
| Export customers | Download all customers as CSV. | `GET /api/admin/export/customers` |

### 10.10 Returns

| Feature | Description | Endpoint |
| --- | --- | --- |
| Return requests | View all return requests with filters. | `GET /api/admin/returns/get` |
| Approve return | Approve and restore stock automatically. | `PUT /api/admin/returns/process/:id` |
| Reject return | Reject the return request. | `PUT /api/admin/returns/process/:id` |

---

## 11. Cross-Cutting Features

- **Responsive UI** — Tailwind CSS with a custom luxury theme, Radix UI primitives, Lucide icons.
- **Global state** — Redux Toolkit slices for auth, products, cart, address, orders, search, reviews, features, wishlist, recently viewed, notifications, loyalty, support, FAQ, policy, user management.
- **Role-based navigation** — Separate layouts for `shopping-view`, `admin-view`, and `auth`.
- **Toast notifications** — Feedback for cart/order/auth/admin actions.
- **Loading skeletons** — Placeholders while data loads.
- **Error / guard pages** — 404 `Not Found` and `Unauthorized` pages.
- **Code-splitting** — All admin and secondary pages are lazy-loaded via `React.lazy` for optimal bundle size (~905 KB core, each admin page 3–11 KB).
- **Audit logging** — All critical admin operations log to `AuditLog` collection with user, action, entity, entity ID, details, and IP address.

---

## 12. Coupons & Discounts

| Feature | Description | Endpoint |
| --- | --- | --- |
| Create coupon | Admin creates a coupon (code, type, value, min-cart, expiry, usage limit). | `POST /api/admin/coupons/add` |
| List coupons | Admin lists all coupons. | `GET /api/admin/coupons/get` |
| Edit coupon | Admin edits a coupon. | `PUT /api/admin/coupons/edit/:id` |
| Toggle / delete coupon | Admin toggles active state or deletes a coupon. | `PUT /api/admin/coupons/toggle/:id`, `DELETE /api/admin/coupons/delete/:id` |
| Validate coupon | Customer applies a coupon code at checkout. | `POST /api/shop/coupon/validate` |

---

## 13. Tax, Shipping & Invoices

- **Order pricing breakdown** — orders store `subtotalAmount`, `shippingAmount`, `taxAmount`, `discountAmount`, and `totalAmount`.
- **Shipping** — flat-rate shipping applied when configured.
- **GST** — tax computed from env var, labelled GST on order details and invoices.
- **Invoice email** — every confirmed order sends an HTML receipt via SMTP.

---

## 14. Refunds & Cancellation

| Feature | Description | Endpoint |
| --- | --- | --- |
| Request cancellation | User cancels a paid/unshipped order; server issues refund, restores stock. | `POST /api/shop/order/cancel/:id` |
| Refund order | Admin initiates/records a refund. | `POST /api/admin/orders/refund/:id` |
| Refund listing | Admin lists orders with refunds. | `GET /api/admin/orders/refunds` |
| Return request | User requests return within 30 days of delivery. | `POST /api/shop/returns/request/:id` |
| Process return | Admin approves (restores stock) or rejects return. | `PUT /api/admin/returns/process/:id` |

---

## 15. Platform Hardening (Phase 0)

- **Centralized secrets** — JWT secret read from `JWT_SECRET` env (no hardcoded values).
- **Server-side role enforcement** — `authMiddleware` + `adminMiddleware` on all admin/feature routes.
- **Security headers** — Helmet enabled.
- **Rate limiting** — `express-rate-limit` on `/api`.
- **Configurable CORS** — origins from `CORS_ORIGIN`.
- **Pagination** — Shop products, admin products, admin orders accept `page` & `limit`.
- **Deployment** — `.env.example` documents every environment variable.

---

## 16. Account & Auth (Phase 2)

| Feature | Description | Endpoint |
| --- | --- | --- |
| Forgot password | Sends a password reset email with a secure token (30 min expiry). | `POST /api/auth/forgot-password` |
| Reset password | Resets password using the token from email. | `POST /api/auth/reset-password` |
| Email verification | Sends a verification email with a secure token (24 hr expiry). | `POST /api/auth/send-verification/:userId` |
| Verify email | Confirms email address using the token. | `POST /api/auth/verify-email` |
| Profile editing | Update username, phone, and avatar URL. | `PUT /api/auth/update-profile` |
| Google OAuth | Login/register via Google authentication. | `POST /api/auth/google` |
| Default address | Mark an address as default (field on Address model). | (via `isDefault` field) |
| Guest checkout | Cart supports `guestId` for non-authenticated users. | (via `guestId` field on Cart) |
| Persisted wishlist | Server-side wishlist per user (DB-backed). | See [Wishlist](#9-wishlist) |
| Reorder | Add all items from a past order back to cart. | `POST /api/shop/reorder` |

---

## 17. Notifications (Phase 3)

| Feature | Description | Endpoint |
| --- | --- | --- |
| In-app notifications | Per-user notifications with read/unread status. | `GET /api/shop/notifications/get/:userId` |
| Mark as read | Mark a single notification as read. | `PUT /api/shop/notifications/read/:id` |
| Mark all as read | Mark all notifications as read. | `PUT /api/shop/notifications/read-all/:userId` |
| Delete notification | Remove a notification. | `DELETE /api/shop/notifications/:id` |
| Notification types | Order, promotion, system, and support notification types. | (via `type` field) |
| Unread badge | Shows unread count in the header. | (computed from notifications) |

---

## 18. Admin Analytics & Operations (Phase 4)

| Feature | Description | Endpoint |
| --- | --- | --- |
| Dashboard stats | Total revenue, orders, products, customers, low stock, pending orders/returns, unread tickets, abandoned carts, recent activity. | `GET /api/admin/analytics/stats` |
| Revenue chart | Daily revenue for configurable period with period filter (7/30/90/365d). | `GET /api/admin/analytics/revenue` |
| Revenue by category | Revenue breakdown by product category. | `GET /api/admin/analytics/revenue-by-category` |
| Revenue by brand | Revenue breakdown by product brand. | `GET /api/admin/analytics/revenue-by-brand` |
| Top products | Best-selling products by quantity and revenue. | `GET /api/admin/analytics/top-products` |
| Coupon performance | Discount usage and revenue per coupon code. | `GET /api/admin/analytics/coupon-performance` |
| Customer management | Paginated list with order count, total spent, block/unblock. | `GET /api/admin/analytics/customers` |
| **User management** | **Full CRUD on all users (admin, user, blocked) with search and role filter.** | `GET/POST/PUT/DELETE /api/admin/users/*` |
| Review moderation | List, filter by status (pending/approved/rejected), approve, reject, delete. | `GET/PUT/DELETE /api/admin/reviews/*` |
| Support ticket mgmt | View, filter, update status, reply to tickets. | `GET/PUT/POST /api/admin/support/*` |
| FAQ management | CRUD with inline edit UI. | `POST/PUT/DELETE /api/admin/faq/*` |
| Policy management | CRUD with inline edit UI. | `POST/PUT/DELETE /api/admin/policies/*` |
| Audit log | Active logging of 16+ admin operations with user, action, entity, details, IP. | `GET /api/admin/audit/get` |
| Product variants | Manage size/color/SKU variants per product. | `POST/PUT/DELETE /api/admin/variants/*` |
| Category management | Full CRUD for product categories. | `POST/PUT/DELETE /api/admin/categories/*` |
| Brand management | Full CRUD for brands. | `POST/PUT/DELETE /api/admin/brands/*` |
| Inventory | View/edit stock levels with low-stock filter and bulk update. | `GET/PUT/POST /api/admin/inventory/*` |
| Returns | View/approve/reject return requests with auto stock restore. | `GET/PUT /api/admin/returns/*` |
| CSV exports | Export orders, products, customers as CSV. | `GET /api/admin/export/orders|products|customers` |

---

## 19. Trust & Support (Phase 5)

| Feature | Description | Endpoint |
| --- | --- | --- |
| FAQ / Help center | Customer-facing FAQ page with accordion UI. | `GET /api/shop/faq` |
| Support tickets | Customers create and reply to support tickets. | `POST /api/shop/support/create`, `GET /api/shop/support/user/:userId` |
| Ticket replies | Threaded replies between customer and admin. | `POST /api/shop/support/:id/reply` |
| Close ticket | Customer or admin can close a ticket. | `PUT /api/shop/support/:id/close` |
| Editable policies | Admin manages policy pages (privacy, terms, shipping, returns). | `GET /api/shop/policies/:slug` |

---

## 20. Engagement & Catalog Depth (Phase 6)

| Feature | Description | Endpoint |
| --- | --- | --- |
| Loyalty points | Earn 1 point per ₹1 spent; redeem at checkout. | `GET /api/shop/loyalty/get/:userId`, `POST /api/shop/loyalty/redeem` |
| Recently viewed | Track last 20 viewed products per user. | `GET /api/shop/recently-viewed/get/:userId` |
| Product variants | Size/color/SKU variants with per-variant stock and pricing. | `GET /api/shop/variants/get/:productId` |
| Order tracking | Visual timeline with status history. | `GET /api/shop/tracking/:id` |
| Returns/exchange | Request returns within 30 days of delivery. | `POST /api/shop/returns/request/:id` |
| Profile editing | Update username, phone, avatar. | `PUT /api/auth/update-profile` |
| Email verification | Verify email with secure token. | `POST /api/auth/verify-email` |
| Guest checkout | Cart supports guest users. | (via `guestId` field) |
