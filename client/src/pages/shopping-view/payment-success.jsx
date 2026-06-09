import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-luxury-gold" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-luxury-charcoal">
          Payment Successful
        </h1>
        <p className="text-sm text-luxury-taupe leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/shop/account")}
            className="bg-luxury-charcoal hover:bg-luxury-brown text-luxury-ivory uppercase tracking-wider"
          >
            View Orders
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/shop/home")}
            className="border-luxury-charcoal text-luxury-charcoal uppercase tracking-wider"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
