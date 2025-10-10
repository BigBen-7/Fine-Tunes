"use client";

import { useState, useEffect } from "react";
import { getTokenFromUrl } from "../lib/spotify";
import LoginScreen from "../components/LoginScreen";
import Dashboard from "@/components/Dashboard";

/**
 * The main entry point component for the application.
 * It acts as a controller, deciding which view to render based on
 * the application's configuration and the user's authentication state.
 */
export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  // New state to track if environment variables are correctly set.

  useEffect(() => {
    // Step 1: Check for application configuration on mount.
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    // Step 2: Check for user authentication token.
    const storedToken = window.localStorage.getItem("spotify_access_token");
    if (storedToken) {
      setToken(storedToken);
      return;
    }

    const accessToken = getTokenFromUrl();
    if (accessToken) {
      window.localStorage.setItem("spotify_access_token", accessToken);
      setToken(accessToken);
      window.location.hash = "";
    }
  }, []);

  const handleLogOut = () => {
    // clear token from both state abd local storage
    setToken(null);
    window.localStorage.removeItem("spotify_access_token");
    // Optionally, you could redirect to a logged-out page or just re-render.
    // The component will re-render automatically due to setToken(null).
  };

  // Render logic based on configuration and authentication state.
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
