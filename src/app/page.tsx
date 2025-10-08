'use client';

import { useState, useEffect } from 'react';
import { getTokenFromUrl } from '../lib/spotify';
import LoginScreen from '../components/LoginScreen';
import ConfigurationError from '../components/ConfigurationError';

/**
 * The main entry point component for the application.
 * It acts as a controller, deciding which view to render based on
 * the application's configuration and the user's authentication state.
 */
export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  // New state to track if environment variables are correctly set.
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  useEffect(() => {
    // Step 1: Check for application configuration on mount.
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      // If keys are missing, set configured to false and stop.
      setIsConfigured(false);
      return; 
    }
    // If keys are present, we can proceed.
    setIsConfigured(true);

    // Step 2: Check for user authentication token.
    const storedToken = window.localStorage.getItem('spotify_access_token');
    if (storedToken) {
      setToken(storedToken);
      return;
    }

    const accessToken = getTokenFromUrl();
    if (accessToken) {
      window.localStorage.setItem('spotify_access_token', accessToken);
      setToken(accessToken);
      window.location.hash = ''; 
    }
  }, []);

  // Render logic based on configuration and authentication state.
  return (
    <main>
      {!isConfigured ? (
        // If the app is not configured, show the error screen.
        <ConfigurationError />
      ) : token ? (
        // If configured and logged in, show the dashboard (placeholder).
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
          <h1 className="text-3xl font-bold">Authentication Successful!</h1>
          <p className="text-gray-400 mt-2">Loading your dashboard...</p>
        </div>
      ) : (
        // If configured but not logged in, show the login screen.
        <LoginScreen />
      )}
    </main>
  );
}