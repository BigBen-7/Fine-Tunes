'use client';

import React from 'react';
import Image from 'next/image';
import { Playlist } from '../types';
import {ExternalLink, Play } from 'lucide-react';

interface UserPlaylistsProps {
  playlists: Playlist[];
}

/**
 * A component that displays a grid of the user's Spotify playlists.
 */
const UserPlaylists: React.FC<UserPlaylistsProps> = ({ playlists }) => {
  return (
    <div className="p-8  rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Playlists</h2>
      
      {!playlists || playlists.length === 0 ? (
        <p className="text-gray-400">You don&apos;t have any public playlists yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-col group">
              <div className="relative w-full mb-4 aspect-square">
                {playlist.images && playlist.images.length > 0 ? (
                  <Image
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="rounded-md object-cover w-full h-full"
                    width={300}
                    height={300}
                  />
                ) : (
                  // Placeholder for playlists without a cover image
                  <div className="w-full h-full bg-gray-600 rounded-md flex items-center justify-center">
                    <Play size={48} className="text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow flex flex-col">
                <h3 className="font-semibold text-white truncate group-hover:underline">
                  {playlist.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {playlist.tracks.total} tracks
                </p>
                
                <a 
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-auto flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors self-start pt-2"
                >
                  <span>Open on Spotify</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPlaylists;