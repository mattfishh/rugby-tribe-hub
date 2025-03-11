import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import { Calendar, Users, TrendingUp, Trophy, History } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Define sponsors with their images and links
const sponsors = [
  {
    name: 'PBR',
    image: '/images/sponsors/PBR-Pabst-Blue-Ribbon-Logo.png',
    url: 'https://pabstblueribbon.com/'
  },
  {
    name: 'M&T',
    image: '/images/sponsors/mandt.png',
    url: 'https://mtprint.com/'
  },
  {
    name: 'NASCAR',
    image: '/images/sponsors/nascar_white_rgb.jpg',
    url: 'https://www.nascar.com/'
  }
  // You can add more sponsors here
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Tavistock Trash Pandas</title>
        <meta name="description" content="Official website of the Tavistock Trash Pandas Rugby team." />
      </Helmet>
      
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
        
        {/* Sponsors section */}
        <section className="py-16 bg-team-darkgray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Our Sponsors</h2>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
              {/* Real sponsors */}
              {sponsors.map((sponsor, index) => (
                <a 
                  key={index}
                  href={sponsor.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg p-6 h-32 w-64 md:h-40 md:w-80 flex items-center justify-center transition-transform hover:scale-105 shadow-md"
                >
                  <img 
                    src={sponsor.image} 
                    alt={sponsor.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
