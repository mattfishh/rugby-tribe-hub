import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type MatchWithTeams = {
  _id: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string;
  matchTime?: string;
  location?: string;
  homeScore?: number;
  awayScore?: number;
  status: string;
  homeTeam: { _id: string; name: string; shortName: string; logoUrl?: string; isHomeTeam: boolean } | null;
  awayTeam: { _id: string; name: string; shortName: string; logoUrl?: string; isHomeTeam: boolean } | null;
};

type MatchCardProps = {
  match: MatchWithTeams;
  isPast?: boolean;
  index: number;
};

const MatchCard = ({ match, isPast = false, index }: MatchCardProps) => {
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

  const isHomeGame = match.homeTeam?.isHomeTeam ?? false;

  return (
    <div
      className="vintage-card overflow-hidden card-hover animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
        <div className="p-4 bg-team-gray/20 flex justify-between items-center border-b border-team-gold/20">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-team-gold mr-2" />
            <span className="text-team-cream font-body">{formatDate(match.matchDate)}</span>
          </div>
          {isPast && match.homeScore !== undefined && match.awayScore !== undefined ? (
            <div
              className={`px-3 py-1 text-sm font-headline tracking-wider ${
                isHomeGame ? (
                  match.homeScore > match.awayScore
                    ? 'bg-green-900/20 text-green-400'
                    : match.homeScore === match.awayScore
                      ? 'bg-team-gray/20 text-team-silver'
                      : 'bg-red-900/20 text-red-400'
                ) : (
                  match.awayScore > match.homeScore
                    ? 'bg-green-900/20 text-green-400'
                    : match.homeScore === match.awayScore
                      ? 'bg-team-gray/20 text-team-silver'
                      : 'bg-red-900/20 text-red-400'
                )
              }`}
            >
              {`${match.homeScore}-${match.awayScore}`}
            </div>
          ) : (
            <div className="px-3 py-1 text-team-gold text-xs font-headline tracking-[0.2em] uppercase border border-team-gold/20">
              {isHomeGame ? 'HOME' : 'AWAY'}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center">
              <img
                src={match.homeTeam?.logoUrl || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"}
                alt={match.homeTeam?.name || "Home Team"}
                className="w-16 h-16 object-contain"
              />
              <span className="text-team-cream font-display font-bold mt-2">{match.homeTeam?.shortName}</span>
            </div>

            <div className="text-center">
              <span className="text-team-gold font-headline text-sm tracking-[0.15em]">VS</span>
            </div>

            <div className="flex flex-col items-center">
              {match.awayTeam?.logoUrl ? (
                <img
                  src={match.awayTeam?.logoUrl}
                  alt={match.awayTeam?.name || "Away Team"}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-team-gray/30 flex items-center justify-center border border-team-gold/20">
                  <span className="text-2xl font-display font-bold text-team-cream">
                    {match.awayTeam?.shortName.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
              )}
              <span className="text-team-cream font-display font-bold mt-2">{match.awayTeam?.shortName}</span>
            </div>
          </div>

          <div className="border-t border-team-gold/15 pt-4 space-y-3 font-body">
            <div className="flex items-center">
              <Clock className="text-team-gold mr-2 h-5 w-5" />
              <span className="text-team-cream">{formatTime(match.matchTime)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="text-team-gold mr-2 h-5 w-5" />
              <span className="text-team-cream">{match.location}</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default MatchCard;
