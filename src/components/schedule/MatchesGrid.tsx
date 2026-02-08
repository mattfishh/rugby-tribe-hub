import React from 'react';
import MatchCard from './MatchCard';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { RefreshCw } from 'lucide-react';

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
  const updateStandings = useMutation(api.stats.updateStandingsFromMatches);

  const handleUpdateStandings = async () => {
    await updateStandings({ season: "2025" });
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-team-darkgray rounded-lg border border-team-gray/30">
        <p className="text-xl text-team-silver">
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
    <div>
      {isPast && (
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleUpdateStandings}
            className="flex items-center gap-2 bg-team-accent hover:bg-team-accent/80"
          >
            <RefreshCw size={16} />
            Update Standings
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedMatches.map((match, index) => (
          <MatchCard
            key={match._id}
            match={match}
            isPast={isPast}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchesGrid;
