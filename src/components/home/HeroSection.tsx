
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import type { Match } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

const HeroSection = () => {
  // Query the next match that involves Tavistock
  const { data: nextMatch, isLoading } = useQuery({
    queryKey: ['next-match'],
    queryFn: async () => {
      const homeTeamId = '9674a0af-661e-4dbb-be75-2e5f72c1dc91'; // Tavistock Trash Pandas ID
      const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*)
        `)
        .or(`home_team_id.eq.${homeTeamId},away_team_id.eq.${homeTeamId}`)
        .gte('match_date', today)
        .order('match_date', { ascending: true })
        .limit(1)
        .single();
      
      if (error) {
        console.error('Error fetching next match:', error);
        return null;
      }
      
      return data as Match;
    }
  });
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };
  
  const formatTime = (timeString: string | null) => {
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-team-silver"></div>
        </div>
      );
    }
    
    if (!nextMatch) {
      return (
        <div className="text-center py-6">
          <p className="text-team-silver">No upcoming matches scheduled.</p>
        </div>
      );
    }
    
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center">
            <img 
              src={nextMatch.home_team?.logo_url || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"} 
              alt={nextMatch.home_team?.name || "Home Team"} 
              className="w-16 h-16 object-contain"
            />
            <span className="text-team-white font-display font-bold mt-2">{nextMatch.home_team?.short_name}</span>
          </div>
          
          <div className="text-center">
            <span className="text-4xl font-display font-bold text-team-silver">VS</span>
          </div>
          
          <div className="flex flex-col items-center">
            {nextMatch.away_team?.logo_url ? (
              <img 
                src={nextMatch.away_team?.logo_url} 
                alt={nextMatch.away_team?.name || "Away Team"} 
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-team-white">
                  {nextMatch.away_team?.short_name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
            )}
            <span className="text-team-white font-display font-bold mt-2">{nextMatch.away_team?.short_name}</span>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <Calendar className="text-team-silver mr-2 h-5 w-5" />
            <span className="text-team-white">{formatDate(nextMatch.match_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="text-team-silver mr-2 h-5 w-5" />
            <span className="text-team-white">{formatTime(nextMatch.match_time)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="text-team-silver mr-2 h-5 w-5" />
            <span className="text-team-white">{nextMatch.location}</span>
          </div>
        </div>
        
        <Link to="/schedule" className="block text-center py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:opacity-90 transition-opacity">
          View Full Schedule
        </Link>
      </div>
    );
  };
  
  return (
    <section className="relative bg-team-black py-16 md:py-24">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png')] bg-center opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-team-white mb-4">
              Tavistock <span className="text-team-silver">Trash Pandas</span>
            </h1>
            <p className="text-xl text-team-white/80 mb-8">
              Home of the 2024 Ontario Rugby League Champions, and the worst blackjack players you've ever seen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="px-6 py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
                Club History
              </Link>
              <Link to="/roster" className="px-6 py-3 bg-transparent border border-team-silver text-team-silver font-display font-semibold rounded hover:bg-team-gray/20 transition-colors duration-300">
                View Roster
              </Link>
            </div>
          </div>
          
          <div className="bg-team-darkgray border border-team-gray/30 rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold text-team-white border-b border-team-gray/30 pb-3 mb-4">
              Next Match
            </h2>
            {renderNextMatch()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
