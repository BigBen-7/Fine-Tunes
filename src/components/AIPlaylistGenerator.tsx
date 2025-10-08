'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// We'll define a simple type for the AI's response format right here.
interface AIGeneratedTrack {
  song: string;
  artist: string;
}

/**
 * A component that allows users to generate a Spotify playlist
 * based on a natural language prompt using the Gemini AI model.
 */
const AIPlaylistGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // NEW: State to hold the tracks returned by the AI.
  const [generatedTracks, setGeneratedTracks] = useState<AIGeneratedTrack[]>([]);

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt for your playlist.');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedTracks([]); // Clear previous results

    try {
      // THE CONNECTION: Call our own backend API route.
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const tracks: AIGeneratedTrack[] = await response.json();
      setGeneratedTracks(tracks);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">AI Playlist Generator ✨</h2>
      <p className="text-gray-400 mb-6">
        Describe the kind of playlist you want, and let AI do the rest. Be creative!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Upbeat indie rock for a summer drive..."
          className="flex-grow bg-gray-700 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          rows={2}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Playlist'
          )}
        </button>
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {/* NEW: Display the generated tracks */}
      {generatedTracks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Your AI-Generated Playlist:</h3>
          <ul className="space-y-3">
            {generatedTracks.map((track, index) => (
              <li key={index} className="bg-gray-700/50 p-3 rounded-md flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{track.song}</p>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
              </li>
            ))}
          </ul>
          {/* We will add functionality to this button later */}
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-full sm:w-auto">
            Save to Spotify (Coming Soon)
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPlaylistGenerator;