'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserProfile, Track } from '../types';
import { searchForTrackFull, createPlaylist, addTracksToPlaylist } from '../lib/spotify';
import SavePlaylistModal from './SavePlaylistModal';

interface MoodPlaylistGeneratorProps {
  token: string;
  userProfile: UserProfile | null;
  onPlaylistCreated?: () => void;
}

interface AITrack {
  song: string;
  artist: string;
}

type SliderKey = 'energy' | 'valence' | 'danceability' | 'acousticness';

const SLIDERS: { key: SliderKey; label: string; low: string; high: string; emoji: string }[] = [
  { key: 'energy',       label: 'Energy',       low: 'Calm',       high: 'Intense',   emoji: '⚡' },
  { key: 'valence',      label: 'Vibe',         low: 'Dark',       high: 'Happy',     emoji: '✨' },
  { key: 'danceability', label: 'Danceability', low: 'Flowing',    high: 'Rhythmic',  emoji: '💃' },
  { key: 'acousticness', label: 'Acoustic',     low: 'Electronic', high: 'Organic',   emoji: '🎸' },
];

const getMoodLabel = (energy: number, valence: number, danceability: number): string => {
  if (energy > 0.65 && valence > 0.65) return danceability > 0.65 ? 'Party Mode 🎉' : 'Happy & Pumped 🔥';
  if (energy > 0.65 && valence < 0.35) return 'Dark & Intense ⚡';
  if (energy > 0.65)                   return danceability > 0.65 ? 'High-Energy Dance 💃' : 'Powerful & Driven 💪';
  if (energy < 0.35 && valence > 0.65) return 'Mellow & Positive ☀️';
  if (energy < 0.35 && valence < 0.35) return 'Melancholic & Deep 🌙';
  if (energy < 0.35)                   return 'Chill & Calm 🌊';
  if (valence > 0.65)                  return 'Feel-Good Vibes 😊';
  if (valence < 0.35)                  return 'Introspective & Raw 🖤';
  return 'Balanced & Versatile 🎵';
};

const buildPrompt = (
  energy: number,
  valence: number,
  danceability: number,
  acousticness: number,
  customText: string
): string => {
  const energyDesc    = energy > 0.65       ? 'high energy'             : energy < 0.35       ? 'calm and low energy'   : 'moderate energy';
  const valenceDesc   = valence > 0.65      ? 'happy and uplifting'     : valence < 0.35      ? 'dark and melancholic'  : 'emotionally balanced';
  const danceDesc     = danceability > 0.65 ? 'very danceable, rhythmic': danceability < 0.35 ? 'ambient, non-rhythmic' : '';
  const acousticDesc  = acousticness > 0.65 ? 'acoustic and organic'    : acousticness < 0.25 ? 'electronic, produced'  : '';

  const parts = [energyDesc, valenceDesc, danceDesc, acousticDesc].filter(Boolean).join(', ');

  return `You are an expert music curator. Create a playlist of 10 songs that are ${parts}.${
    customText ? ` Additional context: "${customText}".` : ''
  } Respond with ONLY a valid JSON array: [{"song": "Song Name", "artist": "Artist Name"}, ...]`;
};

const MoodPlaylistGenerator: React.FC<MoodPlaylistGeneratorProps> = ({
  token,
  userProfile,
  onPlaylistCreated,
}) => {
  const [sliders, setSliders] = useState<Record<SliderKey, number>>({
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    acousticness: 0.3,
  });
  const [customText, setCustomText]       = useState('');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [tracks, setTracks]               = useState<Track[]>([]);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [isSaving, setIsSaving]           = useState(false);
  const [saveStatus, setSaveStatus]       = useState<string | null>(null);

  const moodLabel = getMoodLabel(sliders.energy, sliders.valence, sliders.danceability);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setTracks([]);
    setSaveStatus(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: buildPrompt(
            sliders.energy,
            sliders.valence,
            sliders.danceability,
            sliders.acousticness,
            customText
          ),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Generation failed');
      }

      const aiTracks: AITrack[] = await response.json();

      const resolved = (
        await Promise.all(aiTracks.map((t) => searchForTrackFull(token, t.song, t.artist)))
      ).filter((t): t is Track => t !== null);

      if (resolved.length === 0) throw new Error('Could not find any of these tracks on Spotify.');
      setTracks(resolved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (playlistName: string) => {
    if (!token || !userProfile || tracks.length === 0) return;
    setIsSaving(true);
    setSaveStatus('Creating playlist...');
    try {
      const playlistId = await createPlaylist(token, userProfile.id, playlistName);
      if (!playlistId) throw new Error('Failed to create playlist.');

      setSaveStatus('Adding tracks...');
      const uris = tracks.map((t) => `spotify:track:${t.id}`);
      const ok = await addTracksToPlaylist(token, playlistId, uris);
      if (!ok) throw new Error('Failed to add tracks.');

      setSaveStatus(`"${playlistName}" saved to Spotify! 🎉`);
      setTracks([]);
      setCustomText('');
      onPlaylistCreated?.();
    } catch (err: unknown) {
      setSaveStatus(`Error: ${err instanceof Error ? err.message : 'Something went wrong.'}`);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Mood Playlist</h2>
        <p className="text-gray-400">Dial in your vibe. AI will find tracks that match.</p>
      </div>

      {/* Sliders */}
      <div className="space-y-6 mb-8">
        {SLIDERS.map(({ key, label, low, high, emoji }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">{emoji} {label}</span>
              <span className="text-xs text-gray-500">{low} — {high}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(sliders[key] * 100)}
              onChange={(e) =>
                setSliders((prev) => ({ ...prev, [key]: Number(e.target.value) / 100 }))
              }
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-500 bg-white/10"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>0</span>
              <span>{Math.round(sliders[key] * 100)}%</span>
              <span>100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live mood tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-gray-400">Current vibe:</span>
        <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-sm font-medium transition-all duration-300">
          {moodLabel}
        </span>
      </div>

      {/* Optional context */}
      <textarea
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="Add context (optional) — e.g. 'for a late night drive' or 'studying for exams'"
        className="w-full bg-black/20 text-white rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition border border-white/10 resize-none mb-6"
        rows={2}
      />

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={loading || tracks.length > 0}
        className="flex items-center justify-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 px-8 py-3
          font-bold text-green-300 transition-all duration-300
          hover:enabled:bg-green-500/20 hover:enabled:border-green-500/30
          disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-gray-400 disabled:border-white/10"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Finding tracks...
          </>
        ) : 'Generate Playlist'}
      </button>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {/* Results */}
      {tracks.length > 0 && (
        <div className="mt-10">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">{moodLabel}</h3>
            <p className="text-gray-400 text-sm">{tracks.length} tracks matched on Spotify</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {tracks.map((track) => (
              <a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <div className="relative aspect-square w-full mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={track.album.images[0]?.url}
                    alt={track.album.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-xs font-semibold truncate group-hover:text-green-400 transition-colors">
                  {track.name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {track.artists.map((a) => a.name).join(', ')}
                </p>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => { setSaveStatus(null); setIsModalOpen(true); }}
              className="rounded-md border border-white/10 bg-white/5 px-6 py-3 font-bold text-white
                transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              Save to Spotify
            </button>
            <button
              onClick={() => setTracks([])}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Try different settings
            </button>
          </div>

          {saveStatus && (
            <p className={`mt-4 text-sm ${saveStatus.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {saveStatus}
            </p>
          )}
        </div>
      )}

      <SavePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default MoodPlaylistGenerator;
