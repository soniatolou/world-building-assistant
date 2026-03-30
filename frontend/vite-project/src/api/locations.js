const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function getLocations(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/locations`, {
        credentials: "include",
    })
    return res.json()
}

export async function getLocation(locationId) {
    const res = await fetch(`${BASE_URL}/locations/${locationId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function createLocation(locationData) {
    const res = await fetch(`${BASE_URL}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(locationData),
    })
    return res.json()
}

export async function updateLocation(locationId, locationData) {
    const res = await fetch(`${BASE_URL}/locations/${locationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(locationData),
    })
    return res.json()
}

export async function deleteLocation(locationId) {
    const res = await fetch(`${BASE_URL}/locations/${locationId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}
