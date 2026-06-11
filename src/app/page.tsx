"use client";

import { useState, useEffect } from "react";
import { exchangeCodeForToken, refreshAccessToken } from "../lib/spotify";
import LoginScreen from "../components/LoginScreen";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogOut = () => {
    setToken(null);
    window.localStorage.removeItem("spotify_access_token");
    window.localStorage.removeItem("spotify_refresh_token");
    window.localStorage.removeItem("spotify_token_expiry");
  };

  useEffect(() => {
    const init = async () => {
      // Check for a valid stored token first
      const storedToken = window.localStorage.getItem("spotify_access_token");
      const expiryStr = window.localStorage.getItem("spotify_token_expiry");
      const storedRefreshToken = window.localStorage.getItem("spotify_refresh_token");

      if (storedToken && expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (Date.now() < expiry) {
          setToken(storedToken);
          return;
        }
        // Access token expired — try to silently refresh
        if (storedRefreshToken) {
          const newToken = await refreshAccessToken(storedRefreshToken);
          if (newToken) {
            const newExpiry = Date.now() + 55 * 60 * 1000;
            window.localStorage.setItem("spotify_access_token", newToken);
            window.localStorage.setItem("spotify_token_expiry", newExpiry.toString());
            setToken(newToken);
            return;
          }
        }
        // Refresh failed — force re-login
        handleLogOut();
        return;
      }

      // Check for the auth code Spotify sends back in the URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        const tokenData = await exchangeCodeForToken(code);
        if (tokenData) {
          const expiry = Date.now() + (tokenData.expires_in - 60) * 1000;
          window.localStorage.setItem("spotify_access_token", tokenData.access_token);
          window.localStorage.setItem("spotify_refresh_token", tokenData.refresh_token);
          window.localStorage.setItem("spotify_token_expiry", expiry.toString());
          setToken(tokenData.access_token);
          // Clean the ?code= from the URL bar
          window.history.replaceState({}, "", "/");
        }
      }
    };

    init();
  }, []);

  return (
    <main>
      {token ? (
        <Dashboard token={token} onLogout={handleLogOut} />
      ) : (
        <LoginScreen />
      )}
    </main>
  );
}
