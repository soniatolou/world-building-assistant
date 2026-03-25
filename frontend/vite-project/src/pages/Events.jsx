import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEvents, createEvent } from "../api/events"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function Events() {
    const { worldId } = useParams()
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [createError, setCreateError] = useState("")
    const [createForm, setCreateForm] = useState({
        event_name: "",
        event_description: "",
        start_year: "",
        end_year: "",
    })

    useEffect(() => {
        async function fetchEvents() {
            try {
                const data = await getEvents(worldId)
                if (Array.isArray(data)) setEvents(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchEvents()
    }, [worldId])

    async function handleCreate() {
        if (!createForm.event_name.trim()) {
            setCreateError("Please fill in all the required fields")
            return
        }
        try {
            const newEvent = await createEvent(worldId, createForm)
            setEvents((prev) => [...prev, newEvent])
            setShowCreateModal(false)
            setCreateForm({ event_name: "", event_description: "", start_year: "", end_year: "" })
            setCreateError("")
            setSuccessMsg("Event created!")
            setTimeout(() => setSuccessMsg(""), 3000)
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

                <div className="relative z-10 flex flex-col flex-1 p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-purple-300" />
                            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                                Events
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2 bg-purple-400/40 hover:bg-purple-400/60 border border-purple-300/40 text-white text-sm rounded-md transition-all tracking-wide"
                        >
                            + New Event
                        </button>
                    </div>

                    {successMsg && (
                        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
                            {successMsg}
                        </div>
                    )}

                    {events.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <p className="text-white/40 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                No events yet. Create your first one!
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.5rem" }}>
                            {events.map((event) => (
                                <div
                                    key={event.event_id}
                                    onClick={() => navigate(`/worlds/${worldId}/events/${event.event_id}`)}
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
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img src="/logo.svg" alt="logo" style={{ width: "52px", opacity: 0.55 }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-3 px-1 pb-1">
                                        {(event.start_year || event.end_year) && (
                                            <p className="text-purple-400 text-xs tracking-widest uppercase" style={{ fontFamily: "sans-serif" }}>
                                                {event.start_year && event.end_year
                                                    ? `${event.start_year} – ${event.end_year}`
                                                    : event.start_year || event.end_year}
                                            </p>
                                        )}
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
                                            {event.event_name}
                                        </h2>
                                        {event.event_description && (
                                            <p className="text-white/65 leading-relaxed line-clamp-3" style={{ fontFamily: "sans-serif", fontSize: "0.95rem" }}>
                                                {event.event_description}
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
                            New Event
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Name <span className="text-white/20 normal-case tracking-normal">(required)</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.event_name}
                                    onChange={(e) =>
                                        setCreateForm((f) => ({ ...f, event_name: e.target.value }))
                                    }
                                    className={`w-full bg-white/5 border rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50 ${createError && !createForm.event_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Start Year <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.start_year}
                                    onChange={(e) =>
                                        setCreateForm((f) => ({ ...f, start_year: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    End Year <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.end_year}
                                    onChange={(e) =>
                                        setCreateForm((f) => ({ ...f, end_year: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={createForm.event_description}
                                    onChange={(e) =>
                                        setCreateForm((f) => ({ ...f, event_description: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-300/50 resize-none"
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
                                    setShowCreateModal(false)
                                    setCreateForm({ event_name: "", event_description: "", start_year: "", end_year: "" })
                                    setCreateError("")
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
    )
}
