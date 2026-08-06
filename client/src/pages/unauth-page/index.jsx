import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

function UnauthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-accent" />
        </div>
        <h1 className="heading text-foreground">Access Restricted</h1>
        <p className="text-sm text-muted">
          You don&apos;t have permission to view this page.
        </p>
        <Button asChild className="uppercase">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default UnauthPage;
