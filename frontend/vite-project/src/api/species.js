const BASE_URL = "http://localhost:8000"

export async function getSpecies(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/species`, { credentials: "include" })
    return res.json()
}

export async function getOneSpecies(speciesId) {
    const res = await fetch(`${BASE_URL}/species/${speciesId}`, { credentials: "include" })
    return res.json()
}

export async function createSpecies(worldId, data) {
    const res = await fetch(`${BASE_URL}/species`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, world_id: Number(worldId) }),
    })
    return res.json()
}

export async function updateSpecies(speciesId, data) {
    const res = await fetch(`${BASE_URL}/species/${speciesId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function deleteSpecies(speciesId) {
    const res = await fetch(`${BASE_URL}/species/${speciesId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}
