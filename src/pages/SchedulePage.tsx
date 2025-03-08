
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock } from 'lucide-react';

// Mock data for the schedule
const scheduleData = {
  upcoming: [
    {
      id: 1,
      opponent: "Rivals Club",
      date: "June 15, 2024",
      time: "3:00 PM",
      location: "Tavistock Rugby Grounds",
      isHome: true,
    },
    {
      id: 2,
      opponent: "Metro Rugby FC",
      date: "June 22, 2024",
      time: "4:30 PM",
      location: "Metro Stadium",
      isHome: false,
    },
    {
      id: 3,
      opponent: "Westside Warriors",
      date: "July 5, 2024",
      time: "2:00 PM",
      location: "Tavistock Rugby Grounds",
      isHome: true,
    },
  ],
  past: [
    {
      id: 4,
      opponent: "Eastside Eagles",
      date: "May 28, 2024",
      time: "3:30 PM",
      location: "Tavistock Rugby Grounds",
      isHome: true,
      result: "W 27-12",
    },
    {
      id: 5,
      opponent: "Northern Knights",
      date: "May 14, 2024",
      time: "5:00 PM",
      location: "Knights Field",
      isHome: false,
      result: "W 18-15",
    },
    {
      id: 6,
      opponent: "Southern Sharks",
      date: "May 7, 2024",
      time: "4:00 PM",
      location: "Shark Tank Arena",
      isHome: false,
      result: "L 10-22",
    },
  ]
};

const SchedulePage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  return (
    <div className="page-container">
      <h1 className="section-title">Season Schedule</h1>
      
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scheduleData.upcoming.map((match, index) => (
              <Card 
                key={match.id} 
                className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  <div className="p-4 bg-team-gray/30 flex justify-between items-center border-b border-team-gray/30">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-team-silver mr-2" />
                      <span className="text-team-white font-medium">{match.date}</span>
                    </div>
                    <div className="px-3 py-1 rounded bg-team-silver/20 text-team-silver text-sm font-semibold">
                      {match.isHome ? 'HOME' : 'AWAY'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center">
                        <img 
                          src="/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png" 
                          alt="Tavistock Trash Pandas" 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-team-white font-display font-bold mt-2">TRASH PANDAS</span>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-team-silver font-display text-sm">VS</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-team-white">
                            {match.opponent.split(' ').map(word => word[0]).join('')}
                          </span>
                        </div>
                        <span className="text-team-white font-display font-bold mt-2">{match.opponent.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-team-gray/30 pt-4 space-y-3">
                      <div className="flex items-center">
                        <Clock className="text-team-silver mr-2 h-5 w-5" />
                        <span className="text-team-white">{match.time}</span>
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
        </TabsContent>
        
        <TabsContent value="past" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scheduleData.past.map((match, index) => (
              <Card 
                key={match.id} 
                className="bg-team-darkgray border-team-gray/30 overflow-hidden card-hover animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  <div className="p-4 bg-team-gray/30 flex justify-between items-center border-b border-team-gray/30">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-team-silver mr-2" />
                      <span className="text-team-white font-medium">{match.date}</span>
                    </div>
                    <div 
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        match.result.startsWith('W') 
                          ? 'bg-green-900/20 text-green-400' 
                          : 'bg-red-900/20 text-red-400'
                      }`}
                    >
                      {match.result}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col items-center">
                        <img 
                          src="/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png" 
                          alt="Tavistock Trash Pandas" 
                          className="w-16 h-16 object-contain"
                        />
                        <span className="text-team-white font-display font-bold mt-2">TRASH PANDAS</span>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-team-silver font-display text-sm">VS</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-team-gray/30 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-team-white">
                            {match.opponent.split(' ').map(word => word[0]).join('')}
                          </span>
                        </div>
                        <span className="text-team-white font-display font-bold mt-2">{match.opponent.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-team-gray/30 pt-4 space-y-3">
                      <div className="flex items-center">
                        <Clock className="text-team-silver mr-2 h-5 w-5" />
                        <span className="text-team-white">{match.time}</span>
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
        </TabsContent>
      </Tabs>
      
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
