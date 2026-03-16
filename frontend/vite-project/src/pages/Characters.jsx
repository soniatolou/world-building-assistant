import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacters } from "../api/characters";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function Characters() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const data = await getCharacters(worldId);
        if (Array.isArray(data)) setCharacters(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCharacters();
  }, [worldId]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{
        backgroundImage: `url('/homepage-background.png')`,
        fontFamily: "'Cinzel', serif",
      }}
    >
      <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex flex-1">
      <WorldSidebar worldId={worldId} />

      <div className="relative z-10 flex flex-col flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-purple-500" />
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
              Characters
            </h1>
          </div>
          <button
            onClick={() => navigate(`/worlds/${worldId}/characters/create`)}
            className="px-5 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
          >
            + New Character
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-white/40 text-sm">
              No characters yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.character_id}
                onClick={() =>
                  navigate(
                    `/worlds/${worldId}/characters/${character.character_id}`,
                  )
                }
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer group"
              >
                {character.image_url ? (
                  <img
                    src={character.image_url}
                    alt={character.character_name}
                    className="w-full h-48 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-4xl">✦</span>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                    {character.character_name}
                  </h2>
                  <p
                    className="text-white/50 text-sm line-clamp-2"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {character.character_description}
                  </p>
                  <p className="text-white/30 text-xs mt-3 tracking-widest uppercase">
                    {character.is_alive ? "Alive" : "Deceased"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
