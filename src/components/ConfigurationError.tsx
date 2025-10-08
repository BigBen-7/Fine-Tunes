import React from 'react';

/**
 * A user-friendly error component displayed when essential
 * environment variables for the Spotify API are missing.
 * It provides clear instructions for the developer on how to fix the issue.
 */
const ConfigurationError: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg shadow-lg p-8 border border-red-500/50">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-2xl font-bold text-red-400">Configuration Error</h1>
        </div>
        <p className="text-gray-300 mb-4">
          The application is missing the required Spotify API credentials.
        </p>
        <p className="text-gray-400 mb-6">
          To fix this, please create a file named <code className="bg-gray-700 text-yellow-300 px-2 py-1 rounded">.env.local</code> in the root of your project directory and add the following content:
        </p>
        
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-md overflow-x-auto">
          <code>
            NEXT_PUBLIC_SPOTIFY_CLIENT_ID=&apos;YOUR_SPOTIFY_CLIENT_ID_HERE&apos;<br />
            NEXT_PUBLIC_REDIRECT_URI=&apos;http://localhost:3000/&apos;
          </code>
        </pre>
        
        <p className="text-gray-400 mt-6">
          After creating the file and adding your credentials, you will need to restart the development server for the changes to take effect.
        </p>
      </div>
    </div>
  );
};

export default ConfigurationError;