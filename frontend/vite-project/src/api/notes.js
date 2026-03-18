const BASE_URL = "http://localhost:8000"

export async function getNotes() {
    const userId = localStorage.getItem("user_id")
    const res = await fetch(`${BASE_URL}/users/${userId}/notes`, { credentials: "include" })
    return res.json()
}

export async function getNote(noteId) {
    const res = await fetch(`${BASE_URL}/notes/${noteId}`, { credentials: "include" })
    return res.json()
}

export async function createNote(data) {
    const res = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function updateNote(noteId, data) {
    const res = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return res.json()
}

export async function deleteNote(noteId) {
    const res = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}
