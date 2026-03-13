import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createWorld } from "../api/dashboard"
import Navbar from "../components/Navbar"

export default function CreateWorld() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        world_name: "",
        world_description: "",
        image_url: "",
    })

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        await createWorld(formData)
        navigate("/dashboard")
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('/homepage-background.png')`,
                fontFamily: "'Cinzel', serif",
            }}
        >
            <Navbar />

            <main className="flex items-center justify-center min-h-[calc(100vh-73px)]">
                <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg p-10 w-full max-w-lg">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">
                        Create World
                    </h2>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-white/90 text-sm">World Name</label>
                            <input
                                type="text"
                                name="world_name"
                                value={formData.world_name}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                                placeholder="Enter world name"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-white/90 text-sm">Description</label>
                            <textarea
                                name="world_description"
                                value={formData.world_description}
                                onChange={handleChange}
                                rows={4}
                                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/50 resize-none"
                                placeholder="Describe your world"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-white/90 text-sm">
                                Image URL <span className="text-white/40">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                className="bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/50"
                                placeholder="https://..."
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="mt-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors border border-white/20 text-lg"
                        >
                            Create World
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}