
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About | Tavistock Trash Pandas Rugby</title>
        <meta name="description" content="Learn about the Tavistock Trash Pandas Rugby team, our history, mission, and values." />
      </Helmet>
      
      <div className="page-container">
        <h1 className="section-title">About Our Team</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-display font-bold mb-4">Our History</h2>
            <p className="mb-4 text-team-silver">
              Founded in 2018, the Tavistock Trash Pandas Rugby Club emerged from a group of passionate rugby enthusiasts 
              determined to bring competitive rugby to our community. What started as casual training sessions at local 
              parks has evolved into one of the region's most respected rugby programs.
            </p>
            <p className="mb-4 text-team-silver">
              Our name, inspired by the tenacious and resourceful nature of raccoons (affectionately known as "trash pandas"), 
              represents our playing philosophy: adaptable, resilient, and surprisingly tactical. Just as raccoons 
              are known for their cleverness and versatility, our team approaches each match with strategic intelligence 
              and unwavering determination.
            </p>
          </div>
          
          <div className="bg-team-darkgray rounded-lg p-6">
            <h2 className="text-2xl font-display font-bold mb-4">Team Mission</h2>
            <p className="mb-4 text-team-silver">
              The Tavistock Trash Pandas are committed to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-team-silver space-y-2">
              <li>Promoting rugby excellence through disciplined training and tactical innovation</li>
              <li>Creating an inclusive environment that welcomes players of all skill levels</li>
              <li>Developing rugby talent while emphasizing sportsmanship and character</li>
              <li>Engaging with our community through outreach and youth development programs</li>
              <li>Building lasting camaraderie among teammates on and off the field</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-team-darkgray/50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Resilience</h3>
              <p className="text-team-silver">
                We embrace challenges, learn from setbacks, and always come back stronger.
              </p>
            </div>
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Innovation</h3>
              <p className="text-team-silver">
                We constantly evolve our game, finding creative solutions on and off the field.
              </p>
            </div>
            <div className="bg-team-darkgray p-6 rounded-lg text-center">
              <h3 className="text-xl font-display font-bold mb-3">Community</h3>
              <p className="text-team-silver">
                We're more than a team—we're a family, supporting each other and our local area.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">Join Our Team</h2>
          <p className="mb-4 text-team-silver">
            The Tavistock Trash Pandas are always looking for passionate individuals to join our rugby family. 
            Whether you're an experienced player or new to the sport, we have a place for you.
          </p>
          <p className="mb-4 text-team-silver">
            Training sessions are held every Tuesday and Thursday evening at Tavistock Rugby Grounds.
            For more information, contact our team manager at recruit@tavistocktrashpandas.com.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-6 py-3 rounded-md bg-team-silver text-team-black font-display font-semibold hover:bg-team-white transition-colors duration-300">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
