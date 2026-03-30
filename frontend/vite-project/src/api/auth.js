const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export async function register(userData) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    const data = await res.json()
    return { ok: res.ok, data }
}

export async function login(credentials) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || "Incorrect email or password")
    return data
}

    export async function logout() {
        const res = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            credentials: "include",
        })
        return res
    }

export async function getMe() {
    const res = await fetch(`${BASE_URL}/users/me`, {
        credentials: "include",
    })
    return res.json()
}

export async function updateMe(userData) {
    const res = await fetch(`${BASE_URL}/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })
    return res.json()
}

export async function deleteMe() {
    const res = await fetch(`${BASE_URL}/users/me`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}