
import React from 'react';
import { cn } from '@/lib/utils';

interface TeamLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ 
  className, 
  size = 'md',
  withText = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={cn('flex items-center', className)}>
      <img 
        src="/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png" 
        alt="Tavistock Trash Pandas Logo" 
        className={cn(
          'object-contain',
          sizeClasses[size]
        )}
      />
      {withText && (
        <div className="ml-3 font-display font-bold">
          <div className="text-sm sm:text-base uppercase tracking-wider text-team-silver">Tavistock</div>
          <div className="text-lg sm:text-2xl uppercase tracking-wide text-team-white -mt-1">TRASH PANDAS</div>
        </div>
      )}
    </div>
  );
};

export default TeamLogo;
