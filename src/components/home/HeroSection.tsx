
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useQuery } from 'convex/react';
import { format, parseISO } from 'date-fns';
import { api } from '../../../convex/_generated/api';

const HeroSection = () => {
  const nextMatch = useQuery(api.matches.getNextMatch);
  const isLoading = nextMatch === undefined;

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const renderNextMatch = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-team-gold"></div>
        </div>
      );
    }

    if (!nextMatch) {
      return (
        <div className="text-center py-6">
          <p className="text-team-silver font-body italic">No upcoming matches scheduled.</p>
        </div>
      );
    }

    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center">
            <img
              src={nextMatch.homeTeam?.logoUrl || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"}
              alt={nextMatch.homeTeam?.name || "Home Team"}
              className="w-16 h-16 object-contain"
            />
            <span className="text-team-cream font-display font-bold mt-2">{nextMatch.homeTeam?.shortName}</span>
          </div>

          <div className="text-center">
            <span className="text-3xl font-headline tracking-[0.15em] text-team-gold">VS</span>
          </div>

          <div className="flex flex-col items-center">
            {nextMatch.awayTeam?.logoUrl ? (
              <img
                src={nextMatch.awayTeam?.logoUrl}
                alt={nextMatch.awayTeam?.name || "Away Team"}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-team-gray/30 flex items-center justify-center border border-team-gold/20">
                <span className="text-2xl font-display font-bold text-team-cream">
                  {nextMatch.awayTeam?.shortName.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
            )}
            <span className="text-team-cream font-display font-bold mt-2">{nextMatch.awayTeam?.shortName}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4 font-body">
          <div className="flex items-center">
            <Calendar className="text-team-gold mr-2 h-5 w-5" />
            <span className="text-team-cream">{formatDate(nextMatch.matchDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-team-gold mr-2 h-5 w-5" />
            <span className="text-team-cream">{formatTime(nextMatch.matchTime)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="text-team-gold mr-2 h-5 w-5" />
            <span className="text-team-cream">{nextMatch.location}</span>
          </div>
        </div>

        <Link to="/schedule" className="vintage-btn-primary block text-center">
          View Full Schedule
        </Link>
      </div>
    );
  };

  return (
    <section className="relative bg-team-black py-20 md:py-28">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png')] bg-center opacity-5"></div>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-team-gold/40 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-6 mb-6">
              <img
                src="/images/logos/tavi-white.webp"
                alt="Tavistock Trash Pandas Coat of Arms"
                className="w-28 md:w-36 h-auto flex-shrink-0 drop-shadow-[0_0_15px_rgba(192,173,142,0.15)]"
              />
              <div>
                <div className="mb-2 font-headline text-sm tracking-[0.4em] uppercase text-team-gold">Est. 2024</div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-team-cream mb-2 leading-tight">
                  Tavistock
                </h1>
                <h1 className="text-4xl md:text-5xl font-display font-bold italic text-team-silver">
                  Trash Pandas
                </h1>
              </div>
            </div>
            <p className="text-lg text-team-silver/80 mb-8 font-body leading-relaxed">
              Home of the 2024 Ontario Rugby League Champions, and the worst blackjack players you've ever seen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="vintage-btn-primary">
                Club History
              </Link>
              <Link to="/roster" className="vintage-btn-outline">
                View Roster
              </Link>
            </div>
          </div>

          <div className="vintage-card p-8">
            <h2 className="text-sm font-headline tracking-[0.3em] uppercase text-team-gold border-b border-team-gold/20 pb-3 mb-6">
              Next Match
            </h2>
            {renderNextMatch()}
          </div>
        </div>
      </div>
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-team-gold/40 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
