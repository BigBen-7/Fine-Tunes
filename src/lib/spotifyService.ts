import { UserProfile, Track, TopArtist, SavedAlbum, Playlist } from '../types';

// A generic fetcher function to reduce code duplication and centralize error handling
const spotifyFetch = async (token: string, endpoint: string) => {
  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    // This will be caught by the calling function to trigger a logout
    throw new Error('Spotify token expired');
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch data from Spotify endpoint: ${endpoint}`);
  }
  return response.json();
};

/**
 * Fetches all the necessary data for the main dashboard in parallel.
 * @param token The Spotify access token.
 * @returns An object containing all the fetched data.
 */
export const getDashboardData = async (token: string) => {
  const [profile, tracksData, artistsData, albumsData, playlistsData] = await Promise.all([
    spotifyFetch(token, 'me'),
    spotifyFetch(token, 'me/top/tracks?limit=50&time_range=medium_term'),
    spotifyFetch(token, 'me/top/artists?limit=10&time_range=short_term'),
    spotifyFetch(token, 'me/albums?limit=10'),
    spotifyFetch(token, 'me/playlists?limit=50'),
  ]);

  // Process tracks to handle the preview_url issue, just like you did
  const tracksWithPreviews = (tracksData.items || []).filter((track: Track) => track.preview_url !== null);
  const topTracks = tracksWithPreviews.length > 0 ? tracksWithPreviews.slice(0, 20) : (tracksData.items || []).slice(0, 20);

  return {
    userProfile: profile as UserProfile,
    topTracks: topTracks as Track[],
    topArtists: (artistsData.items || []) as TopArtist[],
    savedAlbums: (albumsData.items || []) as SavedAlbum[],
    playlists: (playlistsData.items || []) as Playlist[],
  };
};

/**
 * Fetches only the user's playlists. Used for refreshing the list after creating a new one.
 * @param token The Spotify access token.
 * @returns An array of the user's playlists.
 */
export const getUserPlaylists = async (token: string): Promise<Playlist[]> => {
    const data = await spotifyFetch(token, 'me/playlists?limit=50');
    return (data.items || []) as Playlist[];
};