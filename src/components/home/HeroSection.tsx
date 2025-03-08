
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-team-black">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-team-black via-team-darkgray/20 to-team-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(120,120,120,0.1)_0,_rgba(0,0,0,0.3)_100%)]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text content */}
          <div className={cn(
            "transition-all duration-1000 transform",
            isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
          )}>
            <h1 className="text-5xl sm:text-6xl font-display font-bold text-team-white leading-tight mb-4">
              TAVISTOCK <br/><span className="text-team-silver">TRASH PANDAS</span>
            </h1>
            <p className="text-xl text-team-white/90 mb-8 max-w-lg">
              Bringing tenacity and tactical prowess to the field. We're not just playing rugby - we're redefining it.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/schedule" 
                className="inline-flex items-center px-6 py-3 rounded-md bg-team-silver text-team-black font-display font-semibold hover:bg-team-white transition-colors duration-300"
              >
                View Schedule <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/roster" 
                className="inline-flex items-center px-6 py-3 rounded-md border border-team-silver text-team-white font-display font-semibold hover:bg-team-darkgray transition-colors duration-300"
              >
                Meet the Team <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Featured content card */}
          <div className={cn(
            "transition-all duration-1000 delay-300 transform",
            isLoaded ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          )}>
            <div className="bg-team-darkgray/80 backdrop-blur-sm rounded-lg overflow-hidden border border-team-gray/30 shadow-xl">
              <div className="px-6 py-5 bg-team-gray/20 border-b border-team-gray/30">
                <h2 className="text-xl font-display font-bold text-team-white">NEXT MATCH</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Calendar className="text-team-silver mr-2 h-5 w-5" />
                  <span className="text-team-white">Saturday, June 15, 2024 • 3:00 PM</span>
                </div>
                <div className="flex items-center mb-6">
                  <MapPin className="text-team-silver mr-2 h-5 w-5" />
                  <span className="text-team-white">Tavistock Rugby Grounds</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <img 
                      src="/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png" 
                      alt="Tavistock Trash Pandas" 
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-team-white font-display font-bold mt-2">TRASH PANDAS</span>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-team-silver font-display text-sm">VS</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-team-white">RC</span>
                    </div>
                    <span className="text-team-white font-display font-bold mt-2">RIVALS CLUB</span>
                  </div>
                </div>
                
                <Link
                  to="/schedule"
                  className="mt-6 block w-full text-center py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300"
                >
                  View Match Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-team-black to-transparent z-10"></div>
    </div>
  );
};

export default HeroSection;
