const BASE_URL = "http://localhost:8000"

export async function getUserWorlds() {
    const res = await fetch(`${BASE_URL}/worlds`, {
        method: "GET",
        credentials: "include",
    })
    return res.json()
}

export async function createWorld(worldData) {
    const res = await fetch(`${BASE_URL}/worlds`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(worldData)
    })
    return res.json()
}

export async function deleteWorld(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}