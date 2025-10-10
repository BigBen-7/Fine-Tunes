import React from 'react';
import Image from 'next/image';
import { TopArtist } from '../types';

interface TopArtistsProps {
  artists: TopArtist[];
}

/**
 * A component that displays a list of the user's top artists.
 */
const TopArtists: React.FC<TopArtistsProps> = ({ artists }) => {
  return (
    <div className="p-8  rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Top Artists</h2>
      
      {!artists || artists.length === 0 ? (
        <p className="text-gray-400">We couldn&apos;t find your top artists. Keep listening!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {artists.map((artist) => (
            <a 
              key={artist.id}
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center group"
            >
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
                {/* Artist Image */}
                <Image
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="rounded-full object-cover transition duration-300 group-hover:scale-105"
                  layout="fill"
                />
              </div>
              {/* Artist Name */}
              <h3 className="font-semibold text-white truncate w-full group-hover:underline">
                {artist.name}
              </h3>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopArtists;