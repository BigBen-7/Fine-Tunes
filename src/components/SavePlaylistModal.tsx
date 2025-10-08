'use client';

import React, { useState } from 'react';

interface SavePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (playlistName: string) => void;
  isSaving: boolean;
}

const SavePlaylistModal: React.FC<SavePlaylistModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [playlistName, setPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (playlistName.trim()) {
      onSave(playlistName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Save Your Playlist</h2>
        <p className="text-gray-400 mb-6">Give your new masterpiece a name.</p>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="e.g., My AI Masterpiece"
          className="w-full bg-gray-700 text-white rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving || !playlistName.trim()}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition disabled:bg-gray-600"
          >
            {isSaving ? 'Saving...' : 'Save Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlaylistModal;