import { useNavigate, useLocation } from "react-router-dom"

export default function WorldSidebar({ worldId, worldName }) {
    const navigate = useNavigate()
    const location = useLocation()

    const links = [
        { label: "Dashboard", path: `/worlds/${worldId}` },
        { label: "Characters", path: `/worlds/${worldId}/characters` },
        { label: "Relationships", path: `/worlds/${worldId}/relationships` },
        { label: "Locations", path: `/worlds/${worldId}/locations` },
        { label: "Events", path: `/worlds/${worldId}/events` },
        { label: "Maps", path: `/worlds/${worldId}/maps` },
    ]

    return (
        <aside
            className="w-48 min-h-screen bg-black/30 backdrop-blur-sm border-r border-white/10 flex flex-col pt-8 px-4 shrink-0"
            style={{ fontFamily: "'Cinzel', serif" }}
        >
            <p className="text-purple-400 text-xs tracking-widest uppercase mb-1">
                World-Building Assistant
            </p>
            {worldName && (
                <p className="text-white/50 text-xs mb-8 truncate">{worldName}</p>
            )}

            <nav className="flex flex-col gap-1">
                {links.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                        <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className={`text-left text-sm py-2 px-3 tracking-widest uppercase transition-colors ${
                                isActive
                                    ? "text-white border-l-2 border-purple-500 pl-2"
                                    : "text-white/50 hover:text-white/80"
                            }`}
                        >
                            {link.label}
                        </button>
                    )
                })}
            </nav>
        </aside>
    )
}
