'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
// THE FIX: Import the necessary types from React and Dashboard
import type { Dispatch, SetStateAction } from 'react';
import type { View } from './Dashboard';

// THE FIX: Use the correct, specific type for the state setter function
interface SnippetCardProps {
  title: string;
  viewName: View;
  setActiveView: Dispatch<SetStateAction<View>>;
  children: React.ReactNode;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, viewName, setActiveView, children }) => {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button 
          onClick={() => setActiveView(viewName)}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
};

export default SnippetCard;