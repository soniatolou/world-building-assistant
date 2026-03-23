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
                            <div className="w-1 h-8 bg-purple-500" />
                            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                                Events
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
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
                            <p className="text-white/40 text-sm">
                                No events yet. Create your first one!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.event_id}
                                    onClick={() => navigate(`/worlds/${worldId}/events/${event.event_id}`)}
                                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                    {(event.start_year || event.end_year) && (
                                        <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
                                            {event.start_year && event.end_year
                                                ? `${event.start_year} – ${event.end_year}`
                                                : event.start_year || event.end_year}
                                        </p>
                                    )}
                                    <h2 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors tracking-wide">
                                        {event.event_name}
                                    </h2>
                                    {event.event_description && (
                                        <p
                                            className="text-white/50 text-sm line-clamp-3"
                                            style={{ fontFamily: "sans-serif" }}
                                        >
                                            {event.event_description}
                                        </p>
                                    )}
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
                                    className={`w-full bg-white/5 border rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 ${createError && !createForm.event_name.trim() ? "border-red-500/60" : "border-white/10"}`}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "sans-serif" }}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "sans-serif" }}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                                    style={{ fontFamily: "sans-serif" }}
                                />
                            </div>
                        </div>
                        {createError && (
                            <p className="text-red-400 text-sm mt-4">{createError}</p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleCreate}
                                className="flex-1 px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
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
