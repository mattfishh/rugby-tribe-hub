
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

// Mock data for standings
const standingsData = {
  league: [
    { 
      position: 1, 
      team: 'Tavistock Trash Pandas', 
      played: 10, 
      won: 7, 
      drawn: 1, 
      lost: 2, 
      pointsFor: 186, 
      pointsAgainst: 124, 
      bonusPoints: 3, 
      totalPoints: 26,
      isOurTeam: true,
    },
    { 
      position: 2, 
      team: 'Westside Warriors', 
      played: 10, 
      won: 6, 
      drawn: 2, 
      lost: 2, 
      pointsFor: 176, 
      pointsAgainst: 142, 
      bonusPoints: 4, 
      totalPoints: 24,
      isOurTeam: false, 
    },
    { 
      position: 3, 
      team: 'Northern Knights', 
      played: 10, 
      won: 5, 
      drawn: 2, 
      lost: 3, 
      pointsFor: 165, 
      pointsAgainst: 148, 
      bonusPoints: 5, 
      totalPoints: 22,
      isOurTeam: false, 
    },
    { 
      position: 4, 
      team: 'Eastside Eagles', 
      played: 10, 
      won: 5, 
      drawn: 0, 
      lost: 5, 
      pointsFor: 142, 
      pointsAgainst: 152, 
      bonusPoints: 6, 
      totalPoints: 21,
      isOurTeam: false, 
    },
    { 
      position: 5, 
      team: 'Metro Rugby FC', 
      played: 10, 
      won: 4, 
      drawn: 1, 
      lost: 5, 
      pointsFor: 138, 
      pointsAgainst: 146, 
      bonusPoints: 5, 
      totalPoints: 18,
      isOurTeam: false, 
    },
    { 
      position: 6, 
      team: 'Southern Sharks', 
      played: 10, 
      won: 3, 
      drawn: 2, 
      lost: 5, 
      pointsFor: 132, 
      pointsAgainst: 158, 
      bonusPoints: 3, 
      totalPoints: 14,
      isOurTeam: false, 
    },
    { 
      position: 7, 
      team: 'City Barbarians', 
      played: 10, 
      won: 3, 
      drawn: 1, 
      lost: 6, 
      pointsFor: 128, 
      pointsAgainst: 166, 
      bonusPoints: 3, 
      totalPoints: 13,
      isOurTeam: false, 
    },
    { 
      position: 8, 
      team: 'Rivals Club', 
      played: 10, 
      won: 2, 
      drawn: 1, 
      lost: 7, 
      pointsFor: 115, 
      pointsAgainst: 146, 
      bonusPoints: 2, 
      totalPoints: 9,
      isOurTeam: false, 
    },
  ],
  division: [
    { 
      position: 1, 
      team: 'Tavistock Trash Pandas', 
      played: 5, 
      won: 4, 
      drawn: 0, 
      lost: 1, 
      pointsFor: 94, 
      pointsAgainst: 58, 
      bonusPoints: 2, 
      totalPoints: 14,
      isOurTeam: true, 
    },
    { 
      position: 2, 
      team: 'Northern Knights', 
      played: 5, 
      won: 3, 
      drawn: 1, 
      lost: 1, 
      pointsFor: 86, 
      pointsAgainst: 72, 
      bonusPoints: 3, 
      totalPoints: 13,
      isOurTeam: false, 
    },
    { 
      position: 3, 
      team: 'Eastside Eagles', 
      played: 5, 
      won: 2, 
      drawn: 0, 
      lost: 3, 
      pointsFor: 76, 
      pointsAgainst: 82, 
      bonusPoints: 3, 
      totalPoints: 9,
      isOurTeam: false, 
    },
    { 
      position: 4, 
      team: 'Rivals Club', 
      played: 5, 
      won: 0, 
      drawn: 1, 
      lost: 4, 
      pointsFor: 52, 
      pointsAgainst: 96, 
      bonusPoints: 1, 
      totalPoints: 2,
      isOurTeam: false, 
    },
  ],
};

// Player stats data
const playerStatsData = [
  { 
    name: 'Oliver Taylor', 
    position: 'Fly Half', 
    matches: 10, 
    tries: 4, 
    conversions: 18, 
    penalties: 12, 
    points: 74,
    imageUrl: "https://placehold.co/100x100/333333/FFFFFF?text=Oliver+T.", 
  },
  { 
    name: 'George Thompson', 
    position: 'Winger', 
    matches: 9, 
    tries: 6, 
    conversions: 0, 
    penalties: 0, 
    points: 30,
    imageUrl: "https://placehold.co/100x100/333333/FFFFFF?text=George+T.", 
  },
  { 
    name: 'Noah Martin', 
    position: 'Inside Center', 
    matches: 10, 
    tries: 5, 
    conversions: 0, 
    penalties: 0, 
    points: 25,
    imageUrl: "https://placehold.co/100x100/333333/FFFFFF?text=Noah+M.", 
  },
  { 
    name: 'Leo Clark', 
    position: 'Fullback', 
    matches: 8, 
    tries: 3, 
    conversions: 0, 
    penalties: 2, 
    points: 21,
    imageUrl: "https://placehold.co/100x100/333333/FFFFFF?text=Leo+C.", 
  },
  { 
    name: 'Charlie Wright', 
    position: 'Outside Center', 
    matches: 10, 
    tries: 3, 
    conversions: 0, 
    penalties: 0, 
    points: 15,
    imageUrl: "https://placehold.co/100x100/333333/FFFFFF?text=Charlie+W.", 
  },
];

