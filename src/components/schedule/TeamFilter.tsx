
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Team = {
  id: string;
  name: string;
  shortName: string;
  isHomeTeam: boolean;
};

type TeamFilterProps = {
  teams: Team[];
  selectedTeam: string;
  onSelectTeam: (teamId: string) => void;
};

const TeamFilter = ({ teams, selectedTeam, onSelectTeam }: TeamFilterProps) => {
  return (
    <div className="mb-6">
      <Select 
        value={selectedTeam} 
        onValueChange={onSelectTeam}
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
  );
};

export default TeamFilter;
