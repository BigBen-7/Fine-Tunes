'use client';

import React, { useState, useEffect, useCallback } from "react";
import { SavedAlbum, TopArtist, Track, UserProfile, Playlist } from "../types";
import Image from "next/image";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtist";
import SavedAlbums from "./SavedAlbums";
import AIPlaylistGenerator from "./AIPlaylistGenerator";
import UserPlaylists from "./UserPlaylists";
import { getDashboardData, getUserPlaylists } from "../lib/spotifyService";
// THE POLISH: Import our new skeleton loader
import DashboardSkeleton from "./DashboardSkeleton";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbum[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlaylists = useCallback(async () => {
    if (!token) return;
    try {
      const freshPlaylists = await getUserPlaylists(token);
      setPlaylists(freshPlaylists);
    } catch (error) {
      console.error("Error re-fetching playlists:", error);
    }
  }, [token]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const data = await getDashboardData(token);
        setUserProfile(data.userProfile);
        setTopTracks(data.topTracks);
        setTopArtists(data.topArtists);
        setSavedAlbums(data.savedAlbums);
        setPlaylists(data.playlists);
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        if (error.message === 'Spotify token expired') {
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token, onLogout]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome to <span className="text-[#1DB954]">Find-Tunes</span>
        </h1>
        {userProfile ? (
          <div className="flex items-center space-x-4">
            <p className="font-medium hidden sm:block">{userProfile.display_name}</p>
            {userProfile.images && userProfile.images.length > 0 ? (
              <Image
                src={userProfile.images[0].url}
                alt={userProfile.display_name || "User profile picture"}
                className="rounded-full h-14 w-14 object-cover"
                width={100}
                height={100}
              />
            ) : ( <div className="w-14 h-14 bg-gray-700 rounded-full"></div> )}
          </div>
        ) : (
          <div className="flex items-center animate-pulse space-x-4">
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
            <div className="w-14 h-14 bg-gray-700 rounded-full"></div>
          </div>
        )}
      </header>

      <main>
        <div className="space-y-8">
          <AIPlaylistGenerator token={token} userProfile={userProfile} onPlaylistCreated={fetchPlaylists} />
          <hr className="border-gray-700" />
          {loading ? (
            // THE POLISH: Replace the simple text with our sophisticated skeleton component
            <DashboardSkeleton />
          ) : (
            <div className="space-y-8">
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