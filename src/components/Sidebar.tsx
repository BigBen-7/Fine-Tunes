"use client";

import React from "react";
import { Home, Music, Mic2, Disc, Wand2, Github, Power, ListVideo} from "lucide-react";
import type { Dispatch, SetStateAction, ElementType } from "react";
import type { View } from "./Dashboard"; // Correctly import the View type

// THE FIX: Create a proper interface for NavItem props to remove 'any'.
interface NavItemProps {
  icon: ElementType;
  label: string;
  viewName: View;
  activeView: View;
  setActiveView: Dispatch<SetStateAction<View>>;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  viewName,
  activeView,
  setActiveView,
}) => (
  <button
    onClick={() => setActiveView(viewName)}
    className={`p-3 rounded-lg transition-all duration-200 w-full flex justify-center ${
      activeView === viewName
        ? "bg-white/10 text-white"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`}
    title={label}
  >
    <Icon size={24} />
  </button>
);

interface SidebarProps {
  activeView: View;
  setActiveView: Dispatch<SetStateAction<View>>;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  onLogout,
}) => {
  return (
    // THE RESPONSIVE FIX: This component is now a bottom bar on mobile and a sidebar on desktop.
    <div
      className="
      flex sm:flex-col items-center justify-center gap-8 h-[%] m-auto
      p-2  sm:p-4 rounded-2xl border border-white/10 bg-black/10 backdrop-blur-xl 
      order-last sm:order-first shrink-0
    "
    >
      {/* Navigation: Horizontal on mobile, vertical on desktop */}
      <nav className="flex flex-row sm:flex-col gap-2 sm:gap-4">
        <NavItem
          icon={Home}
          label="Home"
          viewName="home"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          icon={ListVideo}
          label="Top Tracks"
          viewName="tracks"
          activeView={activeView}
          setActiveView={setActiveView}
        />

        <NavItem
          icon={Music}
          label="Playlists"
          viewName="playlists"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          icon={Mic2}
          label="Artists"
          viewName="artists"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          icon={Disc}
          label="Albums"
          viewName="albums"
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <NavItem
          icon={Wand2}
          label="Generate"
          viewName="generate"
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </nav>

      {/* Bottom section (or right section on mobile) */}
      <div className="hidden sm:flex flex-col items-center mt-10">
        <a
          href="https://github.com/BigBen-7/Fine-Tunes"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors"
          title="View on GitHub"
        >
          <Github size={24} />
        </a>
        <button
          onClick={onLogout}
          className="cursor-pointer mt-8 text-red-400 transition-colors"
          title="Logout"
        >
          <Power size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
