
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import TeamLogo from '@/components/ui/TeamLogo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-team-darkgray pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8">
          <div className="flex flex-col items-center md:items-start">
            <TeamLogo withText size="lg" />
            <p className="mt-4 text-team-silver text-sm max-w-xs text-center md:text-left">
              The official website of the Tavistock Trash Pandas Rugby Club.
            </p>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="text-team-white font-display font-semibold text-lg mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-team-silver hover:text-team-white transition-colors">Home</Link></li>
                <li><Link to="/schedule" className="text-team-silver hover:text-team-white transition-colors">Schedule</Link></li>
                <li><Link to="/roster" className="text-team-silver hover:text-team-white transition-colors">Roster</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-team-white font-display font-semibold text-lg mb-4">Info</h3>
              <ul className="space-y-2">
                <li><Link to="/standings" className="text-team-silver hover:text-team-white transition-colors">Standings</Link></li>
                <li><Link to="/about" className="text-team-silver hover:text-team-white transition-colors">About</Link></li>
                <li><Link to="/casino" className="text-team-silver hover:text-team-white transition-colors">Casino</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-team-white font-display font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-team-silver hover:text-team-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-team-silver hover:text-team-white transition-colors">Sponsors</a></li>
                <li><a href="#" className="text-team-silver hover:text-team-white transition-colors">Join the Team</a></li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-team-white font-display font-semibold text-lg mb-4">Connect With Us</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-team-silver hover:text-team-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-team-silver hover:text-team-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-team-silver hover:text-team-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-team-silver hover:text-team-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-team-white font-semibold mb-2">Subscribe to Updates</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="bg-team-gray text-team-white px-4 py-2 rounded-l-md w-full focus:outline-none" 
                />
                <button className="bg-team-silver hover:bg-team-white text-team-black px-3 py-2 rounded-r-md transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-team-gray pt-6 text-center text-team-silver text-sm">
          <p>&copy; {currentYear} Tavistock Trash Pandas Rugby Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
