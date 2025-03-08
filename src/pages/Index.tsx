
import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Trophy, History } from 'lucide-react';

const LatestNews = [
  {
    id: 1,
    title: "Trash Pandas secure decisive victory against crosstown rivals",
    date: "May 28, 2024",
    excerpt: "The team showed incredible skill and teamwork in their 27-12 win.",
    imageUrl: "https://placehold.co/400x250/333333/FFFFFF?text=Match+Highlights",
  },
  {
    id: 2,
    title: "New player signings boost Trash Pandas' defensive lineup",
    date: "May 20, 2024",
    excerpt: "Three promising talents have joined our squad for the upcoming season.",
    imageUrl: "https://placehold.co/400x250/333333/FFFFFF?text=Team+News",
  },
  {
    id: 3,
    title: "Season tickets now available for loyal fans",
    date: "May 15, 2024",
    excerpt: "Secure your spot to watch all home games with our exclusive package.",
    imageUrl: "https://placehold.co/400x250/333333/FFFFFF?text=Ticket+News",
  },
];

const Index = () => {
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
      
      {/* Latest news section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LatestNews.map((news, index) => (
              <Card key={news.id} className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <img 
                  src={news.imageUrl} 
                  alt={news.title} 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <p className="text-team-silver text-sm mb-2">{news.date}</p>
                  <h3 className="text-xl font-display font-bold text-team-white mb-2">{news.title}</h3>
                  <p className="text-team-silver mb-4">{news.excerpt}</p>
                  <a href="#" className="inline-block text-team-white font-semibold hover:text-team-silver transition-colors">
                    Read More
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <a 
              href="#" 
              className="inline-block px-6 py-3 border border-team-silver text-team-white font-display font-semibold rounded-md hover:bg-team-darkgray transition-colors duration-300"
            >
              View All News
            </a>
          </div>
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
