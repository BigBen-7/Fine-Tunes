const authEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
];

// --- PKCE Helpers ---

const generateCodeVerifier = (length: number): string => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join("");
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (input: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

// --- Auth URL (PKCE) ---

export const getLoginUrl = async (): Promise<string> => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  if (!clientId) {
    console.error("Spotify Client ID is not set in .env.local");
    return "#";
  }

  // Derive redirect URI from the actual browser origin so it always matches
  // whatever protocol/port the dev server is running on.
  const redirectUri = window.location.origin + "/";
  window.sessionStorage.setItem("redirect_uri", redirectUri);

  const codeVerifier = generateCodeVerifier(64);
  const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
  window.sessionStorage.setItem("pkce_code_verifier", codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "code",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  return `${authEndpoint}?${params.toString()}`;
};

// --- Token Exchange (code → access + refresh tokens) ---

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const exchangeCodeForToken = async (code: string): Promise<TokenResponse | null> => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = window.sessionStorage.getItem("redirect_uri");
  const codeVerifier = window.sessionStorage.getItem("pkce_code_verifier");

  if (!clientId || !redirectUri || !codeVerifier) return null;

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) return null;

  window.sessionStorage.removeItem("pkce_code_verifier");
  window.sessionStorage.removeItem("redirect_uri");
  return response.json();
};

// --- Token Refresh ---

export const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  if (!clientId) return null;

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.access_token;
};

// --- Spotify API Helpers ---

export const searchForTrack = async (
  token: string,
  trackName: string,
  artistName: string
): Promise<string | null> => {
  const query = `track:${trackName} artist:${artistName}`;
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.tracks.items[0]?.uri || null;
};

// Returns the full track object (with album art, preview_url, etc.) instead of just the URI.
export const searchForTrackFull = async (
  token: string,
  trackName: string,
  artistName: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> => {
  const query = `track:${trackName} artist:${artistName}`;
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data.tracks.items[0] || null;
};

export const createPlaylist = async (
  token: string,
  userId: string,
  playlistName: string
): Promise<string | null> => {
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: playlistName,
      description: "Generated by FineTunes AI",
      public: false,
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.id;
};

export const addTracksToPlaylist = async (
  token: string,
  playlistId: string,
  trackUris: string[]
): Promise<boolean> => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ uris: trackUris }),
  });
  return response.ok;
};
