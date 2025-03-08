
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Flag, Award, Phone } from 'lucide-react';

// Mock data for the roster
const rosterData = {
  forwards: [
    {
      id: 1,
      name: "Jack Williams",
      position: "Prop",
      number: 1,
      height: "6'2\"",
      weight: "240 lbs",
      age: 28,
      hometown: "Tavistock",
      experience: "7 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Jack+W.",
    },
    {
      id: 2,
      name: "Thomas Smith",
      position: "Hooker",
      number: 2,
      height: "5'11\"",
      weight: "220 lbs",
      age: 25,
      hometown: "Brighton",
      experience: "5 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Thomas+S.",
    },
    {
      id: 3,
      name: "Ryan Johnson",
      position: "Prop",
      number: 3,
      height: "6'3\"",
      weight: "255 lbs",
      age: 29,
      hometown: "Oxford",
      experience: "8 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Ryan+J.",
    },
    {
      id: 4,
      name: "Michael Brown",
      position: "Lock",
      number: 4,
      height: "6'6\"",
      weight: "245 lbs",
      age: 26,
      hometown: "Tavistock",
      experience: "4 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Michael+B.",
    },
    {
      id: 5,
      name: "David Jones",
      position: "Lock",
      number: 5,
      height: "6'5\"",
      weight: "240 lbs",
      age: 30,
      hometown: "Cambridge",
      experience: "10 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=David+J.",
    },
    {
      id: 6,
      name: "James Wilson",
      position: "Flanker",
      number: 6,
      height: "6'2\"",
      weight: "220 lbs",
      age: 26,
      hometown: "Tavistock",
      experience: "5 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=James+W.",
    },
  ],
  backs: [
    {
      id: 7,
      name: "Harry Moore",
      position: "Scrum Half",
      number: 9,
      height: "5'9\"",
      weight: "175 lbs",
      age: 24,
      hometown: "London",
      experience: "6 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Harry+M.",
    },
    {
      id: 8,
      name: "Oliver Taylor",
      position: "Fly Half",
      number: 10,
      height: "5'11\"",
      weight: "185 lbs",
      age: 27,
      hometown: "Tavistock",
      experience: "7 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Oliver+T.",
    },
    {
      id: 9,
      name: "Noah Martin",
      position: "Inside Center",
      number: 12,
      height: "6'0\"",
      weight: "200 lbs",
      age: 25,
      hometown: "Exeter",
      experience: "5 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Noah+M.",
    },
    {
      id: 10,
      name: "Charlie Wright",
      position: "Outside Center",
      number: 13,
      height: "6'1\"",
      weight: "205 lbs",
      age: 26,
      hometown: "Tavistock",
      experience: "4 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Charlie+W.",
    },
    {
      id: 11,
      name: "George Thompson",
      position: "Winger",
      number: 14,
      height: "5'10\"",
      weight: "180 lbs",
      age: 23,
      hometown: "Bristol",
      experience: "3 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=George+T.",
    },
    {
      id: 12,
      name: "Leo Clark",
      position: "Fullback",
      number: 15,
      height: "6'0\"",
      weight: "190 lbs",
      age: 28,
      hometown: "Tavistock",
      experience: "8 years",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Leo+C.",
    },
  ],
  coaching: [
    {
      id: 13,
      name: "Robert Anderson",
      position: "Head Coach",
      experience: "15 years",
      background: "Former National Team Player",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Robert",
    },
    {
      id: 14,
      name: "Steven Lewis",
      position: "Assistant Coach",
      experience: "10 years",
      background: "Specialist in Forward Play",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Steven",
    },
    {
      id: 15,
      name: "Mark Davies",
      position: "Fitness Coach",
      experience: "12 years",
      background: "Sports Science Specialist",
      imageUrl: "https://placehold.co/300x300/333333/FFFFFF?text=Coach+Mark",
    },
  ],
};

