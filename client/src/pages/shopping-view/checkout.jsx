import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Shield, Truck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
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

  function handleInitiatePaypalPayment() {
    if (!cartItems?.items?.length) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({ title: "Please select an address to proceed.", variant: "destructive" });
      return;
    }

    const orderData = {
      userId: user?.id,
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
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
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

            <div className="border-t border-border pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>${totalCartAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-muted">
                <span>Shipping</span>
                <span className="text-accent">Free</span>
              </div>
              <div className="flex justify-between font-serif text-xl font-semibold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span>${totalCartAmount}</span>
              </div>
            </div>

            <Button
              onClick={handleInitiatePaypalPayment}
              className="w-full uppercase mb-4"
              size="lg"
            >
              {isPaymentStart
                ? "Processing..."
                : "Checkout with PayPal"}
            </Button>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted">
                <Shield className="w-4 h-4" />
                Secure checkout with PayPal
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
