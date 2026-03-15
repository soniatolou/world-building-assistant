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
                            <p className="text-3xl text-white font-light">
                                You don't have any worlds yet.
                            </p>
                            <p className="text-3xl text-white font-light mt-2">
                                Click create world to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {worlds.map((world) => (
                            <div
                                key={world.world_id}
                                onClick={() => navigate(`/worlds/${world.world_id}`)}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 transition-all cursor-pointer"
                            >
                                {world.image_url && (
                                    <img
                                        src={world.image_url}
                                        alt={world.world_name}
                                        className="w-full h-48 object-cover rounded-md mb-4"
                                    />
                                )}
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {world.world_name}
                                </h2>
                                <p className="text-white/80 line-clamp-3">
                                    {world.world_description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            </div>
        </div>
    )
}