import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMe, updateMe, deleteMe, logout } from "../api/auth"
import Navbar from "../components/Navbar"

export default function Profile() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [successMsg, setSuccessMsg] = useState("")
    const [editForm, setEditForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
    })

    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getMe()
                setUser(data)
                setEditForm({
                    username: data.username || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                })
            } catch (err) {
                console.error(err)
            }
        }
        fetchUser()
    }, [])

    async function handleUpdate() {
        try {
            const updated = await updateMe(editForm)
            setUser(updated)
            localStorage.setItem("username", updated.username)
            setIsEditing(false)
            setSuccessMsg("Profile updated!")
            setTimeout(() => setSuccessMsg(""), 3000)
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete() {
        try {
            await deleteMe()
            await logout()
            localStorage.removeItem("user_id")
            localStorage.removeItem("username")
            navigate("/")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
            style={{
                backgroundImage: `url('/homepage-background.png')`,
                fontFamily: "'Cinzel', serif",
            }}
        >
            <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
            <div className="relative z-10">
                <Navbar />
            </div>

            <div className="relative z-10 flex flex-col flex-1 p-10 max-w-2xl w-full mx-auto">
                {user ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-purple-500" />
                                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                                    Profile
                                </h1>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-white/50 hover:text-white border border-white/10 hover:border-purple-500/40 px-3 py-1.5 rounded tracking-widest uppercase transition-all"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {successMsg && (
                            <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md">
                                {successMsg}
                            </div>
                        )}

                        {!isEditing ? (
                            /* View mode */
                            <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Username</p>
                                        <p className="text-white text-sm tracking-wide">{user.username}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Email</p>
                                        <p className="text-white text-sm tracking-wide" style={{ fontFamily: "sans-serif" }}>{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-2">First Name</p>
                                        <p className="text-white text-sm tracking-wide">{user.first_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/30 text-xs tracking-widest uppercase mb-2">Last Name</p>
                                        <p className="text-white text-sm tracking-wide">{user.last_name}</p>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-6">
                                    {!showDeleteConfirm ? (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="text-xs text-red-400/70 hover:text-red-400 tracking-widest uppercase transition-all"
                                        >
                                            Delete Account
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-white/50" style={{ fontFamily: "sans-serif" }}>
                                                Are you sure? This cannot be undone.
                                            </span>
                                            <button
                                                onClick={handleDelete}
                                                className="text-xs text-red-400 border border-red-400/30 hover:border-red-400/60 px-3 py-1 rounded tracking-widest uppercase transition-all"
                                            >
                                                Yes, delete
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="text-xs text-white/40 hover:text-white/70 tracking-widest uppercase transition-all"
                                            >
                                                No, don't delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Edit mode */
                            <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.username}
                                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                            style={{ fontFamily: "sans-serif" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.first_name}
                                            onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs tracking-widest uppercase block mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.last_name}
                                            onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                                            style={{ fontFamily: "'Cinzel', serif" }}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded tracking-widest uppercase transition-all"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false)
                                            setEditForm({
                                                username: user.username || "",
                                                first_name: user.first_name || "",
                                                last_name: user.last_name || "",
                                                email: user.email || "",
                                            })
                                        }}
                                        className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 text-xs rounded tracking-widest uppercase transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-white/40">Loading...</p>
                )}
            </div>
        </div>
    )
}
