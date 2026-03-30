const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function getEvents(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/events`, {
        credentials: "include",
    })
    return res.json()
}

export async function getEvent(eventId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function createEvent(worldId, eventData) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventData),
    })
    return res.json()
}

export async function updateEvent(eventId, eventData) {
    const res = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(eventData),
    })
    return res.json()
}

export async function deleteEvent(eventId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}

export async function getCharactersForEvent(eventId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}/characters`, {
        credentials: "include",
    })
    return res.json()
}

export async function addCharacterToEvent(eventId, characterId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}/characters/${characterId}`, {
        method: "POST",
        credentials: "include",
    })
    return res.json()
}

export async function removeCharacterFromEvent(eventId, characterId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}/characters/${characterId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res.json()
}

export async function getEventsForCharacter(characterId) {
    const res = await fetch(`${BASE_URL}/characters/${characterId}/events`, {
        credentials: "include",
    })
    return res.json()
}
