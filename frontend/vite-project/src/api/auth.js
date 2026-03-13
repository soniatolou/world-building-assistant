const BASE_URL = "http://localhost:8000"

export async function register(userData) {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    })
    return res.json()
    }

    export async function login(credentials) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    })
    return res.json()
    }

    export async function logout() {
    const res = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
    })
    return res.json()
    }