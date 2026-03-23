import { useNavigate, useLocation } from "react-router-dom"
import { useConsistency } from "../context/ConsistencyContext"

export default function WorldSidebar({ worldId, worldName }) {
    const navigate = useNavigate()
    const location = useLocation()
    const { consistencyResult, clearResult } = useConsistency()
    const isWorldDetail = location.pathname === `/worlds/${worldId}`

    const links = [
        { label: "Dashboard", path: `/worlds/${worldId}` },
        { label: "Characters", path: `/worlds/${worldId}/characters` },
        { label: "Relationships", path: `/worlds/${worldId}/relationships` },
        { label: "Locations", path: `/worlds/${worldId}/locations` },
        { label: "Events", path: `/worlds/${worldId}/events` },
        { label: "Maps", path: `/worlds/${worldId}/maps` },
        { label: "Items", path: `/worlds/${worldId}/items` },
        { label: "Species", path: `/worlds/${worldId}/species` },
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

            {consistencyResult && !isWorldDetail && (
                <div className="mt-6 bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-amber-300 text-xs tracking-widest uppercase">
                            AI Consistency Check
                        </h3>
                        <button
                            onClick={clearResult}
                            className="text-amber-300/50 hover:text-amber-300 transition-colors text-base leading-none"
                            aria-label="Dismiss"
                        >
                            ×
                        </button>
                    </div>
                    {consistencyResult.contradictions && consistencyResult.contradictions.length === 0 ? (
                        <p className="text-amber-200/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            No issues found. Your world is consistent!
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {(consistencyResult.contradictions || []).map((item, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <p className="text-amber-100/80 text-xs leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        {item.description}
                                    </p>
                                    {item.elements_involved && item.elements_involved.length > 0 && (
                                        <p className="text-amber-400/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            Involves: {item.elements_involved.join(", ")}
                                        </p>
                                    )}
                                    {item.suggestion && (
                                        <p className="text-amber-300/70 text-xs italic" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            {item.suggestion}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </aside>
    )
}
