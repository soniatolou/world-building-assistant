import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacter, updateCharacter, deleteCharacter } from "../api/characters";
import { getRelationshipsForCharacter } from "../api/relationships";
import { getEventsForCharacter } from "../api/events";
import { getSpecies } from "../api/species";
import { getItems } from "../api/items";
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
    death_year: "",
    is_alive: true,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [relationships, setRelationships] = useState([]);
  const [characterEvents, setCharacterEvents] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [itemsList, setItemsList] = useState([]);

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
          death_year: data.death_year || "",
          is_alive: data.is_alive ?? true,
          species_id: data.species_id || "",
          item_id: data.item_id || "",
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchCharacter();
  }, [characterId]);

  useEffect(() => {
    async function fetchRelationships() {
      try {
        const data = await getRelationshipsForCharacter(characterId);
        if (Array.isArray(data)) setRelationships(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchRelationships();
  }, [characterId]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEventsForCharacter(characterId);
        if (Array.isArray(data)) setCharacterEvents(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvents();
  }, [characterId]);

  useEffect(() => {
    async function fetchSpeciesAndItems() {
      try {
        const [s, i] = await Promise.all([getSpecies(worldId), getItems(worldId)]);
        if (Array.isArray(s)) setSpeciesList(s);
        if (Array.isArray(i)) setItemsList(i);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSpeciesAndItems();
  }, [worldId]);

  async function handleUpdate() {
    try {
      const payload = {
        ...editForm,
        death_year: editForm.is_alive ? null : (editForm.death_year || null),
        species_id: editForm.species_id === "" ? null : Number(editForm.species_id),
        item_id: editForm.item_id === "" ? null : Number(editForm.item_id),
      };
      const updated = await updateCharacter(characterId, payload);
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
                      className="w-full bg-white/5"
                      style={{ minHeight: "420px" }}
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                      {character.character_name}
                    </h2>
                    <p className="text-purple-400 text-xs tracking-widest uppercase mt-1">
                      {character.is_alive ? "Alive" : "Deceased"}
                      {character.birth_year && ` · Born ${character.birth_year}`}
                      {!character.is_alive && character.death_year && ` · Died ${character.death_year}`}
                    </p>
                  </div>
                </div>

                {/* Right: Info */}
                <div className="flex-1 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-1 border-b border-white/10 pb-2">
                        Status
                      </h3>
                      <p className="text-white/70 text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {character.is_alive ? "Alive" : "Deceased"}
                      </p>
                    </div>
                    {character.birth_year && (
                      <div>
                        <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-1 border-b border-white/10 pb-2 mt-2">
                          Birth Year
                        </h3>
                        <p className="text-white/70 text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {character.birth_year}
                        </p>
                      </div>
                    )}
                    {!character.is_alive && character.death_year && (
                      <div>
                        <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-1 border-b border-white/10 pb-2 mt-2">
                          Death Year
                        </h3>
                        <p className="text-white/70 text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {character.death_year}
                        </p>
                      </div>
                    )}
                  </div>

                  {(character.species_id || character.item_id) && (
                    <div className="flex flex-col gap-2">
                      {character.species_id && (
                        <div>
                          <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-1 border-b border-white/10 pb-2">Species</h3>
                          <button
                            onClick={() => navigate(`/worlds/${worldId}/species/${character.species_id}`)}
                            className="text-white/70 hover:text-purple-300 text-sm mt-2 transition-colors text-left"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {speciesList.find((s) => s.species_id === character.species_id)?.species_name || character.species_id}
                          </button>
                        </div>
                      )}
                      {character.item_id && (
                        <div>
                          <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-1 border-b border-white/10 pb-2 mt-2">Item</h3>
                          <button
                            onClick={() => navigate(`/worlds/${worldId}/items/${character.item_id}`)}
                            className="text-white/70 hover:text-purple-300 text-sm mt-2 transition-colors text-left"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            {itemsList.find((i) => i.item_id === character.item_id)?.item_name || character.item_id}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-lg p-5 w-1/2">
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Biography</p>
                    <p
                      className="text-white/70 leading-relaxed text-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif", whiteSpace: "pre-wrap" }}
                    >
                      {character.character_description}
                    </p>
                  </div>

                  {relationships.length > 0 && (
                    <div>
                      <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                        Relationships
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden w-full">
                        {relationships.map((rel) => {
                          const isA = rel.character_a_id === parseInt(characterId);
                          const otherId = isA ? rel.character_b_id : rel.character_a_id;
                          const otherName = isA ? rel.character_b_name : rel.character_a_name;
                          return (
                            <div
                              key={rel.relationship_id}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                            >
                              <span className="text-purple-400 text-xs tracking-widest uppercase border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded shrink-0">
                                {rel.relationship_type}
                              </span>
                              <span className="text-white/30 text-xs">→</span>
                              <button
                                onClick={() => navigate(`/worlds/${worldId}/characters/${otherId}`)}
                                className="text-white/80 hover:text-purple-300 text-sm tracking-wide transition-colors text-left"
                                style={{ fontFamily: "'Cinzel', serif" }}
                              >
                                {otherName}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {characterEvents.length > 0 && (
                    <div>
                      <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-4 border-b border-white/10 pb-2">
                        Events
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden w-full">
                        {characterEvents.map((event) => (
                          <div
                            key={event.event_id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all"
                          >
                            <button
                              onClick={() => navigate(`/worlds/${worldId}/events/${event.event_id}`)}
                              className="text-white/80 hover:text-purple-300 text-sm tracking-wide transition-colors text-left"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              {event.event_name}
                            </button>
                            {(event.start_year || event.end_year) && (
                              <span className="text-white/30 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {event.start_year}{event.end_year && event.end_year !== event.start_year ? ` – ${event.end_year}` : ""}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-white/40" style={{ fontFamily: "'Montserrat', sans-serif" }}>Loading...</p>
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
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
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
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
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
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
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
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
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

              {!editForm.is_alive && (
                <div>
                  <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                    Death Year <span className="text-white/20">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.death_year}
                    onChange={(e) => setEditForm({ ...editForm, death_year: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    placeholder="e.g. 1289"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              )}

              {speciesList.length > 0 && (
                <div>
                  <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                    Species <span className="text-white/20">(optional)</span>
                  </label>
                  <select
                    value={editForm.species_id}
                    onChange={(e) => setEditForm({ ...editForm, species_id: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <option value="" style={{ backgroundColor: 'white', color: 'black' }}>No species</option>
                    {speciesList.map((s) => (
                      <option key={s.species_id} value={s.species_id} style={{ backgroundColor: 'white', color: 'black' }}>{s.species_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {itemsList.length > 0 && (
                <div>
                  <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                    Item <span className="text-white/20">(optional)</span>
                  </label>
                  <select
                    value={editForm.item_id}
                    onChange={(e) => setEditForm({ ...editForm, item_id: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <option value="" style={{ backgroundColor: 'white', color: 'black' }}>No item</option>
                    {itemsList.map((i) => (
                      <option key={i.item_id} value={i.item_id} style={{ backgroundColor: 'white', color: 'black' }}>{i.item_name}</option>
                    ))}
                  </select>
                </div>
              )}
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
                  <span className="text-xs text-white/50" style={{ fontFamily: "'Montserrat', sans-serif" }}>
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
