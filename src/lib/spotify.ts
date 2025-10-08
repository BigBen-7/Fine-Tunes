const authEndpoint = "https://accounts.spotify.com/authorize";

// These are the permissions we are asking the user to grant our application.
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
];

/**
 * Extracts the access token from the URL hash after a successful
 * redirect from the Spotify authentication page.
 * @returns {string | null} The access token, or null if not found.
 */
export const getTokenFromUrl = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const hash = window.location.hash;
  if (!hash) {
    return null;
  }

  const token = hash
    .substring(1)
    .split("&")
    .find((elem) => elem.startsWith("access_token"))
    ?.split("=")[1];

  return token || null;
};


/**
 * Constructs the full URL for the Spotify login page, including our
 * client ID, requested scopes, and redirect URI.
 * @returns {string} The fully constructed login URL.
 */
export const getLoginUrl = (): string => {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    // In a real app, you might want more robust error handling.
    // For our purposes, logging to the console is sufficient.
    console.error("Spotify Client ID or Redirect URI is not set in .env.local");
    // Return a non-functional link to prevent runtime errors on the server.
    return '#'; 
  }

  // URLSearchParams makes it easy to correctly format the query parameters.
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "), // Scopes must be a space-separated string.
    response_type: "token",
    show_dialog: "true", // Forces the user to re-approve permissions every time. Good for development.
  });

  return `${authEndpoint}?${params.toString()}`;
};