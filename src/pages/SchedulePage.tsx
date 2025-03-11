
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingMatches, getPastMatches } from '@/services/database';
import type { Match } from '@/types/database';
import TeamFilter from '@/components/schedule/TeamFilter';
import MatchesGrid from '@/components/schedule/MatchesGrid';
import LoadingSpinner from '@/components/schedule/LoadingSpinner';

// Team data from the SQL file
const teams = [
  { id: '9674a0af-661e-4dbb-be75-2e5f72c1dc91', name: 'Tavistock Trash Pandas', shortName: 'Tavistock Trash Pandas', isHomeTeam: true },
  { id: 'adab6481-0fd1-40ef-b636-1e15a2e9c4f4', name: 'Brantford Broncos', shortName: 'Brantford Broncos', isHomeTeam: false },
  { id: '7bab3297-e933-4b88-a3cc-667bea32c24c', name: 'Toronto City Saints', shortName: 'Toronto City Saints', isHomeTeam: false },
  { id: 'a58ca74d-eae0-4a03-81a7-fa0d56a16b00', name: 'Brampton Beavers', shortName: 'Brampton Beavers', isHomeTeam: false },
  { id: '335630e0-cb79-41f1-b522-1086bc9da0cf', name: 'Royal City Goons', shortName: 'Royal City Goons', isHomeTeam: false },
  { id: '6de7c0ab-0c3f-4212-83d1-128372a7c114', name: 'Durham Dawgs', shortName: 'Durham Dawgs', isHomeTeam: false },
];

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTeam, setSelectedTeam] = useState('all');
  
  // Query for upcoming matches
  const { data: upcomingMatchesData, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcoming-matches'],
    queryFn: getUpcomingMatches
  });
  
  // Query for past matches
  const { data: pastMatchesData, isLoading: isLoadingPast } = useQuery({
    queryKey: ['past-matches'],
    queryFn: getPastMatches
  });
  
  const isLoading = isLoadingUpcoming || isLoadingPast;
  
  // Filter matches based on selected team
  const filterMatchesByTeam = (matches: Match[] | undefined) => {
    if (!matches) return [];
    if (selectedTeam === 'all') return matches;
    
    return matches.filter(match => 
      match.home_team_id === selectedTeam || match.away_team_id === selectedTeam
    );
  };

  const filteredUpcomingMatches = filterMatchesByTeam(upcomingMatchesData);
  const filteredPastMatches = filterMatchesByTeam(pastMatchesData);
  
  return (
    <div className="page-container">
      <h1 className="section-title">Season Schedule</h1>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-8 bg-team-darkgray">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
              >
                Upcoming Matches
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
              >
                Past Results
              </TabsTrigger>
            </TabsList>
            
            {/* Team selector */}
            <TeamFilter 
              teams={teams} 
              selectedTeam={selectedTeam}
              onSelectTeam={setSelectedTeam}
            />
            
            <TabsContent value="upcoming" className="mt-0">
              <MatchesGrid 
                matches={filteredUpcomingMatches} 
                isPast={false}
              />
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              <MatchesGrid 
                matches={filteredPastMatches} 
                isPast={true}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SchedulePage;
