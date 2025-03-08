
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUpcomingMatches, getPastMatches } from '@/services/database';
import { format, parseISO } from 'date-fns';
import type { Match } from '@/types/database';

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const { data: upcomingMatches, isLoading: upcomingLoading } = useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: getUpcomingMatches
  });
  
  const { data: pastMatches, isLoading: pastLoading } = useQuery({
    queryKey: ['matches', 'past'],
    queryFn: getPastMatches
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
  
  const isLoading = upcomingLoading || pastLoading;
  
  return (
    <div className="page-container">
      <h1 className="section-title">Season Schedule</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
        </div>
      ) : (
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
          
          <TabsContent value="upcoming" className="mt-0">
            {upcomingMatches && upcomingMatches.length > 0 ? (
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
            {pastMatches && pastMatches.length > 0 ? (
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
      )}
      
      <div className="mt-12 p-6 bg-team-darkgray border border-team-gray/30 rounded-lg">
        <h2 className="text-2xl font-display font-bold text-team-white mb-4">Season Calendar</h2>
        <p className="text-team-silver mb-4">
          Our full season schedule is available for download. Stay up-to-date with all matches and events.
        </p>
        <button className="px-6 py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
          Download Full Schedule
        </button>
      </div>
    </div>
  );
};

export default SchedulePage;
