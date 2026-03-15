import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacter } from "../api/characters";
import WorldSidebar from "../components/WorldSidebar";

export default function CharacterDetail() {
  const { worldId, characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const data = await getCharacter(characterId);
        setCharacter(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCharacter();
  }, [characterId]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex"
      style={{
        backgroundImage: `url('/homepage-background.png')`,
        fontFamily: "'Cinzel', serif",
      }}
    >
      <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
      <WorldSidebar worldId={worldId} />

      <div className="relative z-10 flex flex-col flex-1">
        {character ? (
          <>
            <div className="flex items-center gap-2 px-10 py-4 text-xs tracking-widest uppercase text-white/40 border-b border-white/10">
              <span
                className="hover:text-white/70 cursor-pointer transition-colors"
                onClick={() => navigate(`/worlds/${worldId}/characters`)}
              >
                Characters
              </span>
              <span>/</span>
              <span className="text-white/70">{character.character_name}</span>
            </div>

            <div className="flex flex-col md:flex-row flex-1">
              <div className="relative w-full md:w-80 shrink-0">
                {character.image_url ? (
                  <img
                    src={character.image_url}
                    alt={character.character_name}
                    className="w-full h-full object-cover object-top min-h-[400px]"
                  />
                ) : (
                  <div className="w-full min-h-[400px] bg-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-6xl">✦</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                    {character.character_name}
                  </h2>
                  <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
                    {character.is_alive ? "Alive" : "Deceased"}
                    {character.birth_year && ` · Born ${character.birth_year}`}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-10">
                <div className="mb-8">
                  <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-3">
                    Biography
                  </h3>
                  <p
                    className="text-white/70 leading-relaxed"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    {character.character_description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/worlds/${worldId}/characters`)}
                  className="text-white/40 hover:text-white/70 text-xs tracking-widest uppercase transition-colors"
                >
                  ← Back to Characters
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-white/40">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