const StandingsPage = () => {
  const [activeTab, setActiveTab] = useState('league');
  
  return (
    <div className="page-container">
      <h1 className="section-title">Standings & Stats</h1>
      
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
                      {standingsData[tableType].map((team) => (
                        <TableRow 
                          key={team.position} 
                          className={`
                            hover:bg-team-gray/20
                            ${team.isOurTeam ? 'bg-team-gray/20 font-semibold' : ''}
                          `}
                        >
                          <TableCell className="text-center font-medium text-team-white">
                            {team.position}
                          </TableCell>
                          <TableCell className="font-medium text-team-white">
                            {team.team}
                            {team.isOurTeam && (
                              <span className="ml-2 inline-block px-2 py-1 text-xs bg-team-silver/20 rounded text-team-silver">
                                (Our Team)
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-center text-team-silver">{team.played}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.won}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.drawn}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.lost}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.pointsFor}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.pointsAgainst}</TableCell>
                          <TableCell className="text-center text-team-silver">{team.bonusPoints}</TableCell>
                          <TableCell className="text-center font-bold text-team-white">{team.totalPoints}</TableCell>
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
                    {standingsData[tableType].slice(0, 4).map((team) => (
                      <div key={team.position} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-team-white">{team.team}</span>
                          <span className={`font-semibold ${team.isOurTeam ? 'text-team-white' : 'text-team-silver'}`}>
                            {Math.max(0, 100 - (team.position * 20))}%
                          </span>
                        </div>
                        <div className="w-full bg-team-gray/20 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${team.isOurTeam ? 'bg-team-white' : 'bg-team-silver/60'}`}
                            style={{ width: `${Math.max(0, 100 - (team.position * 20))}%` }}
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
                    {standingsData[tableType].slice(0, 4).map((team) => (
                      <div key={team.position} className="flex justify-between items-center">
                        <span className={`${team.isOurTeam ? 'text-team-white font-semibold' : 'text-team-silver'}`}>
                          {team.team}
                        </span>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            // Generate random form for illustration (W, D, L)
                            const forms = ['W', 'D', 'L'];
                            const randomIndex = Math.floor(Math.random() * 
                              (team.position === 1 ? 2 : 3)); // More wins for first place
                            const form = forms[randomIndex];
                            
                            return (
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
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
                    {standingsData[tableType].slice(0, 6).map((team) => {
                      const difference = team.pointsFor - team.pointsAgainst;
                      const isPositive = difference > 0;
                      
                      return (
                        <div key={team.position} className="space-y-1">
                          <div className="flex justify-between">
                            <span className={`${team.isOurTeam ? 'text-team-white font-semibold' : 'text-team-silver'}`}>
                              {team.team}
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
                      {playerStatsData.map((player, index) => (
                        <TableRow 
                          key={index} 
                          className="hover:bg-team-gray/20"
                        >
                          <TableCell className="font-medium text-team-white">
                            <div className="flex items-center">
                              <img 
                                src={player.imageUrl} 
                                alt={player.name}
                                className="w-8 h-8 rounded-full mr-2 object-cover"
                              />
                              {player.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-team-silver">{player.position}</TableCell>
                          <TableCell className="text-center text-team-silver">{player.matches}</TableCell>
                          <TableCell className="text-center text-team-silver">{player.tries}</TableCell>
                          <TableCell className="text-center text-team-silver">{player.conversions}</TableCell>
                          <TableCell className="text-center text-team-silver">{player.penalties}</TableCell>
                          <TableCell className="text-center font-bold text-team-white">{player.points}</TableCell>
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
                    {[
                      { label: 'Tries Scored', value: 28 },
                      { label: 'Conversions', value: 18 },
                      { label: 'Penalties', value: 14 },
                      { label: 'Yellow Cards', value: 4 },
                      { label: 'Red Cards', value: 0 },
                      { label: 'Average Points', value: '18.6' },
                    ].map((stat, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-team-silver">{stat.label}</span>
                        <span className="text-team-white font-semibold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-team-darkgray border-team-gray/30">
                <div className="p-4 bg-team-gray/30 border-b border-team-gray/30">
                  <h3 className="text-lg font-display font-bold text-team-white">Try Distribution</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { position: 'Backs', value: 18, percentage: 64 },
                      { position: 'Forwards', value: 10, percentage: 36 },
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
