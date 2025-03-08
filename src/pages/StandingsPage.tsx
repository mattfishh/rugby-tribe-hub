
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

const StandingsPage = () => {
  const [activeTab, setActiveTab] = useState('league');
  const currentSeason = '2023-2024';
  
  const { data: leagueStandings, isLoading: leagueLoading } = useQuery({
    queryKey: ['standings', currentSeason, 'League'],
    queryFn: () => getTeamStandings(currentSeason, 'League')
  });
  
  const { data: divisionStandings, isLoading: divisionLoading } = useQuery({
    queryKey: ['standings', currentSeason, 'Division'],
    queryFn: () => getTeamStandings(currentSeason, 'Division')
  });
  
  const { data: playerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['playerStats', currentSeason],
    queryFn: () => getPlayerStats(currentSeason)
  });
  
  const isLoading = leagueLoading || divisionLoading || statsLoading;
  
  const calculatePoints = (player: any) => {
    if (!player) return 0;
    return (player.tries * 5) + (player.conversions * 2) + (player.penalties * 3);
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Standings & Stats</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
        </div>
      ) : (
        <Tabs defaultValue="league" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-team-darkgray">
            <TabsTrigger 
              value="league" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              League Table
            </TabsTrigger>
            <TabsTrigger 
              value="division" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              Division Table
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              Player Stats
            </TabsTrigger>
          </TabsList>
          
          {['league', 'division'].map((tableType) => (
            <TabsContent key={tableType} value={tableType} className="mt-0 animate-fade-in">
              <Card className="bg-team-darkgray border-team-gray/30">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-team-gray/30 hover:bg-team-gray/30">
                          <TableHead className="text-team-white w-[60px] text-center">Pos</TableHead>
                          <TableHead className="text-team-white">Team</TableHead>
                          <TableHead className="text-team-white text-center">P</TableHead>
                          <TableHead className="text-team-white text-center">W</TableHead>
                          <TableHead className="text-team-white text-center">D</TableHead>
                          <TableHead className="text-team-white text-center">L</TableHead>
                          <TableHead className="text-team-white text-center">PF</TableHead>
                          <TableHead className="text-team-white text-center">PA</TableHead>
                          <TableHead className="text-team-white text-center">BP</TableHead>
                          <TableHead className="text-team-white text-center">Pts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(tableType === 'league' ? leagueStandings : divisionStandings)?.map((standing, index) => (
                          <TableRow 
                            key={standing.id} 
                            className={`
                              hover:bg-team-gray/20
                              ${standing.team.is_home_team ? 'bg-team-gray/20 font-semibold' : ''}
                            `}
                          >
                            <TableCell className="text-center font-medium text-team-white">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium text-team-white">
                              {standing.team.name}
                              {standing.team.is_home_team && (
                                <span className="ml-2 inline-block px-2 py-1 text-xs bg-team-silver/20 rounded text-team-silver">
                                  (Our Team)
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center text-team-silver">{standing.played}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.won}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.drawn}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.lost}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.points_for}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.points_against}</TableCell>
                            <TableCell className="text-center text-team-silver">{standing.bonus_points}</TableCell>
                            <TableCell className="text-center font-bold text-team-white">{standing.total_points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-4 flex items-center text-sm text-team-silver bg-team-gray/20 p-3 rounded-md">
                <Info className="h-4 w-4 mr-2" />
                <span>
                  P = Played, W = Won, D = Drawn, L = Lost, PF = Points For, PA = Points Against, BP = Bonus Points, Pts = Total Points
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-team-darkgray border-team-gray/30 overflow-hidden">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex items-center">
                    <Trophy className="h-5 w-5 text-team-silver mr-2" />
                    <h3 className="text-lg font-display font-bold text-team-white">Championship Probability</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(tableType === 'league' ? leagueStandings : divisionStandings)?.slice(0, 4).map((standing, index) => (
                        <div key={standing.id} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-team-white">{standing.team.name}</span>
                            <span className={`font-semibold ${standing.team.is_home_team ? 'text-team-white' : 'text-team-silver'}`}>
                              {Math.max(0, 100 - (index * 20))}%
                            </span>
                          </div>
                          <div className="w-full bg-team-gray/20 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${standing.team.is_home_team ? 'bg-team-white' : 'bg-team-silver/60'}`}
                              style={{ width: `${Math.max(0, 100 - (index * 20))}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-team-darkgray border-team-gray/30 overflow-hidden">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex items-center">
                    <TrendingUp className="h-5 w-5 text-team-silver mr-2" />
                    <h3 className="text-lg font-display font-bold text-team-white">Form Guide</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(tableType === 'league' ? leagueStandings : divisionStandings)?.slice(0, 4).map((standing) => {
                        // Generate random form for illustration (W, D, L)
                        const generateFormGuide = (position: number) => {
                          const result = [];
                          for (let i = 0; i < 5; i++) {
                            const rand = Math.random();
                            if (position === 0) {
                              // First place - more wins
                              result.push(rand < 0.7 ? 'W' : (rand < 0.9 ? 'D' : 'L'));
                            } else if (position === 1) {
                              // Second place
                              result.push(rand < 0.6 ? 'W' : (rand < 0.8 ? 'D' : 'L'));
                            } else if (position === 2) {
                              // Third place
                              result.push(rand < 0.5 ? 'W' : (rand < 0.7 ? 'D' : 'L'));
                            } else {
                              // Fourth place - more losses
                              result.push(rand < 0.4 ? 'W' : (rand < 0.6 ? 'D' : 'L'));
                            }
                          }
                          return result;
                        };
                        
                        const formGuide = generateFormGuide((tableType === 'league' ? leagueStandings : divisionStandings)?.indexOf(standing) || 0);
                        
                        return (
                          <div key={standing.id} className="flex justify-between items-center">
                            <span className={`${standing.team.is_home_team ? 'text-team-white font-semibold' : 'text-team-silver'}`}>
                              {standing.team.name}
                            </span>
                            <div className="flex space-x-1">
                              {formGuide.map((form, i) => (
                                <span 
                                  key={i}
                                  className={`
                                    inline-block w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold
                                    ${form === 'W' ? 'bg-green-900/60 text-green-400' : 
                                      form === 'D' ? 'bg-team-gray/40 text-team-silver' : 
                                      'bg-red-900/60 text-red-400'}
                                  `}
                                >
                                  {form}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-team-darkgray border-team-gray/30 overflow-hidden">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex items-center">
                    <LineChart className="h-5 w-5 text-team-silver mr-2" />
                    <h3 className="text-lg font-display font-bold text-team-white">Point Difference</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(tableType === 'league' ? leagueStandings : divisionStandings)?.slice(0, 6).map((standing) => {
                        const difference = standing.points_for - standing.points_against;
                        const isPositive = difference > 0;
                        
                        return (
                          <div key={standing.id} className="space-y-1">
                            <div className="flex justify-between">
                              <span className={`${standing.team.is_home_team ? 'text-team-white font-semibold' : 'text-team-silver'}`}>
                                {standing.team.name}
                              </span>
                              <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                                {isPositive ? '+' : ''}{difference}
                              </span>
                            </div>
                            <div className="w-full bg-team-gray/20 rounded-full h-2.5 overflow-hidden relative">
                              <div 
                                className={`h-2.5 absolute ${isPositive ? 'bg-green-700/60' : 'bg-red-700/60'}`}
                                style={{ 
                                  width: `${Math.min(100, Math.abs(difference) / 2)}%`,
                                  [isPositive ? 'left' : 'right']: '50%'
                                }}
                              ></div>
                              <div className="absolute left-1/2 transform -translate-x-1/2 top-0 w-0.5 h-2.5 bg-team-silver/50"></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
          
          <TabsContent value="stats" className="mt-0 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-team-darkgray border-team-gray/30">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30">
                    <h3 className="text-lg font-display font-bold text-team-white">Top Scorers</h3>
                  </div>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-team-gray/10">
                          <TableHead className="text-team-white">Player</TableHead>
                          <TableHead className="text-team-white">Position</TableHead>
                          <TableHead className="text-team-white text-center">Games</TableHead>
                          <TableHead className="text-team-white text-center">Tries</TableHead>
                          <TableHead className="text-team-white text-center">Conv.</TableHead>
                          <TableHead className="text-team-white text-center">Pen.</TableHead>
                          <TableHead className="text-team-white text-center">Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {playerStats?.slice(0, 5).map((stat) => (
                          <TableRow 
                            key={stat.id} 
                            className="hover:bg-team-gray/20"
                          >
                            <TableCell className="font-medium text-team-white">
                              <div className="flex items-center">
                                <img 
                                  src={stat.player.image_url || "https://placehold.co/300x300/333333/FFFFFF?text=Player"} 
                                  alt={stat.player.name}
                                  className="w-8 h-8 rounded-full mr-2 object-cover"
                                />
                                {stat.player.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-team-silver">{stat.player.position}</TableCell>
                            <TableCell className="text-center text-team-silver">{stat.matches_played}</TableCell>
                            <TableCell className="text-center text-team-silver">{stat.tries}</TableCell>
                            <TableCell className="text-center text-team-silver">{stat.conversions}</TableCell>
                            <TableCell className="text-center text-team-silver">{stat.penalties}</TableCell>
                            <TableCell className="text-center font-bold text-team-white">{calculatePoints(stat)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="bg-team-darkgray border-team-gray/30 mb-6">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30">
                    <h3 className="text-lg font-display font-bold text-team-white">Team Stats</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(() => {
                        // Calculate team stats from player stats
                        const totalTries = playerStats?.reduce((sum, player) => sum + player.tries, 0) || 0;
                        const totalConversions = playerStats?.reduce((sum, player) => sum + player.conversions, 0) || 0;
                        const totalPenalties = playerStats?.reduce((sum, player) => sum + player.penalties, 0) || 0;
                        const totalYellowCards = playerStats?.reduce((sum, player) => sum + player.yellow_cards, 0) || 0;
                        const totalRedCards = playerStats?.reduce((sum, player) => sum + player.red_cards, 0) || 0;
                        
                        const homeTeamStanding = leagueStandings?.find(s => s.team.is_home_team);
                        const averagePoints = homeTeamStanding 
                          ? (homeTeamStanding.points_for / homeTeamStanding.played).toFixed(1) 
                          : '0.0';
                        
                        return [
                          { label: 'Tries Scored', value: totalTries },
                          { label: 'Conversions', value: totalConversions },
                          { label: 'Penalties', value: totalPenalties },
                          { label: 'Yellow Cards', value: totalYellowCards },
                          { label: 'Red Cards', value: totalRedCards },
                          { label: 'Average Points', value: averagePoints },
                        ].map((stat, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-team-silver">{stat.label}</span>
                            <span className="text-team-white font-semibold">{stat.value}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-team-darkgray border-team-gray/30">
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30">
                    <h3 className="text-lg font-display font-bold text-team-white">Try Distribution</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(() => {
                        // Calculate try distribution between forwards and backs
                        const forwardPositions = ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8'];
                        const backPositions = ['Scrum Half', 'Fly Half', 'Inside Center', 'Outside Center', 'Winger', 'Fullback'];
                        
                        let forwardTries = 0;
                        let backTries = 0;
                        
                        playerStats?.forEach(stat => {
                          if (forwardPositions.some(pos => stat.player.position.includes(pos))) {
                            forwardTries += stat.tries;
                          } else if (backPositions.some(pos => stat.player.position.includes(pos))) {
                            backTries += stat.tries;
                          }
                        });
                        
                        const totalTries = forwardTries + backTries;
                        const forwardPercentage = totalTries > 0 ? Math.round((forwardTries / totalTries) * 100) : 0;
                        const backPercentage = totalTries > 0 ? Math.round((backTries / totalTries) * 100) : 0;
                        
                        return [
                          { position: 'Backs', value: backTries, percentage: backPercentage },
                          { position: 'Forwards', value: forwardTries, percentage: forwardPercentage },
                        ].map((stat, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-team-white">{stat.position}</span>
                              <span className="text-team-silver">{stat.value} ({stat.percentage}%)</span>
                            </div>
                            <div className="w-full bg-team-gray/20 rounded-full h-2.5">
                              <div 
                                className="h-2.5 rounded-full bg-team-silver/60"
                                style={{ width: `${stat.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-12 p-6 bg-team-darkgray border border-team-gray/30 rounded-lg">
        <h2 className="text-2xl font-display font-bold text-team-white mb-4">Season Reports</h2>
        <p className="text-team-silver mb-4">
          Detailed statistics and analytics for the current season are available for download.
        </p>
        <button className="px-6 py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
          Download Full Stats
        </button>
      </div>
    </div>
  );
};

export default StandingsPage;
