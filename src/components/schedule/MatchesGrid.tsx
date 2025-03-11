
import React from 'react';
import type { Match } from '@/types/database';
import MatchCard from './MatchCard';

type MatchesGridProps = {
  matches: Match[];
  isPast?: boolean;
};

const MatchesGrid = ({ matches, isPast = false }: MatchesGridProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-team-darkgray rounded-lg border border-team-gray/30">
        <p className="text-xl text-team-silver">
          {isPast ? 'No past matches to display.' : 'No upcoming matches scheduled.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {matches.map((match, index) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          isPast={isPast} 
          index={index} 
        />
      ))}
    </div>
  );
};

export default MatchesGrid;
