import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getNotes, createNote } from "../api/notes"
import Navbar from "../components/Navbar"

export default function Notes() {
    const navigate = useNavigate()
    const [notes, setNotes] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createForm, setCreateForm] = useState({ note_name: "", note_text: "" })
    const [successMsg, setSuccessMsg] = useState("")

    useEffect(() => {
        async function fetchNotes() {
            try {
                const data = await getNotes()
                if (Array.isArray(data)) setNotes(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchNotes()
    }, [])

    async function handleCreate() {
        if (!createForm.note_name.trim() || !createForm.note_text.trim()) return
        try {
            const newNote = await createNote(createForm)
            setNotes((prev) => [...prev, newNote])
            setShowCreateModal(false)
            setCreateForm({ note_name: "", note_text: "" })
            setSuccessMsg("Note created!")
            setTimeout(() => setSuccessMsg(""), 3000)
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

            <div className="relative z-10 flex flex-col flex-1 p-10 max-w-5xl w-full mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-purple-500" />
                        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Notes</h1>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-5 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
                    >
                        + New Note
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
                        {successMsg}
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <p className="text-white/40 text-sm">No notes yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.notes_id}
                                onClick={() => navigate(`/notes/${note.notes_id}`)}
                                className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer group"
                            >
                                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors tracking-wide">
                                    {note.note_name}
                                </h2>
                                <p className="text-white/50 text-sm line-clamp-4" style={{ fontFamily: "sans-serif" }}>
                                    {note.note_text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1c] border border-white/10 rounded-xl p-8 w-full max-w-lg shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg tracking-widest uppercase mb-6">New Note</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">Title</label>
                                <input
                                    type="text"
                                    value={createForm.note_name}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, note_name: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">Note</label>
                                <textarea
                                    rows={6}
                                    value={createForm.note_text}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, note_text: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none"
                                    style={{ fontFamily: "sans-serif" }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={handleCreate}
                                disabled={!createForm.note_name.trim() || !createForm.note_text.trim()}
                                className="flex-1 px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => { setShowCreateModal(false); setCreateForm({ note_name: "", note_text: "" }) }}
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
