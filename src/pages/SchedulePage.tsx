import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import MatchesGrid from '@/components/schedule/MatchesGrid';
import LoadingSpinner from '@/components/schedule/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('2025');

  const teams = useQuery(api.teams.getAll);
  const upcomingMatchesData = useQuery(api.matches.getUpcoming);

  const regularSeasonMatches = useQuery(api.matches.getBySeason, { season: selectedSeason });
  const playoffMatches = useQuery(api.matches.getBySeason, { season: `${selectedSeason} Playoffs` });

  const pastMatchesData = React.useMemo(() => {
    if (regularSeasonMatches === undefined || playoffMatches === undefined) return undefined;
    const all = [...regularSeasonMatches, ...playoffMatches]
      .filter(m => m.status === "completed");
    all.sort((a, b) => b.matchDate.localeCompare(a.matchDate));
    return all;
  }, [regularSeasonMatches, playoffMatches]);

  const isLoading = teams === undefined || upcomingMatchesData === undefined || pastMatchesData === undefined;

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
        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="bg-team-darkgray border border-team-gold/20">
              <TabsTrigger
                value="upcoming"
                className="font-headline text-xs tracking-[0.15em] uppercase data-[state=active]:bg-team-gray data-[state=active]:text-team-cream"
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="font-headline text-xs tracking-[0.15em] uppercase data-[state=active]:bg-team-gray data-[state=active]:text-team-cream"
              >
                Results
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              {activeTab === 'past' && (
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger className="w-40 bg-team-darkgray border-team-gold/20 text-team-cream font-body text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-team-darkgray border-team-gold/20 text-team-cream">
                    <SelectItem value="2025">2025 Season</SelectItem>
                    <SelectItem value="2024">2024 Season</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-56 bg-team-darkgray border-team-gold/20 text-team-cream font-body text-sm">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent className="bg-team-darkgray border-team-gold/20 text-team-cream">
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams?.map(team => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            <MatchesGrid matches={filteredUpcomingMatches} isPast={false} />
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            <MatchesGrid matches={filteredPastMatches} isPast={true} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SchedulePage;
