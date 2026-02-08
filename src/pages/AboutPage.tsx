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
        <h1 className="section-title">About Our Club</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-display font-bold mb-4 text-team-cream">Our History</h2>
            <p className="mb-4 text-team-silver font-body leading-relaxed">
              Founded in 2024, the Tavistock Trash Pandas emerged from a group of rugby players tired of commuting to Brantford to play for the Broncos. Members of the 2023 ORL Championship winning
              Broncos decided to start their own team with one goal in mind: <strong className="text-team-cream">winning games without having to drive hours to practice.</strong> Since then, the team has practiced very little,
              but has won every game.
            </p>
            <p className="mb-4 text-team-silver font-body leading-relaxed italic">
              Our name, inspired by the tenacious nature of raccoons,
              represents our playing philosophy: being mischevious, fierce and a little bit silly.
            </p>
          </div>

          <div className="vintage-card p-8">
            <h2 className="text-sm font-headline tracking-[0.3em] uppercase text-team-gold mb-6">Team Mission</h2>
            <p className="mb-4 text-team-silver font-body">
              The Trash Pandas are committed to:
            </p>
            <ul className="list-none pl-0 mb-4 text-team-silver space-y-3 font-body">
              <li className="flex items-start"><span className="text-team-gold mr-3">&mdash;</span>Winning</li>
              <li className="flex items-start"><span className="text-team-gold mr-3">&mdash;</span>Being an autism friendly environment</li>
              <li className="flex items-start"><span className="text-team-gold mr-3">&mdash;</span>Developing top domestic rugby league athletes</li>
              <li className="flex items-start"><span className="text-team-gold mr-3">&mdash;</span>Drinking beers with friends</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-b border-team-gold/20 py-12 mb-12">
          <h2 className="text-sm font-headline tracking-[0.3em] uppercase text-team-gold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vintage-card p-8 text-center">
              <h3 className="text-xl font-display font-bold mb-3 text-team-cream">Scoring</h3>
              <p className="text-team-silver font-body italic">
                We score tries, and also cream pies
              </p>
            </div>
            <div className="vintage-card p-8 text-center">
              <h3 className="text-xl font-display font-bold mb-3 text-team-cream">Banter</h3>
              <p className="text-team-silver font-body italic">
              We're committed to making more instagram shitposts than actual rugby content
              </p>
            </div>
            <div className="vintage-card p-8 text-center">
              <h3 className="text-xl font-display font-bold mb-3 text-team-cream">Friendship</h3>
              <p className="text-team-silver font-body italic">
              With the power of friendship, we can do anything
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6 text-team-cream">Join Our Club</h2>
          <p className="mb-4 text-team-silver font-body leading-relaxed">
            The Trash Pandas roster for the 2025 season has been announced, but if you're willing to fork over $5000, I will gladly let you take my place.
          </p>
          <p className="mb-4 text-team-silver font-body leading-relaxed">
            To organize a bribe or get in contact with the team, message me on instagram @tavistocktrashpandas
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
