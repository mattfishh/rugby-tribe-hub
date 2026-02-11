import React from 'react';
import MatchCard from './MatchCard';

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

type MatchesGridProps = {
  matches: MatchWithTeams[];
  isPast?: boolean;
};

const MatchesGrid = ({ matches, isPast = false }: MatchesGridProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 vintage-card">
        <p className="text-xl text-team-silver font-body italic">
          {isPast ? 'No past matches to display.' : 'No upcoming matches scheduled.'}
        </p>
      </div>
    );
  }

  const sortedMatches = [...matches].sort((a, b) => {
    const dateComparison = new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime();
    if (dateComparison !== 0) {
      return isPast ? -dateComparison : dateComparison;
    }
    const aTime = a.matchTime || '00:00';
    const bTime = b.matchTime || '00:00';
    return isPast
      ? bTime.localeCompare(aTime)
      : aTime.localeCompare(bTime);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sortedMatches.map((match, index) => (
        <MatchCard
          key={match._id}
          match={match}
          isPast={isPast}
          index={index}
        />
      ))}
    </div>
  );
};

export default MatchesGrid;
