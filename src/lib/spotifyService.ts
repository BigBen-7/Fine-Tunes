import { UserProfile, Track, TopArtist, SavedAlbum, Playlist, SavedShows, NowPlaying } from '../types';

// This function is now fully robust. No changes are needed here.
const spotifyFetch = async (token: string, endpoint: string) => {
  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    throw new Error('Spotify token expired');
  }

  if (response.status === 204) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data from Spotify endpoint: ${endpoint}`);
  }

  return response.json();
};

export const getDashboardData = async (token: string) => {
  const [
    profile, 
    tracksData, 
    artistsData, 
    albumsData, 
    playlistsData,
    playerData,
    showsData
  ] = await Promise.all([
    spotifyFetch(token, 'me'),
    spotifyFetch(token, 'me/top/tracks?limit=50&time_range=medium_term'),
    spotifyFetch(token, 'me/top/artists?limit=10&time_range=short_term'),
    spotifyFetch(token, 'me/albums?limit=10'),
    spotifyFetch(token, 'me/playlists?limit=50'),
    spotifyFetch(token, 'me/player/currently-playing'),
    spotifyFetch(token, 'me/shows?limit=5'),
  ]);

  let recentlyPlayed = null;
  if (!playerData?.item) {
    recentlyPlayed = await spotifyFetch(token, 'me/player/recently-played?limit=5');
  }

  const tracksWithPreviews = (tracksData?.items || []).filter((track: Track) => track.preview_url !== null);
  const topTracks = tracksWithPreviews.length > 0 ? tracksWithPreviews.slice(0, 20) : (tracksData?.items || []).slice(0, 20);

  return {
    userProfile: profile as UserProfile,
    topTracks: topTracks as Track[],
    topArtists: (artistsData?.items || []) as TopArtist[],
    savedAlbums: (albumsData?.items || []) as SavedAlbum[],
    playlists: (playlistsData?.items || []) as Playlist[],
    nowPlaying: playerData,
    recentlyPlayed: recentlyPlayed,
    // THE FIX: Gracefully handle a null response for showsData from the fetcher.
    savedShows: (showsData || { items: [] }) as SavedShows,
  };
};

export const getUserPlaylists = async (token: string): Promise<Playlist[]> => {
    const data = await spotifyFetch(token, 'me/playlists?limit=50');
    return (data?.items || []) as Playlist[];
};

/**
 * Fetches only the user's current playback state.
 * @param token The Spotify access token.
 * @returns The NowPlaying object, or null.
 */



export const getNowPlaying = async (token: string): Promise<NowPlaying | null> => {
    const data = await spotifyFetch(token, 'me/player/currently-playing');
    return data as NowPlaying | null;
};