import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createMap } from "../api/maps";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function CreateMap() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    map_name: "",
    map_url: "",
    map_description: "",
    scale_factor: "",
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.map_name.trim() || !formData.map_url.trim() || !formData.map_description.trim()) return;
    await createMap(worldId, {
      map_name: formData.map_name,
      map_url: formData.map_url,
      map_description: formData.map_description,
      scale_factor: formData.scale_factor ? parseFloat(formData.scale_factor) : null,
    });
    navigate(`/worlds/${worldId}/maps`);
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
              New Map
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-8 w-full max-w-xl">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Name
                </label>
                <input
                  type="text"
                  name="map_name"
                  value={formData.map_name}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="Map name"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Map Image URL
                </label>
                <input
                  type="text"
                  name="map_url"
                  value={formData.map_url}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="https://..."
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Description
                </label>
                <textarea
                  name="map_description"
                  value={formData.map_description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50 resize-none"
                  placeholder="Describe this map"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Scale Factor <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="scale_factor"
                  value={formData.scale_factor}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="e.g. 1.5"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.map_name.trim() || !formData.map_url.trim() || !formData.map_description.trim()}
                  className="flex-1 py-3 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white rounded-md transition-all tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Map
                </button>
                <button
                  onClick={() => navigate(`/worlds/${worldId}/maps`)}
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
