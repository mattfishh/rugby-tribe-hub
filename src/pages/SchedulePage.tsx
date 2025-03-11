import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingMatches, getPastMatches } from '@/services/database';
import { format, parseISO, isAfter, startOfDay } from 'date-fns';
import type { Match } from '@/types/database';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [selectedTeam, setSelectedTeam] = useState('9674a0af-661e-4dbb-be75-2e5f72c1dc91'); // Default to Tavistock
  
  const { data: allMatches, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: () => Promise.all([getUpcomingMatches(), getPastMatches()]).then(([upcoming, past]) => [...upcoming, ...past])
  });
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };
  
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    // Format time without seconds, e.g., "15:00:00" -> "3:00 PM"
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  // Filter matches based on date (upcoming or past)
  const filterMatchesByDate = (matches: Match[] | undefined, isPast: boolean) => {
    if (!matches) return [];
    
    const today = startOfDay(new Date());
    
    return matches.filter(match => {
      const matchDate = startOfDay(parseISO(match.match_date));
      // For past matches, return dates before or equal to today
      // For upcoming matches, return dates after today
      return isPast ? !isAfter(matchDate, today) : isAfter(matchDate, today);
    });
  };
  
  // Filter matches based on selected team
  const filterMatchesByTeam = (matches: Match[] | undefined) => {
    if (!matches) return [];
    if (selectedTeam === 'all') return matches;
    
    return matches.filter(match => 
      match.home_team_id === selectedTeam || match.away_team_id === selectedTeam
    );
  };

  // Apply both filters
  const getFilteredMatches = (isPast: boolean) => {
    const dateFiltered = filterMatchesByDate(allMatches, isPast);
    return filterMatchesByTeam(dateFiltered);
  };

  const upcomingMatches = getFilteredMatches(false);
  const pastMatches = getFilteredMatches(true);
  
  return (
    <div className="page-container">
      <h1 className="section-title">Season Schedule</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
        </div>
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
            <div className="mb-6">
              <Select 
                value={selectedTeam} 
                onValueChange={setSelectedTeam}
              >
                <SelectTrigger className="w-full md:w-72 bg-team-darkgray border-team-gray/30 text-team-white">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent className="bg-team-darkgray border-team-gray/30">
                  <SelectItem value="all" className="text-team-white hover:bg-team-gray/40">
                    All Teams
                  </SelectItem>
                  {teams.map(team => (
                    <SelectItem 
                      key={team.id} 
                      value={team.id}
                      className="text-team-white hover:bg-team-gray/40"
                    >
                      {team.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="upcoming" className="mt-0">
              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingMatches.map((match: Match, index: number) => (
                    <Card 
                      key={match.id} 
                      className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <CardContent className="p-0">
                        <div className="p-4 bg-team-gray/30 flex justify-between items-center border-b border-team-gray/30">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-team-silver mr-2" />
                            <span className="text-team-white font-medium">{formatDate(match.match_date)}</span>
                          </div>
                          <div className="px-3 py-1 rounded bg-team-silver/20 text-team-silver text-sm font-semibold">
                            {match.home_team?.is_home_team ? 'HOME' : 'AWAY'}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col items-center">
                              <img 
                                src={match.home_team?.logo_url || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"} 
                                alt={match.home_team?.name || "Home Team"} 
                                className="w-16 h-16 object-contain"
                              />
                              <span className="text-team-white font-display font-bold mt-2">{match.home_team?.short_name}</span>
                            </div>
                            
                            <div className="text-center">
                              <span className="text-team-silver font-display text-sm">VS</span>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              {match.away_team?.logo_url ? (
                                <img 
                                  src={match.away_team?.logo_url} 
                                  alt={match.away_team?.name || "Away Team"} 
                                  className="w-16 h-16 object-contain"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                                  <span className="text-2xl font-bold text-team-white">
                                    {match.away_team?.short_name.split(' ').map(word => word[0]).join('')}
                                  </span>
                                </div>
                              )}
                              <span className="text-team-white font-display font-bold mt-2">{match.away_team?.short_name}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-team-gray/30 pt-4 space-y-3">
                            <div className="flex items-center">
                              <Clock className="text-team-silver mr-2 h-5 w-5" />
                              <span className="text-team-white">{formatTime(match.match_time)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="text-team-silver mr-2 h-5 w-5" />
                              <span className="text-team-white">{match.location}</span>
                            </div>
                          </div>
                          
                          <button className="mt-6 block w-full text-center py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
                            Match Details
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-team-darkgray rounded-lg border border-team-gray/30">
                  <p className="text-xl text-team-silver">No upcoming matches scheduled.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="mt-0">
              {pastMatches.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastMatches.map((match: Match, index: number) => (
                    <Card 
                      key={match.id} 
                      className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <CardContent className="p-0">
                        <div className="p-4 bg-team-gray/30 flex justify-between items-center border-b border-team-gray/30">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-team-silver mr-2" />
                            <span className="text-team-white font-medium">{formatDate(match.match_date)}</span>
                          </div>
                          <div 
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              (match.home_team?.is_home_team && match.home_score && match.away_score && match.home_score > match.away_score) || 
                              (match.away_team?.is_home_team && match.home_score && match.away_score && match.away_score > match.home_score)
                                ? 'bg-green-900/20 text-green-400' 
                                : (match.home_score === match.away_score 
                                  ? 'bg-team-gray/20 text-team-silver'
                                  : 'bg-red-900/20 text-red-400')
                            }`}
                          >
                            {match.home_score}-{match.away_score}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col items-center">
                              <img 
                                src={match.home_team?.logo_url || "/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png"}
                                alt={match.home_team?.name || "Home Team"} 
                                className="w-16 h-16 object-contain"
                              />
                              <span className="text-team-white font-display font-bold mt-2">{match.home_team?.short_name}</span>
                            </div>
                            
                            <div className="text-center">
                              <span className="text-team-silver font-display text-sm">VS</span>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              {match.away_team?.logo_url ? (
                                <img 
                                  src={match.away_team?.logo_url} 
                                  alt={match.away_team?.name || "Away Team"} 
                                  className="w-16 h-16 object-contain"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                                  <span className="text-2xl font-bold text-team-white">
                                    {match.away_team?.short_name.split(' ').map(word => word[0]).join('')}
                                  </span>
                                </div>
                              )}
                              <span className="text-team-white font-display font-bold mt-2">{match.away_team?.short_name}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-team-gray/30 pt-4 space-y-3">
                            <div className="flex items-center">
                              <Clock className="text-team-silver mr-2 h-5 w-5" />
                              <span className="text-team-white">{formatTime(match.match_time)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="text-team-silver mr-2 h-5 w-5" />
                              <span className="text-team-white">{match.location}</span>
                            </div>
                          </div>
                          
                          <button className="mt-6 block w-full text-center py-3 bg-team-gray text-team-white font-display font-semibold rounded hover:bg-team-silver hover:text-team-black transition-colors duration-300">
                            View Recap
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-team-darkgray rounded-lg border border-team-gray/30">
                  <p className="text-xl text-team-silver">No past matches to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default SchedulePage;
