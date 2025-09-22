import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-mono font-bold text-primary">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-mono font-bold text-foreground">
            PAGE NOT FOUND
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist in this terminal. 
            Perhaps it was moved or deleted from the system.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="cyber" size="lg">
            <Link to="/">
              <Home className="w-5 h-5 mr-2" />
              Return Home
            </Link>
          </Button>
          <Button asChild variant="cyber-outline" size="lg">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
          </Button>
        </div>
        
        <div className="text-sm font-mono text-muted-foreground">
          ERROR_CODE: <span className="text-primary">0x404_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
