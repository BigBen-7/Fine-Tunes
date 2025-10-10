'use client';

import React from 'react';
import Image from 'next/image';
import { NowPlaying, RecentlyPlayed } from '../types';
import { ExternalLink } from 'lucide-react';

// Define the props this component expects
interface PlayerWidgetProps {
  nowPlaying: NowPlaying | null;
  recentlyPlayed: RecentlyPlayed | null;
}

const PlayerWidget: React.FC<PlayerWidgetProps> = ({ nowPlaying, recentlyPlayed }) => {
  // Determine if there is a currently playing track
  const isPlaying = nowPlaying && nowPlaying.item;

  if (isPlaying) {
    const track = nowPlaying.item;
    return (
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Now Playing</h2>
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0">
            <Image
              src={track.album.images[0]?.url}
              alt={track.album.name}
              className="rounded-md object-cover shadow-lg"
              layout="fill"
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="font-bold text-white text-lg truncate hover:underline">{track.name}</a>
            <p className="text-gray-300 truncate">{track.artists.map((artist) => artist.name).join(', ')}</p>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-5 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <span className="text-green-400 text-sm ml-2">Playing</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to Recently Played if nothing is currently playing
  const recentTracks = recentlyPlayed?.items;

  if (recentTracks && recentTracks.length > 0) {
    return (
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4">Recently Played</h2>
        <ul className="space-y-3">
          {recentTracks.map(({ track }, index) => (
            <li key={`${track.id}-${index}`} className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={track.album.images[0]?.url}
                  alt={track.album.name}
                  className="rounded-md object-cover"
                  layout="fill"
                />
              </div>
              <div className="flex-grow overflow-hidden">
                <p className="font-semibold text-white truncate">{track.name}</p>
                <p className="text-sm text-gray-400 truncate">{track.artists.map((artist) => artist.name).join(', ')}</p>
              </div>
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // If there's nothing playing and no recent tracks, render nothing.
  return null;
};

export default PlayerWidget;