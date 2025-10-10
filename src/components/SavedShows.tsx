'use client';

import React from 'react';
import Image from 'next/image';
// import { SavedShows } from '../types';
import { ExternalLink } from 'lucide-react';
import type { SavedShows as SavedShowsType } from '../types';
    
// Define the props this component expects
interface SavedShowsProps {
  savedShows: SavedShowsType | null;
}

const SavedShows: React.FC<SavedShowsProps> = ({ savedShows }) => {
  const shows = savedShows?.items;

  // If there are no saved shows, we don't render anything.
  if (!shows || shows.length === 0) {
    return null;
  }

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
      <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Your Podcasts</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map(({ show }) => (
          <a
            key={show.id}
            href={show.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="relative aspect-square w-full mb-2">
              <Image
                src={show.images[0]?.url}
                alt={show.name}
                className="rounded-md object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                layout="fill"
              />
            </div>
            <p className="font-semibold text-white text-sm truncate group-hover:underline">{show.name}</p>
            <p className="text-xs text-gray-400 truncate">{show.publisher}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SavedShows;