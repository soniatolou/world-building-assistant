const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function getMaps(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/maps`, {
        credentials: "include",
    })
    return res.json()
}

export async function getMap(mapId) {
    const res = await fetch(`${BASE_URL}/maps/${mapId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function createMap(worldId, mapData) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/maps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mapData),
    })
    return res.json()
}

export async function updateMap(mapId, mapData) {
    const res = await fetch(`${BASE_URL}/maps/${mapId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(mapData),
    })
    return res.json()
}

export async function deleteMap(mapId) {
    const res = await fetch(`${BASE_URL}/maps/${mapId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}
