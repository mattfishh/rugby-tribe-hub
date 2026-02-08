import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Index from "./pages/Index";
import SchedulePage from "./pages/SchedulePage";
import RosterPage from "./pages/RosterPage";
import StandingsPage from "./pages/StandingsPage";
import AboutPage from "./pages/AboutPage";
import CasinoPage from "./pages/CasinoPage";
import NotFound from "./pages/NotFound";
import { useInitializeApp } from "./hooks/useInitializeApp";

const ScrollToTop = () => {
  const { pathname } = window.location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const { isLoading } = useInitializeApp();

  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <div className="pt-16">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/roster" element={<RosterPage />} />
                <Route path="/standings" element={<StandingsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/casino" element={<CasinoPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </div>
          <Footer />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
