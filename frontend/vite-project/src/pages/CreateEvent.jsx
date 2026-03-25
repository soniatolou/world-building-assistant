import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent } from "../api/events";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";

export default function CreateEvent() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    start_year: "",
    end_year: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!formData.event_name.trim()) {
      setError("Please fill in all the required fields");
      return;
    }
    await createEvent(worldId, formData);
    navigate(`/worlds/${worldId}/events`);
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
              New Event
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
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  className={`bg-white/10 border rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50 ${error && !formData.event_name.trim() ? "border-red-500/60" : "border-white/20"}`}
                  placeholder="Event name"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Start Year <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="start_year"
                  value={formData.start_year}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="e.g. 1200"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  End Year <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="end_year"
                  value={formData.end_year}
                  onChange={handleChange}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50"
                  placeholder="e.g. 1205"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/70 text-xs tracking-widest uppercase">
                  Description <span className="text-white/40 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  name="event_description"
                  value={formData.event_description}
                  onChange={handleChange}
                  rows={4}
                  className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-300/50 resize-none"
                  placeholder="Describe this event"
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
                  Create Event
                </button>
                <button
                  onClick={() => navigate(`/worlds/${worldId}/events`)}
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
