
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Flag, Award, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPlayers, getCoaches, getHomeTeam } from '@/services/database';
import type { Player, Coach } from '@/types/database';

const RosterPage = () => {
  const [activeTab, setActiveTab] = useState('forwards');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const { data: homeTeam } = useQuery({
    queryKey: ['teams', 'home'],
    queryFn: getHomeTeam
  });

  const { data: allPlayers, isLoading: playersLoading } = useQuery({
    queryKey: ['players', homeTeam?.id],
    queryFn: () => homeTeam?.id ? getPlayers(homeTeam.id) : Promise.resolve([]),
    enabled: !!homeTeam?.id
  });

  const { data: coaches, isLoading: coachesLoading } = useQuery({
    queryKey: ['coaches', homeTeam?.id],
    queryFn: () => homeTeam?.id ? getCoaches(homeTeam.id) : Promise.resolve([]),
    enabled: !!homeTeam?.id
  });

  // Split players into forwards and backs based on position
  const forwardPositions = ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8'];
  const backPositions = ['Scrum Half', 'Fly Half', 'Inside Center', 'Outside Center', 'Winger', 'Fullback'];

  const forwards = allPlayers?.filter(player => 
    forwardPositions.some(pos => player.position.includes(pos))
  ) || [];

  const backs = allPlayers?.filter(player => 
    backPositions.some(pos => player.position.includes(pos))
  ) || [];

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };
  
  const closePlayerDetails = () => {
    setSelectedPlayer(null);
  };

  const isLoading = playersLoading || coachesLoading || !homeTeam;
  
  return (
    <div className="page-container">
      <h1 className="section-title">Team Roster</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
        </div>
      ) : (
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
                {(section === 'forwards' ? forwards : backs).map((player, index) => (
                  <Card 
                    key={player.id} 
                    className="bg-team-darkgray border-team-gray/30 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => handlePlayerClick(player)}
                  >
                    <div className="p-4 bg-team-gray/30 border-b border-team-gray/30 flex justify-between items-center">
                      <span className="text-team-white font-display font-bold">{player.name}</span>
                      <div className="px-3 py-1 bg-team-silver/20 rounded text-team-silver text-sm">
                        #{player.number || '-'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={player.image_url || "https://placehold.co/300x300/333333/FFFFFF?text=Player"} 
                          alt={player.name} 
                          className="w-full aspect-square object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="text-team-white font-semibold mb-1">{player.position}</div>
                        <div className="text-team-silver text-sm mb-2">
                          {player.height || '-'} | {player.weight || '-'}
                        </div>
                        <div className="flex items-center text-team-silver text-sm">
                          <Flag className="h-4 w-4 mr-1" />
                          {player.hometown || 'Unknown'}
                        </div>
                        <div className="flex items-center text-team-silver text-sm mt-1">
                          <Award className="h-4 w-4 mr-1" />
                          {player.experience || 'Unknown'}
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
              {coaches?.map((coach, index) => (
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
                        src={coach.image_url || "https://placehold.co/300x300/333333/FFFFFF?text=Coach"} 
                        alt={coach.name} 
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <div className="text-team-white font-semibold mb-1">{coach.position}</div>
                      <div className="text-team-silver text-sm mb-2">
                        Experience: {coach.experience || 'Unknown'}
                      </div>
                      <div className="text-team-silver text-sm">
                        {coach.background || ''}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
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
                  #{selectedPlayer.number || '-'}
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
                  src={selectedPlayer.image_url || "https://placehold.co/300x300/333333/FFFFFF?text=Player"} 
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
                      <div className="text-team-white">{selectedPlayer.age || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Height</div>
                      <div className="text-team-white">{selectedPlayer.height || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Weight</div>
                      <div className="text-team-white">{selectedPlayer.weight || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Hometown</div>
                      <div className="text-team-white">{selectedPlayer.hometown || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-team-silver text-sm">Experience</div>
                      <div className="text-team-white">{selectedPlayer.experience || 'Unknown'}</div>
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
