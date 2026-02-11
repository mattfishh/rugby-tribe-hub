import React from 'react';
import { MapPin, Clock } from 'lucide-react';
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
  season: string;
  homeTeam: { _id: string; name: string; shortName: string; logoUrl?: string; isHomeTeam: boolean } | null;
  awayTeam: { _id: string; name: string; shortName: string; logoUrl?: string; isHomeTeam: boolean } | null;
};

type MatchCardProps = {
  match: MatchWithTeams;
  isPast?: boolean;
  index: number;
};

const TeamLogo = ({ team }: { team: MatchWithTeams['homeTeam'] }) => {
  if (team?.logoUrl) {
    return (
      <img
        src={team.logoUrl}
        alt={team.name}
        className="w-10 h-10 object-contain"
      />
    );
  }
  return (
    <div className="w-10 h-10 bg-team-gray/30 flex items-center justify-center border border-team-gold/20 rounded">
      <span className="text-xs font-display font-bold text-team-cream">
        {team?.shortName.split(' ').map(word => word[0]).join('')}
      </span>
    </div>
  );
};

const MatchCard = ({ match, isPast = false, index }: MatchCardProps) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const isPlayoff = match.season?.toLowerCase().includes('playoff');
  const homeWon = (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = (match.awayScore ?? 0) > (match.homeScore ?? 0);
  const isHomeGame = match.homeTeam?.isHomeTeam ?? false;

  return (
    <div
      className="vintage-card overflow-hidden card-hover animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header row: date, meta, type badge */}
      <div className="px-4 py-2.5 bg-team-gray/20 flex items-center justify-between border-b border-team-gold/20">
        <span className="text-sm text-team-cream/80 font-body">{formatDate(match.matchDate)}</span>
        <div className="flex items-center gap-3 text-xs font-headline tracking-[0.15em] uppercase">
          {match.location && (
            <span className="text-team-cream/50 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {match.location}
            </span>
          )}
          {match.matchTime && (
            <span className="text-team-cream/50 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(match.matchTime)}
            </span>
          )}
          {isPast ? (
            <span className={isPlayoff ? 'text-team-gold' : 'text-team-silver'}>
              {isPlayoff ? 'Playoff' : 'Regular'}
            </span>
          ) : (
            <span className="text-team-gold border border-team-gold/20 px-2 py-0.5">
              {isHomeGame ? 'Home' : 'Away'}
            </span>
          )}
        </div>
      </div>

      {/* Main content: two team rows */}
      <div className="px-4 py-3">
        {/* Home team row */}
        <div className={`flex items-center py-2.5 ${isPast && homeWon ? '' : isPast ? 'opacity-50' : ''}`}>
          <TeamLogo team={match.homeTeam} />
          <span className="ml-3 font-display font-bold text-team-cream flex-1">
            {match.homeTeam?.name}
          </span>
          {isPast && match.homeScore !== undefined ? (
            <span className={`text-2xl font-headline tracking-wider min-w-[2ch] text-right ${
              homeWon ? 'text-team-cream' : 'text-team-silver/50'
            }`}>
              {match.homeScore}
            </span>
          ) : null}
        </div>

        <div className="border-t border-team-gold/10" />

        {/* Away team row */}
        <div className={`flex items-center py-2.5 ${isPast && awayWon ? '' : isPast ? 'opacity-50' : ''}`}>
          <TeamLogo team={match.awayTeam} />
          <span className="ml-3 font-display font-bold text-team-cream flex-1">
            {match.awayTeam?.name}
          </span>
          {isPast && match.awayScore !== undefined ? (
            <span className={`text-2xl font-headline tracking-wider min-w-[2ch] text-right ${
              awayWon ? 'text-team-cream' : 'text-team-silver/50'
            }`}>
              {match.awayScore}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
