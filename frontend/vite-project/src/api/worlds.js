const BASE_URL = "http://localhost:8000"

export async function getAllWorlds(userId) {
    const res = await fetch(`${BASE_URL}/worlds`, {
        credentials: "include",
    })
    return res.json()
}

export async function getWorld(userId, worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        credentials: "include",
    })
    return res.json()
}

export async function updateWorld(worldId, worldData) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(worldData)
    })
    return res.json()
}

export async function deleteWorld(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}

export async function getRules(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/world_rules`, {
        credentials: "include",
    })
    return res.json()
}

export async function createRule(worldId, ruleText) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/world_rules`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule_text: ruleText }),
    })
    return res.json()
}

export async function deleteRule(ruleId) {
    const res = await fetch(`${BASE_URL}/world_rules/${ruleId}`, {
        method: "DELETE",
        credentials: "include",
    })
    return res
}

export async function runConsistencyCheck(worldId) {
    const res = await fetch(`${BASE_URL}/worlds/${worldId}/consistency-check`, {
        method: "POST",
        credentials: "include",
    })
    return res.json()
}
