import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEvent, updateEvent, deleteEvent, getCharactersForEvent, addCharacterToEvent, removeCharacterFromEvent } from "../api/events"
import { getCharacters } from "../api/characters"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function EventDetail() {
    const { worldId, eventId } = useParams()
    const navigate = useNavigate()
    const [event, setEvent] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({
        event_name: "",
        event_description: "",
        start_year: "",
        end_year: "",
    })
    const [editError, setEditError] = useState("")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [eventCharacters, setEventCharacters] = useState([])
    const [allCharacters, setAllCharacters] = useState([])
    const [selectedCharId, setSelectedCharId] = useState("")

    useEffect(() => {
        async function fetchEventCharacters() {
            try {
                const data = await getCharactersForEvent(eventId)
                if (Array.isArray(data)) setEventCharacters(data)
            } catch (err) {
                console.error(err)
            }
        }
        async function fetchAllCharacters() {
            try {
                const data = await getCharacters(worldId)
                if (Array.isArray(data)) setAllCharacters(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchEventCharacters()
        fetchAllCharacters()
    }, [eventId, worldId])

    async function handleAddCharacter() {
        if (!selectedCharId) return
        try {
            await addCharacterToEvent(eventId, selectedCharId)
            const data = await getCharactersForEvent(eventId)
            if (Array.isArray(data)) setEventCharacters(data)
            setSelectedCharId("")
        } catch (err) {
            console.error(err)
        }
    }

    async function handleRemoveCharacter(characterId) {
        try {
            await removeCharacterFromEvent(eventId, characterId)
            setEventCharacters((prev) => prev.filter((c) => c.character_id !== characterId))
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        async function fetchEvent() {
            try {
                const data = await getEvent(eventId)
                setEvent(data)
                setEditForm({
                    event_name: data.event_name || "",
                    event_description: data.event_description || "",
                    start_year: data.start_year || "",
                    end_year: data.end_year || "",
                })
            } catch (err) {
                console.error(err)
            }
        }
        fetchEvent()
    }, [eventId])

    async function handleUpdate() {
        if (!editForm.event_name.trim()) {
            setEditError("Please make sure all the required fields are filled in.")
            return
        }
        try {
            const updated = await updateEvent(eventId, editForm)
            setEvent(updated)
            setShowEditModal(false)
            setShowDeleteConfirm(false)
            setEditError("")
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            await deleteEvent(eventId)
            navigate(`/worlds/${worldId}/events`)
        } catch (err) {
            console.error(err)
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
                    {event ? (
                        <>
                            {/* Breadcrumb */}
                            <div className="flex items-center justify-between px-10 py-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
                                    <span
                                        className="hover:text-white/70 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/worlds/${worldId}/events`)}
                                    >
                                        Events
                                    </span>
                                    <span>/</span>
                                    <span className="text-white/70">{event.event_name}</span>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-300/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                                >
                                    Edit
                                </button>
                            </div>

                            {/* Main content */}
                            <div className="flex gap-8 p-10 items-start">
                                {/* Left: placeholder */}
                                <div className="w-80 shrink-0">
                                    <div className="rounded-lg border border-white/10 bg-white/5 flex items-center justify-center" style={{ minHeight: "280px" }}>
                                        <img src="/logo.svg" alt="logo" style={{ width: "80px", opacity: 0.55 }} />
                                    </div>
                                </div>

                                {/* Right: info */}
                                <div className="flex-1 flex flex-col gap-6">
                                <div>
                                    {(event.start_year || event.end_year) && (
                                        <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
                                            {event.start_year && event.end_year
                                                ? `${event.start_year} – ${event.end_year}`
                                                : event.start_year || event.end_year}
                                        </p>
                                    )}
                                    <h1 className="text-4xl font-bold text-white uppercase tracking-wide">
                                        {event.event_name}
                                    </h1>
                                </div>

                                {event.event_description && (
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-3">
                                            Description
                                        </p>
                                        <p
                                            className="text-white/70 leading-relaxed text-sm"
                                            style={{ fontFamily: "'Montserrat', sans-serif", whiteSpace: "pre-wrap" }}
                                        >
                                            {event.event_description}
                                        </p>
                                    </div>
                                )}

                                {/* Characters section */}
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                    <p className="text-white/30 text-xs tracking-widest uppercase mb-4">
                                        Characters
                                    </p>

                                    {/* Existing characters */}
                                    {eventCharacters.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-4">
                                            {eventCharacters.map((char) => (
                                                <div
                                                    key={char.character_id}
                                                    className="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-md"
                                                >
                                                    <button
                                                        onClick={() => navigate(`/worlds/${worldId}/characters/${char.character_id}`)}
                                                        className="text-white/80 hover:text-purple-300 text-sm tracking-wide transition-colors"
                                                    >
                                                        {char.character_name}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveCharacter(char.character_id)}
                                                        className="text-white/20 hover:text-red-400 text-xs transition-colors"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add character */}
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedCharId}
                                            onChange={(e) => setSelectedCharId(e.target.value)}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                        >
                                            <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Add character...</option>
                                            {allCharacters
                                                .filter((c) => !eventCharacters.find((ec) => ec.character_id === c.character_id))
                                                .map((c) => (
                                                    <option key={c.character_id} value={c.character_id} style={{ backgroundColor: 'white', color: 'black' }}>
                                                        {c.character_name}
                                                    </option>
                                                ))}
                                        </select>
                                        <button
                                            onClick={handleAddCharacter}
                                            disabled={!selectedCharId}
                                            className="px-4 py-2 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white text-sm rounded-md transition-all tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                </div>{/* end flex-1 right column */}
                            </div>{/* end flex gap-8 */}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1e] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg font-bold tracking-wide uppercase mb-6">
                            Edit Event
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Name <span className="text-white/20 normal-case tracking-normal">(required)</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.event_name}
                                    onChange={(e) => setEditForm({ ...editForm, event_name: e.target.value })}
                                    className={`w-full bg-white/5 border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/60 ${editError && !editForm.event_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Start Year <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.start_year}
                                    onChange={(e) => setEditForm({ ...editForm, start_year: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/60"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    End Year <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.end_year}
                                    onChange={(e) => setEditForm({ ...editForm, end_year: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/60"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={editForm.event_description}
                                    onChange={(e) => setEditForm({ ...editForm, event_description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/60 resize-none"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                        </div>

                        {editError && <p className="text-red-400 text-sm mt-4">{editError}</p>}

                        <div className="flex justify-between items-center mt-8">
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-xs text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-all"
                                >
                                    Delete Event
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
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setShowDeleteConfirm(false);
                                        setEditError("");
                                        setEditForm({
                                            event_name: event.event_name || "",
                                            event_description: event.event_description || "",
                                            start_year: event.start_year || "",
                                            end_year: event.end_year || "",
                                        });
                                    }}
                                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 px-4 py-2 rounded tracking-widest uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="text-xs text-white bg-purple-400 hover:bg-purple-300 px-4 py-2 rounded tracking-widest uppercase transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
