"use client";

import React, { useState } from "react";
import { UserProfile } from "../types";
import SavePlaylistModal from "./SavePlaylistModal";
import {
  searchForTrack,
  createPlaylist,
  addTracksToPlaylist,
} from "../lib/spotify";

// Define the shape of the AI's response for clarity
interface AIGeneratedTrack {
  song: string;
  artist: string;
}

// Define the props the component expects from its parent (Dashboard)
interface AIPlaylistGeneratorProps {
  token: string | null;
  userProfile: UserProfile | null;
  onPlaylistCreated?: () => Promise<void>; 
}

/**
 * A component that allows users to generate a Spotify playlist
 * based on a natural language prompt using the Gemini AI model,
 * and then save that playlist to their Spotify account.
 */
const AIPlaylistGenerator: React.FC<AIPlaylistGeneratorProps> = ({
  token,
  userProfile,
}) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTracks, setGeneratedTracks] = useState<AIGeneratedTrack[]>(
    []
  );

  // State for the save-to-spotify functionality
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt for your playlist.");
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedTracks([]);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const tracks: AIGeneratedTrack[] = await response.json();
      setGeneratedTracks(tracks);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSaveStatus(`Error: ${err.message}`);
      } else {
        setSaveStatus("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlaylist = async (playlistName: string) => {
    if (!token || !userProfile || generatedTracks.length === 0) {
      setError("Cannot save playlist. Missing token or user data.");
      setIsModalOpen(false);
      return;
    }
    setIsSaving(true);
    setSaveStatus("Step 1/3: Finding songs on Spotify...");
    try {
      // Step 1: Search for all track URIs in parallel
      const trackUriPromises = generatedTracks.map((track) =>
        searchForTrack(token, track.song, track.artist)
      );
      const trackUris = (await Promise.all(trackUriPromises)).filter(
        (uri): uri is string => uri !== null
      );

      if (trackUris.length === 0) {
        throw new Error(
          "Could not find any of the generated songs on Spotify."
        );
      }

      // Step 2: Create the new playlist
      setSaveStatus(`Step 2/3: Creating playlist "${playlistName}"...`);
      const playlistId = await createPlaylist(
        token,
        userProfile.id,
        playlistName
      );
      if (!playlistId) {
        throw new Error("Failed to create the playlist on Spotify.");
      }

      // Step 3: Add the found tracks to the new playlist
      setSaveStatus("Step 3/3: Adding songs to your new playlist...");
      const success = await addTracksToPlaylist(
        token,
        playlistId,
        trackUris.slice(0, 100)
      ); // Limit to 100 tracks per request
      if (!success) {
        throw new Error("Failed to add tracks to the playlist.");
      }

      setSaveStatus(
        `Success! Your playlist "${playlistName}" has been saved to your Spotify library.`
      );
      setGeneratedTracks([]);
      setPrompt("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSaveStatus(`Error: ${err.message}`);
      } else {
        setSaveStatus("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">
        AI Playlist Generator ✨
      </h2>
      <p className="text-gray-400 mb-6">
        Describe the kind of playlist you want, and let AI do the rest. Be
        creative!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A high-energy workout playlist with 90s hip-hop..."
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
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            "Generate Playlist"
          )}
        </button>
      </div>
      {error && <p className="text-red-400 mt-4">{error}</p>}

      {generatedTracks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            Your AI-Generated Playlist:
          </h3>
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2 border-t border-gray-700 pt-4">
            {generatedTracks.map((track, index) => (
              <li
                key={index}
                className="bg-gray-700/50 p-3 rounded-md flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-white">{track.song}</p>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => {
              setSaveStatus(null);
              setIsModalOpen(true);
            }}
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full sm:w-auto transition"
          >
            Save to Spotify
          </button>
          {saveStatus && (
            <p
              className={`mt-4 text-sm ${
                saveStatus.startsWith("Error")
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {saveStatus}
            </p>
          )}
        </div>
      )}

      <SavePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlaylist}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AIPlaylistGenerator;
