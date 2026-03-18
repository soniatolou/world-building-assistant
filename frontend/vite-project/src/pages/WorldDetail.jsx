import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserWorlds } from "../api/dashboard";
import { getCharacters } from "../api/characters";
import { getLocations } from "../api/locations";
import { getEvents } from "../api/events";
import { getMaps } from "../api/maps";
import { updateWorld, deleteWorld, getRules, createRule, deleteRule, runConsistencyCheck } from "../api/worlds";
import WorldSidebar from "../components/WorldSidebar";
import Navbar from "../components/Navbar";
import { useConsistency } from "../context/ConsistencyContext";

export default function WorldDetail() {
  const { worldId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const [world, setWorld] = useState(null);
  const [counts, setCounts] = useState({
    characters: 0,
    locations: 0,
    events: 0,
    maps: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    world_name: "",
    world_description: "",
    image_url: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rules, setRules] = useState([]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleText, setNewRuleText] = useState("");
  const { consistencyResult, consistencyWorldId, setResultForWorld, clearResult } = useConsistency();
  const [isCheckingConsistency, setIsCheckingConsistency] = useState(false);

  useEffect(() => {
    if (consistencyWorldId !== null && consistencyWorldId !== String(worldId)) {
      clearResult();
    }
  }, [worldId]);

  useEffect(() => {
    async function fetchData() {
      try {
        const worlds = await getUserWorlds(userId);
        const found = worlds.find(
          (w) => String(w.world_id) === String(worldId),
        );
        if (found) {
          setWorld(found);
          setEditForm({
            world_name: found.world_name || "",
            world_description: found.world_description || "",
            image_url: found.image_url || "",
          });
        }

        const [characters, locations, events, maps] = await Promise.all([
          getCharacters(worldId),
          getLocations(worldId),
          getEvents(worldId),
          getMaps(worldId),
        ]);
        setCounts({
          characters: Array.isArray(characters) ? characters.length : 0,
          locations: Array.isArray(locations) ? locations.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          maps: Array.isArray(maps) ? maps.length : 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [worldId]);

  useEffect(() => {
    async function fetchRules() {
      try {
        const data = await getRules(worldId)
        setRules(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchRules()
  }, [worldId]);

  async function handleUpdate() {
    try {
      const updated = await updateWorld(worldId, editForm);
      setWorld(updated);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddRule() {
    if (!newRuleText.trim()) return
    try {
      await createRule(worldId, newRuleText.trim())
      const data = await getRules(worldId)
      if (Array.isArray(data)) setRules(data)
      setNewRuleText("")
      setShowAddRule(false)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDeleteRule(ruleId) {
    try {
      await deleteRule(ruleId)
      setRules((prev) => prev.filter((r) => r.rule_id !== ruleId))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleConsistencyCheck() {
    setIsCheckingConsistency(true)
    clearResult()
    try {
      const data = await runConsistencyCheck(worldId)
      setResultForWorld(data, worldId)
    } catch (err) {
      console.error(err)
    } finally {
      setIsCheckingConsistency(false)
    }
  }

  async function handleDelete() {
    try {
      await deleteWorld(worldId);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }

  const quickActions = [
    { label: "New Character", path: `/worlds/${worldId}/characters/create` },
    { label: "New Location", path: `/worlds/${worldId}/locations/create` },
    { label: "New Event", path: `/worlds/${worldId}/events` },
    { label: "New Map", path: `/worlds/${worldId}/maps` },
  ];

  const stats = [
    { label: "Characters", value: counts.characters },
    { label: "Locations", value: counts.locations },
    { label: "Events", value: counts.events },
    { label: "Maps", value: counts.maps },
  ];

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
      <WorldSidebar worldId={worldId} worldName={world?.world_name} />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Breadcrumb / header bar */}
        <div className="flex items-center justify-between px-10 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-purple-500" />
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              {world?.world_name}
            </h1>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
          >
            Edit
          </button>
        </div>

        {world ? (
          <div className="flex gap-8 p-10 flex-1">
            {/* Left: World image + consistency check */}
            {world.image_url && (
              <div className="w-72 shrink-0 flex flex-col gap-4">
                <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img
                    src={world.image_url}
                    alt={world.world_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h2 className="text-white font-bold text-xl uppercase tracking-wide">
                      {world.world_name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={handleConsistencyCheck}
                  disabled={isCheckingConsistency}
                  className="w-full px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 text-xs rounded-md transition-all tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingConsistency ? "Checking..." : "Run Consistency Check"}
                </button>

                {consistencyResult && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-amber-300 text-xs tracking-widest uppercase">
                        AI Consistency Check
                      </h3>
                      <button
                        onClick={clearResult}
                        className="text-amber-300/50 hover:text-amber-300 transition-colors text-base leading-none"
                        aria-label="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                    {consistencyResult.contradictions && consistencyResult.contradictions.length === 0 ? (
                      <p className="text-amber-200/60 text-xs" style={{ fontFamily: "sans-serif" }}>
                        No issues found. Your world is consistent!
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {(consistencyResult.contradictions || []).map((item, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <p className="text-amber-100/80 text-xs leading-relaxed" style={{ fontFamily: "sans-serif" }}>
                              {item.description}
                            </p>
                            {item.elements_involved && item.elements_involved.length > 0 && (
                              <p className="text-amber-400/60 text-xs" style={{ fontFamily: "sans-serif" }}>
                                Involves: {item.elements_involved.join(", ")}
                              </p>
                            )}
                            {item.suggestion && (
                              <p className="text-amber-300/70 text-xs italic" style={{ fontFamily: "sans-serif" }}>
                                {item.suggestion}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* Right: Content */}
            <div className="flex flex-col gap-8 flex-1">
              {world.world_description && (
                <p className="text-white/50 text-sm whitespace-pre-wrap" style={{ fontFamily: "sans-serif" }}>
                  {world.world_description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 border border-white/10 rounded-lg p-5 text-center"
                  >
                    <p className="text-3xl font-bold text-purple-400">
                      {stat.value}
                    </p>
                    <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* World Rules */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-sm tracking-widest uppercase">
                    World Rules
                  </h2>
                  <button
                    onClick={() => setShowAddRule((v) => !v)}
                    className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                  >
                    + Add World Rule
                  </button>
                </div>

                {showAddRule && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newRuleText}
                      onChange={(e) => setNewRuleText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddRule()}
                      placeholder="Enter rule..."
                      className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                      style={{ fontFamily: "sans-serif" }}
                      autoFocus
                    />
                    <button
                      onClick={handleAddRule}
                      disabled={!newRuleText.trim()}
                      className="px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setShowAddRule(false); setNewRuleText("") }}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-sm rounded transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {rules.length === 0 && !showAddRule ? (
                  <p className="text-white/30 text-xs" style={{ fontFamily: "sans-serif" }}>
                    No rules yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {rules.map((rule) => (
                      <div
                        key={rule.rule_id}
                        className="flex items-start justify-between gap-4 py-2 border-b border-white/5 last:border-b-0"
                      >
                        <p className="text-white/70 text-sm" style={{ fontFamily: "sans-serif", whiteSpace: "pre-wrap" }}>
                          {rule.rule_text}
                        </p>
                        <button
                          onClick={() => handleDeleteRule(rule.rule_id)}
                          className="text-white/20 hover:text-red-400 text-xs transition-colors shrink-0 mt-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-white/50 text-xs tracking-widest uppercase mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-lg p-5 text-white/70 hover:text-white text-sm tracking-wide transition-all text-left"
                    >
                      + {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white/40 p-10">Loading...</p>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div
            className="bg-[#0d0f1e] border border-white/10 rounded-xl p-8 w-full max-w-md"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <h2 className="text-white text-lg font-bold tracking-wide uppercase mb-6">
              Edit World
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  World Name
                </label>
                <input
                  type="text"
                  value={editForm.world_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, world_name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.world_description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      world_description: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setEditForm({ ...editForm, image_url: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  style={{ fontFamily: "sans-serif" }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-8">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-all"
                >
                  Delete World
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs text-white/50"
                    style={{ fontFamily: "sans-serif" }}
                  >
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
                  onClick={() => {
                    setShowEditModal(false);
                    setShowDeleteConfirm(false);
                  }}
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
    </div>
  );
}
