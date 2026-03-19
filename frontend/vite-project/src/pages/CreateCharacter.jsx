import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCharacter } from "../api/characters";
import { getSpecies } from "../api/species";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function CreateCharacter() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    character_name: "",
    character_description: "",
    birth_year: "",
    is_alive: true,
    image_url: "",
    species_id: "",
  });
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    async function fetchSpecies() {
      try {
        const data = await getSpecies(worldId);
        if (Array.isArray(data)) setSpeciesList(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSpecies();
  }, [worldId]);

  function handleChange(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...formData,
      species_id: formData.species_id === "" ? null : Number(formData.species_id),
    };
    await createCharacter(worldId, payload);
    navigate(`/worlds/${worldId}/characters`);
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
          <div className="w-1 h-8 bg-purple-500" />
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
            New Character
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
                name="character_name"
                value={formData.character_name}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="Character name"
                style={{ fontFamily: "sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs tracking-widest uppercase">
                Description
              </label>
              <textarea
                name="character_description"
                value={formData.character_description}
                onChange={handleChange}
                rows={4}
                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                placeholder="Describe this character"
                style={{ fontFamily: "sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs tracking-widest uppercase">
                Birth Year
              </label>
              <input
                type="text"
                name="birth_year"
                value={formData.birth_year}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="e.g. 1205"
                style={{ fontFamily: "sans-serif" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-xs tracking-widest uppercase">
                Image URL <span className="text-white/30">(optional)</span>
              </label>
              <input
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                placeholder="https://..."
                style={{ fontFamily: "sans-serif" }}
              />
            </div>

            {speciesList.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Species <span className="text-white/30">(optional)</span>
                </label>
                <select
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <option value="" style={{ backgroundColor: 'white', color: 'black' }}>No species</option>
                  {speciesList.map((s) => (
                    <option key={s.species_id} value={s.species_id} style={{ backgroundColor: 'white', color: 'black' }}>{s.species_name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_alive"
                id="is_alive"
                checked={formData.is_alive}
                onChange={handleChange}
                className="accent-purple-500 w-4 h-4"
              />
              <label
                htmlFor="is_alive"
                className="text-white/70 text-xs tracking-widest uppercase cursor-pointer"
              >
                Alive
              </label>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white rounded-md transition-all tracking-wide"
              >
                Create Character
              </button>
              <button
                onClick={() => navigate(`/worlds/${worldId}/characters`)}
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
