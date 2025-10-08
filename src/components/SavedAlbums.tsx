import React from "react";
import Image from "next/image";
import { SavedAlbum } from "../types";

interface SavedAlbumsProps {
  albums: SavedAlbum[];
}

/**
 * A component that displays a grid of the user's saved albums.
 */
const SavedAlbums: React.FC<SavedAlbumsProps> = ({ albums }) => {
  return (
    <div className="p-8 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Your Saved Albums</h2>

      {!albums || albums.length === 0 ? (
        <p className="text-gray-400">
          You haven&apos;t saved any albums yet. Go explore!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map(({ album }) => (
            <a
              key={album.id}
              href={album.images[0]?.url ? album.external_urls.spotify : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600 transition duration-300 group"
            >
              <div
                className="relative w-full mb-4"
                style={{ paddingBottom: "100%" }}
              >
                <Image
                  src={album.images[0]?.url}
                  alt={album.name}
                  className="rounded-md object-cover"
                  layout="fill"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white truncate group-hover:underline">
                  {album.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {album.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAlbums;
