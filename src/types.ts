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
