
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

  // Sort matches by date and time
  const sortedMatches = [...matches].sort((a, b) => {
    // First compare by date
    const dateComparison = new Date(a.match_date).getTime() - new Date(b.match_date).getTime();
    if (dateComparison !== 0) {
      return isPast ? -dateComparison : dateComparison; // Reverse order for past matches
    }
    
    // If dates are the same, compare by time
    const aTime = a.match_time || '00:00:00';
    const bTime = b.match_time || '00:00:00';
    
    return isPast 
      ? bTime.localeCompare(aTime) // Latest time first for past matches
      : aTime.localeCompare(bTime); // Earliest time first for upcoming matches
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sortedMatches.map((match, index) => (
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
