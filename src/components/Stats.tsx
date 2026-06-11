'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Track, TopArtist } from '../types';
import { ExternalLink } from 'lucide-react';

interface StatsProps {
  topTracks: Track[];
  topArtists: TopArtist[];
}

const DECADE_ORDER = ['2020s', '2010s', '2000s', '1990s', '1980s', 'Earlier'];

const GENRE_COLORS = [
  'bg-green-500/20  border-green-500/30  text-green-300',
  'bg-purple-500/20 border-purple-500/30 text-purple-300',
  'bg-blue-500/20   border-blue-500/30   text-blue-300',
  'bg-orange-500/20 border-orange-500/30 text-orange-300',
  'bg-pink-500/20   border-pink-500/30   text-pink-300',
];

const capitalize = (s: string) =>
  s.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const Stats: React.FC<StatsProps> = ({ topTracks, topArtists }) => {
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topArtists.forEach((artist) =>
      artist.genres.forEach((g) => { counts[g] = (counts[g] || 0) + 1; })
    );
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [topArtists]);

  const eraCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    topTracks.forEach((track) => {
      const year = parseInt(track.album.release_date?.slice(0, 4) || '0', 10);
      const decade =
        year >= 2020 ? '2020s' :
        year >= 2010 ? '2010s' :
        year >= 2000 ? '2000s' :
        year >= 1990 ? '1990s' :
        year >= 1980 ? '1980s' : 'Earlier';
      counts[decade] = (counts[decade] || 0) + 1;
    });
    return DECADE_ORDER
      .filter((d) => counts[d])
      .map((d) => [d, counts[d]] as [string, number]);
  }, [topTracks]);

  const topGenres      = genreCounts.slice(0, 5);
  const maxGenreCount  = topGenres[0]?.[1] || 1;
  const maxEraCount    = Math.max(...eraCounts.map(([, c]) => c), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Your Music Stats</h2>
        <p className="text-gray-400">Based on the last 6 months of listening</p>
      </div>

      {/* Top row: Sound tags · Genre bars · Era bars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Your Sound */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Sound</h3>
          {topGenres.length === 0 ? (
            <p className="text-gray-500 text-sm">Not enough data yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {topGenres.map(([genre], i) => (
                <span
                  key={genre}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${GENRE_COLORS[i] ?? GENRE_COLORS[4]}`}
                >
                  {capitalize(genre)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Genre bars */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Genres</h3>
          {genreCounts.length === 0 ? (
            <p className="text-gray-500 text-sm">Not enough data yet.</p>
          ) : (
            <div className="space-y-3">
              {genreCounts.slice(0, 6).map(([genre, count]) => (
                <div key={genre}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 capitalize truncate max-w-[75%]">{genre}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(count / maxGenreCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Era bars */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Eras You Love</h3>
          {eraCounts.length === 0 ? (
            <p className="text-gray-500 text-sm">Not enough data yet.</p>
          ) : (
            <div className="space-y-3">
              {eraCounts.map(([decade, count]) => (
                <div key={decade}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{decade}</span>
                    <span className="text-gray-500">{count} tracks</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(count / maxEraCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Artists */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Top Artists</h3>
        {topArtists.length === 0 ? (
          <p className="text-gray-500 text-sm">Not enough data yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {topArtists.map((artist, i) => (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 shrink-0">
                  {i === 0 && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-black z-10">
                      1
                    </div>
                  )}
                  <Image
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-sm font-semibold text-white truncate w-full group-hover:text-green-400 transition-colors">
                  {artist.name}
                </p>
                {artist.genres[0] && (
                  <p className="text-xs text-gray-500 capitalize truncate w-full">{artist.genres[0]}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Top Tracks numbered list */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Top Tracks</h3>
        {topTracks.length === 0 ? (
          <p className="text-gray-500 text-sm">Not enough data yet.</p>
        ) : (
          <div className="space-y-1">
            {topTracks.slice(0, 20).map((track, i) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="text-gray-600 text-sm w-5 text-right shrink-0 tabular-nums">{i + 1}</span>
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src={track.album.images[0]?.url}
                    alt={track.album.name}
                    fill
                    sizes="40px"
                    className="rounded object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {track.artists.map((a) => a.name).join(', ')}
                    {track.album.release_date && (
                      <span className="text-gray-600"> · {track.album.release_date.slice(0, 4)}</span>
                    )}
                  </p>
                </div>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  <ExternalLink size={15} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
