import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMaps, createMap } from "../api/maps";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function Maps() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [maps, setMaps] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    map_name: "",
    map_url: "",
    map_description: "",
    scale_factor: "",
  });

  useEffect(() => {
    async function fetchMaps() {
      try {
        const data = await getMaps(worldId);
        if (Array.isArray(data)) setMaps(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMaps();
  }, [worldId]);

  async function handleCreate() {
    if (!createForm.map_name.trim() || !createForm.map_url.trim()) {
      setCreateError("Please fill in all the required fields");
      return;
    }
    try {
      const newMap = await createMap(worldId, {
        map_name: createForm.map_name,
        map_url: createForm.map_url,
        map_description: createForm.map_description,
        scale_factor: createForm.scale_factor
          ? parseFloat(createForm.scale_factor)
          : null,
      });
      setMaps((prev) => [...prev, newMap]);
      setShowCreateModal(false);
      setCreateForm({
        map_name: "",
        map_url: "",
        map_description: "",
        scale_factor: "",
      });
      setCreateError("");
      setSuccessMsg("Map created!");
      setTimeout(() => setSuccessMsg(""), 3000);
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

        <div className="relative z-10 flex flex-col flex-1 p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-purple-300" />
              <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                Maps
              </h1>
            </div>
            <button
              onClick={() => navigate(`/worlds/${worldId}/maps/create`)}
              className="px-5 py-2 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white text-sm rounded-md transition-all tracking-wide"
            >
              + New Map
            </button>
          </div>

          {successMsg && (
            <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
              {successMsg}
            </div>
          )}

          {maps.length === 0 ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p
                className="text-white/40 text-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                No maps yet. Create your first one!
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.5rem" }}>
              {maps.map((map) => (
                <div
                  key={map.map_id}
                  onClick={() =>
                    navigate(`/worlds/${worldId}/maps/${map.map_id}`)
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
                    {map.map_url ? (
                      <img
                        src={map.map_url}
                        alt={map.map_name}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                        style={{ objectFit: "cover", objectPosition: "center", display: "block" }}
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
                      {map.map_name}
                    </h2>
                    {map.map_description && (
                      <p className="text-white/65 leading-relaxed line-clamp-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem" }}>
                        {map.map_description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="bg-[#0d0f1c] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <h2 className="text-white text-lg tracking-widest uppercase mb-6">
              New Map
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                  Name{" "}
                  <span className="text-white/20 normal-case tracking-normal">
                    (required)
                  </span>
                </label>
                <input
                  type="text"
                  value={createForm.map_name}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, map_name: e.target.value }))
                  }
                  className={`w-full bg-white/5 border rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50 ${createError && !createForm.map_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                  style={{ fontFamily: "'Cinzel', serif" }}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                  Map Image URL{" "}
                  <span className="text-white/20 normal-case tracking-normal">
                    (required)
                  </span>
                </label>
                <input
                  type="text"
                  value={createForm.map_url}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, map_url: e.target.value }))
                  }
                  className={`w-full bg-white/5 border rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50 ${createError && !createForm.map_url.trim() ? "border-red-500/60" : "border-white/10"}`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                  Description{" "}
                  <span className="text-white/20 normal-case tracking-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={createForm.map_description}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      map_description: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50 resize-none"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                  Scale Factor{" "}
                  <span className="text-white/20 normal-case">(optional)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={createForm.scale_factor}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      scale_factor: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
            </div>
            {createError && (
              <p className="text-red-400 text-sm mt-4">{createError}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white text-sm rounded-md transition-all tracking-wide"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({
                    map_name: "",
                    map_url: "",
                    map_description: "",
                    scale_factor: "",
                  });
                  setCreateError("");
                }}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm rounded-md transition-all tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
