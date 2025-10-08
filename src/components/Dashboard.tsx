import React, { useState, useEffect, useCallback } from "react";
// Import all our types, including the new Playlist type
import { SavedAlbum, TopArtist, Track, UserProfile, Playlist } from "../types";
import Image from "next/image";
import TopTracks from "./TopTracks";
import SavedAlbums from "./SavedAlbums";
import AIPlaylistGenerator from "./AIPlaylistGenerator";
import UserPlaylists from "./UserPlaylists"; // Import our new component
import TopArtists from "./TopArtist";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbum[]>([]);
  // NEW: State to hold the user's playlists
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // NEW: A function to fetch ONLY the playlists. We'll pass this to the AI component.
  // useCallback is used for optimization, ensuring the function doesn't get redefined on every render.
  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      const data = await response.json();
      setPlaylists(data.items);
    } catch (error) {
      console.error("Error re-fetching playlists:", error);
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all FIVE data points in parallel for maximum efficiency.
        const [
          profileResponse,
          tracksResponse,
          artistsResponse,
          albumsResponse,
          playlistsResponse, // NEW: Fetch playlists on initial load
        ] = await Promise.all([
          fetch("https://api.spotify.com/v1/me", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.spotify.com/v1/me/albums?limit=10", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("https://api.spotify.com/v1/me/playlists?limit=50", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if ([profileResponse, tracksResponse, artistsResponse, albumsResponse, playlistsResponse].some((res) => res.status === 401)) {
          onLogout();
          return;
        }
        if (!profileResponse.ok || !tracksResponse.ok || !artistsResponse.ok || !albumsResponse.ok || !playlistsResponse.ok) {
          throw new Error("Failed to fetch data from Spotify");
        }

        const profileData: UserProfile = await profileResponse.json();
        const tracksData = await tracksResponse.json();
        const artistsData = await artistsResponse.json();
        const albumsData = await albumsResponse.json();
        const playlistsData = await playlistsResponse.json(); // NEW

        setUserProfile(profileData);
        const tracksWithPreviews = tracksData.items.filter((track: Track) => track.preview_url !== null);
        setTopTracks(tracksWithPreviews.length > 0 ? tracksWithPreviews.slice(0, 20) : tracksData.items.slice(0, 20));
        setTopArtists(artistsData.items);
        setSavedAlbums(albumsData.items);
        setPlaylists(playlistsData.items); // NEW: Set the playlists state
        
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, onLogout]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        {/* ... your existing header code ... */}
      </header>

      <main>
        <div className="space-y-8">
          {/* NEW: Pass the fetchPlaylists function as a prop */}
          <AIPlaylistGenerator token={token} userProfile={userProfile} onPlaylistCreated={fetchPlaylists} />
          <hr className="border-gray-700" />
          {loading ? (
            <div className="p-8 text-center"><p>Loading your music library...</p></div>
          ) : (
            <div className="space-y-8">
              {/* NEW: Render the UserPlaylists component */}
              <UserPlaylists playlists={playlists} />
              <TopTracks tracks={topTracks} />
              <TopArtists artists={topArtists} />
              <SavedAlbums albums={savedAlbums} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;