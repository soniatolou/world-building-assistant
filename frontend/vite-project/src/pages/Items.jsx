import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getItems, createItem } from "../api/items"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function Items() {
    const { worldId } = useParams()
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [createForm, setCreateForm] = useState({ item_name: "", item_description: "" })
    const [createError, setCreateError] = useState("")

    useEffect(() => {
        async function fetchItems() {
            try {
                const data = await getItems(worldId)
                if (Array.isArray(data)) setItems(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchItems()
    }, [worldId])

    async function handleCreate() {
        if (!createForm.item_name.trim()) {
            setCreateError("Please fill in all the required fields")
            return
        }
        try {
            const newItem = await createItem(worldId, createForm)
            setItems((prev) => [...prev, newItem])
            setShowCreateModal(false)
            setCreateForm({ item_name: "", item_description: "" })
            setCreateError("")
            setSuccessMsg("Item created!")
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
            <div className="flex flex-1">
                <WorldSidebar worldId={worldId} />

                <div className="relative z-10 flex flex-col flex-1 p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-purple-500" />
                            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Items</h1>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-5 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white text-sm rounded-md transition-all tracking-wide"
                        >
                            + New Item
                        </button>
                    </div>

                    {successMsg && (
                        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
                            {successMsg}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[50vh]">
                            <p className="text-white/40 text-sm">No items yet. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((item) => (
                                <div
                                    key={item.item_id}
                                    onClick={() => navigate(`/worlds/${worldId}/items/${item.item_id}`)}
                                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all cursor-pointer group"
                                >
                                    <h2 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors tracking-wide">
                                        {item.item_name}
                                    </h2>
                                    {item.item_description && (
                                        <p className="text-white/50 text-sm line-clamp-3" style={{ fontFamily: "sans-serif" }}>
                                            {item.item_description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div
                        className="bg-[#0d0f1c] border border-white/10 rounded-xl p-8 w-full max-w-md shadow-2xl"
                        style={{ fontFamily: "'Cinzel', serif" }}
                    >
                        <h2 className="text-white text-lg tracking-widest uppercase mb-6">New Item</h2>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">Name <span className="text-white/20 normal-case tracking-normal">(required)</span></label>
                                <input
                                    type="text"
                                    value={createForm.item_name}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, item_name: e.target.value }))}
                                    className={`w-full bg-white/5 border rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 ${createError && !createForm.item_name.trim() ? "border-red-500/60" : "border-white/10"}`}
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">Description <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
                                <textarea
                                    rows={4}
                                    value={createForm.item_description}
                                    onChange={(e) => setCreateForm((f) => ({ ...f, item_description: e.target.value }))}
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
                                onClick={() => { setShowCreateModal(false); setCreateForm({ item_name: "", item_description: "" }); setCreateError("") }}
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
