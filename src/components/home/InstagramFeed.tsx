
import React, { useEffect } from 'react';
import { Instagram } from 'lucide-react';

const InstagramFeed: React.FC = () => {
  // Load Instagram embed script
  useEffect(() => {
    // Only add the script if it doesn't already exist
    if (!document.getElementById('instagram-embed-script')) {
      const script = document.createElement('script');
      script.id = 'instagram-embed-script';
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      // Clean up the script when component unmounts
      return () => {
        // We don't remove it because it could be used by other components
        // If you really want to remove it:
        // const scriptEl = document.getElementById('instagram-embed-script');
        // if (scriptEl) document.body.removeChild(scriptEl);
      };
    }
    
    // Instagram needs to process embeds after page loads
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  // Reload Instagram embeds when component mounts
  useEffect(() => {
    // Give the DOM time to render the blockquotes
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
        {/* Instagram post 1 */}
        <div className="bg-team-darkgray rounded-lg overflow-hidden border border-team-gray/30">
          <blockquote 
            className="instagram-media" 
            data-instgrm-captioned 
            data-instgrm-permalink="https://www.instagram.com/p/DGiob4hu_fF/"
            data-instgrm-version="14"
            style={{ 
              margin: 0, 
              width: '100%', 
              minHeight: '500px',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          ></blockquote>
        </div>
        
        {/* Instagram post 2 */}
        <div className="bg-team-darkgray rounded-lg overflow-hidden border border-team-gray/30">
          <blockquote 
            className="instagram-media" 
            data-instgrm-captioned 
            data-instgrm-permalink="https://www.instagram.com/p/C6oFRGtOW2N/"
            data-instgrm-version="14"
            style={{ 
              margin: 0, 
              width: '100%', 
              minHeight: '500px',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          ></blockquote>
        </div>
        
        {/* Instagram post 3 */}
        <div className="bg-team-darkgray rounded-lg overflow-hidden border border-team-gray/30">
          <blockquote 
            className="instagram-media" 
            data-instgrm-captioned 
            data-instgrm-permalink="https://www.instagram.com/reel/C59MmYhv0x5/"
            data-instgrm-version="14"
            style={{ 
              margin: 0, 
              width: '100%', 
              minHeight: '500px',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none'
            }}
          ></blockquote>
        </div>
      </div>
    </div>
  );
};

// Add type definition for window.instgrm
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramFeed;
