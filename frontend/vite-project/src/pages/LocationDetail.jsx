import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getLocation, updateLocation, deleteLocation } from "../api/locations"
import { getMaps } from "../api/maps"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function LocationDetail() {
    const { worldId, locationId } = useParams()
    const navigate = useNavigate()
    const [location, setLocation] = useState(null)
    const [maps, setMaps] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [editError, setEditError] = useState("")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [editForm, setEditForm] = useState({
        location_name: "",
        location_description: "",
        location_type: "",
        map_id: "",
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const [locData, mapData] = await Promise.all([
                    getLocation(locationId),
                    getMaps(worldId),
                ])
                setLocation(locData)
                setEditForm({
                    location_name: locData.location_name || "",
                    location_description: locData.location_description || "",
                    location_type: locData.location_type || "",
                    map_id: locData.map_id || "",
                })
                if (Array.isArray(mapData)) setMaps(mapData)
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [locationId, worldId])

    async function handleUpdate() {
        if (!editForm.location_name.trim()) {
            setEditError("Please make sure all the required fields are filled in.")
            return
        }
        try {
            const updated = await updateLocation(locationId, {
                location_name: editForm.location_name,
                location_description: editForm.location_description,
                location_type: editForm.location_type || null,
                map_id: editForm.map_id ? parseInt(editForm.map_id) : null,
            })
            setLocation(updated)
            setShowEditModal(false)
            setShowDeleteConfirm(false)
            setEditError("")
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            await deleteLocation(locationId)
            navigate(`/worlds/${worldId}/locations`)
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
                    {location ? (
                        <>
                            {/* Breadcrumb */}
                            <div className="flex items-center justify-between px-10 py-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
                                    <span
                                        className="hover:text-white/70 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/worlds/${worldId}/locations`)}
                                    >
                                        Locations
                                    </span>
                                    <span>/</span>
                                    <span className="text-white/70">{location.location_name}</span>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                                >
                                    Edit
                                </button>
                            </div>

                            {/* Main content */}
                            <div className="flex flex-col gap-8 p-10 max-w-2xl">
                                <div>
                                    {location.location_type && (
                                        <p className="text-purple-400 text-xs tracking-widest uppercase mb-3">
                                            {location.location_type}
                                        </p>
                                    )}
                                    <h1 className="text-4xl font-bold text-white uppercase tracking-wide">
                                        {location.location_name}
                                    </h1>
                                </div>

                                {location.location_description && (
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-3">
                                            Description
                                        </p>
                                        <p
                                            className="text-white/70 leading-relaxed text-sm"
                                            style={{ fontFamily: "sans-serif", whiteSpace: "pre-wrap" }}
                                        >
                                            {location.location_description}
                                        </p>
                                    </div>
                                )}

                                {location.map_id && maps.length > 0 && (() => {
                                    const linkedMap = maps.find((m) => m.map_id === location.map_id)
                                    return linkedMap ? (
                                        <div>
                                            <h3 className="text-purple-400 text-xs tracking-widest uppercase mb-3 border-b border-white/10 pb-2">
                                                Map
                                            </h3>
                                            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                                                <div
                                                    onClick={() => navigate(`/worlds/${worldId}/maps/${linkedMap.map_id}`)}
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-all"
                                                >
                                                    <span className="text-white/80 hover:text-purple-300 text-sm tracking-wide transition-colors">
                                                        {linkedMap.map_name}
                                                    </span>
                                                </div>
                                                {linkedMap.map_url && (
                                                    <div className="border-t border-white/10">
                                                        <img
                                                            src={linkedMap.map_url}
                                                            alt={linkedMap.map_name}
                                                            className="w-full object-cover max-h-[300px]"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : null
                                })()}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1">
                            <p className="text-white/40">Loading...</p>
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
                            Edit Location
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Name <span className="text-white/20 normal-case tracking-normal">(required)</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.location_name}
                                    onChange={(e) => setEditForm({ ...editForm, location_name: e.target.value })}
                                    className={`w-full bg-white/5 border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 ${editError && !editForm.location_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Type <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.location_type}
                                    onChange={(e) => setEditForm({ ...editForm, location_type: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Map <span className="text-white/20 normal-case tracking-normal">(Optional)</span>
                                </label>
                                <select
                                    value={editForm.map_id}
                                    onChange={(e) => setEditForm({ ...editForm, map_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    <option value="" style={{ backgroundColor: 'white', color: 'black' }}>No map selected</option>
                                    {maps.map((m) => (
                                        <option key={m.map_id} value={m.map_id} style={{ backgroundColor: 'white', color: 'black' }}>
                                            {m.map_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                    Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={editForm.location_description}
                                    onChange={(e) => setEditForm({ ...editForm, location_description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 resize-none"
                                    style={{ fontFamily: "sans-serif" }}
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
                                    Delete Location
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-white/50" style={{ fontFamily: "sans-serif" }}>
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
                                            location_name: location.location_name || "",
                                            location_description: location.location_description || "",
                                            location_type: location.location_type || "",
                                            map_id: location.map_id || "",
                                        });
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
    )
}
