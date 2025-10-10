"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  SavedAlbum,
  TopArtist,
  Track,
  UserProfile,
  Playlist,
  NowPlaying,
  RecentlyPlayed,
  SavedShows as SavedShowsType,
} from "../types";
import Image from "next/image";
import TopTracks from "./TopTracks";
import TopArtists from "./TopArtist";
import SavedAlbums from "./SavedAlbums";
import AIPlaylistGenerator from "./AIPlaylistGenerator";
import UserPlaylists from "./UserPlaylists";
import {
  getDashboardData,
  getUserPlaylists,
  getNowPlaying,
} from "../lib/spotifyService";
import Sidebar from "./Sidebar";
import DashboardSkeleton from "./DashboardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./Home";
import { Github } from "lucide-react";

export type View =
  | "home"
  | "tracks"
  | "playlists"
  | "artists"
  | "albums"
  | "generate";

interface DashboardProps {
  token: string | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbum[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed | null>(
    null
  );
  const [savedShows, setSavedShows] = useState<SavedShowsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<View>("home");

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
        setNowPlaying(data.nowPlaying);
        setRecentlyPlayed(data.recentlyPlayed);
        setSavedShows(data.savedShows);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          error.message === "Spotify token expired"
        ) {
          onLogout();
        } else {
          console.error("Error loading dashboard data:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      loadDashboardData();
    }
  }, [token, onLogout]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(async () => {
      try {
        const currentlyPlaying = await getNowPlaying(token);
        setNowPlaying(currentlyPlaying);
      } catch (error) {
        console.error("Error polling for now playing status:", error);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return (
      <div className="h-screen w-screen p-2 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6"></div>
    );
  }

  const renderView = () => {
    // THE FIX: Define all props for the Home component in one place for consistency.
    const homeProps = {
      userProfile,
      topTracks,
      topArtists,
      savedAlbums,
      playlists,
      nowPlaying,
      recentlyPlayed,
      savedShows,
      setActiveView,
    };

    switch (activeView) {
      case "home":
        return <Home {...homeProps} />;
      case "tracks":
        return <TopTracks tracks={topTracks} />;
      case "playlists":
        return <UserPlaylists playlists={playlists} />;
      case "artists":
        return <TopArtists artists={topArtists} />;
      case "albums":
        return <SavedAlbums albums={savedAlbums} />;
      case "generate":
        return (
          <AIPlaylistGenerator
            token={token}
            userProfile={userProfile}
            onPlaylistCreated={fetchPlaylists}
          />
        );
      default:
        // THE FIX: The default case now uses the consistent homeProps object.
        return <Home {...homeProps} />;
    }
  };

  return (
    <div className="h-screen w-screen p-2 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/10 backdrop-blur-xl shadow-2xl">
        <header className="flex items-center p-4 border-b border-white/10 shrink-0">
          {/* This is the mobile-only GitHub icon. It will appear on the left. */}
          <a
            href="https://github.com/BigBen-7/Fine-Tunes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors sm:hidden"
            title="View on GitHub"
          >
            <Github size={24} />
          </a>

          {/* THE FIX: By adding 'ml-auto', this entire block will always be pushed to the far right. */}
          {userProfile ? (
            <div className="flex items-center space-x-4 ml-auto">
              <p className="font-medium hidden sm:block">
                {userProfile.display_name}
              </p>
              {userProfile.images && userProfile.images.length > 0 ? (
                <Image
                  src={userProfile.images[0].url}
                  alt={userProfile.display_name || "User profile"}
                  className="rounded-full h-10 w-10 object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              )}
            </div>
          ) : (
            <div className="flex items-center animate-pulse space-x-4 ml-auto">
              <div className="w-24 h-4 bg-white/10 rounded"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
