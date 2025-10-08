'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Track } from '../types';
import { Play, Pause, ExternalLink } from 'lucide-react';

interface TopTracksProps {
  tracks: Track[];
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks }) => {
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const togglePreview = (track: Track) => {
    console.log('Toggle preview clicked for:', track.name);
    
    if (audio) {
      audio.pause();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    if (playingUrl === track.preview_url) {
      setPlayingUrl(null);
      setAudio(null);
      setProgress(0);
    } else {
      if (track.preview_url) {
        const newAudio = new Audio(track.preview_url);
        setAudio(newAudio);
        setPlayingUrl(track.preview_url);
        setProgress(0);

        newAudio.play().catch(err => {
          console.error('Error playing audio:', err);
        });

        const updateProgress = () => {
          if (newAudio && !newAudio.paused) {
            const currentProgress = (newAudio.currentTime / 30) * 100;
            setProgress(Math.min(currentProgress, 100));
            
            if (newAudio.currentTime < 30 && !newAudio.paused) {
              animationFrameRef.current = requestAnimationFrame(updateProgress);
            }
          }
        };

        newAudio.addEventListener('timeupdate', () => {
          if (newAudio.currentTime >= 30) {
            newAudio.pause();
            setPlayingUrl(null);
            setAudio(null);
            setProgress(0);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
          }
        });

        animationFrameRef.current = requestAnimationFrame(updateProgress);

        newAudio.onended = () => {
          setPlayingUrl(null);
          setAudio(null);
          setProgress(0);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      } else {
        console.log('No preview URL available for this track');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audio]);

  console.log('TopTracks render - tracks count:', tracks?.length);
  console.log('Hovered track ID:', hoveredTrackId);
  
  // Debug: Log track preview URLs
  if (tracks && tracks.length > 0) {
    console.log('Track preview URLs:', tracks.map(t => ({ 
      name: t.name, 
      hasPreview: !!t.preview_url,
      previewUrl: t.preview_url 
    })));
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Top Tracks</h2>
        <p className="text-gray-400">Your most played songs • Hover to preview</p>
      </div>
      
      {!tracks || tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Looks like we couldn&apos;t find your top tracks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => {
            const isPlaying = playingUrl === track.preview_url;
            const isHovered = hoveredTrackId === track.id;

            return (
              <div 
                key={track.id} 
                className="group bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all duration-300 hover:scale-105 flex flex-col"
                onMouseEnter={() => {
                  console.log('Mouse enter:', track.name);
                  setHoveredTrackId(track.id);
                }}
                onMouseLeave={() => {
                  console.log('Mouse leave:', track.name);
                  setHoveredTrackId(null);
                }}
              >
                {/* Album Art with Play Button Overlay */}
                <div className="relative w-full mb-3 aspect-square">
                  <Image
                    src={track.album.images[0]?.url || '/placeholder.png'}
                    alt={track.album.name}
                    className="rounded-lg object-cover w-full h-full shadow-lg"
                    width={300}
                    height={300}
                  />
                  
                  {/* Play/Pause Button Overlay */}
                  {track.preview_url ? (
                    <div
                      onClick={() => togglePreview(track)}
                      className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${
                        isHovered || isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-xl pointer-events-none">
                        {isPlaying ? (
                          <Pause size={28} className="text-white" />
                        ) : (
                          <Play size={28} className="text-white ml-1" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <p className="text-xs text-gray-300">No Preview</p>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {isPlaying && (
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Playing Indicator */}
                  {isPlaying && (
                    <div className="absolute top-2 right-2 flex gap-0.5">
                      <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-grow flex flex-col">
                  <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate mb-3">
                    {track.artists.map((artist) => artist.name).join(', ')}
                  </p>

                  {/* Spotify Link */}
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