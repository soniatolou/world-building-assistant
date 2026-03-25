import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLocation } from "../api/locations";
import { getMaps } from "../api/maps";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function CreateLocation() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location_name: "",
    location_description: "",
    location_type: "",
    map_id: "",
  });
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState("");

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!formData.location_name.trim()) {
      setError("Please fill in all the required fields");
      return;
    }
    await createLocation({
      location_name: formData.location_name,
      location_description: formData.location_description || null,
      location_type: formData.location_type || null,
      map_id: formData.map_id ? parseInt(formData.map_id) : null,
      world_id: parseInt(worldId),
    });
    navigate(`/worlds/${worldId}/locations`);
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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-purple-300" />
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
              New Location
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-8 w-full max-w-xl">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Name <span className="text-white/40 normal-case tracking-normal">(required)</span>
                </label>
                <input
                  type="text"
                  name="location_name"
                  value={formData.location_name}
                  onChange={handleChange}
                  className={`bg-white/10 border rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50 ${error && !formData.location_name.trim() ? "border-red-500/60" : "border-white/20"}`}
                  placeholder="Location name"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Type <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="e.g. City, Forest, Castle..."
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Map <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <select
                  name="map_id"
                  value={formData.map_id}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-300/50"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <option value="" style={{ backgroundColor: "white", color: "black" }}>No map selected</option>
                  {maps.map((m) => (
                    <option key={m.map_id} value={m.map_id} style={{ backgroundColor: "white", color: "black" }}>
                      {m.map_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Description <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  name="location_description"
                  value={formData.location_description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50 resize-none"
                  placeholder="Describe this location"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white rounded-md transition-all tracking-wide"
                >
                  Create Location
                </button>
                <button
                  onClick={() => navigate(`/worlds/${worldId}/locations`)}
                  className="px-5 py-3 text-white/50 hover:text-white border border-white/10 rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
