import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { captureStripePayment } from "@/store/shop/order-slice";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [status, setStatus] = useState("loading");
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (orderId && sessionId) {
      dispatch(captureStripePayment({ orderId, sessionId }))
        .unwrap()
        .then((data) => {
          if (data.success) {
            sessionStorage.removeItem("currentOrderId");
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("success");
    }
  }, [orderId, sessionId, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
          <p className="font-serif text-xl text-foreground">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            status === "success"
              ? "bg-accent/10"
              : "bg-destructive/10"
          }`}
        >
          {status === "success" ? (
            <CheckCircle className="w-8 h-8 text-accent" />
          ) : (
            <XCircle className="w-8 h-8 text-destructive" />
          )}
        </div>
        <h1 className="display-md text-foreground">
          {status === "success" ? "Payment Successful" : "Payment Confirmation Failed"}
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          {status === "success"
            ? "Thank you for your purchase. Your order has been confirmed and will be shipped shortly."
            : "We could not confirm your payment. Please check your orders or contact support."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/shop/account")} className="uppercase">
            View Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/home")}
            className="uppercase"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
