
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
        <SelectTrigger className="w-full md:w-72 bg-team-darkgray border-team-gold/20 text-team-cream font-body">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent className="bg-team-darkgray border-team-gold/20">
          <SelectItem value="all" className="text-team-cream hover:bg-team-gray/40 font-body">
            All Teams
          </SelectItem>
          {teams.map(team => (
            <SelectItem
              key={team.id}
              value={team.id}
              className="text-team-cream hover:bg-team-gray/40 font-body"
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
