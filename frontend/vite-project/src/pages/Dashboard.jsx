import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserWorlds } from "../api/dashboard"
import Navbar from "../components/Navbar"

export default function Dashboard() {
    const navigate = useNavigate()
    const [worlds, setWorlds] = useState([])
    const userId = localStorage.getItem("user_id")

    useEffect(() => {
        async function fetchWorlds() {
            try {
                const data = await getUserWorlds(userId)
                if (Array.isArray(data)) {
                    setWorlds(data)
                } else {
                    setWorlds([])
                }
            } catch (err) {
                console.error(err)
                setWorlds([])
            }
        }
        fetchWorlds()
    }, [])

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('/homepage-background.png')`,
                fontFamily: "'Cinzel', serif",
            }}
        >
            <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
            <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />

            <main className="container mx-auto px-6 py-12">
                {worlds.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <p className="text-3xl text-white/50 font-light" style={{ fontFamily: "'Cinzel', serif" }}>
                                You don't have any worlds yet.
                            </p>
                            <p className="text-3xl text-white/50 font-light mt-2" style={{ fontFamily: "'Cinzel', serif" }}>
                                Click create world to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {worlds.map((world) => (
                            <div
                                key={world.world_id}
                                onClick={() => navigate(`/worlds/${world.world_id}`)}
                                className="cursor-pointer group transition-all duration-300"
                                style={{
                                    borderRadius: "14px",
                                    border: "2px solid rgba(148,163,184,0.45)",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                                    background: "rgba(13,15,30,0.9)",
                                    overflow: "hidden",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = "2px solid rgba(168,85,247,0.8)"
                                    e.currentTarget.style.boxShadow = "0 0 20px rgba(168,85,247,0.35), 0 4px 24px rgba(0,0,0,0.6)"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = "2px solid rgba(148,163,184,0.45)"
                                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.6)"
                                }}
                            >
                                <div className="aspect-square w-full shrink-0 overflow-hidden">
                                    {world.image_url ? (
                                        <img
                                            src={world.image_url}
                                            alt={world.world_name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <span className="text-white/20 text-4xl">✦</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <h2
                                        className="text-base text-white leading-snug"
                                        style={{ fontFamily: "'Cinzel', serif", fontVariant: "small-caps" }}
                                    >
                                        {world.world_name}
                                    </h2>
                                    {world.world_description && (
                                        <p className="text-white/50 text-xs line-clamp-3 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
                                            {world.world_description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            </div>
        </div>
    )
}