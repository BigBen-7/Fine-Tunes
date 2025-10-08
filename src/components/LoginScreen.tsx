"use client";

import React from "react";
import { getLoginUrl } from "../lib/spotify"; 
import MusicalBackground from "./MusicalBackground";

/**
 * and login button. It uses the AnimatedBackground component.
 */
const LoginScreen: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0E27] via-[#151932] to-[#0A0E27]">
      {/* Animated Background */}
      <MusicalBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo/Title with animation */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1ED760] shadow-2xl shadow-green-500/30 animate-pulse-slow">
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent tracking-tight">
              Find-Tunes
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#1DB954] to-transparent rounded-full mb-6"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-4 animate-fade-in-delay">
            Your AI-Powered Music Discovery Dashboard
          </p>
          <p className="text-base text-gray-400 mb-12 max-w-md mx-auto animate-fade-in-delay-2">
            Generate personalized playlists with the power of AI. Connect your
            Spotify account to begin your journey.
          </p>

          {/* Login Button - Changed to an <a> tag for proper redirection */}
          <a
            href={getLoginUrl()}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-[#1DB954] to-[#1ED760] hover:from-[#1ED760] hover:to-[#1DB954] text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:scale-105 animate-fade-in-delay-3"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:scale-110"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>Login with Spotify</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>

          {/* Feature badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 animate-fade-in-delay-4">
            {["AI-Powered", "Personalized", "Instant Playlists"].map(
              (feature, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-all duration-300"
                >
                  {feature}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 20px 50px rgba(29, 185, 84, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 20px 60px rgba(29, 185, 84, 0.5);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.2s forwards;
        }

        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.4s forwards;
        }

        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.6s forwards;
        }

        .animate-fade-in-delay-4 {
          opacity: 0;
          animation: fade-in 0.8s ease-out 0.8s forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
