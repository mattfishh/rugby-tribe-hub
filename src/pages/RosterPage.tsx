import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const FORWARD_POSITIONS = ["Prop", "Hooker", "Lock", "Flanker", "Number 8"];
const BACK_POSITIONS = ["Scrum Half", "Fly Half", "Centre", "Winger", "Fullback"];

const RosterPage = () => {
  const [activeTab, setActiveTab] = useState('team');

  const homeTeam = useQuery(api.teams.getHomeTeam);
  const players = useQuery(
    api.players.getByTeam,
    homeTeam ? { teamId: homeTeam._id } : "skip"
  );

  const isLoading = homeTeam === undefined || (homeTeam && players === undefined);

  const forwards = players?.filter(p => FORWARD_POSITIONS.includes(p.position)) ?? [];
  const backs = players?.filter(p => BACK_POSITIONS.includes(p.position)) ?? [];

  const renderPlayerCard = (player: NonNullable<typeof players>[number]) => (
    <Card key={player._id} className="bg-team-darkgray border-team-gold/20 overflow-hidden card-hover">
      <CardContent className="p-0">
        <div className="aspect-w-3 aspect-h-4">
          <img
            src={player.imageUrl || '/placeholder.svg'}
            alt={player.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-display font-bold text-team-cream">{player.name}</h3>
            {player.number && (
              <span className="text-2xl font-headline tracking-wider text-team-gold">#{player.number}</span>
            )}
          </div>

          <div className="text-team-silver font-body italic mb-3">{player.position}</div>

          {(player.height || player.weight) && (
            <div className="flex space-x-3 text-sm mb-3 font-body">
              {player.height && (
                <div className="text-team-cream/70">
                  <span className="font-semibold">Height:</span> {player.height}
                </div>
              )}

              {player.weight && (
                <div className="text-team-cream/70">
                  <span className="font-semibold">Weight:</span> {player.weight}
                </div>
              )}
            </div>
          )}

          {player.hometown && (
            <div className="text-sm text-team-cream/70 mb-4 font-body">
              <span className="font-semibold">From:</span> {player.hometown}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="page-container">
      <h1 className="section-title">Team Roster</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-team-gold"></div>
        </div>
      ) : (
        <Tabs defaultValue="team" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-team-darkgray border border-team-gold/20">
            <TabsTrigger
              value="team"
              className="font-headline text-xs tracking-[0.15em] uppercase data-[state=active]:bg-team-gray data-[state=active]:text-team-cream"
            >
              Full Roster
            </TabsTrigger>
            <TabsTrigger
              value="forwards"
              className="font-headline text-xs tracking-[0.15em] uppercase data-[state=active]:bg-team-gray data-[state=active]:text-team-cream"
            >
              Forwards
            </TabsTrigger>
            <TabsTrigger
              value="backs"
              className="font-headline text-xs tracking-[0.15em] uppercase data-[state=active]:bg-team-gray data-[state=active]:text-team-cream"
            >
              Backs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {players?.map(renderPlayerCard)}
            </div>
          </TabsContent>

          <TabsContent value="forwards" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {forwards.map(renderPlayerCard)}
            </div>
          </TabsContent>

          <TabsContent value="backs" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {backs.map(renderPlayerCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default RosterPage;
