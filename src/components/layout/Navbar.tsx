
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Roster', href: '/roster' },
  { name: 'Standings', href: '/standings' },
  { name: 'About', href: '/about' },
  { name: 'Casino', href: '/casino' },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-team-black/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <TeamLogo withText size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-link',
                  (location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href))) && 'active'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden rounded-md p-2 text-team-silver hover:text-team-white focus:outline-none" 
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          'md:hidden fixed inset-0 bg-team-black/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out transform',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ top: '64px' }}
      >
        <div className="px-4 pt-4 pb-12 space-y-1 flex flex-col items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'py-3 px-4 text-lg font-display font-semibold w-full text-center',
                (location.pathname === item.href || 
                (item.href !== '/' && location.pathname.startsWith(item.href))) 
                  ? 'text-team-white bg-team-gray/30 rounded-md' 
                  : 'text-team-silver'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
