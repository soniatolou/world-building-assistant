const BASE_URL = "http://localhost:8000"

export async function getAllWorlds(userId) {
    const res = await fetch(`${BASE_URL}/users/${userId}/worlds`, {
        credentials: "include",
    })
    return res.json()
}

export async function getWorld(userId, worldId) {
    const res = await fetch(`${BASE_URL}/users/${userId}/worlds/${worldId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function updateWorld(worldId, worldData) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(worldData)
    })
    return res.json()
}

export async function deleteWorld(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}
