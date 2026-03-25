import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createItem } from "../api/items"
import WorldSidebar from "../components/WorldSidebar"
import Navbar from "../components/Navbar"

export default function CreateItem() {
    const { worldId } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({ item_name: "", item_description: "", image_url: "" })
    const [error, setError] = useState("")

    async function handleSubmit() {
        if (!form.item_name.trim()) {
            setError("Please fill in all the required fields")
            return
        }
        try {
            await createItem(worldId, {
                item_name: form.item_name.trim(),
                item_description: form.item_description || null,
                image_url: form.image_url || null,
            })
            navigate(`/worlds/${worldId}/items`)
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
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-purple-500" />
                        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">New Item</h1>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 w-full max-w-xl">
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Name <span className="text-white/20 normal-case tracking-normal">(required)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.item_name}
                                    onChange={(e) => setForm((f) => ({ ...f, item_name: e.target.value }))}
                                    className={`w-full bg-white/10 border rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 ${error && !form.item_name.trim() ? "border-red-500/60" : "border-white/20"}`}
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Image URL <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.image_url}
                                    onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                                    placeholder="https://..."
                                    className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>
                            <div>
                                <label className="text-white/50 text-xs tracking-widest uppercase mb-1 block">
                                    Description <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={4}
                                    value={form.item_description}
                                    onChange={(e) => setForm((f) => ({ ...f, item_description: e.target.value }))}
                                    className="w-full bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 text-white rounded-md transition-all tracking-wide"
                                >
                                    Create Item
                                </button>
                                <button
                                    onClick={() => navigate(`/worlds/${worldId}/items`)}
                                    className="px-5 py-3 text-white/50 hover:text-white border border-white/10 rounded-md transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
