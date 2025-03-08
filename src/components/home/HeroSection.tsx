
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNextMatch } from '@/services/database';
import { format } from 'date-fns';
import { Match } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    
    const fetchNextTavistockMatch = async () => {
      try {
        // Get the Tavistock team id first
        const { data: tavistockTeam } = await supabase
          .from('teams')
          .select('id')
          .eq('is_home_team', true)
          .single();
        
        if (!tavistockTeam) {
          setIsLoading(false);
          return;
        }
        
        // Get next match where Tavistock is playing (either home or away)
        const { data: matches } = await supabase
          .from('matches')
          .select(`
            id,
            match_date,
            match_time,
            location,
            status,
            home_score,
            away_score,
            home_team:home_team_id(id, name, short_name, logo_url),
            away_team:away_team_id(id, name, short_name, logo_url)
          `)
          .or(`home_team_id.eq.${tavistockTeam.id},away_team_id.eq.${tavistockTeam.id}`)
          .eq('status', 'upcoming')
          .order('match_date', { ascending: true })
          .limit(1);
          
        setNextMatch(matches && matches.length > 0 ? matches[0] : null);
      } catch (error) {
        console.error('Error fetching next match:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNextTavistockMatch();
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
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-team-silver"></div>
                  </div>
                ) : nextMatch ? (
                  <>
                    <div className="flex items-center mb-4">
                      <Calendar className="text-team-silver mr-2 h-5 w-5" />
                      <span className="text-team-white">
                        {format(new Date(nextMatch.match_date), 'EEEE, MMMM d, yyyy')}
                        {nextMatch.match_time && ` • ${nextMatch.match_time.substring(0, 5)}`}
                      </span>
                    </div>
                    {nextMatch.location && (
                      <div className="flex items-center mb-6">
                        <MapPin className="text-team-silver mr-2 h-5 w-5" />
                        <span className="text-team-white">{nextMatch.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        {nextMatch.home_team?.logo_url ? (
                          <img 
                            src={nextMatch.home_team.logo_url} 
                            alt={nextMatch.home_team.name} 
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-team-white">
                              {nextMatch.home_team?.short_name?.substring(0, 2) || 'HT'}
                            </span>
                          </div>
                        )}
                        <span className="text-team-white font-display font-bold mt-2">
                          {nextMatch.home_team?.short_name || 'HOME TEAM'}
                        </span>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-team-silver font-display text-sm">VS</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        {nextMatch.away_team?.logo_url ? (
                          <img 
                            src={nextMatch.away_team.logo_url} 
                            alt={nextMatch.away_team.name} 
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-team-white">
                              {nextMatch.away_team?.short_name?.substring(0, 2) || 'AT'}
                            </span>
                          </div>
                        )}
                        <span className="text-team-white font-display font-bold mt-2">
                          {nextMatch.away_team?.short_name || 'AWAY TEAM'}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-team-silver mb-2">No upcoming matches scheduled</p>
                    <Link
                      to="/schedule"
                      className="text-team-white underline hover:text-team-white/80"
                    >
                      View full schedule
                    </Link>
                  </div>
                )}
                
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
