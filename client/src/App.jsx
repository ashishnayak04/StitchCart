import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import Loading from "./components/common/loading";
import Landing from "./pages/landing";

const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminCoupons = lazy(() => import("./pages/admin-view/coupons"));
const AdminAnalytics = lazy(() => import("./pages/admin-view/analytics"));
const AdminCustomers = lazy(() => import("./pages/admin-view/customers"));
const AdminReviews = lazy(() => import("./pages/admin-view/reviews-moderation"));
const AdminSupport = lazy(() => import("./pages/admin-view/support-tickets"));
const AdminFAQ = lazy(() => import("./pages/admin-view/faq-admin"));
const AdminPolicies = lazy(() => import("./pages/admin-view/policies-admin"));
const AdminAudit = lazy(() => import("./pages/admin-view/audit-log"));
const AdminVariants = lazy(() => import("./pages/admin-view/variants"));
const AdminCategories = lazy(() => import("./pages/admin-view/categories"));
const AdminBrands = lazy(() => import("./pages/admin-view/brands"));
const AdminInventory = lazy(() => import("./pages/admin-view/inventory"));
const AdminReturns = lazy(() => import("./pages/admin-view/returns"));
const AdminUsers = lazy(() => import("./pages/admin-view/users"));
const PaypalReturnPage = lazy(() => import("./pages/shopping-view/paypal-return"));
const PaypalCancelPage = lazy(() => import("./pages/shopping-view/paypal-cancel"));
const PaymentSuccessPage = lazy(() => import("./pages/shopping-view/payment-success"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const ShoppingWishlist = lazy(() => import("./pages/shopping-view/wishlist"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot-password"));
const ResetPassword = lazy(() => import("./pages/auth/reset-password"));
const VerifyEmail = lazy(() => import("./pages/auth/verify-email"));
const ShoppingNotifications = lazy(() => import("./pages/shopping-view/notifications"));
const ShoppingSupport = lazy(() => import("./pages/shopping-view/support"));
const ShoppingSupportTicket = lazy(() => import("./pages/shopping-view/support-ticket"));
const ShoppingFAQ = lazy(() => import("./pages/shopping-view/faq"));
const ShoppingPolicy = lazy(() => import("./pages/shopping-view/policy"));
const ShoppingOrderTracking = lazy(() => import("./pages/shopping-view/order-tracking"));
const ShoppingLoyalty = lazy(() => import("./pages/shopping-view/loyalty"));
const ShoppingProfile = lazy(() => import("./pages/shopping-view/profile"));
const ShoppingReturns = lazy(() => import("./pages/shopping-view/returns"));

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <Landing />
              </CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="faq" element={<AdminFAQ />} />
            <Route path="policies" element={<AdminPolicies />} />
            <Route path="audit" element={<AdminAudit />} />
            <Route path="variants" element={<AdminVariants />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="returns" element={<AdminReturns />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          <Route
            path="/shop"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="paypal-return" element={<PaypalReturnPage />} />
            <Route path="paypal-cancel" element={<PaypalCancelPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="wishlist" element={<ShoppingWishlist />} />
            <Route path="notifications" element={<ShoppingNotifications />} />
            <Route path="support" element={<ShoppingSupport />} />
            <Route path="support/:ticketId" element={<ShoppingSupportTicket />} />
            <Route path="faq" element={<ShoppingFAQ />} />
            <Route path="policy/:slug" element={<ShoppingPolicy />} />
            <Route path="order-tracking/:orderId" element={<ShoppingOrderTracking />} />
            <Route path="loyalty" element={<ShoppingLoyalty />} />
            <Route path="profile" element={<ShoppingProfile />} />
            <Route path="returns/:orderId" element={<ShoppingReturns />} />
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
