import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserWorlds } from "../api/dashboard"
import { logout } from "../api/auth"

export default function Dashboard() {
    const navigate = useNavigate()
    const [worlds, setWorlds] = useState([])
    const [loading, setLoading] = useState(true)
    const userId = localStorage.getItem("user_id")
    const username = localStorage.getItem("username")

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
            } finally {
                setLoading(false)
            }
        }
        fetchWorlds()
    }, [])

    async function handleLogout() {
        await logout()
        localStorage.removeItem("user_id")
        localStorage.removeItem("username")
        navigate("/")
    }

    if (loading) {
        return (
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
                style={{
                    backgroundImage: `url('/homepage-background.png')`,
                    fontFamily: "'Cinzel', serif",
                }}
            >
                <p className="text-white text-2xl">Loading...</p>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `url('/homepage-background.png')`,
                fontFamily: "'Cinzel', serif",
            }}
        >
            {/* Banner */}
            <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 w-full">
                <div className="w-full px-6 py-4 flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold text-white whitespace-nowrap">
                            World-Building Assistant
                        </h1>
                        <button
                            onClick={() => navigate("/create-world")}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors border border-white/20 whitespace-nowrap"
                        >
                            Create World
                        </button>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors border border-white/20 whitespace-nowrap"
                        >
                            The Great Archives
                        </button>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <span
                            onClick={() => navigate("/profile")}
                            className="text-white/90 hover:text-white cursor-pointer transition-colors whitespace-nowrap"
                        >
                            {username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors border border-white/20 whitespace-nowrap"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main */}
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
    )
}