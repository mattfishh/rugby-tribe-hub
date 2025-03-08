
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Instagram } from 'lucide-react';
import { format } from 'date-fns';

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

const InstagramFeed: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Since we can't use a real Instagram API without authentication,
  // we'll create mock data that looks realistic
  useEffect(() => {
    const mockPosts: InstagramPost[] = [
      {
        id: '1',
        media_url: 'https://placehold.co/400x400/333333/FFFFFF?text=Match+Day',
        permalink: 'https://www.instagram.com/p/example1/',
        caption: 'Match day! The Trash Pandas are ready to take on our rivals this Saturday. Come support your local team! 🏉 #RugbyLife #TrashPandas',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        media_url: 'https://placehold.co/400x400/333333/FFFFFF?text=Training',
        permalink: 'https://www.instagram.com/p/example2/',
        caption: 'Hard work at training tonight. Preparing for this weekend\'s big match! 💪 #PrepMode #RugbyTraining',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        media_url: 'https://placehold.co/400x400/333333/FFFFFF?text=Team+Spirit',
        permalink: 'https://www.instagram.com/p/example3/',
        caption: 'Team spirit is what makes us strong. Great session with the lads today! #TeamWork #TrashPandasRugby',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-team-silver">Unable to load Instagram posts</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">@tavistocktrashpandas</h2>
        <a 
          href="https://www.instagram.com/tavistocktrashpandas" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-team-silver hover:text-team-white transition-colors"
        >
          <Instagram className="w-5 h-5 mr-2" />
          <span>Follow us</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-team-darkgray rounded-lg overflow-hidden">
              <Skeleton className="w-full h-64 bg-team-gray/30" />
              <div className="p-4">
                <Skeleton className="w-3/4 h-4 bg-team-gray/30 mb-2" />
                <Skeleton className="w-full h-4 bg-team-gray/30 mb-2" />
                <Skeleton className="w-1/2 h-4 bg-team-gray/30" />
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-team-darkgray rounded-lg overflow-hidden border border-team-gray/30 hover:border-team-gray/60 transition-all hover:translate-y-[-5px]">
              <div className="aspect-square relative">
                <img src={post.media_url} alt="Instagram post" className="w-full h-full object-cover" />
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              </div>
              <div className="p-4">
                <p className="text-team-silver text-sm mb-2">
                  {format(new Date(post.timestamp), 'MMMM d, yyyy')}
                </p>
                <p className="text-team-white line-clamp-3">
                  {post.caption}
                </p>
                <a 
                  href={post.permalink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-team-silver hover:text-team-white transition-colors text-sm"
                >
                  View on Instagram
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstagramFeed;
