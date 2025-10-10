export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
}

// Artist, Album, and Track interfaces for Spotify API responses

export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  name: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  external_urls: {
    spotify: string;
  };
  artists: {
    id: string;
    name: string;
    external_urls: {
      spotify: string;
    };
  }[];
}

export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface TopArtist {
  id: string;
  name: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  genres: string[];
  external_urls: {
    spotify: string;
  };
  
}

export interface SavedAlbum {
  added_at: string;
  album: Album;
}

// Add this new interface to your types.ts file

export interface Playlist {
  id: string;
  name: string;
  description: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  hue: number;
}

export interface NowPlaying {
  is_playing: boolean;
  item: Track; // It uses the same Track type we already have!
}

export interface RecentlyPlayedItem {
  track: Track;
  played_at: string;
}

export interface RecentlyPlayed {
  items: RecentlyPlayedItem[];
}

export interface Show {
  id: string;
  name: string;
  publisher: string;
  images: {
    url: string;
    height: number | null;
    width: number | null;
  }[];
  external_urls: {
    spotify: string;
  };
}

export interface SavedShow {
  added_at: string;
  show: Show;
}

export interface SavedShows {
  items: SavedShow[];
}