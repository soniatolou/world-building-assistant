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
                                {/* Framed image with large margin */}
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
                                    {world.image_url ? (
                                        <img
                                            src={world.image_url}
                                            alt={world.world_name}
                                            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                                            style={{ objectFit: "cover", objectPosition: "center", display: "block" }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <img src="/logo.svg" alt="logo" style={{ width: "52px", opacity: 0.55 }} />
                                        </div>
                                    )}
                                </div>

                                {/* Text content */}
                                <div className="flex flex-col gap-2 mt-3 px-1 pb-1">
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
                                        {world.world_name}
                                    </h2>
                                    {world.world_description && (
                                        <p className="text-white/65 leading-relaxed line-clamp-3" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem" }}>
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