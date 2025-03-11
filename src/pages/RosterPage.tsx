
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getPlayers, getHomeTeam } from '@/services/database';
import { Link } from 'react-router-dom';
import type { Player, Team } from '@/types/database';

const RosterPage = () => {
  const [activeTab, setActiveTab] = useState('team');
  
  const { data: homeTeam, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['home-team'],
    queryFn: getHomeTeam
  });
  
  const { data: players, isLoading: isLoadingPlayers } = useQuery({
    queryKey: ['players', homeTeam?.id],
    queryFn: () => homeTeam ? getPlayers(homeTeam.id) : Promise.resolve([]),
    enabled: !!homeTeam
  });
  
  const isLoading = isLoadingTeam || isLoadingPlayers;
  
  // Group players by position: "Good Guy" or "Bad Guy"
  const groupPlayersByPosition = (players: Player[] | undefined) => {
    if (!players) return { goodGuys: [], badGuys: [] };
    
    return {
      goodGuys: players.filter(player => player.position === 'Good Guy'),
      badGuys: players.filter(player => player.position === 'Bad Guy')
    };
  };
  
  const { goodGuys, badGuys } = groupPlayersByPosition(players);
  
  const renderPlayerCard = (player: Player) => (
    <Card key={player.id} className="bg-team-darkgray border-team-gray/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-w-3 aspect-h-4">
          <img 
            src={player.image_url || '/placeholder.svg'} 
            alt={player.name} 
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-bold text-team-white">{player.name}</h3>
            <span className="text-2xl font-display font-bold text-team-silver">#{player.number}</span>
          </div>
          
          <div className="text-team-silver mb-3">{player.position}</div>
          
          {(player.height || player.weight) && (
            <div className="flex space-x-3 text-sm mb-3">
              {player.height && (
                <div className="text-team-white/70">
                  <span className="font-semibold">Height:</span> {player.height}
                </div>
              )}
              
              {player.weight && (
                <div className="text-team-white/70">
                  <span className="font-semibold">Weight:</span> {player.weight}
                </div>
              )}
            </div>
          )}
          
          {player.hometown && (
            <div className="text-sm text-team-white/70 mb-4">
              <span className="font-semibold">From:</span> {player.hometown}
            </div>
          )}
          
          <Link 
            to={`/player/${player.id}`}
            className="block w-full text-center py-2 bg-team-silver text-team-black font-display font-semibold rounded hover:bg-team-white transition-colors duration-300"
          >
            Player Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="page-container">
      <h1 className="section-title">Team Roster</h1>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-silver"></div>
        </div>
      ) : (
        <Tabs defaultValue="team" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-team-darkgray">
            <TabsTrigger 
              value="team" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              Full Roster
            </TabsTrigger>
            <TabsTrigger 
              value="good-guys" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              Good Guys
            </TabsTrigger>
            <TabsTrigger 
              value="bad-guys" 
              className="data-[state=active]:bg-team-gray data-[state=active]:text-team-white"
            >
              Bad Guys
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="team" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {players?.map(renderPlayerCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="good-guys" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {goodGuys.map(renderPlayerCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="bad-guys" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {badGuys.map(renderPlayerCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RosterPage;
