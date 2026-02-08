import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TeamFilter from '@/components/schedule/TeamFilter';
import MatchesGrid from '@/components/schedule/MatchesGrid';
import LoadingSpinner from '@/components/schedule/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const teams = useQuery(api.teams.getAll);
  const upcomingMatchesData = useQuery(api.matches.getUpcoming);
  const pastMatchesData = useQuery(api.matches.getPast);

  const isLoading = teams === undefined || upcomingMatchesData === undefined || pastMatchesData === undefined;

  const teamsForFilter = teams?.map(t => ({
    id: t._id,
    name: t.name,
    shortName: t.shortName,
    isHomeTeam: t.isHomeTeam,
  })) ?? [];

  const filterMatchesByTeam = (matches: typeof upcomingMatchesData) => {
    if (!matches) return [];
    if (selectedTeam === 'all') return matches;
    return matches.filter(match =>
      match.homeTeamId === selectedTeam || match.awayTeamId === selectedTeam
    );
  };

  const filteredUpcomingMatches = filterMatchesByTeam(upcomingMatchesData);
  const filteredPastMatches = filterMatchesByTeam(pastMatchesData);

  return (
    <div className="page-container">
      <Helmet>
        <title>Schedule | Tavistock Trash Pandas</title>
        <meta name="description" content="Match schedule for the Tavistock Trash Pandas Rugby team." />
      </Helmet>

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

            <TeamFilter
              teams={teamsForFilter}
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
