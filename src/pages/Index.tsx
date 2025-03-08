
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import InstagramFeed from '@/components/home/InstagramFeed';
import { Calendar, Users, TrendingUp, Trophy, History } from 'lucide-react';

const Index = () => {
  // Ensure Instagram embeds are processed when the page loads
  useEffect(() => {
    // This will trigger the embedding of Instagram posts after component mount
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="bg-team-black min-h-screen">
      <HeroSection />
      
      {/* Quick navigation section */}
      <section className="py-16 bg-team-darkgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Calendar, label: "Schedule", path: "/schedule" },
              { icon: Users, label: "Roster", path: "/roster" },
              { icon: TrendingUp, label: "Standings", path: "/standings" },
              { icon: History, label: "About", path: "/about" },
              { icon: Trophy, label: "Casino", path: "/casino" },
            ].map((item, index) => (
              <Link 
                key={index} 
                to={item.path}
                className="group bg-team-gray/20 hover:bg-team-gray/40 border border-team-gray/30 rounded-lg p-4 text-center transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <item.icon className="h-8 w-8 mb-2 text-team-silver group-hover:text-team-white transition-colors" />
                  <span className="font-display font-semibold text-team-white">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instagram feed section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstagramFeed />
        </div>
      </section>
      
      {/* Sponsors section */}
      <section className="py-16 bg-team-darkgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Our Sponsors</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 h-16 w-32 md:h-20 md:w-40 flex items-center justify-center">
                <span className="text-team-silver font-semibold">Sponsor {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
