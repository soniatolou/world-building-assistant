const BASE_URL = "http://localhost:8000"

export async function getCharacters(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/characters`, {
        credentials: "include",
    })
    return res.json()
}

export async function getCharacter(characterId) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function createCharacter(worldId, characterData) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(characterData),
    })
    return res.json()
}

export async function updateCharacter(characterId, characterData) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(characterData),
    })
    return res.json()
}

export async function deleteCharacter(characterId) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}
