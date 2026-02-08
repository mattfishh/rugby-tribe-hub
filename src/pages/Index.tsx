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
        <section className="py-16 bg-team-darkgray relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-team-gold/20 to-transparent"></div>
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
                  className="group bg-team-gray/10 hover:bg-team-gray/25 border border-team-gold/15 hover:border-team-gold/30 p-5 text-center transition-all duration-300 hover:translate-y-[-3px]"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <item.icon className="h-7 w-7 mb-3 text-team-gold/60 group-hover:text-team-gold transition-colors" />
                    <span className="font-headline text-xs tracking-[0.2em] uppercase text-team-cream">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors section */}
        <section className="py-16 bg-team-darkgray relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-team-gold/20 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title">Our Patrons</h2>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 mt-8">
              {sponsors.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-team-cream/95 p-6 h-32 w-64 md:h-40 md:w-80 flex items-center justify-center transition-all duration-300 hover:scale-105 border border-team-gold/20"
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
