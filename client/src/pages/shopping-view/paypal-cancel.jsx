import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaypalCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Your PayPal payment was cancelled. No charges were made to your account.
        You can return to your cart to try again.
      </p>
      <div className="flex gap-3">
        <Link
          to="/shop/checkout"
          className="bg-black text-white px-6 py-2 rounded-md text-sm hover:bg-gray-800 transition"
        >
          Return to Checkout
        </Link>
        <Link
          to="/shop/listing"
          className="border border-gray-300 px-6 py-2 rounded-md text-sm hover:bg-gray-50 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
