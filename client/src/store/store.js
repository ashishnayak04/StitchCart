import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminCouponSlice from "./admin/coupons-slice";
import adminAnalyticsSlice from "./admin/analytics-slice";
import reviewModerationSlice from "./admin/review-moderation-slice";
import supportAdminSlice from "./admin/support-admin-slice";
import faqAdminSlice from "./admin/faq-admin-slice";
import auditSlice from "./admin/audit-slice";
import categorySlice from "./admin/category-slice";
import brandSlice from "./admin/brand-slice";
import inventorySlice from "./admin/inventory-slice";
import returnAdminSlice from "./admin/return-admin-slice";
import userManagementSlice from "./admin/user-management-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shopCouponSlice from "./shop/coupon-slice";
import commonFeatureSlice from "./common-slice";
import wishlistSlice from "./shop/wishlist-slice";
import recentlyViewedSlice from "./shop/recently-viewed-slice";
import notificationSlice from "./shop/notification-slice";
import loyaltySlice from "./shop/loyalty-slice";
import supportSlice from "./shop/support-slice";
import faqSlice from "./shop/faq-slice";
import policySlice from "./shop/policy-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminCoupon: adminCouponSlice,
    adminAnalytics: adminAnalyticsSlice,
    reviewModeration: reviewModerationSlice,
    supportAdmin: supportAdminSlice,
    faqAdmin: faqAdminSlice,
    audit: auditSlice,
    adminCategory: categorySlice,
    adminBrand: brandSlice,
    adminInventory: inventorySlice,
    adminReturn: returnAdminSlice,
    adminUserManagement: userManagementSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopCoupon: shopCouponSlice,
    commonFeature: commonFeatureSlice,
    wishlist: wishlistSlice,
    recentlyViewed: recentlyViewedSlice,
    notifications: notificationSlice,
    loyalty: loyaltySlice,
    support: supportSlice,
    faq: faqSlice,
    policy: policySlice,
  },
});

export default store;
