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
            <p className="text-white/40 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              No characters yet. Create your first one!
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {characters.map((character) => (
              <div
                key={character.character_id}
                onClick={() =>
                  navigate(
                    `/worlds/${worldId}/characters/${character.character_id}`,
                  )
                }
                className="cursor-pointer group transition-all duration-300 flex flex-col"
                style={{
                  borderRadius: "18px",
                  border: "1.5px solid rgba(148,163,184,0.25)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.45)",
                  background: "rgba(8,10,22,0.18)",
                  backdropFilter: "blur(12px)",
                  padding: "12px",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = "1.5px solid rgba(168,85,247,0.7)"
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(168,85,247,0.3), 0 4px 32px rgba(0,0,0,0.5)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = "1.5px solid rgba(148,163,184,0.25)"
                  e.currentTarget.style.boxShadow = "0 4px 32px rgba(0,0,0,0.45)"
                }}
              >
                <div
                  style={{
                    border: "1.5px solid rgba(148,163,184,0.35)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                    flexShrink: 0,
                    margin: "6px",
                  }}
                >
                  {character.image_url ? (
                    <img
                      src={character.image_url}
                      alt={character.character_name}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      style={{ objectFit: "cover", objectPosition: "center top", display: "block" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img src="/logo.svg" alt="logo" style={{ width: "52px", opacity: 0.55 }} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-3 px-1 pb-1">
                  <h2
                    className="text-white leading-tight"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontVariant: "small-caps",
                      fontSize: "2.4rem",
                      fontWeight: "700",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {character.character_name}
                  </h2>
                  {character.character_description && (
                    <p className="text-white/65 leading-relaxed line-clamp-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem" }}>
                      {character.character_description}
                    </p>
                  )}
                  <p className="text-white/30 text-xs tracking-widest uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
