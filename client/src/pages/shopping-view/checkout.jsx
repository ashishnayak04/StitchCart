import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createNewOrder, createStripeOrder } from "@/store/shop/order-slice";
import { validateCoupon, resetCoupon } from "@/store/shop/coupon-slice";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Truck, ArrowLeft, Tag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL, checkoutURL, isLoading } = useSelector(
    (state) => state.shopOrder
  );
  const { appliedCoupon } = useSelector((state) => state.shopCoupon);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subtotalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const discountAmount = appliedCoupon
    ? Math.min(appliedCoupon.discountAmount, subtotalAmount)
    : 0;

  const shippingAmount = 0;
  const taxAmount = 0;
  const totalAmount = subtotalAmount - discountAmount + shippingAmount + taxAmount;

  function buildOrderData() {
    return {
      userId: user?.id,
      email: user?.email,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      couponCode: appliedCoupon?.code || undefined,
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };
  }

  function handleApplyCoupon() {
    if (!couponCode.trim()) {
      toast({ title: "Please enter a coupon code", variant: "destructive" });
      return;
    }
    dispatch(validateCoupon({ code: couponCode, cartAmount: subtotalAmount }))
      .unwrap()
      .then((data) => {
        if (data.success) {
          toast({ title: `Coupon ${data.data.code} applied` });
        } else {
          toast({ title: data.message || "Invalid coupon", variant: "destructive" });
        }
      })
      .catch(() => {
        toast({ title: "Invalid coupon code", variant: "destructive" });
      });
  }

  function handleRemoveCoupon() {
    dispatch(resetCoupon());
    setCouponCode("");
  }

  function handleInitiatePayment() {
    if (!cartItems?.items?.length) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({ title: "Please select an address to proceed.", variant: "destructive" });
      return;
    }

    setIsPaymemntStart(true);
    const orderData = buildOrderData();

    const action = paymentMethod === "paypal" ? createNewOrder : createStripeOrder;

    dispatch(action(orderData)).then((data) => {
      if (data?.payload?.success) {
        if (paymentMethod === "paypal") {
          setIsPaymemntStart(false);
        }
      } else {
        setIsPaymemntStart(false);
        toast({ title: "Payment failed. Please try again.", variant: "destructive" });
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  if (checkoutURL) {
    window.location.href = checkoutURL;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="display-md text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left - Shipping & Cart */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping Address */}
          <div className="bg-surface-raised border border-border p-6 shadow-1">
            <h2 className="heading text-foreground mb-6">Shipping Address</h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          {/* Cart Items */}
          <div className="bg-surface-raised border border-border p-6 shadow-1">
            <h2 className="heading text-foreground mb-6">Order Items</h2>
            <div className="divide-y divide-border">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item) => (
                    <UserCartItemsContent key={item._id} cartItem={item} />
                  ))
                : null}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-surface-raised border border-border p-6 shadow-1">
            <h2 className="heading text-foreground mb-6">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`border p-4 text-left transition-all ${
                  paymentMethod === "stripe"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-medium text-foreground">Card (Stripe)</p>
                <p className="text-xs text-muted mt-1">
                  Visa, Mastercard, Amex — secure hosted checkout
                </p>
              </button>
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`border p-4 text-left transition-all ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <p className="font-medium text-foreground">PayPal</p>
                <p className="text-xs text-muted mt-1">
                  Pay with your PayPal balance or linked account
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-surface-raised border border-border p-6 lg:sticky lg:top-24 shadow-1">
            <h2 className="heading text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted truncate mr-4">
                        {item?.title} × {item?.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        $
                        {(
                          (item?.salePrice > 0 ? item?.salePrice : item?.price) *
                          item?.quantity
                        ).toFixed(0)}
                      </span>
                    </div>
                  ))
                : null}
            </div>

            {/* Coupon */}
            <div className="border-t border-border pt-4 mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-accent/10 border border-accent/20 px-3 py-2">
                  <span className="text-sm font-medium text-accent">
                    {appliedCoupon.code} applied (−${appliedCoupon.discountAmount.toFixed(2)})
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-muted hover:text-foreground"
                    aria-label="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="pl-9 uppercase"
                    />
                  </div>
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              )}
            </div>

            <div className="border-t border-border pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>${subtotalAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between text-sm text-accent">
                  <span>Discount</span>
                  <span>−${discountAmount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-semibold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleInitiatePayment}
              disabled={isLoading || isPaymentStart}
              className="w-full uppercase mb-4"
              size="lg"
            >
              {isLoading || isPaymentStart
                ? "Processing..."
                : paymentMethod === "paypal"
                ? "Checkout with PayPal"
                : "Checkout with Card"}
            </Button>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted">
                <Shield className="w-4 h-4" />
                Secure checkout
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <Truck className="w-4 h-4" />
                Free shipping on all orders
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
