"use client";

import React from "react";
import {
  UserProfile,
  Track,
  TopArtist,
  SavedAlbum,
  NowPlaying,
  RecentlyPlayed,
  SavedShows as SavedShowsType,
} from "../types";
import SnippetCard from "./SnippetCard";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { View } from "./Dashboard";
import PlayerWidget from "./PlayerWidget";
import SavedShows from "./SavedShows";

interface HomeProps {
  userProfile: UserProfile | null;
  topTracks: Track[];
  topArtists: TopArtist[];
  savedAlbums: SavedAlbum[];
  nowPlaying: NowPlaying | null;
  recentlyPlayed: RecentlyPlayed | null;
  savedShows: SavedShowsType | null;
  setActiveView: Dispatch<SetStateAction<View>>;
}

const Home: React.FC<HomeProps> = ({
  userProfile,
  topTracks,
  topArtists,
  savedAlbums,
  nowPlaying,
  recentlyPlayed,
  savedShows,
  setActiveView,
}) => {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, {userProfile?.display_name?.split(" ")[0]}
        </h1>
        <p className="text-gray-300">
          Here&apos;s a snapshot of your musical world.
        </p>
      </div>

      {/* THE NEW LAYOUT: A responsive grid that becomes 4 columns on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* --- Player Widget (Now Playing / Recently Played) --- */}
        <PlayerWidget
          nowPlaying={nowPlaying}
          recentlyPlayed={recentlyPlayed}
          //   setActiveView={setActiveView}
        />

        {/* --- Top Tracks Snippet --- */}
        {topTracks && topTracks.length > 0 && (
          <SnippetCard
            title="Top Tracks"
            viewName="tracks"
            setActiveView={setActiveView}
          >
            {topTracks.slice(0, 4).map((track) => (
              <div
                key={track.id}
                className="relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src={track.album.images[0]?.url}
                  alt={track.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  layout="fill"
                />
              </div>
            ))}
          </SnippetCard>
        )}

        {/* --- Top Artists Snippet --- */}
        {topArtists && topArtists.length > 0 && (
          <SnippetCard
            title="Top Artists"
            viewName="artists"
            setActiveView={setActiveView}
          >
            {topArtists.slice(0, 4).map((artist) => (
              <div
                key={artist.id}
                className="relative aspect-square rounded-full overflow-hidden group"
              >
                <Image
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  layout="fill"
                />
              </div>
            ))}
          </SnippetCard>
        )}

        {/* --- Saved Albums Snippet --- */}
        {savedAlbums && savedAlbums.length > 0 && (
          <SnippetCard
            title="Saved Albums"
            viewName="albums"
            setActiveView={setActiveView}
          >
            {savedAlbums.slice(0, 4).map(({ album }) => (
              <div
                key={album.id}
                className="relative aspect-square rounded-md overflow-hidden group"
              >
                <Image
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  layout="fill"
                />
              </div>
            ))}
          </SnippetCard>
        )}
      </div>
      <SavedShows savedShows={savedShows} />
    </div>
  );
};

export default Home;
