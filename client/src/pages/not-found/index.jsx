import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="font-serif text-8xl font-semibold text-accent">404</h1>
        <h2 className="heading text-foreground">Page Not Found</h2>
        <p className="text-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild className="uppercase">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
