import React from 'react';
import Image from 'next/image';
import { Track } from '../types';

interface TopTracksProps {
  tracks: Track[];
}

/**
 * A component that displays a list of the user's top tracks in a responsive grid.
 */
const TopTracks: React.FC<TopTracksProps> = ({ tracks }) => {
  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Top Tracks</h2>
      
      {/* Check if there are tracks to display */}
      {!tracks || tracks.length === 0 ? (
        <p className="text-gray-400">Looks like we couldn&apos;t find your top tracks. Try listening to more music!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tracks.map((track) => (
            <a 
              key={track.id}
              href={track.external_urls.spotify}
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security best practice for external links
              className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600 transition duration-300 group"
            >
              <div className="relative w-full mb-4" style={{ paddingBottom: '100%' }}>
                {/* Album Art */}
                <Image
                  src={track.album.images[0]?.url}
                  alt={track.album.name}
                  className="rounded-md object-cover"
                  layout="fill"
                />
              </div>
              <div>
                {/* Track Name */}
                <h3 className="font-semibold text-white truncate group-hover:underline">
                  {track.name}
                </h3>
                {/* Artist Name(s) */}
                <p className="text-sm text-gray-400 truncate">
                  {track.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopTracks;