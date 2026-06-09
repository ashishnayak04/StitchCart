import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

function UnauthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-luxury-ivory">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-luxury-gold" />
        </div>
        <h1 className="font-serif text-2xl text-luxury-charcoal">
          Access Restricted
        </h1>
        <p className="text-sm text-luxury-taupe">
          You don't have permission to view this page.
        </p>
        <Button
          asChild
          className="bg-luxury-charcoal hover:bg-luxury-brown text-luxury-ivory uppercase tracking-wider"
        >
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default UnauthPage;
