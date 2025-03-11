import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, LineChart, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { getTeamStandings, getPlayerStats } from '@/services/database';
import { Helmet } from 'react-helmet-async';
import LoadingSpinner from '@/components/schedule/LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StandingsPage = () => {
  const [selectedSeason, setSelectedSeason] = useState('2025');
  
  const { data: standings, isLoading } = useQuery({
    queryKey: ['standings', selectedSeason],
    queryFn: () => getTeamStandings(selectedSeason)
  });
  
  const { data: playerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['playerStats', selectedSeason],
    queryFn: () => getPlayerStats(selectedSeason)
  });
  
  const isLoadingCombined = isLoading || statsLoading;
  
  const calculatePoints = (player: any) => {
    if (!player) return 0;
    return (player.tries * 5) + (player.conversions * 2) + (player.penalties * 3);
  };
  
  return (
    <div className="page-container">
      <Helmet>
        <title>Standings | Tavistock Trash Pandas Rugby</title>
        <meta name="description" content="Current season standings for the Tavistock Trash Pandas Rugby team and their league." />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="section-title mb-0">League Standings</h1>
        
        <div className="w-48">
          <Select
            value={selectedSeason}
            onValueChange={setSelectedSeason}
          >
            <SelectTrigger className="bg-team-darkgray border-team-gray/30 text-team-white">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent className="bg-team-darkgray border-team-gray/30 text-team-white">
              <SelectItem value="2025">2025 Season</SelectItem>
              <SelectItem value="2024">2024 Season</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoadingCombined ? (
        <LoadingSpinner />
      ) : (
        <Card className="bg-team-darkgray border-team-gray/30">
          <CardContent className="p-6">
            {standings && standings.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-team-white">
                    <thead>
                      <tr className="border-b border-team-gray/30">
                        <th className="text-left py-3 px-4">Team</th>
                        <th className="py-3 px-4">P</th>
                        <th className="py-3 px-4">W</th>
                        <th className="py-3 px-4">D</th>
                        <th className="py-3 px-4">L</th>
                        <th className="py-3 px-4">PF</th>
                        <th className="py-3 px-4">PA</th>
                        <th className="py-3 px-4">+/-</th>
                        <th className="py-3 px-4">BP</th>
                        <th className="py-3 px-4">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((team, index) => (
                        <tr 
                          key={team.team_id} 
                          className={`border-b border-team-gray/30 ${team.team?.is_home_team ? 'bg-team-gray/20' : ''}`}
                        >
                          <td className="text-left py-3 px-4 font-medium flex items-center">
                            <span className="mr-2">{index + 1}.</span>
                            {team.team?.logo_url && (
                              <img 
                                src={team.team.logo_url} 
                                alt={team.team?.name} 
                                className="w-6 h-6 mr-2 object-contain"
                              />
                            )}
                            {team.team?.name}
                          </td>
                          <td className="py-3 px-4 text-center">{team.played}</td>
                          <td className="py-3 px-4 text-center">{team.won}</td>
                          <td className="py-3 px-4 text-center">{team.drawn}</td>
                          <td className="py-3 px-4 text-center">{team.lost}</td>
                          <td className="py-3 px-4 text-center">{team.points_for}</td>
                          <td className="py-3 px-4 text-center">{team.points_against}</td>
                          <td className="py-3 px-4 text-center">{team.points_for - team.points_against}</td>
                          <td className="py-3 px-4 text-center">{team.bonus_points}</td>
                          <td className="py-3 px-4 text-center font-bold">{team.total_points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-team-silver text-sm">
                  <p><strong>P</strong> = Played, <strong>W</strong> = Won, <strong>D</strong> = Drawn, <strong>L</strong> = Lost</p>
                  <p><strong>PF</strong> = Points For, <strong>PA</strong> = Points Against, <strong>BP</strong> = Bonus Points, <strong>Pts</strong> = Total Points</p>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-team-silver">
                <p className="text-xl font-display mb-2">No standings data available for {selectedSeason}</p>
                <p>Standings will appear here once matches have been played and recorded.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-12 p-6 bg-team-darkgray border border-team-gray/30 rounded-lg">
        <h2 className="text-2xl font-display font-bold text-team-white mb-4">Season Reports</h2>
        <p className="text-team-silver mb-4">
          Detailed statistics and analytics for the {selectedSeason} season are available for download.
        </p>
        <button className="px-6 py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
          Download Full Stats
        </button>
      </div>
    </div>
  );
};

export default StandingsPage;
