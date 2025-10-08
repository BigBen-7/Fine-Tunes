import React, { useState, useEffect } from "react";
import { UserProfile } from "../types"; // Import our new type
import Image from "next/image";

interface DashboardProps {
  token: string;
  onLogout: () => void; // THE FIX: This line declares the onLogout prop.
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          onLogout();
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, onLogout]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome to <span className="text-[#1DB954]">Find-Tunes</span>
        </h1>

        {/* Conditionally render the user profile when it's loaded */}
        {userProfile ? (
          <div className="flex items-center space-x-4">
            <p className="font-medium hidden sm:block">
              {userProfile.display_name}
            </p>
            {userProfile.images && userProfile.images.length > 0 ? (
              // THE FIX: Using next/image with proper responsive classes
              <Image
                src={userProfile.images[0].url}
                alt={userProfile.display_name || "User profile picture"}
                className="rounded-full h-14 w-14 object-cover"
                width={100} // Sets the base size
                height={100}
              />
            ) : (
              // Fallback with consistent sizing
              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
            )}
          </div>
        ) : (
          <div className="flex items-center animate-pulse space-x-4">
            <div className="w-24 h-4 bg-gray-700 rounded"></div>
            <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          </div>
        )}
      </header>

      <main>
        <div className="p-8 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Dashboard Content Area</h2>
          <p className="text-gray-400 mt-2">
            Our features will be built out here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
