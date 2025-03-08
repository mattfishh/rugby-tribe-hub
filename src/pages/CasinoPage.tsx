
import React from 'react';
import { Helmet } from 'react-helmet-async';

const CasinoPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Casino | Tavistock Trash Pandas Rugby</title>
        <meta name="description" content="Tavistock Trash Pandas Rugby team's interactive casino games and entertainment." />
      </Helmet>
      
      <div className="page-container">
        <h1 className="section-title">Trash Pandas Casino</h1>
        
        <div className="bg-team-darkgray rounded-lg p-8 mb-12 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Coming Soon!</h2>
          <p className="text-xl text-team-silver mb-6">
            Our interactive casino games are currently under development.
          </p>
          <p className="text-team-silver">
            Check back later for exciting games and opportunities to support the Tavistock Trash Pandas!
          </p>
          
          <div className="mt-12 flex justify-center">
            <div className="relative w-24 h-24 animate-bounce">
              <img 
                src="/lovable-uploads/11addc92-eec4-4bc8-bf09-e03a971de567.png" 
                alt="Tavistock Trash Pandas Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoPage;
