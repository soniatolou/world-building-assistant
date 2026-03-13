import { useNavigate } from "react-router-dom"
import { logout } from "../api/auth"

export default function Navbar() {
    const navigate = useNavigate()
    const username = localStorage.getItem("username")

    async function handleLogout() {
        await logout()
        localStorage.removeItem("user_id")
        localStorage.removeItem("username")
        navigate("/")
    }

    return (
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 w-full">
            <div className="w-full px-6 py-4 flex items-center justify-between">
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
    )
}