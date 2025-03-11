import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About | Tavistock Trash Pandas</title>
        <meta name="description" content="Learn about the Tavistock Trash Pandas Rugby team, our history, and our mission." />
      </Helmet>
      
      <div className="page-container">
        <h1 className="section-title">About Our Team</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-display font-bold mb-4">Our History</h2>
            <p className="mb-4 text-team-silver">
              Founded in 2024, the Tavistock Trash Pandas emerged from a group of rugby players tired of commuting to Brantford to play for the Broncos. Members of the 2023 ORL Championship winning
              Broncos decided to start their own team with one goal in mind: <strong>winning games without having to drive hours to practice.</strong> Since then, the team has practiced very little,
              but has won every game.
            </p>
            <p className="mb-4 text-team-silver">
              Our name, inspired by the tenacious nature of raccoons, 
              represents our playing philosophy: being mischevious, fierce and a little bit silly.
            </p>
          </div>
          
          <div className="bg-team-darkgray rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold mb-4">Team Mission</h2>
            <p className="mb-4 text-team-silver">
              The Trash Pandas are committed to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-team-silver space-y-2">
              <li>Winning</li>
              <li>Being an autism friendly environment</li>
              <li>Developing top domestic rugby league athletes </li>
              <li>Drinking beers with friends</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-team-darkgray/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Scoring</h3>
              <p className="text-team-silver">
                We score tries, and also cream pies
              </p>
            </div>
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Banter</h3>
              <p className="text-team-silver">
              We're committed to making more instagram shitposts than actual rugby content
              </p>
            </div>
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Friendship</h3>
              <p className="text-team-silver">
              With the power of friendship, we can do anything
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">Join Our Team</h2>
          <p className="mb-4 text-team-silver">
            The Trash Pandas roster for the 2025 season has been announced, but if you're willing to fork over $5000, I will gladly let you take my place.
          </p>
          <p className="mb-4 text-team-silver">
            To organize a bribe or get in contact with the team, message me on instagram @tavistocktrashpandas
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
