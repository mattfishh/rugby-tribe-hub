import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-team-black">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold mb-4 text-team-cream">404</h1>
        <p className="text-xl text-team-silver mb-6 font-body italic">Page not found, old sport</p>
        <a href="/" className="vintage-btn-primary inline-block">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