const RosterPage = () => {
  const [activeTab, setActiveTab] = useState('forwards');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };
  
  const closePlayerDetails = () => {
    setSelectedPlayer(null);
  };
  
  return (
    <div className="page-container">
      <h1 className="section-title">Team Roster</h1>
      
      <Tabs 
        defaultValue="forwards" 
        className="w-full" 
        onValueChange={(value) => {
          setActiveTab(value);
          setSelectedPlayer(null);
        }}
      >
        <TabsList className="mb-8 bg-team-darkgray">
          <TabsTrigger 
            value="forwards" 
            className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
          >
            Forwards
          </TabsTrigger>
          <TabsTrigger 
            value="backs" 
            className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
          >
            Backs
          </TabsTrigger>
          <TabsTrigger 
            value="coaching" 
            className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
          >
            Coaching Staff
          </TabsTrigger>
        </TabsList>
        
        {['forwards', 'backs'].map((section) => (
          <TabsContent key={section} value={section} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rosterData[section].map((player, index) => (
                <Card 
                  key={player.id} 
                  className="bg-team-darkgray border-team-gray/30 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex justify-between items-center">
                    <span className="text-team-white font-display font-bold">{player.name}</span>
                    <div className="px-3 py-1 bg-team-silver/20 rounded text-team-silver text-sm">
                      #{player.number}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3">
                      <img 
                        src={player.imageUrl} 
                        alt={player.name} 
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="text-team-white font-semibold mb-1">{player.position}</div>
                      <div className="text-team-silver text-sm mb-2">
                        {player.height} | {player.weight}
                      </div>
                      <div className="flex items-center text-team-silver text-sm">
                        <Flag className="h-4 w-4 mr-1" />
                        {player.hometown}
                      </div>
                      <div className="flex items-center text-team-silver text-sm mt-1">
                        <Award className="h-4 w-4 mr-1" />
                        {player.experience}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
        
        <TabsContent value="coaching" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rosterData.coaching.map((coach, index) => (
              <Card 
                key={coach.id} 
                className="bg-team-darkgray border-team-gray/30 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 bg-team-gray/30 border-b border-team-gray/30">
                  <span className="text-team-white font-display font-bold">{coach.name}</span>
                </div>
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={coach.imageUrl} 
                      alt={coach.name} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <div className="text-team-white font-semibold mb-1">{coach.position}</div>
                    <div className="text-team-silver text-sm mb-2">
                      Experience: {coach.experience}
                    </div>
                    <div className="text-team-silver text-sm">
                      {coach.background}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Player details modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closePlayerDetails}>
          <div 
            className="bg-team-darkgray border border-team-gray/30 rounded-lg max-w-2xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex justify-between items-center">
              <div className="flex items-center">
                <div className="px-3 py-1 bg-team-silver/20 rounded text-team-silver text-sm mr-3">
                  #{selectedPlayer.number}
                </div>
                <span className="text-team-white font-display font-bold text-xl">{selectedPlayer.name}</span>
              </div>
              <button 
                onClick={closePlayerDetails}
                className="text-team-silver hover:text-team-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img 
                  src={selectedPlayer.imageUrl} 
                  alt={selectedPlayer.name} 
                  className="w-full aspect-square object-cover rounded-md border border-team-gray/30"
                />
              </div>
              
              <div className="md:w-2/3 md:pl-6">
                <div className="bg-team-gray/20 rounded-md p-4 mb-4">
                  <h3 className="text-team-white font-display font-bold text-lg mb-2">Player Info</h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                      <div className="text-team-silver text-sm">Position</div>
                      <div className="text-team-white">{selectedPlayer.position}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Age</div>
                      <div className="text-team-white">{selectedPlayer.age}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Height</div>
                      <div className="text-team-white">{selectedPlayer.height}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Weight</div>
                      <div className="text-team-white">{selectedPlayer.weight}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Hometown</div>
                      <div className="text-team-white">{selectedPlayer.hometown}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Experience</div>
                      <div className="text-team-white">{selectedPlayer.experience}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-team-gray/20 rounded-md p-4">
                  <h3 className="text-team-white font-display font-bold text-lg mb-2">Season Stats</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-team-gray/30 p-3 rounded-md text-center">
                      <div className="text-team-silver text-sm">Matches</div>
                      <div className="text-team-white text-xl font-bold">12</div>
                    </div>
                    <div className="bg-team-gray/30 p-3 rounded-md text-center">
                      <div className="text-team-silver text-sm">Tries</div>
                      <div className="text-team-white text-xl font-bold">3</div>
                    </div>
                    <div className="bg-team-gray/30 p-3 rounded-md text-center">
                      <div className="text-team-silver text-sm">Cards</div>
                      <div className="text-team-white text-xl font-bold">1</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-team-silver text-team-black rounded-md font-semibold hover:bg-team-white transition-colors">
                    <Phone className="h-4 w-4 mr-2 inline-block" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-12 p-6 bg-team-darkgray border border-team-gray/30 rounded-lg">
        <h2 className="text-2xl font-display font-bold text-team-white mb-4">Join Our Team</h2>
        <p className="text-team-silver mb-4">
          Interested in joining the Tavistock Trash Pandas Rugby Club? We're always looking for new talent to join our ranks.
        </p>
        <button className="px-6 py-3 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300">
          Contact Recruitment
        </button>
      </div>
    </div>
  );
};

export default RosterPage;
