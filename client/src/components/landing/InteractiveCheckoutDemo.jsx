import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { VALID_COUPONS } from "./data";

const INITIAL_CART = [
  {
    id: "c1",
    title: "Double-Breasted Wool Atelier Suit",
    brand: "Raymond Atelier",
    price: 18999,
    quantity: 1,
    size: "40R",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=85",
  },
  {
    id: "c2",
    title: "Pinpoint Oxford Formal Shirt",
    brand: "Louis Philippe",
    price: 3999,
    quantity: 1,
    size: "M / 39",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=85",
  },
];

function InteractiveCheckoutDemo() {
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [couponCodeInput, setCouponCodeInput] = useState("ATELIER20");
  const [appliedCoupon, setAppliedCoupon] = useState(VALID_COUPONS[0]);
  const [couponMessage, setCouponMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [simulatedCheckout, setSimulatedCheckout] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minCart) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shipping = 0; // Free pan-India shipping
  const gstAmount = Math.round(((subtotal - discountAmount) * 18) / 118); // 18% inclusive GST
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    const foundCoupon = VALID_COUPONS.find((c) => c.code === code);

    if (!foundCoupon) {
      setCouponMessage({
        type: "error",
        text: `Invalid coupon "${code}". Try ATELIER20 or FESTIVE15.`,
      });
      return;
    }

    if (subtotal < foundCoupon.minCart) {
      setCouponMessage({
        type: "error",
        text: `Minimum cart value of ₹${foundCoupon.minCart.toLocaleString(
          "en-IN"
        )} required for ${code}.`,
      });
      return;
    }

    setAppliedCoupon(foundCoupon);
    setCouponCodeInput(foundCoupon.code);
    setCouponMessage({
      type: "success",
      text: `Coupon ${foundCoupon.code} applied! ${foundCoupon.description}`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponMessage(null);
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleSimulatePayment = () => {
    setSimulatedCheckout(true);
    setTimeout(() => {
      setSimulatedCheckout(false);
    }, 2400);
  };

  return (
    <section
      id="checkout-demo"
      className="py-20 sm:py-28 bg-surface border-y border-border"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <SectionHeader
          number="03"
          eyebrow="Checkout & Coupon Engine"
          title="Transparent INR pricing with zero hidden surcharges."
          description="Test our live coupon engine, adjust bag quantities, and inspect how every rupee (subtotal, discount, GST, shipping) is calculated transparently before commitment."
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left: Interactive Bag & Delivery Address Mock */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Bag Items Card */}
            <div className="bg-surface-raised border border-border p-4 sm:p-6 shadow-1">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
                <h3 className="font-serif text-base sm:text-lg text-espresso font-medium">
                  Review Bag Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </h3>
                <span className="text-[10px] sm:text-xs text-muted uppercase tracking-[0.14em]">
                  Live Synchronized
                </span>
              </div>

              <div className="divide-y divide-border/80">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 sm:py-4.5 flex items-center gap-3 sm:gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-18 sm:w-16 sm:h-20 object-cover bg-beige/40 shrink-0 border border-border"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="overline text-accent text-[9px] sm:text-[10px]">
                        {item.brand}
                      </p>
                      <h4 className="font-serif text-xs sm:text-base text-espresso font-medium truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                        Size: {item.size} · In Stock
                      </p>
                      <p className="font-serif text-xs sm:text-sm text-accent font-semibold mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border bg-surface shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-muted hover:text-espresso active:bg-beige"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 sm:w-7 text-center text-xs font-semibold text-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-muted hover:text-espresso active:bg-beige"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Test Coupon Pills */}
            <div className="bg-surface-raised border border-border p-4 sm:p-5 shadow-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-espresso mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Tap a Coupon Code to Test the Engine:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {VALID_COUPONS.map((cp) => (
                  <button
                    key={cp.code}
                    onClick={() => handleApplyCoupon(cp.code)}
                    className={`p-3 text-xs border text-left transition-all active:scale-98 ${
                      appliedCoupon?.code === cp.code
                        ? "border-accent bg-accent/10 text-espresso font-semibold shadow-xs"
                        : "border-border bg-surface hover:border-accent/60 text-brown"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-accent">
                        {cp.code}
                      </span>
                      {appliedCoupon?.code === cp.code && (
                        <Check className="w-3.5 h-3.5 text-sage" />
                      )}
                    </div>
                    <span className="block text-[11px] text-muted mt-1 leading-snug">
                      {cp.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Address Card */}
            <div className="bg-surface-raised border border-border p-4 sm:p-5 shadow-1 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-espresso">
                    Verified Express Shipping (Pan-India)
                  </p>
                  <p className="text-muted mt-0.5">
                    Colaba, South Mumbai, Maharashtra — 400005
                  </p>
                  <p className="text-sage font-medium mt-1">
                    Estimated Delivery: 2 Business Days via Tracked Express
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.1em] font-semibold text-sage border border-sage/30 px-2.5 py-1 bg-sage/10 shrink-0">
                Free
              </span>
            </div>
          </div>

          {/* Right: Live Itemized Checkout Receipt Card */}
          <div className="lg:col-span-5 bg-surface-raised border border-border p-5 sm:p-7 shadow-2 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
              <h3 className="font-serif text-lg sm:text-xl text-espresso font-medium">
                Itemized Summary
              </h3>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-muted font-medium">
                Currency: INR (₹)
              </span>
            </div>

            {/* Coupon Application Box */}
            <div className="py-4 sm:py-5 border-b border-border">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-sage/10 border border-sage/30 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sage shrink-0" />
                    <div>
                      <span className="text-xs font-mono font-bold text-espresso">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-sage block font-medium">
                        {appliedCoupon.description}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-muted hover:text-danger p-1 active:scale-95"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value)}
                      placeholder="Enter promo code"
                      className="w-full h-11 pl-9 pr-3 uppercase bg-surface border border-border text-xs text-espresso focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="h-11 px-4 bg-espresso text-ivory text-xs uppercase tracking-[0.14em] font-semibold hover:bg-gold hover:text-espresso active:scale-95 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponMessage && (
                <p
                  className={`text-xs mt-2 font-medium ${
                    couponMessage.type === "success"
                      ? "text-sage"
                      : "text-danger"
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Line Items */}
            <div className="py-4 sm:py-5 space-y-3 text-xs sm:text-sm border-b border-border">
              <div className="flex justify-between text-muted">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="text-espresso font-medium">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sage font-medium">
                  <span className="flex items-center gap-1.5">
                    <span>Discount ({appliedCoupon?.code})</span>
                  </span>
                  <span>−₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>Pan-India Tracked Express Shipping</span>
                <span className="text-sage font-semibold uppercase tracking-[0.1em]">
                  Free
                </span>
              </div>

              <div className="flex justify-between text-muted text-[11px]">
                <span>Applicable GST (18% inclusive)</span>
                <span>₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 sm:pt-5 pb-5 sm:pb-6 flex items-baseline justify-between">
              <div>
                <span className="overline text-espresso font-bold">
                  Total Payable
                </span>
                <p className="text-[10px] text-muted mt-0.5">
                  Billed directly in Indian Rupees (INR)
                </p>
              </div>
              <span className="font-serif text-2xl sm:text-3xl text-accent font-semibold">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-3 pt-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-espresso">
                Select Payment Gateway:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod("stripe")}
                  className={`p-3 text-left border transition-all active:scale-98 ${
                    paymentMethod === "stripe"
                      ? "border-accent bg-accent/10 font-semibold"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  <p className="text-xs text-espresso font-medium">
                    Cards &amp; UPI
                  </p>
                  <p className="text-[10px] text-taupe mt-0.5">
                    Stripe Hosted INR
                  </p>
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`p-3 text-left border transition-all active:scale-98 ${
                    paymentMethod === "paypal"
                      ? "border-accent bg-accent/10 font-semibold"
                      : "border-border bg-surface text-muted"
                  }`}
                >
                  <p className="text-xs text-espresso font-medium">PayPal INR</p>
                  <p className="text-[10px] text-taupe mt-0.5">
                    Direct INR Balance
                  </p>
                </button>
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={simulatedCheckout}
                className="w-full min-h-[48px] py-3.5 sm:py-4 bg-espresso text-ivory text-xs uppercase tracking-[0.18em] font-semibold hover:bg-gold hover:text-espresso transition-all duration-base shadow-2 flex items-center justify-center gap-2 mt-4 active:scale-98"
              >
                {simulatedCheckout ? (
                  <>
                    <Check className="w-4 h-4 text-gold animate-bounce" />
                    <span>Authorizing ₹{finalTotal.toLocaleString("en-IN")}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-gold" />
                    <span>Proceed to Secure Checkout</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-taupe">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sage" /> 256-bit SSL
              </span>
              <span>Automated Refund Policy</span>
              <span>100% Tax Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveCheckoutDemo;
