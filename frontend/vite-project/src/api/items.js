const BASE_URL = "http://localhost:8000"

export async function getItems(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/items`, { credentials: "include" })
    return res.json()
}

export async function getItem(itemId) {
    const res = await fetch(`${BASE_URL}/items/${itemId}`, { credentials: "include" })
    return res.json()
}

export async function createItem(worldId, data) {
    const res = await fetch(`${BASE_URL}/items`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, world_id: Number(worldId) }),
    })
    return res.json()
}

export async function updateItem(itemId, data) {
    const res = await fetch(`${BASE_URL}/items/${itemId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function deleteItem(itemId) {
    const res = await fetch(`${BASE_URL}/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}
