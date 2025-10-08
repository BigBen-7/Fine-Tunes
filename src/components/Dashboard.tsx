import React, { useState, useEffect } from "react";
import { SavedAlbum, TopArtist, Track, UserProfile } from "../types"; // Import our new type
import Image from "next/image";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtist";
import SavedAlbums from "./SavedAlbums";
import AIPlaylistGenerator from "./AIPlaylistGenerator";

interface DashboardProps {
  token: string;
  onLogout: () => void; // THE FIX: This line declares the onLogout prop.
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbum[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all four data points in parallel for maximum efficiency.
        const [
          profileResponse,
          tracksResponse,
          artistsResponse,
          albumsResponse,
        ] = await Promise.all([
          fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          // NEW: Fetch saved albums
          fetch("https://api.spotify.com/v1/me/albums?limit=10", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (
          [
            profileResponse,
            tracksResponse,
            artistsResponse,
            albumsResponse,
          ].some((res) => res.status === 401)
        ) {
          onLogout();
          return;
        }
        if (
          !profileResponse.ok ||
          !tracksResponse.ok ||
          !artistsResponse.ok ||
          !albumsResponse.ok
        ) {
          throw new Error("Failed to fetch data from Spotify");
        }

        const profileData: UserProfile = await profileResponse.json();
        const tracksData = await tracksResponse.json();
        const artistsData = await artistsResponse.json();
        const albumsData = await albumsResponse.json();

        setUserProfile(profileData);
        setTopTracks(tracksData.items);
        setTopArtists(artistsData.items);
        setSavedAlbums(albumsData.items); // Set the new state
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
        <h1 className="text-3xl font-bold text-white">
          Welcome to <span className="text-[#1DB954]">Find-Tunes</span>
        </h1>

        {/* Conditionally render the user profile when it's loaded */}
        {userProfile ? (
          <div className="flex items-center space-x-4">
            <p className="font-medium hidden sm:block">
              {userProfile.display_name}
            </p>
            {userProfile.images && userProfile.images.length > 0 ? (
              // THE FIX: Using next/image with proper responsive classes
              <Image
                src={userProfile.images[0].url}
                alt={userProfile.display_name || "User profile picture"}
                className="rounded-full h-14 w-14 object-cover"
                width={100} // Sets the base size
                height={100}
              />
            ) : (
              // Fallback with consistent sizing
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            )}
          </div>
        ) : (
          <div className="flex items-center animate-pulse space-x-4">
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          </div>
        )}
      </header>

      <main>
        {/* NEW: Render a loading state or the TopTracks component */}
        <div className="space-y-8">
          <AIPlaylistGenerator />
          <hr className="border-gray-700" />
          {/* Conditional rendering based on loading state */}
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading your music library...</p>
            </div>
          ) : (
            <div className="space-y-8">
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
