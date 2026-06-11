'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Track } from '../types';
import { Play, Pause, ExternalLink } from 'lucide-react';

interface TopTracksProps {
  tracks: Track[];
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks }) => {
  const [playingUrl, setPlayingUrl]     = useState<string | null>(null);
  const [audio, setAudio]               = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress]         = useState<number>(0);
  const [playError, setPlayError]       = useState<string | null>(null);
  const animationFrameRef               = useRef<number | null>(null);

  const stopCurrent = (a: HTMLAudioElement | null) => {
    if (a) a.pause();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const togglePreview = (track: Track) => {
    stopCurrent(audio);
    setPlayError(null);

    // Toggle off if already playing this track
    if (playingUrl === track.preview_url) {
      setPlayingUrl(null);
      setAudio(null);
      setProgress(0);
      return;
    }

    if (!track.preview_url) return;

    const newAudio = new Audio(track.preview_url);
    setAudio(newAudio);
    setPlayingUrl(track.preview_url);
    setProgress(0);

    newAudio.play().catch((err: Error) => {
      setPlayError(`Could not play preview: ${err.message}`);
      setPlayingUrl(null);
      setAudio(null);
      setProgress(0);
    });

    const tick = () => {
      if (newAudio.paused) return;
      const pct = Math.min((newAudio.currentTime / 30) * 100, 100);
      setProgress(pct);
      if (newAudio.currentTime < 30) {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    newAudio.addEventListener('timeupdate', () => {
      if (newAudio.currentTime >= 30) {
        stopCurrent(newAudio);
        setPlayingUrl(null);
        setAudio(null);
        setProgress(0);
      }
    });

    newAudio.onended = () => {
      setPlayingUrl(null);
      setAudio(null);
      setProgress(0);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => stopCurrent(audio);
  }, [audio]);

  const previewCount = tracks.filter((t) => t.preview_url).length;

  return (
    <div className="p-8 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Top Tracks</h2>
        <p className="text-gray-400">
          Your most played songs
          {previewCount > 0
            ? ` • ${previewCount} of ${tracks.length} have previews — hover to play`
            : ' • Spotify previews unavailable for these tracks'}
        </p>
        {previewCount === 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Spotify deprecated audio previews in 2024. Click any track to open it in Spotify.
          </p>
        )}
      </div>

      {playError && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {playError}
        </div>
      )}

      {!tracks || tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Couldn&apos;t find your top tracks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => {
            const isPlaying    = playingUrl === track.preview_url && !!track.preview_url;
            const hasPreview   = !!track.preview_url;

            return (
              <div
                key={track.id}
                className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col"
              >
                {/* Album art */}
                <div className="relative w-full mb-3 aspect-square">
                  <Image
                    src={track.album.images[0]?.url || '/placeholder.png'}
                    alt={track.album.name}
                    className="rounded-lg object-cover shadow-lg"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />

                  {/* Overlay — play button if preview available, open-link if not */}
                  {hasPreview ? (
                    <div
                      onClick={() => togglePreview(track)}
                      className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${
                        isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-xl">
                        {isPlaying ? (
                          <Pause size={28} className="text-white" />
                        ) : (
                          <Play size={28} className="text-white ml-1" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 gap-2"
                    >
                      <ExternalLink size={22} className="text-white" />
                      <span className="text-xs text-gray-200">Open in Spotify</span>
                    </a>
                  )}

                  {/* Progress bar */}
                  {isPlaying && (
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Playing indicator */}
                  {isPlaying && (
                    <div className="absolute top-2 right-2 flex gap-0.5">
                      <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="flex-grow flex flex-col">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate mb-3">
                    {track.artists.map((a) => a.name).join(', ')}
                  </p>
                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-auto flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors group/link"
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopTracks;
