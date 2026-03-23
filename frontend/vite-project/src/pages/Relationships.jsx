import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getCharacters } from "../api/characters"
import { getRelationshipsForCharacter, createRelationship, deleteRelationship } from "../api/relationships"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function Relationships() {
    const { worldId } = useParams()
    const [characters, setCharacters] = useState([])
    const [selectedChar, setSelectedChar] = useState(null)
    const [relationships, setRelationships] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [successMsg, setSuccessMsg] = useState("")
    const [form, setForm] = useState({
        character_a_id: "",
        character_b_id: "",
        relationship_type: "",
    })

    useEffect(() => {
        async function fetchCharacters() {
            try {
                const data = await getCharacters(worldId)
                if (Array.isArray(data)) setCharacters(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCharacters()
    }, [worldId])

    useEffect(() => {
        if (!selectedChar) return
        async function fetchRelationships() {
            try {
                const data = await getRelationshipsForCharacter(selectedChar.character_id)
                setRelationships(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchRelationships()
    }, [selectedChar])

    async function handleCreate() {
        if (!form.character_a_id || !form.character_b_id || !form.relationship_type.trim()) return
        try {
            await createRelationship(form.character_a_id, {
                relationship_type: form.relationship_type.trim(),
                character_a_id: parseInt(form.character_a_id),
                character_b_id: parseInt(form.character_b_id),
            })
            setShowModal(false)
            setForm({ character_a_id: "", character_b_id: "", relationship_type: "" })
            setSuccessMsg("Relationship created!")
            setTimeout(() => setSuccessMsg(""), 3000)
            if (
                selectedChar &&
                (selectedChar.character_id === parseInt(form.character_a_id) ||
                    selectedChar.character_id === parseInt(form.character_b_id))
            ) {
                const data = await getRelationshipsForCharacter(selectedChar.character_id)
                setRelationships(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete(relationshipId) {
        try {
            await deleteRelationship(relationshipId)
            setRelationships((prev) => prev.filter((r) => r.relationship_id !== relationshipId))
            setShowDeleteConfirm(null)
            setSuccessMsg("Relationship deleted!")
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
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-purple-500" />
                            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                                Relationships
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-5 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
                        >
                            + Add Relationship
                        </button>
                    </div>

                    {successMsg && (
                        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
                            {successMsg}
                        </div>
                    )}

                    <div className="flex gap-8 flex-1">
                        {/* Character filter panel */}
                        <div className="w-48 shrink-0">
                            <p className="text-white/40 text-xs tracking-widest uppercase mb-3">
                                Filter by character
                            </p>
                            <div className="flex flex-col gap-1">
                                {characters.map((char) => (
                                    <button
                                        key={char.character_id}
                                        onClick={() => {
                                            setSelectedChar(char)
                                            setRelationships([])
                                        }}
                                        className={`text-left px-3 py-2 text-sm rounded-md transition-all tracking-wide border ${
                                            selectedChar?.character_id === char.character_id
                                                ? "bg-purple-600/30 border-purple-500/40 text-white"
                                                : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5"
                                        }`}
                                    >
                                        {char.character_name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Relationships area */}
                        <div className="flex-1">
                            {!selectedChar ? (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-white/30 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        Select a character to view their relationships
                                    </p>
                                </div>
                            ) : relationships.length === 0 ? (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-white/30 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        {selectedChar.character_name} has no relationships yet
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {relationships.map((rel) => {
                                        const otherName =
                                            rel.character_a_name === selectedChar.character_name
                                                ? rel.character_b_name
                                                : rel.character_a_name
                                        return (
                                            <div
                                                key={rel.relationship_id}
                                                className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-purple-500/30 transition-all group relative"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    {/* Character A */}
                                                    <div className="flex flex-col items-center gap-2 flex-1">
                                                        <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30" />
                                                        <span className="text-white text-xs text-center tracking-wider">
                                                            {selectedChar.character_name}
                                                        </span>
                                                    </div>

                                                    {/* Connector */}
                                                    <div className="flex flex-col items-center gap-1 shrink-0">
                                                        <span className="text-purple-400 text-xs tracking-widest uppercase border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded text-center">
                                                            {rel.relationship_type}
                                                        </span>
                                                        <div className="w-10 h-px bg-white/10" />
                                                    </div>

                                                    {/* Character B */}
                                                    <div className="flex flex-col items-center gap-2 flex-1">
                                                        <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/30" />
                                                        <span className="text-white text-xs text-center tracking-wider">
                                                            {otherName}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Delete button */}
                                                <button
                                                    onClick={() => setShowDeleteConfirm(rel.relationship_id)}
                                                    className="absolute top-2 right-2 text-white/20 hover:text-red-400 text-xs transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Relationship Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1c] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg tracking-widest uppercase mb-6">
                            Add Relationship
                        </h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Character A
                                </label>
                                <select
                                    value={form.character_a_id}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, character_a_id: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select character...</option>
                                    {characters.map((c) => (
                                        <option key={c.character_id} value={c.character_id} style={{ backgroundColor: 'white', color: 'black' }}>
                                            {c.character_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Relationship Type
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rival, Mentor, Childhood friend..."
                                    value={form.relationship_type}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, relationship_type: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 placeholder:text-white/20"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>

                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Character B
                                </label>
                                <select
                                    value={form.character_b_id}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, character_b_id: e.target.value }))
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    <option value="" style={{ backgroundColor: 'white', color: 'black' }}>Select character...</option>
                                    {characters
                                        .filter(
                                            (c) => c.character_id !== parseInt(form.character_a_id)
                                        )
                                        .map((c) => (
                                            <option key={c.character_id} value={c.character_id} style={{ backgroundColor: 'white', color: 'black' }}>
                                                {c.character_name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleCreate}
                                disabled={
                                    !form.character_a_id ||
                                    !form.character_b_id ||
                                    !form.relationship_type.trim()
                                }
                                className="flex-1 px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setForm({ character_a_id: "", character_b_id: "", relationship_type: "" })
                                }}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm rounded-md transition-all tracking-wide"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1c] border border-white/10 rounded-xl p-8 w-full max-w-sm shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg tracking-widest uppercase mb-3">
                            Delete Relationship
                        </h2>
                        <p
                            className="text-white/50 text-sm mb-8"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Are you sure you want to delete this relationship? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 text-red-400 text-sm rounded-md transition-all tracking-wide"
                            >
                                Yes, delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm rounded-md transition-all tracking-wide"
                            >
                                No, don't delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
