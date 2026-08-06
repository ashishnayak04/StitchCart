import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-accent" />
        </div>
        <h1 className="display-md text-foreground">Payment Successful</h1>
        <p className="text-sm text-muted leading-relaxed">
          Thank you for your purchase. Your order has been confirmed and will be shipped shortly.
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
