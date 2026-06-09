import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-luxury-ivory">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-serif text-8xl font-bold text-luxury-gold">404</h1>
        <h2 className="font-serif text-2xl text-luxury-charcoal">
          Page Not Found
        </h2>
        <p className="text-sm text-luxury-taupe">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          asChild
          className="bg-luxury-charcoal hover:bg-luxury-brown text-luxury-ivory uppercase tracking-wider"
        >
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
