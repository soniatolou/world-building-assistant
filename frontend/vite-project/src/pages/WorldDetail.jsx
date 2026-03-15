import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getUserWorlds } from "../api/dashboard"
import { getCharacters } from "../api/characters"
import { getLocations } from "../api/locations"
import { getEvents } from "../api/events"
import { getMaps } from "../api/maps"
import WorldSidebar from "../components/WorldSidebar"

export default function WorldDetail() {
    const { worldId } = useParams()
    const navigate = useNavigate()
    const userId = localStorage.getItem("user_id")

    const [world, setWorld] = useState(null)
    const [counts, setCounts] = useState({ characters: 0, locations: 0, events: 0, maps: 0 })

    useEffect(() => {
        async function fetchData() {
            try {
                const worlds = await getUserWorlds(userId)
                const found = worlds.find((w) => String(w.world_id) === String(worldId))
                if (found) setWorld(found)

                const [characters, locations, events, maps] = await Promise.all([
                    getCharacters(worldId),
                    getLocations(worldId),
                    getEvents(worldId),
                    getMaps(worldId),
                ])
                setCounts({
                    characters: Array.isArray(characters) ? characters.length : 0,
                    locations: Array.isArray(locations) ? locations.length : 0,
                    events: Array.isArray(events) ? events.length : 0,
                    maps: Array.isArray(maps) ? maps.length : 0,
                })
            } catch (err) {
                console.error(err)
            }
        }
        fetchData()
    }, [worldId])

    const quickActions = [
        { label: "New Character", path: `/worlds/${worldId}/characters/create` },
        { label: "New Location", path: `/worlds/${worldId}/locations/create` },
        { label: "New Event", path: `/worlds/${worldId}/events/create` },
        { label: "New Map", path: `/worlds/${worldId}/maps/create` },
    ]

    const stats = [
        { label: "Characters", value: counts.characters },
        { label: "Locations", value: counts.locations },
        { label: "Events", value: counts.events },
        { label: "Maps", value: counts.maps },
    ]

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat flex"
            style={{
                backgroundImage: `url('/homepage-background.png')`,
                fontFamily: "'Cinzel', serif",
            }}
        >
            <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />

            <WorldSidebar worldId={worldId} worldName={world?.world_name} />

            <div className="relative z-10 flex flex-col flex-1 p-10">
                {world ? (
                    <>
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1 h-8 bg-purple-500" />
                                <h1 className="text-3xl font-bold text-white tracking-wide uppercase">
                                    {world.world_name}
                                </h1>
                            </div>
                            <p className="text-white/50 text-sm ml-4" style={{ fontFamily: "sans-serif" }}>
                                {world.world_description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-white/5 border border-white/10 rounded-lg p-5 text-center"
                                >
                                    <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
                                    <p className="text-white/50 text-xs tracking-widest uppercase mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="text-white/50 text-xs tracking-widest uppercase mb-4">
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickActions.map((action) => (
                                    <button
                                        key={action.path}
                                        onClick={() => navigate(action.path)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 rounded-lg p-5 text-white/70 hover:text-white text-sm tracking-wide transition-all text-left"
                                    >
                                        + {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="text-white/40">Loading...</p>
                )}
            </div>
        </div>
    )
}
