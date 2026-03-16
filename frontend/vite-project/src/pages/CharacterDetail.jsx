import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacter, updateCharacter, deleteCharacter } from "../api/characters";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function CharacterDetail() {
  const { worldId, characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    character_name: "",
    character_description: "",
    image_url: "",
    birth_year: "",
    is_alive: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const data = await getCharacter(characterId);
        setCharacter(data);
        setEditForm({
          character_name: data.character_name || "",
          character_description: data.character_description || "",
          image_url: data.image_url || "",
          birth_year: data.birth_year || "",
          is_alive: data.is_alive ?? true,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchCharacter();
  }, [characterId]);

  async function handleUpdate() {
    try {
      const updated = await updateCharacter(characterId, editForm);
      setCharacter(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await deleteCharacter(characterId);
      navigate(`/worlds/${worldId}/characters`);
    } catch (err) {
      console.error(err);
    }
  }

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

        <div className="relative z-10 flex flex-col flex-1">
          {character ? (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center justify-between px-10 py-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
                  <span
                    className="hover:text-white/70 cursor-pointer transition-colors"
                    onClick={() => navigate(`/worlds/${worldId}/characters`)}
                  >
                    Characters
                  </span>
                  <span>/</span>
                  <span className="text-white/70">{character.character_name}</span>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                >
                  Edit
                </button>
              </div>

              {/* Main content */}
              <div className="flex gap-8 p-10">

                {/* Left: Portrait card */}
                <div className="relative w-72 shrink-0 rounded-lg overflow-hidden border border-white/10 self-start">
                  {character.image_url ? (
                    <img
                      src={character.image_url}
                      alt={character.character_name}
                      className="w-full object-cover object-top"
                      style={{ minHeight: "420px", maxHeight: "520px" }}
                    />
                  ) : (
                    <div
                      className="w-full bg-white/5 flex items-center justify-center"
                      style={{ minHeight: "420px" }}
                    >
                      <span className="text-white/20 text-6xl">✦</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                      {character.character_name}
                    </h2>
                    <p className="text-purple-400 text-xs tracking-widest uppercase mt-1">
                      {character.is_alive ? "Alive" : "Deceased"}
                      {character.birth_year && ` · Born ${character.birth_year}`}
                    </p>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 flex flex-col gap-8">
                  <div>
                    <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                      Biography
                    </h3>
                    <p
                      className="text-white/70 leading-relaxed"
                      style={{ fontFamily: "sans-serif" }}
                    >
                      {character.character_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                      <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Status</p>
                      <p className="text-white font-bold tracking-wide uppercase text-sm">
                        {character.is_alive ? "Alive" : "Deceased"}
                      </p>
                    </div>
                    {character.birth_year && (
                      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                        <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Birth Year</p>
                        <p className="text-white font-bold tracking-wide uppercase text-sm">
                          {character.birth_year}
                        </p>
                      </div>
                    )}
                  </div>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="bg-[#0d0f1e] border border-white/10 rounded-xl p-8 w-full max-w-md"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <h2 className="text-white text-lg font-bold tracking-wide uppercase mb-6">
              Edit Character
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.character_name}
                  onChange={(e) => setEditForm({ ...editForm, character_name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.character_description}
                  onChange={(e) => setEditForm({ ...editForm, character_description: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 resize-none"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editForm.image_url}
                  onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  Birth Year
                </label>
                <input
                  type="text"
                  value={editForm.birth_year}
                  onChange={(e) => setEditForm({ ...editForm, birth_year: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="edit_is_alive"
                  checked={editForm.is_alive}
                  onChange={(e) => setEditForm({ ...editForm, is_alive: e.target.checked })}
                  className="accent-purple-500 w-4 h-4"
                />
                <label
                  htmlFor="edit_is_alive"
                  className="text-white/50 text-xs tracking-widest uppercase cursor-pointer"
                >
                  Alive
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-all"
                >
                  Delete Character
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50" style={{ fontFamily: "sans-serif" }}>
                    Are you sure?
                  </span>
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-400 border border-red-400/30 hover:border-red-400/60 px-3 py-1 rounded tracking-widest uppercase transition-all"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-white/40 hover:text-white/70 tracking-widest uppercase transition-all"
                  >
                    No, don't delete
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditModal(false); setShowDeleteConfirm(false); }}
                  className="text-xs text-white/40 hover:text-white/70 border border-white/10 px-4 py-2 rounded tracking-widest uppercase transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="text-xs text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded tracking-widest uppercase transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
