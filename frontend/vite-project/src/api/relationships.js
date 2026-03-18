const BASE_URL = "http://localhost:8000"

export async function getRelationshipsForCharacter(characterId) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}/relationships`, {
        credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to fetch relationships")
    return res.json()
}

export async function createRelationship(characterId, data) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}/relationships`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Failed to create relationship")
    return res.json()
}

export async function deleteRelationship(relationshipId) {
    const res = await fetch(`${BASE_URL}/relationships/${relationshipId}`, {
        method: "DELETE",
        credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to delete relationship")
    return res.json()
}
