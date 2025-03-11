
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Match } from '@/types/database';

type MatchCardProps = {
  match: Match;
  isPast?: boolean;
  index: number;
};

const MatchCard = ({ match, isPast = false, index }: MatchCardProps) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };
  
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    // Format time without seconds, e.g., "15:00:00" -> "3:00 PM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isHomeGame = match.home_team_id === '9674a0af-661e-4dbb-be75-2e5f72c1dc91';

  return (
    <Card 
      className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-0">
        <div className="p-4 bg-team-gray/30 flex justify-between items-center border-b border-team-gray/30">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-team-silver mr-2" />
            <span className="text-team-white font-medium">{formatDate(match.match_date)}</span>
          </div>
          {isPast && match.home_score !== null && match.away_score !== null ? (
            <div 
              className={`px-3 py-1 rounded text-sm font-semibold ${
                isHomeGame ? (
                  match.home_score > match.away_score 
                    ? 'bg-green-900/20 text-green-400' 
                    : match.home_score === match.away_score 
                      ? 'bg-team-gray/20 text-team-silver'
                      : 'bg-red-900/20 text-red-400'
                ) : (
                  match.away_score > match.home_score 
                    ? 'bg-green-900/20 text-green-400' 
                    : match.home_score === match.away_score 
                      ? 'bg-team-gray/20 text-team-silver' 
                      : 'bg-red-900/20 text-red-400'
                )
              }`}
            >
              {`${match.home_score}-${match.away_score}`}
            </div>
          ) : (
            <div className="px-3 py-1 rounded bg-team-silver/20 text-team-silver text-sm font-semibold">
              {isHomeGame ? 'HOME' : 'AWAY'}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center">
              <img 
                src={match.home_team?.logo_url || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"} 
                alt={match.home_team?.name || "Home Team"} 
                className="w-16 h-16 object-contain"
              />
              <span className="text-team-white font-display font-bold mt-2">{match.home_team?.short_name}</span>
            </div>
            
            <div className="text-center">
              <span className="text-team-silver font-display text-sm">VS</span>
            </div>
            
            <div className="flex flex-col items-center">
              {match.away_team?.logo_url ? (
                <img 
                  src={match.away_team?.logo_url} 
                  alt={match.away_team?.name || "Away Team"} 
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-team-white">
                    {match.away_team?.short_name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
              )}
              <span className="text-team-white font-display font-bold mt-2">{match.away_team?.short_name}</span>
            </div>
          </div>
          
          <div className="border-t border-team-gray/30 pt-4 space-y-3">
            <div className="flex items-center">
              <Clock className="text-team-silver mr-2 h-5 w-5" />
              <span className="text-team-white">{formatTime(match.match_time)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-team-silver mr-2 h-5 w-5" />
              <span className="text-team-white">{match.location}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchCard;
