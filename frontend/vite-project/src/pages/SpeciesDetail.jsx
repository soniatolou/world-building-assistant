import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getOneSpecies, updateSpecies, deleteSpecies } from "../api/species"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function SpeciesDetail() {
    const { worldId, speciesId } = useParams()
    const navigate = useNavigate()
    const [species, setSpecies] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editError, setEditError] = useState("")
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [editForm, setEditForm] = useState({ species_name: "", species_description: "", image_url: "" })
    useEffect(() => {
        async function fetchSpecies() {
            try {
                const data = await getOneSpecies(speciesId)
                setSpecies(data)
                setEditForm({ species_name: data.species_name || "", species_description: data.species_description || "", image_url: data.image_url || "" })
            } catch (err) {
                console.error(err)
            }
        }
        fetchSpecies()
    }, [speciesId])

    async function handleUpdate() {
        if (!editForm.species_name.trim()) {
            setEditError("Please make sure all the required fields are filled in.")
            return
        }
        try {
            const updated = await updateSpecies(speciesId, editForm)
            setSpecies(updated)
            setShowEditModal(false)
            setShowDeleteConfirm(false)
            setEditError("")
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            await deleteSpecies(speciesId)
            navigate(`/worlds/${worldId}/species`)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
            style={{ backgroundImage: `url('/homepage-background.png')`, fontFamily: "'Cinzel', serif" }}
        >
            <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
            <div className="relative z-10">
                <Navbar />
            </div>

            <div className="flex flex-1">
                <WorldSidebar worldId={worldId} />

                <div className="relative z-10 flex flex-col flex-1">
                    {species ? (
                        <>
                            {/* Breadcrumb */}
                            <div className="flex items-center justify-between px-10 py-4 border-b border-white/10">
                                <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-white/40">
                                    <span
                                        className="hover:text-white/70 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/worlds/${worldId}/species`)}
                                    >
                                        Species
                                    </span>
                                    <span>/</span>
                                    <span className="text-white/70">{species.species_name}</span>
                                </div>
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                                >
                                    Edit
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex gap-8 p-10 items-start">
                                {/* Left: image */}
                                <div className="w-80 shrink-0">
                                    {species.image_url ? (
                                        <div className="rounded-lg overflow-hidden border border-white/10">
                                            <img src={species.image_url} alt={species.species_name} className="w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-white/10 bg-white/5 flex items-center justify-center" style={{ minHeight: "280px" }}>
                                            <img src="/logo.svg" alt="logo" style={{ width: "80px", opacity: 0.55 }} />
                                        </div>
                                    )}
                                </div>

                                {/* Right: info */}
                                <div className="flex-1 flex flex-col gap-6">
                                    <h1 className="text-4xl font-bold text-white uppercase tracking-wide">
                                        {species.species_name}
                                    </h1>
                                    {species.species_description && (
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                                            <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Description</p>
                                            <p className="text-white/70 leading-relaxed text-sm" style={{ fontFamily: "'Montserrat', sans-serif", whiteSpace: "pre-wrap" }}>
                                                {species.species_description}
                                            </p>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1e] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg font-bold tracking-wide uppercase mb-6">Edit Species</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">Name <span className="text-white/20 normal-case tracking-normal">(required)</span></label>
                                <input
                                    type="text"
                                    value={editForm.species_name}
                                    onChange={(e) => setEditForm({ ...editForm, species_name: e.target.value })}
                                    className={`w-full bg-white/5 border rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 ${editError && !editForm.species_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">Image URL <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
                                <input
                                    type="text"
                                    value={editForm.image_url}
                                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">Description <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
                                <textarea
                                    rows={4}
                                    value={editForm.species_description}
                                    onChange={(e) => setEditForm({ ...editForm, species_description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 resize-none"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                        </div>

                        {editError && <p className="text-red-400 text-sm mt-4">{editError}</p>}

                        <div className="flex justify-between items-center mt-8">
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-xs text-red-400/70 hover:text-red-400 tracking-widests uppercase transition-all"
                                >
                                    Delete Species
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-white/50" style={{ fontFamily: "'Montserrat', sans-serif" }}>Are you sure?</span>
                                    <button
                                        onClick={handleDelete}
                                        className="text-xs text-red-400 border border-red-400/30 hover:border-red-400/60 px-3 py-1 rounded tracking-widests uppercase transition-all"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="text-xs text-white/40 hover:text-white/70 tracking-widests uppercase transition-all"
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
                                            species_name: species.species_name || "",
                                            species_description: species.species_description || "",
                                            image_url: species.image_url || "",
                                        });
                                    }}
                                    className="text-xs text-white/40 hover:text-white/70 border border-white/10 px-4 py-2 rounded tracking-widests uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="text-xs text-white bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded tracking-widests uppercase transition-all"
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
